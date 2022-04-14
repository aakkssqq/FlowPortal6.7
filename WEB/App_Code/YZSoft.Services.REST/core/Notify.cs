using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Notify;
using YZSoft.Web.DAL;
using YZSoft.Web.Social;
using YZSoft.Group;
using YZSoft.P2PGroup;

namespace YZSoft.Services.REST.core
{
    public class NotifyHandler : YZServiceHandler
    {
        private const int DefaultDays = 30;

        public virtual DataTable GetNewMessageCount(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int days = request.GetInt32("days", DefaultDays);
            string uid = YZAuthHelper.LoginUserAccount;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return YZSoft.Web.Notify.NotifyManager.GetNotifyNewMessageCount(provider, cn, uid, days);
                }
            }
        }

        public virtual PageResult GetNotifyTopics(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int days = request.GetInt32("days", DefaultDays);
            string uid = YZAuthHelper.LoginUserAccount;

            PageResult result;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    result = YZSoft.Web.Notify.NotifyManager.GetNotifyTopics(provider, cn, uid, days, request.Start, request.Limit);
                    this.PostProcessNotifyTopic(provider, cn, uid, result.Table);
                }
            }

            return result;
        }

        public virtual object SearchSocial(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int days = request.GetInt32("days", DefaultDays);
            string keyword = request.GetString("kwd");
            string uid = YZAuthHelper.LoginUserAccount;

            DataTable topics;
            DataTable messages;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    topics = YZSoft.Web.Social.SocialManager.SearchSocialTopics(provider, cn, uid, days, keyword);
                    this.PostProcessNotifyTopic(provider, cn, uid, topics);

                    messages = YZSoft.Web.Social.SocialManager.SearchSocialMessages(provider, cn, uid, days, keyword);
                    this.PostProcessNotifyTopic(provider, cn, uid, messages);
                }
            }

            UserCollection users;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                users = OrgSvr.SearchUser(cn, keyword);
            }

            return new {
                topics = topics,
                users = users,
                messages = messages
            };
        }

        public virtual PageResult SearchSocialMessagesInTopic(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string resType = request.GetString("resType");
            string resId = request.GetString("resId");
            int days = request.GetInt32("days", DefaultDays);
            string keyword = request.GetString("kwd");
            string uid = YZAuthHelper.LoginUserAccount;

            PageResult result;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    result = YZSoft.Web.Social.SocialManager.SearchSocialMessagesInTopic(provider, cn, resType, resId, days, keyword, request.Start, request.Limit);
                    this.PostProcessNotifyTopic(provider, cn, uid, result.Table);
                }
            }

            return result;
        }

        public virtual JObject GetTaskRejectedInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepid = request.GetInt32("stepid");

            //获得数据
            BPMProcStep step = new BPMProcStep();
            BPMTask task = new BPMTask();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                step.Open(cn, stepid);
                task.Open(cn, step.TaskID);

                JObject rv = new JObject();
                rv["taskid"] = task.TaskID;
                rv["processName"] = task.ProcessName;
                rv["sn"] = task.SerialNum;
                rv["desc"] = task.Description;
                rv["rejectBy"] = YZStringHelper.GetUserShortName(step.HandlerAccount, step.HandlerDisplayName);
                rv["rejectAt"] = step.FinishAt;
                rv["comments"] = step.Comments;

                return rv;
            }
        }

        public virtual JObject GetTaskApprovedInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("taskid");

            //获得数据
            BPMTask task = new BPMTask();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                task.Open(cn, taskid);

                JObject rv = new JObject();
                rv["taskid"] = task.TaskID;
                rv["processName"] = task.ProcessName;
                rv["sn"] = task.SerialNum;
                rv["desc"] = task.Description;
                rv["createat"] = task.CreateAt;

                return rv;
            }
        }

        public virtual JObject GetProcessRemindInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepid = request.GetInt32("stepid");

            //获得数据
            BPMProcStep step = new BPMProcStep();
            BPMTask task = new BPMTask();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                step.Open(cn, stepid);
                task.Open(cn, step.TaskID);

                JObject rv = new JObject();
                rv["stepid"] = step.StepID;
                rv["finished"] = step.Finished;
                rv["finishat"] = step.FinishAt;
                rv["stepName"] = step.RegularNodeName;
                rv["taskid"] = task.TaskID;
                rv["processName"] = task.ProcessName;
                rv["sn"] = task.SerialNum;
                rv["desc"] = task.Description;
                rv["ownerAccount"] = task.OwnerAccount;
                rv["ownerDisplayName"] = task.OwnerDisplayName;
                rv["createat"] = task.CreateAt;

                return rv;
            }
        }

        public virtual JObject GetExceptionStepInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepid = request.GetInt32("stepid");

            //获得数据
            BPMProcStep step = new BPMProcStep();
            BPMTask task = new BPMTask();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                step.Open(cn, stepid);
                task.Open(cn, step.TaskID);

                JObject rv = new JObject();
                rv["taskid"] = task.TaskID;
                rv["processName"] = task.ProcessName;
                rv["sn"] = task.SerialNum;
                rv["desc"] = task.Description;
                rv["ownerAccount"] = task.OwnerAccount;
                rv["ownerDisplayName"] = task.OwnerDisplayName;
                rv["createat"] = task.CreateAt;
                rv["stepid"] = step.StepID;
                rv["stepName"] = step.NodeName;
                rv["receiveAt"] = step.ReceiveAt;

                return rv;
            }
        }

        protected virtual void PostProcessNotifyTopic(IYZDbProvider provider, IDbConnection cn, string loginUserAccount, DataTable table)
        {
            if (!table.Columns.Contains("id"))
            {
                table.Columns.Add("id", typeof(string));
                foreach (DataRow row in table.Rows)
                    row["id"] = String.Format("{0}/{1}", row["resType"], row["resId"]);
            }

            if (!table.Columns.Contains("resName"))
            {
                table.Columns.Add("resName", typeof(string));
            }

            using (BPMConnection bpmcn = new BPMConnection())
            {
                bpmcn.WebOpen();

                table.Columns.Add("ext", typeof(object));

                for (int i = 0; i < table.Rows.Count; i++)
                {
                    try
                    {
                        this.PostProcessNotifyTopic(provider, cn, bpmcn, loginUserAccount, table.Rows[i], true);
                    }
                    catch (Exception)
                    {
                        //result.Table.Rows.RemoveAt(i);
                        //i--;
                    }
                }
            }
        }

        protected virtual void PostProcessNotifyTopic(IYZDbProvider provider, IDbConnection cn, BPMConnection bpmcn, string loginUserAccount, DataRow row, bool countUsers)
        {
            JObject jExt = new JObject();
            row["ext"] = jExt;
            YZResourceType resType = (YZResourceType)Enum.Parse(typeof(YZResourceType), Convert.ToString(row["resType"]), true);

            row["resType"] = resType.ToString();

            if (row.Table.Columns.Contains("uid"))
            {
                string uid = Convert.ToString(row["uid"]);
                User user = User.TryGetUser(bpmcn, uid);
                jExt["UserShortName"] = user == null ? uid : user.ShortName;
            }

            switch (resType)
            {
                case YZResourceType.Task:
                    BPMTask task = BPMTask.Load(bpmcn, Int32.Parse(Convert.ToString(row["resId"])));
                    ProcessProperty property = BPMProcess.GetProcessProperty(bpmcn, task.ProcessName, task.ProcessVersion);

                    string owner = YZStringHelper.GetUserShortName(task.OwnerAccount, task.OwnerDisplayName);
                    row["resName"] = String.Format(Resources.YZStrings.All_BPM_Task_Title_FMT, owner, task.ProcessName);

                    jExt["ProcessName"] = task.ProcessName;
                    jExt["Owner"] = owner;
                    jExt["Color"] = property.Color;
                    jExt["ShortName"] = property.ShortName;
                    if (String.IsNullOrEmpty(property.ShortName))
                        jExt["ShortName"] = YZStringHelper.GetProcessDefaultShortName(task.ProcessName);
                    break;
                case YZResourceType.Group:
                    Group.Group group = GroupManager.GetGroup(provider, cn, Int32.Parse(Convert.ToString(row["resId"])));

                    row["resName"] = group.Name;
                    jExt["GroupType"] = group.GroupType;
                    jExt["ImageFileID"] = group.ImageFileID;

                    if (countUsers)
                        jExt["MemberCount"] = GroupManager.GetGroupMemberCount(provider,cn,group.GroupID);

                    break;
                case YZResourceType.SingleChat:
                    P2PGroup.P2PGroup p2pGroup = P2PGroupManager.GetGroup(provider, cn, Int32.Parse(Convert.ToString(row["resId"])));
                    
                    row["resName"] = p2pGroup.GetGroupName(bpmcn, loginUserAccount);
                    jExt["P2PPeerAccount"] = p2pGroup.GetPeerAccount(loginUserAccount);
                    jExt["FolderID"] = p2pGroup.FolderID;

                    break;
                case YZResourceType.TaskApproved:
                    row["resName"] = Resources.YZStrings.Aspx_Message_Title_Approved;
                    break;
                case YZResourceType.TaskRejected:
                    row["resName"] = Resources.YZStrings.Aspx_Message_Title_Rejected;
                    break;
                default:
                    break;
            }
        }
    }
}