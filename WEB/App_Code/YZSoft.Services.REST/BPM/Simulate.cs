using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Runtime.Serialization.Json;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System.IO;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;
using ProcessInfo = BPM.Client.ProcessInfo;

namespace YZSoft.Services.REST.BPM
{
    public class SimulateHandler : YZServiceHandler
    {
        public virtual object Start(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            Guid draftid = request.GetGuid("draftid", false);
            string memberfullname = request.GetString("memberfullname");
            string uid = request.GetString("uid");

            using (BPMConnection cn = new BPMConnection())
            {
                string orguid = YZAuthHelper.LoginUserAccount;
                YZAuthHelper.SetAuthCookie(uid);
                try
                {
                    cn.WebOpen();
                }
                finally
                {
                    YZAuthHelper.SetAuthCookie(orguid);
                }

                BPMDraft draft = new BPMDraft();
                draft.Open(cn, draftid);

                JObject jDraftHeader = null;
                if (!String.IsNullOrEmpty(draft.Header))
                    jDraftHeader = JObject.Parse(draft.Header);

                PostInfo postInfo = BPMProcess.GetPostInfo(cn, draft.ProcessName, null, memberfullname,-1);
                if (postInfo.Links.Count == 0)
                    throw new BPMException(BPMExceptionType.MissOutLink, postInfo.NodeName);

                string postXml = @"{0}
                    <XForm>
                        <Header>
                            <Method>Post</Method>
                            <ProcessName>{1}</ProcessName>
                            <OwnerMemberFullName>{2}</OwnerMemberFullName>
                            <Action>{3}</Action>
                            <Comment>{4}</Comment>
                            {5}
                        </Header>
                        {6}
                    </XForm>";

                StringBuilder sb = new StringBuilder();
                if (jDraftHeader != null)
                {
                    foreach (KeyValuePair<string,JToken> jProp in jDraftHeader)
                    {
                        string line = String.Format("<{0}>{1}</{0}>", jProp.Key, YZUtility.EncodeXMLInnerText(jProp.Value.ToString()));
                        sb.AppendLine(line);
                    }
                }

                postXml = String.Format(postXml,
                    "<?xml version=\"1.0\"?>",
                    YZUtility.EncodeXMLInnerText(draft.ProcessName),
                    YZUtility.EncodeXMLInnerText(memberfullname),
                    YZUtility.EncodeXMLInnerText(postInfo.Links[0].DisplayString),
                    YZUtility.EncodeXMLInnerText(draft.Comments),
                    sb.ToString(),
                    draft.xml);

                using (MemoryStream postStream = new MemoryStream(Encoding.UTF8.GetBytes(postXml)))
                {
                    PostResult postResult = BPMProcess.Post(cn, postStream);

                    return new
                    {
                        success = true,
                        TaskID = postResult.TaskID,
                        SN = postResult.SN
                    };
                }
            }
        }

        public virtual object Process(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepid = request.GetInt32("StepID");
            string uid = request.GetString("uid", YZAuthHelper.LoginUserAccount); //共享任务uid为空，会导致重定向到登录页面，产生异常

            using (BPMConnection cn = new BPMConnection())
            {
                string orguid = YZAuthHelper.LoginUserAccount;
                YZAuthHelper.SetAuthCookie(uid);
                try
                {
                    cn.WebOpen();
                }
                finally
                {
                    YZAuthHelper.SetAuthCookie(orguid);
                }

                ProcessInfo processInfo = BPMProcess.GetProcessInfo(cn, stepid);
                if (processInfo.Links.Count == 0)
                    throw new BPMException(BPMExceptionType.MissOutLink, processInfo.NodeName);

                string postXml = @"{0}
                    <XForm>
                        <Header>
                            <Method>Process</Method>
                            <PID>{1}</PID>
                            <Action>{2}</Action>
                            <Comment></Comment>
                        </Header>
                        <FormData>
                        </FormData>
                    </XForm>";

                postXml = String.Format(postXml,
                    "<?xml version=\"1.0\"?>",
                    stepid,
                    YZUtility.EncodeXMLInnerText(processInfo.Links[0].DisplayString));

                using (MemoryStream postStream = new MemoryStream(Encoding.UTF8.GetBytes(postXml)))
                {
                    PostResult postResult = BPMProcess.Post(cn, postStream);

                    return new
                    {
                        success = true,
                        result = (postResult.PostResultType == PostResultType.TaskFinishedApproved || postResult.PostResultType == PostResultType.TaskFinishedRejected) ? "finished" : "running"
                    };
                }
            }
        }

        public virtual JObject LoadTask(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            JObject rv = new JObject();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                rv[YZJsonProperty.total] = 1;
                JArray children = new JArray();
                rv["children"] = children;

                BPMTask task = BPMTask.Load(cn, taskid);
                JObject item = new JObject();
                children.Add(item);

                item["TaskID"] = task.TaskID;
                item["SerialNum"] = task.SerialNum;
                item["ProcessName"] = task.ProcessName;
                item["ProcessVersion"] = task.ProcessVersion.ToString(2);
                item["OwnerAccount"] = task.OwnerAccount;
                item["OwnerDisplayName"] = task.OwnerFullName;
                item["AgentAccount"] = task.AgentAccount;
                item["AgentDisplayName"] = task.AgentFullName;
                item["CreateAt"] = task.CreateAt;
                item["State"] = YZJsonHelper.GetTaskStateJObject(cn, task.TaskState, task.TaskID);
                item["Description"] = String.IsNullOrEmpty(task.Description) ? Resources.YZStrings.All_None : task.Description;
            }

            rv["success"] = true;
            return rv;
        }

        public virtual JObject GetTestingTemplates(HttpContext context)
        {
            string loginAccount = YZAuthHelper.LoginUserAccount;
            YZRequest request = new YZRequest(context);
            string processName = request.GetString("ProcessName", null);

            IYZDbProvider provider = YZDbProviderManager.DefaultProvider;

            //System.Threading.Thread.Sleep(2000);
            //获得数据
            BPMDraftCollection drafts = new BPMDraftCollection();
            int rowcount = 0;
            JObject rv = new JObject();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (!String.IsNullOrEmpty(processName))
                    drafts = cn.GetTestingTemplates(processName, null, null, request.GetSortString("CreateDate DESC"), 0, Int32.MaxValue, out rowcount);

                //将数据转化为Json集合
                rv[YZJsonProperty.total] = rowcount;

                JArray children = new JArray();
                rv[YZJsonProperty.children] = children;

                foreach (BPMDraft draft in drafts)
                {
                    JObject item = new JObject();
                    children.Add(item);

                    item["DraftID"] = draft.DraftGuid.ToString();
                    item["Name"] = draft.Name;
                    item["ProcessName"] = draft.ProcessName;
                    item["CreateDate"] = draft.CreateDate;
                    item["ModifyDate"] = draft.ModifyDate;
                    item["Account"] = draft.Account;
                    item["OwnerAccount"] = draft.OwnerAccount;

                    User user = User.TryGetUser(cn, draft.OwnerAccount);
                    if (user != null)
                        item["OnwerShortName"] = user.ShortName;

                    item["Comments"] = draft.Comments;
                    item["Description"] = draft.Description;

                    if (!NameCompare.EquName(draft.OwnerAccount, loginAccount))
                        item["Owner"] = PositionManager.MemberFullNameFromID(cn, draft.OwnerPositionID);
                }
            }

            return rv;
        }

        public virtual JObject GetTaskProcessingSteps(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            JObject rv = new JObject();

            //获得数据
            BPMStepCollection steps = null;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                steps = BPMTask.GetUnFinishedHumanSteps(cn, taskid);

                //将数据转化为Json集合
                rv[YZJsonProperty.total] = steps.Count;

                JArray children = new JArray();
                rv[YZJsonProperty.children] = children;

                foreach (BPMProcStep step in steps)
                    children.Add(this.Serialize(cn, step));
            }

            //输出数据
            rv[YZJsonProperty.success] = true;
            return rv;
        }

        protected virtual JObject Serialize(BPMConnection cn, BPMProcStep step)
        {
            JObject jstep = TaskHandler.Serialize(cn, step);
            string loginUserAccount = YZAuthHelper.LoginUserAccount;

            if(step.IsHumanStep)
            {
                string account = String.IsNullOrEmpty(step.OwnerAccount) ? loginUserAccount:step.OwnerAccount;
                jstep["stk"] = YZAuthHelper.Acctout2FormAuthCookie(account);
            }
            return jstep;
        }
    }
}