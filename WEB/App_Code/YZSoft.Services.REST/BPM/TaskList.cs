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
using BPM.Client.Security;
using YZSoft.Web.DAL;
using YZSoft.Web.Task;

namespace YZSoft.Services.REST.BPM
{
    public class TaskListHandler : YZServiceHandler
    {
        public virtual JObject GetDrafts(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string loginAccount = YZAuthHelper.LoginUserAccount;
            GridPageInfo gridPageInfo = new GridPageInfo(context);

            //System.Threading.Thread.Sleep(2000);
            //获得数据
            BPMDraftCollection drafts = new BPMDraftCollection();
            int rowcount;
            JObject rv = new JObject();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                drafts = cn.GetMyDrafts(DraftType.Draft, null, request.GetSortString("CreateDate DESC"), gridPageInfo.Start, gridPageInfo.Limit, out rowcount);

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
                    item["Comments"] = draft.Comments;
                    item["Description"] = draft.Description;

                    if (!NameCompare.EquName(draft.OwnerAccount, loginAccount))
                    {
                        item["Owner"] = PositionManager.MemberFullNameFromID(cn, draft.OwnerPositionID);
                        User user = User.TryGetUser(cn, draft.OwnerAccount);
                        if (user != null)
                            item["OnwerShortName"] = user.ShortName;
                    }
                }
            }

            //输出数据
            return rv;
        }

        public virtual JObject GetFormTemplates(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string loginAccount = YZAuthHelper.LoginUserAccount;
            GridPageInfo gridPageInfo = new GridPageInfo(context);

            //System.Threading.Thread.Sleep(2000);
            //获得数据
            BPMDraftCollection drafts = new BPMDraftCollection();
            int rowcount;
            JObject rv = new JObject();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                drafts = cn.GetMyDrafts(DraftType.FormTemplate, null, request.GetSortString("CreateDate DESC"), gridPageInfo.Start, gridPageInfo.Limit, out rowcount);

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
                    item["Comments"] = draft.Comments;
                    item["Description"] = draft.Description;

                    if (!NameCompare.EquName(draft.OwnerAccount, loginAccount))
                    {
                        item["Owner"] = PositionManager.MemberFullNameFromID(cn, draft.OwnerPositionID);
                        User user = User.TryGetUser(cn, draft.OwnerAccount);
                        if (user != null)
                            item["OnwerShortName"] = user.ShortName;
                    }
                }
            }

            return rv;
        }

        public virtual JObject GetWorkList(HttpContext context)
        {
            return this.InternalGetWorkList(YZAuthHelper.LoginUserAccount,context);
        }

        public virtual JObject GetShareTasks(HttpContext context)
        {
            return this.InternalGetShareTasks(YZAuthHelper.LoginUserAccount, context);
        }

        public virtual JObject GetHistoryTasks(HttpContext context)
        {
            YZRequest request = new YZRequest(context);

            GridPageInfo gridPageInfo = new GridPageInfo(context);
            HistoryTaskType taskType = request.GetEnum<HistoryTaskType>("HistoryTaskType", HistoryTaskType.AllAccessable);
            string strTaskType = request.GetString("HistoryTaskType");
            int year = request.GetString("byYear","1") == "0" ? -1 : request.GetInt32("Year");

            //获得数据
            JObject rv = new JObject();

            string taskTableFilter;
            string stepTableFilter;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                taskTableFilter = this.GetFilterStringHistoryTaskTaskTable(request, provider);
                stepTableFilter = this.GetFilterStringHistoryTaskStep(request, provider);
            }

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                int rowcount;
                BPMTaskCollection tasks = cn.GetHistoryTasks(year, taskType, taskTableFilter, stepTableFilter, request.GetSortString("TaskID DESC", null, "TaskID DESC"), gridPageInfo.Start, gridPageInfo.Limit, out rowcount);

                rv[YZJsonProperty.total] = rowcount;
                JArray children = new JArray();
                rv[YZJsonProperty.children] = children;

                foreach (BPMTask task in tasks)
                {
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
            }

            return rv;
        }

        public virtual object GetHandoverRequests(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = request.GetString("uid");
            PageResult result;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    result = TaskListManager.GetHandoverMyRequests(provider, cn, uid, this.GetFilterStringHandoverRequests(request, provider), request.GetSortString("TaskID ASC"), request.Start, request.Limit);
                }
            }

            JArray children = new JArray();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach (DataRow task in result.Table.Rows)
                {
                    JObject item = new JObject();
                    children.Add(item);

                    int taskid = YZConvert.ToInt32(task["TaskID"]);
                    string desc = YZConvert.ToString(task["Description"]);
                    string ownerAccount = YZConvert.ToString(task["OwnerAccount"]);
                    string agentAccount = YZConvert.ToString(task["AgentAccount"]);

                    User owner = User.TryGetUser(cn, ownerAccount);
                    User agent = null;

                    if (!String.IsNullOrEmpty(agentAccount))
                        agent = User.TryGetUser(cn, agentAccount);

                    item["TaskID"] = taskid;
                    item["SerialNum"] = YZConvert.ToString(task["SerialNum"]);
                    item["ProcessName"] = YZConvert.ToString(task["ProcessName"]);
                    item["ProcessVersion"] = YZConvert.ToString(task["ProcessVersion"]);
                    item["OwnerAccount"] = ownerAccount;
                    item["OwnerDisplayName"] = owner == null ? ownerAccount : owner.ShortName;
                    item["AgentAccount"] = agentAccount;
                    item["AgentDisplayName"] = agent == null ? agentAccount : agent.ShortName;
                    item["CreateAt"] = YZConvert.ToDateTime(task["CreateAt"]);
                    item["State"] = YZJsonHelper.GetTaskStateJObject(cn, YZConvert.ToEnum<TaskState>(task["State"]), taskid);
                    item["Description"] = String.IsNullOrEmpty(desc) ? Resources.YZStrings.All_None : desc;
                }
            }

            return new
            {
                success = true,
                total = result.TotalRows,
                children = children
            };
        }

        public virtual object GetWorkListOfUser(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = request.GetString("uid");
            return this.InternalGetWorkList(uid, context);
        }

        public virtual object GetShareTasksOfUser(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = request.GetString("uid");
            return this.InternalGetShareTasks(uid, context);
        }

        public virtual object GetTimeoutMonitorWorklist(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path",null);

            //获得数据
            BPMTaskListCollection tasks = new BPMTaskListCollection();
            int rowcount;
            JObject rv = new JObject();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                using(IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    tasks = cn.GetTaskList(path, null, this.GetTimeoutMonitorWorklistFilterString(request,provider), request.GetSortString("Progress DESC"), request.Start, request.Limit, out rowcount);
                }

                rv = this.Serialize(cn, tasks, rowcount);
            }

            return rv;
        }

        public virtual JObject GetExceptionTaskList(HttpContext context)
        {
            YZRequest request = new YZRequest(context);

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {

                //获得数据
                BPMTaskListCollection tasks = new BPMTaskListCollection();
                int rowcount;

                JObject rv = new JObject();
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    tasks = cn.GetExceptionTaskList(this.GetFilterStringWorklist(request, provider), request.GetSortString("StepID DESC", null, "StepID DESC"), request.Start, request.Limit, out rowcount);
                    rv = this.Serialize(cn, tasks, rowcount);
                }

                return rv;
            }
        }

        protected virtual string GetTimeoutMonitorWorklistFilterString(YZRequest request, IYZDbProvider provider)
        {
            string filter = null;
            string searchType = request.GetString("searchType", null);
            string searchBy = request.GetString("SearchBy", null);
            string processName = request.GetString("ProcessName", null);

            if(!String.IsNullOrEmpty(processName))
            {
                filter = String.Format("ProcessName=N'{0}'", provider.EncodeText(processName));
            }

            if (!YZStringHelper.EquName(searchType, "AdvancedSearch"))
            {
                filter = provider.CombinCond(filter, "Progress >= 1");
            }
            else
            {
                if (YZStringHelper.EquName(searchBy, "Progress"))
                {
                    decimal minProgress = request.GetDecimal("minProgress");
                    decimal maxProgress = request.GetDecimal("maxProgress", -1);

                    filter = provider.CombinCond(filter, String.Format("Progress >= {0}",minProgress));

                    if (maxProgress != -1)
                        filter = provider.CombinCond(filter,String.Format("Progress < {0}",maxProgress));
                }
                else
                {
                    DateTime deadline = request.GetDateTime("Deadline");
                    filter = provider.CombinCond(filter, String.Format("TimeoutDeadline IS NOT NULL AND Progress < 10000 AND TimeoutDeadline <= {0}", provider.DateToQueryString(deadline)));
                }
            }

            return filter;
        }

        protected virtual JObject InternalGetWorkList(string uid, HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path",null);

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                //获得数据
                BPMTaskListCollection tasks = new BPMTaskListCollection();
                int rowcount;

                JObject rv = new JObject();
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    tasks = cn.GetTaskList(path, uid, this.GetFilterStringWorklist(request, provider), request.GetSortString("StepID DESC", null, "StepID DESC"), request.Start, request.Limit, out rowcount);
                    rv = this.Serialize(cn, tasks, rowcount);
                }

                return rv;
            }
        }

        protected virtual JObject Serialize(BPMConnection cn, BPMTaskListCollection tasks, int rowcount)
        {
            JObject rv = new JObject();

            //将数据转化为Json集合
            rv[YZJsonProperty.total] = rowcount;

            JArray children = new JArray();
            rv[YZJsonProperty.children] = children;

            foreach (BPMTaskListItem task in tasks)
            {
                JObject item = new JObject();
                children.Add(item);

                string stepDisplayName = BPMProcStep.GetStepDisplayName(task.StepName);

                item["StepID"] = task.StepID;
                item["TaskID"] = task.TaskID;
                item["SerialNum"] = task.SerialNum;
                item["ProcessName"] = task.ProcessName;
                item["ProcessVersion"] = task.ProcessVersion.ToString(2);
                item["OwnerAccount"] = task.OwnerAccount;
                item["OwnerDisplayName"] = task.OwnerFullName;
                item["OwnerShortName"] = YZStringHelper.GetUserShortName(task.OwnerAccount, task.OwnerFullName);
                item["AgentAccount"] = task.AgentAccount;
                item["AgentDisplayName"] = task.AgentFullName;
                item["CreateAt"] = task.CreateAt;
                item["NodeName"] = stepDisplayName;
                item["StepName"] = task.StepName;
                item["ReceiveAt"] = task.ReceiveAt;

                JObject recipient = new JObject();
                recipient["account"] = task.RecipientAccount;
                recipient["displayName"] = task.RecipientFullName;
                item["Recipient"] = recipient;
                item["RecipientShortName"] = YZStringHelper.GetUserShortName(task.RecipientAccount, task.RecipientFullName);


                item["Share"] = task.Share;
                //item["State"] = YZJsonHelper.GetTaskStateJObject(cn, task.TaskState, task.TaskID);
                item["TimeoutFirstNotifyDate"] = task.TimeoutFirstNotifyDate;
                item["TimeoutDeadline"] = task.TimeoutDeadline;
                item["TimeoutNotifyCount"] = task.TimeoutNotifyCount;
                item["Description"] = String.IsNullOrEmpty(task.Description) ? Resources.YZStrings.All_None : task.Description;

                if (task.Progress != -1)
                    item["Progress"] = task.Progress;

                JObject perm = new JObject();
                item["perm"] = perm;
                perm["Share"] = task.Share;
            }

            return rv;
        }

        protected virtual JObject InternalGetShareTasks(string uid, HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path", null);

            IYZDbProvider provider = YZDbProviderManager.DefaultProvider;

            //获得数据
            BPMTaskListCollection tasks = new BPMTaskListCollection();
            int rowcount;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                tasks = cn.GetShareTaskList(path, uid, this.GetFilterStringWorklist(request, provider), request.GetSortString("StepID DESC", null, "StepID DESC"), request.Start, request.Limit, out rowcount);
            }

            //将数据转化为Json集合
            JObject rv = new JObject();
            rv[YZJsonProperty.total] = rowcount;

            JArray children = new JArray();
            rv[YZJsonProperty.children] = children;

            foreach (BPMTaskListItem task in tasks)
            {
                JObject item = new JObject();
                children.Add(item);

                item["StepID"] = task.StepID;
                item["TaskID"] = task.TaskID;
                item["SerialNum"] = task.SerialNum;
                item["ProcessName"] = task.ProcessName;
                item["ProcessVersion"] = task.ProcessVersion.ToString(2);
                item["OwnerAccount"] = task.OwnerAccount;
                item["OwnerDisplayName"] = task.OwnerFullName;
                item["AgentAccount"] = task.AgentAccount;
                item["AgentDisplayName"] = task.AgentFullName;
                item["CreateAt"] = task.CreateAt;
                item["NodeName"] = task.StepName;
                item["ReceiveAt"] = task.ReceiveAt;
                item["Share"] = task.Share;
                item["State"] = task.TaskState.ToString();
                item["TimeoutFirstNotifyDate"] = task.TimeoutFirstNotifyDate;
                item["TimeoutDeadline"] = task.TimeoutDeadline;
                item["TimeoutNotifyCount"] = task.TimeoutNotifyCount;
                item["Description"] = String.IsNullOrEmpty(task.Description) ? Resources.YZStrings.All_None : task.Description;
            }

            return rv;
        }

        protected virtual string GetFilterStringHandoverRequests(YZRequest request, IYZDbProvider provider)
        {
            string filter = null;

            string searchType = request.GetString("searchType", null);
            string keyword = request.GetString("kwd", null);

            string serialNumLike = null;
            string processNameLike = null;
            string ownerAccountLike = null;
            string agentAccountLike = null;
            string stepNameLike = null;
            string descriptionLike = null;
            string taskidEqu = null;

            if (!String.IsNullOrEmpty(keyword))
            {
                serialNumLike = String.Format("SerialNum LIKE(N'%{0}%')", provider.EncodeText(keyword));
                processNameLike = String.Format("ProcessName LIKE(N'%{0}%')", provider.EncodeText(keyword));
                ownerAccountLike = String.Format("OwnerAccount LIKE(N'%{0}%')", provider.EncodeText(keyword));
                agentAccountLike = String.Format("AgentAccount LIKE(N'%{0}%')", provider.EncodeText(keyword));
                descriptionLike = String.Format("Description LIKE(N'%{0}%')", provider.EncodeText(keyword));
            }

            if (YZStringHelper.EquName(searchType, "AdvancedSearch"))
            {
                string processName = request.GetString("ProcessName",null);
                string postUserAccount = request.GetString("PostUserAccount",null);
                string periodType = request.GetString("PostDateType","").ToLower();
                string periodDate1 = request.GetString("PostDate1",null);
                string periodDate2 = request.GetString("PostDate2",null);
                string taskId = request.GetString("TaskID",null);
                string serialNum = request.GetString("SerialNum",null);

                string keywordFilter = null;

                if (!String.IsNullOrEmpty(processName))
                    filter = provider.CombinCond(filter, String.Format("ProcessName=N'{0}'", provider.EncodeText(processName)));
                else
                    keywordFilter = provider.CombinCondOR(keywordFilter, processNameLike);

                if (!String.IsNullOrEmpty(postUserAccount))
                {
                    filter = provider.CombinCond(filter, String.Format("OwnerAccount=N'{0}' OR AgentAccount=N'{0}'", provider.EncodeText(postUserAccount)));
                }
                else
                {
                    keywordFilter = provider.CombinCondOR(keywordFilter, ownerAccountLike);
                    keywordFilter = provider.CombinCondOR(keywordFilter, agentAccountLike);
                }

                DateTime date1 = DateTime.MinValue;
                DateTime date2 = DateTime.MaxValue;
                if (periodType != "all")
                {
                    DateTime.TryParse(periodDate1, out date1);
                    DateTime.TryParse(periodDate2, out date2);
                }

                if (date1 != DateTime.MinValue)
                    filter = provider.CombinCond(filter, provider.GenPeriodCond("CreateAt", date1, date2));

                if (!String.IsNullOrEmpty(taskId) && YZStringHelper.IsNumber(taskId))
                    filter = provider.CombinCond(filter, String.Format("TaskID={0}", taskId));
                else
                    keywordFilter = provider.CombinCondOR(keywordFilter, taskidEqu);

                if (!String.IsNullOrEmpty(serialNum))
                    filter = provider.CombinCond(filter, String.Format("SerialNum LIKE(N'{0}%')", provider.EncodeText(serialNum)));
                else
                    keywordFilter = provider.CombinCondOR(keywordFilter, serialNumLike);

                keywordFilter = provider.CombinCondOR(keywordFilter, stepNameLike);
                keywordFilter = provider.CombinCondOR(keywordFilter, descriptionLike);

                filter = provider.CombinCond(filter, keywordFilter);
            }

            return filter;
        }

        protected virtual string GetFilterStringHistoryTaskTaskTable(YZRequest request, IYZDbProvider provider)
        {
            string filter = null;

            string searchType = request.GetString("searchType", null);
            string keyword = request.GetString("kwd", null);

            string serialNumLike = null;
            string processNameLike = null;
            string ownerAccountLike = null;
            string agentAccountLike = null;
            string descriptionLike = null;
            string taskidEqu = null;
            if (!String.IsNullOrEmpty(keyword))
            {
                serialNumLike = String.Format("SerialNum LIKE(N'%{0}%')", provider.EncodeText(keyword));
                processNameLike = String.Format("ProcessName LIKE(N'%{0}%')", provider.EncodeText(keyword));
                ownerAccountLike = String.Format("OwnerAccount LIKE(N'%{0}%')", provider.EncodeText(keyword));
                agentAccountLike = String.Format("AgentAccount LIKE(N'%{0}%')", provider.EncodeText(keyword));
                descriptionLike = String.Format("Description LIKE(N'%{0}%')", provider.EncodeText(keyword));
                if (YZStringHelper.IsNumber(keyword))
                    taskidEqu = String.Format("TaskID={0}", keyword);
            }

            string statusFilter = request.GetString("StatusFilter", null);
            if (!String.IsNullOrEmpty(statusFilter))
            {
                if (statusFilter == "Deleted")
                    filter = provider.CombinCond(filter, "State='Deleted'");
                if (statusFilter == "Aborted")
                    filter = provider.CombinCond(filter, "State='Aborted'");
                if (statusFilter == "RecycleBin")
                    filter = provider.CombinCond(filter, "State='Deleted' OR State='Aborted'");
                else if (statusFilter == "Archived")
                    filter = provider.CombinCond(filter, "State='Approved' OR State='Rejected'");
                else if (statusFilter == "Running")
                    filter = provider.CombinCond(filter, "State='Running'");
            }

            string specProcessName = request.GetString("specProcessName", null);
            if (!String.IsNullOrEmpty(specProcessName))
            {
                string[] processNames = specProcessName.Split(',');
                string processNameFilter = null;
                foreach (string processName in processNames)
                {
                    if (String.IsNullOrEmpty(processName))
                        continue;

                    processNameFilter = provider.CombinCondOR(processNameFilter, String.Format("ProcessName=N'{0}'", provider.EncodeText(processName)));
                }

                filter = provider.CombinCond(filter, processNameFilter);
            }

            if (YZStringHelper.EquName(searchType, "AdvancedSearch"))
            {
                string processName = request.GetString("ProcessName", null);
                string postUserAccount = request.GetString("PostUserAccount", null);
                string periodType = request.GetString("PostDateType", "").ToLower();
                string taskStatus = request.GetString("TaskStatus",null);
                string taskId = request.GetString("TaskID",null);
                string serialNum = request.GetString("SerialNum",null);

                string keywordFilter = null;

                if (String.IsNullOrEmpty(specProcessName))
                {
                    if (!String.IsNullOrEmpty(processName))
                        filter = provider.CombinCond(filter, String.Format("ProcessName=N'{0}'", provider.EncodeText(processName)));
                    else
                        keywordFilter = provider.CombinCondOR(keywordFilter, processNameLike);
                }

                if (!String.IsNullOrEmpty(postUserAccount))
                {
                    filter = provider.CombinCond(filter, String.Format("OwnerAccount=N'{0}' OR AgentAccount=N'{0}'", provider.EncodeText(postUserAccount)));
                }
                else
                {
                    keywordFilter = provider.CombinCondOR(keywordFilter, ownerAccountLike);
                    keywordFilter = provider.CombinCondOR(keywordFilter, agentAccountLike);
                }

                DateTime date1 = DateTime.MinValue;
                DateTime date2 = DateTime.MaxValue;
                if (periodType != "all")
                {
                    date1 = request.GetDateTime("PostDate1", DateTime.MinValue);
                    date2 = request.GetDateTime("PostDate2", DateTime.MaxValue);
                }

                if (date1 != DateTime.MinValue)
                    filter = provider.CombinCond(filter, provider.GenPeriodCond("CreateAt", date1, date2));

                if (!String.IsNullOrEmpty(taskStatus) && !YZStringHelper.EquName(taskStatus, "all"))
                    filter = provider.CombinCond(filter, String.Format("State=N'{0}'", provider.EncodeText(taskStatus)));

                if (!String.IsNullOrEmpty(taskId) && YZStringHelper.IsNumber(taskId))
                    filter = provider.CombinCond(filter, String.Format("TaskID={0}", taskId));
                else
                    keywordFilter = provider.CombinCondOR(keywordFilter, taskidEqu);

                if (!String.IsNullOrEmpty(serialNum))
                    filter = provider.CombinCond(filter, String.Format("SerialNum LIKE(N'{0}%')", provider.EncodeText(serialNum)));
                else
                    keywordFilter = provider.CombinCondOR(keywordFilter, serialNumLike);

                keywordFilter = provider.CombinCondOR(keywordFilter, descriptionLike);

                filter = provider.CombinCond(filter, keywordFilter);
            }

            if (YZStringHelper.EquName(searchType, "QuickSearch"))
            {
                string keywordFilter = null;

                keywordFilter = provider.CombinCondOR(keywordFilter, processNameLike);
                keywordFilter = provider.CombinCondOR(keywordFilter, taskidEqu);
                keywordFilter = provider.CombinCondOR(keywordFilter, serialNumLike);
                keywordFilter = provider.CombinCondOR(keywordFilter, ownerAccountLike);
                keywordFilter = provider.CombinCondOR(keywordFilter, agentAccountLike);
                keywordFilter = provider.CombinCondOR(keywordFilter, descriptionLike);
                filter = provider.CombinCond(filter, keywordFilter);
            }

            return filter;
        }

        protected virtual string GetFilterStringHistoryTaskStep(YZRequest request, IYZDbProvider provider)
        {
            string filter = null;
            string searchType = request.GetString("searchType", null);

            if (YZStringHelper.EquName(searchType, "AdvancedSearch"))
            {
                string taskStatus = request.GetString("TaskStatus", null);

                if (YZStringHelper.EquName(taskStatus, TaskState.Running.ToString()))
                {
                    string recipientUserAccount = request.GetString("RecipientUserAccount", null);
                    if (!String.IsNullOrEmpty(recipientUserAccount))
                        filter = provider.CombinCond(filter, String.Format("(FinishAt IS NULL AND (OwnerAccount=N'{0}' OR AgentAccount=N'{0}'))", provider.EncodeText(recipientUserAccount)));
                }
            }

            return filter;
        }

        protected virtual string GetFilterStringWorklist(YZRequest request, IYZDbProvider provider)
        {
            string filter = null;

            string searchType = request.GetString("searchType", null);
            string keyword = request.GetString("kwd", null);

            string serialNumLike = null;
            string processNameLike = null;
            string ownerAccountLike = null;
            string agentAccountLike = null;
            string stepNameLike = null;
            string descriptionLike = null;
            string taskidEqu = null;

            string specProcessName = request.GetString("specProcessName", null);
            if (!String.IsNullOrEmpty(specProcessName))
            {
                string[] processNames = specProcessName.Split(',');
                string processNameFilter = null;
                foreach (string processName in processNames)
                {
                    if (String.IsNullOrEmpty(processName))
                        continue;

                    processNameFilter = provider.CombinCondOR(processNameFilter, String.Format("ProcessName=N'{0}'", provider.EncodeText(processName)));
                }

                filter = provider.CombinCond(filter, processNameFilter);
            }

            if (!String.IsNullOrEmpty(keyword))
            {
                serialNumLike = String.Format("SerialNum LIKE(N'%{0}%')", provider.EncodeText(keyword));
                processNameLike = String.Format("ProcessName LIKE(N'%{0}%')", provider.EncodeText(keyword));
                ownerAccountLike = String.Format("OwnerAccount LIKE(N'%{0}%')", provider.EncodeText(keyword));
                agentAccountLike = String.Format("AgentAccount LIKE(N'%{0}%')", provider.EncodeText(keyword));
                stepNameLike = String.Format("NodeName LIKE(N'%{0}%')", provider.EncodeText(keyword));
                descriptionLike = String.Format("Description LIKE(N'%{0}%')", provider.EncodeText(keyword));
                if (YZStringHelper.IsNumber(keyword))
                    taskidEqu = String.Format("TaskID={0}", keyword);
            }

            if (YZStringHelper.EquName(searchType, "AdvancedSearch"))
            {
                string processName = request.GetString("ProcessName", null);
                string postUserAccount = request.GetString("PostUserAccount", null);
                string periodType = request.GetString("PostDateType", "").ToLower();
                string taskId = request.GetString("TaskID", null);
                string serialNum = request.GetString("SerialNum", null);

                string keywordFilter = null;

                if (!String.IsNullOrEmpty(processName))
                    filter = provider.CombinCond(filter, String.Format("ProcessName=N'{0}'", provider.EncodeText(processName)));
                else
                    keywordFilter = provider.CombinCondOR(keywordFilter, processNameLike);

                if (!String.IsNullOrEmpty(postUserAccount))
                {
                    filter = provider.CombinCond(filter, String.Format("OwnerAccount=N'{0}' OR AgentAccount=N'{0}'", provider.EncodeText(postUserAccount)));
                }
                else
                {
                    keywordFilter = provider.CombinCondOR(keywordFilter, ownerAccountLike);
                    keywordFilter = provider.CombinCondOR(keywordFilter, agentAccountLike);
                }

                DateTime date1 = DateTime.MinValue;
                DateTime date2 = DateTime.MaxValue;
                if (periodType != "all")
                {
                    date1 = request.GetDateTime("PostDate1", DateTime.MinValue);
                    date2 = request.GetDateTime("PostDate2", DateTime.MinValue);
                }

                if (date1 != DateTime.MinValue)
                    filter = provider.CombinCond(filter, provider.GenPeriodCond("CreateAt", date1, date2));

                if (!String.IsNullOrEmpty(taskId) && YZStringHelper.IsNumber(taskId))
                    filter = provider.CombinCond(filter, String.Format("TaskID={0}", taskId));
                else
                    keywordFilter = provider.CombinCondOR(keywordFilter, taskidEqu);

                if (!String.IsNullOrEmpty(serialNum))
                    filter = provider.CombinCond(filter, String.Format("SerialNum LIKE(N'{0}%')", provider.EncodeText(serialNum)));
                else
                    keywordFilter = provider.CombinCondOR(keywordFilter, serialNumLike);

                keywordFilter = provider.CombinCondOR(keywordFilter, stepNameLike);
                keywordFilter = provider.CombinCondOR(keywordFilter, descriptionLike);

                filter = provider.CombinCond(filter, keywordFilter);
            }

            if (YZStringHelper.EquName(searchType, "QuickSearch"))
            {
                string keywordFilter = null;

                keywordFilter = provider.CombinCondOR(keywordFilter, processNameLike);
                keywordFilter = provider.CombinCondOR(keywordFilter, taskidEqu);
                keywordFilter = provider.CombinCondOR(keywordFilter, serialNumLike);
                keywordFilter = provider.CombinCondOR(keywordFilter, ownerAccountLike);
                keywordFilter = provider.CombinCondOR(keywordFilter, agentAccountLike);
                keywordFilter = provider.CombinCondOR(keywordFilter, stepNameLike);
                keywordFilter = provider.CombinCondOR(keywordFilter, descriptionLike);
                filter = provider.CombinCond(filter, keywordFilter);
            }

            return filter;
        }

        public virtual object GetTaskCount(HttpContext context)
        {
            //获得数据
            int total;
            int worklist;
            int sharetask;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                total = cn.GetMyTaskCount(out worklist, out sharetask);
            }

            return new
            {
                total = total,
                worklist = worklist,
                sharetask = sharetask
            };
        }
    }
}