using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using ProcessInfo = BPM.Client.ProcessInfo;

namespace YZSoft.Services.REST.BPM
{
    public class FormHandler : YZServiceHandler
    {
        public virtual JObject GetTaskReadInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("tid");
            string permisions = request.GetString("Permisions",null);

            BPMTask task;
            string formFile;
            JObject perm;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                task = BPMTask.Load(cn, taskid);
                formFile = BPMProcess.GetTaskReadForm(cn, taskid);
                perm = this.CheckPermision(cn, taskid, -1, permisions);
            }

            JObject rv = new JObject();
            
            rv[YZJsonProperty.success] = true;
            rv["sn"] = task.SerialNum;
            rv["url"] = YZUtility.GetFormRedirectUrl(formFile).ToString();
            rv["urlParams"] = task.UrlParams;
            rv["perm"] = perm;

            return rv;
        }

        public virtual JObject GetProcessInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepid = request.GetInt32("pid");
            string permisions = request.GetString("Permisions",null);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                BPMProcStep step = BPMProcStep.Load(cn, stepid);
                BPMTask task = BPMTask.Load(cn, step.TaskID);
                ProcessInfo processInfo = BPMProcess.GetProcessInfo(cn, stepid);

                //检查处理权
                if (!step.Share || !String.IsNullOrEmpty(step.OwnerAccount)) //常规任务及已获取的共享任务
                {
                    if (!NameCompare.EquName(step.OwnerAccount, cn.UID) &&
                        !NameCompare.EquName(step.AgentAccount, cn.UID))
                        throw new BPMException(BPMExceptionType.ProcessErrPermDenied);
                }

                //获得ProcessSubModel
                ProcessSubModel subModel;
                if (step.Share && String.IsNullOrEmpty(step.OwnerAccount))
                    subModel = ProcessSubModel.Share;
                else
                {
                    if (processInfo.StepProcessPermision == StepProcessPermision.Inform)
                        subModel = ProcessSubModel.Inform;
                    else if (processInfo.StepProcessPermision == StepProcessPermision.Indicate)
                        subModel = ProcessSubModel.Indicate;
                    else
                        subModel = ProcessSubModel.Process;
                }

                //ProcessSubModel.Process - 则获得任务操作权限
                JObject perm = null;
                if (subModel == ProcessSubModel.Process ||
                    subModel == ProcessSubModel.Inform ||
                    subModel == ProcessSubModel.Indicate)
                    perm = this.CheckPermision(cn, step.TaskID, stepid, permisions);
                else
                    perm = new JObject();

                if (String.IsNullOrEmpty(processInfo.FormFile))
                    throw new Exception(String.Format(Resources.YZStrings.Aspx_Process_MissForm,step.NodeName));

                JObject rv = new JObject();
                rv[YZJsonProperty.success] = true;
                rv["uid"] = cn.UID;
                rv["subModel"] = subModel.ToString();

                rv["sn"] = task.SerialNum;
                rv["taskid"] = task.TaskID;
                rv["urlParams"] = task.UrlParams;
                rv["url"] = YZUtility.GetFormRedirectUrl(processInfo.FormFile).ToString();
                rv["NodePermisions"] = this.Serialize(processInfo.NodePermision);
                rv["Comments"] = step.Comments;
                rv["perm"] = perm;

                if (subModel == ProcessSubModel.Process)
                {
                    rv["shareTask"] = step.Share;
                    rv["IsConsign"] = step.IsConsignStep;

                    JArray links = new JArray();
                    rv["links"] = links;
                    foreach (Link link in processInfo.Links)
                        links.Add(this.Serialize(link, "normal"));

                    rv["directsend"] = this.GetDirectSendInfo(cn, step, processInfo.SystemLinks);

                    //自由流
                    if (!step.IsConsignStep) //加签不显示自由流
                    {
                        rv["ParticipantDeclares"] = JArray.FromObject(processInfo.ParticipantDeclares);
                        rv["Routing"] = processInfo.Routing;
                    }
                }

                return rv;
            }
        }

        protected virtual JObject GetDirectSendInfo(BPMConnection cn, BPMProcStep step, SystemLinkCollection systemLinks)
        {
            if (step.RecedeFromStep == -1)
                return null;

            int idx = systemLinks.Find(SystemLinkType.DirectSend);
            SystemLink directSendLink = idx == -1 ? null:systemLinks[idx];
            if (directSendLink != null && !directSendLink.Enabled)
                return null;

            BPMStepCollection toSteps = null;
            toSteps = BPMProcStep.GetDirectSendTargetSteps(cn, step.StepID);

            if (toSteps == null || toSteps.Count == 0)
                return null;

            JObject rv = new JObject();
            JArray jtoSteps = new JArray();
            rv["toSteps"] = jtoSteps;
            rv["validationGroup"] = directSendLink.ValidationGroup;

            foreach (BPMProcStep toStep in toSteps)
            {
                JObject jtoStep = new JObject();
                jtoSteps.Add(jtoStep);

                jtoStep["NodeName"] = toStep.NodeName;
                jtoStep["User"] = YZStringHelper.GetUserShortName(toStep.RecipientAccount, toStep.RecipientFullName);
            }

            return rv;
        }

        public virtual JObject GetPostInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string processName = request.GetString("pn",null);
            int restartTaskID = request.GetInt32("restartTaskID", -1);
            string owner = request.GetString("owner",null);
            string permisions = request.GetString("Permisions",null);
            string did = request.GetString("did",null);

            Version processVersion = null;
            PostInfo postInfo;
            JObject perm;
            BPMDraft draft = null;
            JObject jDraftHeader = null;
            bool delagation;
            string selectPosition;
            MemberCollection positions;
            JObject rv = new JObject();
            PostSubModel subModel;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (!String.IsNullOrEmpty(did))
                {
                    draft = new BPMDraft();
                    draft.Open(cn, new Guid(did));
                    processName = draft.ProcessName;

                    if (!String.IsNullOrEmpty(draft.Header))
                        jDraftHeader = JObject.Parse(draft.Header);
                }

                if (draft != null)
                    subModel = (PostSubModel)Enum.Parse(typeof(PostSubModel), draft.Type.ToString());
                else
                    subModel = PostSubModel.Post;

                if (restartTaskID == -1)
                    processVersion = cn.GetGlobalObjectLastVersion(StoreZoneType.Process, processName);

                postInfo = BPMProcess.GetPostInfo(cn, processName, processVersion, owner, restartTaskID);
                perm = this.CheckPermision(postInfo, permisions);

                //获得delagation/selectPosition
                if (draft != null)
                {
                    selectPosition = PositionManager.MemberFullNameFromID(cn, draft.OwnerPositionID);
                    delagation = !YZStringHelper.EquName(draft.OwnerAccount, cn.UID);
                }
                else
                {
                    if (postInfo.IsPostByAgent)
                    {
                        delagation = true;
                        selectPosition = owner;
                    }
                    else
                    {
                        delagation = false;
                        selectPosition = owner;
                    }
                }

                //获得positions
                if (!delagation)
                {
                    positions = OrgSvr.GetUserPositions(cn, cn.UID);
                    if (String.IsNullOrEmpty(selectPosition) && positions.Count != 0)
                        selectPosition = positions[0].FullName;
                }
                else
                {
                    Member mb = new Member();
                    mb.Open(cn, selectPosition);
                    positions = OrgSvr.GetUserPositions(cn, mb.UserAccount);
                    selectPosition = mb.FullName;
                }

                if (String.IsNullOrEmpty(postInfo.FormFile))
                    throw new Exception(Resources.YZStrings.Aspx_Post_MissForm);

                //返回
                rv[YZJsonProperty.success] = true;
                rv["subModel"] = subModel.ToString();

                //基本信息
                rv["pn"] = postInfo.ProcessName;
                rv["version"] = postInfo.ProcessVersion.ToString(2);
                rv["restartTaskID"] = restartTaskID;
                rv["url"] = YZUtility.GetFormRedirectUrl(postInfo.FormFile).ToString();
                rv["perm"] = perm;
                rv["PersistParams"] = postInfo.PersistParams;
                rv["NodePermisions"] = this.Serialize(postInfo.NodePermision);

                rv["Comments"] = draft != null ? draft.Comments : null;
                rv["DraftHeader"] = jDraftHeader;

                //处理按钮
                JArray links = new JArray();
                rv["links"] = links;
                foreach (Link link in postInfo.Links)
                    links.Add(this.Serialize(link, "normal"));

                //提交职位
                rv["delagation"] = delagation;
                rv["selectPosition"] = selectPosition;
                JArray jPoss = new JArray();
                rv["positions"] = jPoss;
                foreach (Member position in positions)
                {
                    JObject jPos = new JObject();
                    jPoss.Add(jPos);

                    string name = position.GetParentOU(cn).Name + "\\" + position.UserAccount;

                    if (position.IsLeader)
                        name += "(" + position.LeaderTitle + ")";

                    jPos["name"] = name;
                    jPos["value"] = position.FullName;
                }

                //自由流
                rv["ParticipantDeclares"] = JArray.FromObject(postInfo.ParticipantDeclares);
            }
            return rv;
        }

        public virtual JObject GetFormStateInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string app = request.GetString("app");
            string key = request.GetString("key",null);
            string formstate = request.GetString("formstate",null);

            FormApplication formApplication;
            FormState formState;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                formApplication = FormApplication.Open(cn, app);
                formState = FormService.GetFormStateBasicInfo(cn, app, formstate);
            }

            JObject rv = new JObject();
            rv[YZJsonProperty.success] = true;
            rv["appShortName"] = formApplication.Name;
            rv["formstate"] = formState.Name;
            rv["token"] = YZSecurityHelper.GenFormApplicationToken(app, key, formState.Name);
            rv["showSaveButton"] = formState.ShowSaveButton;
            rv["validationGroup"] = formState.ValidationGroup;
            rv["url"] = YZUtility.GetFormRedirectUrl(formApplication.Form).ToString();
            return rv;
        }

        public virtual JObject SubmitAuth(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepid = request.GetInt32("StepID",-1);
            string pwd = request.GetString("Password",null);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                string uid = null;
                if (stepid != -1)
                {
                    BPMProcStep step = BPMProcStep.Load(cn, stepid);
                    uid = step.RecipientAccount;
                }
                else
                {
                    uid = cn.UID;
                }

                JObject rv = new JObject();
                rv[YZJsonProperty.success] = true;

                string token;
                if (BPMConnection.Authenticate(YZAuthHelper.BPMServerName, YZAuthHelper.BPMServerPort, uid, pwd, out uid, out token))
                    rv["pass"] = true;
                else
                    rv["pass"] = false;

                return rv;
            }
        }

        public virtual JObject SignAuth(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string account = request.GetString("Account",null);
            string pwd = request.GetString("Password",null);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (String.IsNullOrEmpty(account))
                    account = cn.UID;

                JObject rv = new JObject();
                rv[YZJsonProperty.success] = true;

                string token;
                if (BPMConnection.Authenticate(YZAuthHelper.BPMServerName, YZAuthHelper.BPMServerPort, account, pwd, out account,out token))
                    rv["pass"] = true;
                else
                    rv["pass"] = false;

                return rv;
            }
        }

        public virtual JObject GetReadToken(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            string token = YZSecurityHelper.GenTaskAccessToken(taskid);

            JObject rv = new JObject();
            rv[YZJsonProperty.success] = true;
            rv["token"] = token;
            return rv;
        }

        public virtual JObject GetFormApplicationToken(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string app = request.GetString("app");
            string key = request.GetString("key");
            string formstate = request.GetString("formstate",null);
            string token = YZSecurityHelper.GenFormApplicationToken(app, key, formstate);

            JObject rv = new JObject();
            rv[YZJsonProperty.success] = true;
            rv["token"] = token;
            return rv;
        }

        public virtual JArray GetTaskDirtyFields(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");

            ModifyRecordCollection modifies;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                modifies = SpoorService.GetTaskDirtyFields(cn, taskid);
            }

            JArray rv = new JArray();
            foreach (ModifyRecord modify in modifies)
            {
                JObject item = new JObject();
                rv.Add(item);

                item["DataSourceName"] = modify.TableIdentity.DataSourceName;
                item["TableName"] = modify.TableIdentity.TableName;
                item["PrimaryKey"] = modify.PrimaryKey;
                item["ColumnName"] = modify.ColumnName;
            }

            return rv;
        }

        public virtual JArray GetFormAppDirtyFields(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string appName = request.GetString("AppName");
            string key = request.GetString("Key");

            ModifyRecordCollection modifies;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                modifies = SpoorService.GetFormAppDirtyFields(cn, appName, key);
            }

            JArray rv = new JArray();
            foreach (ModifyRecord modify in modifies)
            {
                JObject item = new JObject();
                rv.Add(item);

                item["DataSourceName"] = modify.TableIdentity.DataSourceName;
                item["TableName"] = modify.TableIdentity.TableName;
                item["PrimaryKey"] = modify.PrimaryKey;
                item["ColumnName"] = modify.ColumnName;
            }

            return rv;
        }

        public virtual JArray GetFieldModifies(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string DataSource = request.GetString("DataSource","");
            string TableName = request.GetString("TableName");
            string ColumnName = request.GetString("ColumnName");
            string CKeyName = request.GetString("CKeyName","");
            string CKeyValue = request.GetString("CKeyValue");

            JArray rv = new JArray();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                ModifyRecordCollection modifies = SpoorService.GetFieldSpoor(cn, DataSource, TableName, ColumnName, CKeyValue);

                foreach (ModifyRecord modify in modifies)
                {
                    JObject item = new JObject();
                    rv.Add(item);

                    string userName = modify.Account;
                    User user = User.TryGetUser(cn, modify.Account);
                    if (user != null)
                        userName = YZStringHelper.GetUserShortName(user.Account, user.DisplayName);

                    item["Account"] = userName;
                    item["UserSortName"] = userName;
                    item["Value"] = modify.Value;
                    item["ModifyDate"] = YZStringHelper.DateToStringM(modify.ModifyDate);
                }
            }

            return rv;
        }

        protected virtual JObject Serialize(Link link, string type)
        {
            JObject rv = new JObject();
            rv["type"] = type;
            rv["DisplayString"] = link.DisplayString;
            rv["ValidationGroup"] = link.ValidationGroup;
            rv["ProcessConfirmType"] = link.ProcessConfirmType.ToString();
            rv["PromptMessage"] = link.PromptMessage;
            return rv;
        }

        protected virtual JObject Serialize(NodePermision perm)
        {
            JObject rv = new JObject();
            foreach (NodePermision permCheck in Enum.GetValues(typeof(NodePermision)))
                rv[permCheck.ToString()] = (perm & permCheck) == permCheck;

            return rv;
        }

        protected virtual JObject CheckPermision(BPMConnection cn, int taskid, int stepid, string permString)
        {
            JObject rv = new JObject();
            NodePermision[] perms = YZSecurityHelper.ParseNodePermisions(permString);

            bool[] allows = BPMTask.TaskOptPermCheckExt(cn, taskid, stepid, perms);

            for (int i = 0; i < perms.Length; i++)
            {
                rv[perms[i].ToString()] = allows[i];
            }

            return rv;
        }

        protected virtual JObject CheckPermision(PostInfo postInfo, string permString)
        {
            JObject rv = new JObject();
            NodePermision[] perms = YZSecurityHelper.ParseNodePermisions(permString);

            for (int i = 0; i < perms.Length; i++)
            {
                NodePermision perm = perms[i];
                rv[perm.ToString()] = (postInfo.NodePermision & perm) == perm;
            }

            return rv;
        }

        public virtual object GetPositionInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string ouLevel = request.GetString("OULevel", null);
            string memberfullname = request.GetString("memberfullname");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                Member member = Member.FromFullName(cn, memberfullname);
                OU ou = null;
                OU parentOU = member.GetParentOU(cn);

                if (!String.IsNullOrEmpty(ouLevel))
                    ou = member.GetParentOU(cn, ouLevel);

                return new
                {
                    MemberFullName = member.FullName,
                    LeaderTitle = member.LeaderTitle,
                    Department = member.Department,
                    Level = member.Level,
                    OUName = ou == null ? "" : ou.Name,
                    OUCode = ou == null ? "" : ou.Code,
                    ParentOUName = parentOU == null ? "" : parentOU.Name,
                    ParentOUCode = parentOU == null ? "" : parentOU.Code,
                };
            }
        }
    }

    internal enum PostSubModel
    {
        Post,
        Draft,
        FormTemplate,
        TestingTemplate
    }

    internal enum ProcessSubModel
    {
        Process,
        Share,
        Inform,
        Indicate
    }

    internal enum ReadSubModel
    {
        Read,
        History,
        Snapshot
    }
}