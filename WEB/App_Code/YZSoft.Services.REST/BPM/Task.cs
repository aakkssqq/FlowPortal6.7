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
using YZSoft.Web.Trace;

namespace YZSoft.Services.REST.BPM
{
    public class TaskHandler : YZServiceHandler
    {
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
                    children.Add(Serialize(cn, step));
            }

            //输出数据
            rv[YZJsonProperty.success] = true;
            return rv;
        }

        public virtual JObject GetTaskProcessedSteps(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            JObject rv = new JObject();

            //获得数据
            BPMStepCollection steps = null;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                steps = BPMTask.GetAllSteps(cn, taskid);

                //将数据转化为Json集合
                JArray children = new JArray();
                rv[YZJsonProperty.children] = children;

                foreach (BPMProcStep step in steps)
                {
                    if (!step.IsHumanStep)
                        continue;

                    if (!step.Finished)
                        continue;

                    children.Add(Serialize(cn, step));
                }

                rv[YZJsonProperty.total] = children.Count;
            }

            //输出数据
            rv[YZJsonProperty.success] = true;
            return rv;
        }

        public virtual JObject GetTimellineSteps(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            JObject rv = new JObject();

            //获得数据
            BPMTask task = null;
            BPMStepCollection steps = null;
            BPMStepCollection filtedSteps = new BPMStepCollection();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                steps = BPMTask.GetAllSteps(cn, taskid);
                task = BPMTask.Load(cn, taskid);

                //将数据转化为Json集合
                JArray children = new JArray();
                rv[YZJsonProperty.children] = children;

                foreach (BPMProcStep step in steps)
                {
                    if (filtedSteps.Count == 0) //第一个步骤可能是系统启动
                    {
                        filtedSteps.Add(step);
                        continue;
                    }

                    //不是有效的步骤
                    if (!step.IsHumanStep)
                        continue;

                    //跳过 - 无处理人的非共享任务
                    if (String.IsNullOrEmpty(step.OwnerAccount) && !step.Share)
                        continue;

                    filtedSteps.Add(step);
                }

                filtedSteps = TraceManager.BuildDependency(cn, filtedSteps);

                foreach (BPMProcStep step in filtedSteps)
                {
                    children.Add(SerializeTraceStep(cn, step, true));
                }

                object endstep = null;
                switch (task.TaskState)
                {
                    case TaskState.Approved:
                    case TaskState.Rejected:
                    case TaskState.Aborted:
                    case TaskState.Deleted:
                        endstep = new
                        {
                            StepID = Int32.MaxValue, //前台排序放到最后
                            isEndStep = true,
                            NodeDisplayName = Resources.YZStrings.All_NodeDisplayName_End,
                            Finished = true,
                            ReceiveAt = task.FinishAt,
                            TaskState = task.TaskState.ToString()
                        };
                        break;
                }

                if (endstep != null)
                    children.Add(JObject.FromObject(endstep));

                rv[YZJsonProperty.total] = children.Count;
            }

            //输出数据
            rv[YZJsonProperty.success] = true;
            return rv;
        }

        public virtual JObject GetRecedeBackSteps(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepid = request.GetInt32("StepID");
            JObject rv = new JObject();

            //获得数据
            BPMStepCollection steps = null;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                steps = BPMProcStep.GetRecedableToSteps(cn, stepid);

                //将数据转化为Json集合
                rv[YZJsonProperty.total] = steps.Count;

                JArray children = new JArray();
                rv[YZJsonProperty.children] = children;

                foreach (BPMProcStep step in steps)
                    children.Add(Serialize(cn, step));
            }

            //输出数据
            rv[YZJsonProperty.success] = true;
            return rv;
        }

        public virtual JObject GetTaskForecastSteps(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            string xmlData = request.GetString("xmlData", null);

            if (!String.IsNullOrEmpty(xmlData))
                xmlData = Encoding.UTF8.GetString(Convert.FromBase64String(xmlData));

            JObject rv = new JObject();

            //获得数据
            BPMStepCollection steps = null;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                steps = BPMTask.GetForecastSteps(cn, taskid, xmlData);

                //将数据转化为Json集合
                JArray children = new JArray();
                rv[YZJsonProperty.children] = children;

                foreach (BPMProcStep step in steps)
                {
                    if (!step.IsHumanStep)
                        continue;

                    children.Add(Serialize(cn, step));
                }

                rv[YZJsonProperty.total] = children.Count;
            }

            //输出数据
            rv[YZJsonProperty.success] = true;
            return rv;
        }

        public virtual JObject GetProcessForecastSteps(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string processName = request.GetString("processName");
            Version version = request.GetVersion("version");
            string owner = request.GetString("owner",null);
            string xmlData = request.GetString("xmlData", null);

            if (!String.IsNullOrEmpty(xmlData))
                xmlData = Encoding.UTF8.GetString(Convert.FromBase64String(xmlData));

            if (String.IsNullOrEmpty(owner))
                throw new Exception(String.Format(Resources.YZStrings.Aspx_ProcessForecastNoPos, YZAuthHelper.LoginUserAccount));

            JObject rv = new JObject();

            //获得数据
            BPMStepCollection steps = null;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                steps = BPMProcess.GetForecastSteps(cn, processName, version, owner, xmlData);

                //将数据转化为Json集合
                JArray children = new JArray();
                rv[YZJsonProperty.children] = children;

                foreach (BPMProcStep step in steps)
                {
                    if (!step.IsHumanStep)
                        continue;

                    children.Add(Serialize(cn, step));
                }

                rv[YZJsonProperty.total] = children.Count;
            }

            //输出数据
            rv[YZJsonProperty.success] = true;
            return rv;
        }

        public virtual JObject GetJumpSrcSteps(HttpContext context)
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
                    children.Add(Serialize(cn, step));
            }

            //输出数据
            rv[YZJsonProperty.success] = true;
            return rv;
        }

        public virtual JArray GetRemindTarget(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            JArray rv = new JArray();

            //获得数据
            BPMStepCollection steps = null;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                steps = BPMTask.GetUnFinishedHumanSteps(cn, taskid);

                foreach (BPMProcStep step in steps)
                {

                    if (step.Share && String.IsNullOrEmpty(step.OwnerAccount))
                    {
                        UserCollection users = BPMProcStep.GetShareUsers(cn, step.StepID);
                        foreach (User user in users)
                        {
                            JObject jStep = new JObject();
                            rv.Add(jStep);

                            jStep["StepID"] = step.StepID;
                            jStep["Share"] = true;
                            jStep["NodeDisplayName"] = step.StepDisplayName;
                            jStep["Account"] = user.Account;
                            jStep["ShortName"] = user.ShortName;
                            jStep["ElapsedMinutes"] = (DateTime.Now - step.ReceiveAt).TotalMinutes;
                        }
                    }
                    else
                    {
                        JObject jStep = new JObject();
                        rv.Add(jStep);

                        jStep["StepID"] = step.StepID;
                        jStep["NodeDisplayName"] = step.StepDisplayName;
                        jStep["Account"] = step.RecipientAccount;
                        jStep["ShortName"] = step.RecipientDisplayName;
                        jStep["ElapsedMinutes"] = (DateTime.Now - step.ReceiveAt).TotalMinutes;
                    }
                }
            }

            return rv;
        }

        public virtual JObject GetJumpTagSteps(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");

            //获得数据
            NodeCollection humanNodes = null;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                humanNodes = BPMTask.GetAllHumanNodesInProcessDefine(cn, taskid);
            }

            //将数据转化为Json集合
            JObject rv = new JObject();
            rv[YZJsonProperty.total] = humanNodes.Count;

            JArray children = new JArray();
            rv[YZJsonProperty.children] = children;

            foreach (ProcessNode node in humanNodes)
            {
                JObject item = new JObject();
                children.Add(item);
                item["NodeName"] = node.Name;
            }

            //输出数据
            rv[YZJsonProperty.success] = true;
            return rv;
        }

        public virtual JObject GetPickbackableSteps(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            JObject rv = new JObject();

            //获得数据
            BPMStepCollection steps = null;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                steps = BPMTask.GetPickbackableSteps(cn, taskid);

                //将数据转化为Json集合
                rv[YZJsonProperty.total] = steps.Count;

                JArray children = new JArray();
                rv[YZJsonProperty.children] = children;

                foreach (BPMProcStep step in steps)
                    children.Add(Serialize(cn, step));
            }

            //输出数据
            rv[YZJsonProperty.success] = true;
            return rv;
        }

        public virtual JObject GetReActiveSteps(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");

            JArray children = new JArray();

            //获得数据
            BPMStepCollection steps = null;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                steps = BPMTask.GetAllSteps(cn, taskid);

                BPMObjectNameCollection stepNames = new BPMObjectNameCollection();
                for (int i = steps.Count - 1; i >= 0; i--)
                {
                    BPMProcStep step = steps[i];

                    if (!step.IsHumanStep)
                        continue;

                    if (step.IsTaskOptStep || step.IsIndicateStep || step.IsInformStep || step.IsConsignStep)
                        continue;

                    if (stepNames.Contains(step.NodeName))
                        continue;

                    stepNames.Add(step.NodeName);
                    children.Add(Serialize(cn, step));
                }
            }

            //输出数据
            JObject rv = new JObject();
            rv[YZJsonProperty.success] = true;
            rv[YZJsonProperty.total] = children.Count;
            rv[YZJsonProperty.children] = children;
            return rv;
        }

        public virtual JObject GetTaskHumenSteps(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");

            //获得数据
            NodeCollection humanNodes = null;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                humanNodes = BPMTask.GetAllHumanNodesInProcessDefine(cn, taskid);
            }

            //将数据转化为Json集合
            JObject rv = new JObject();
            rv[YZJsonProperty.total] = humanNodes.Count;

            JArray children = new JArray();
            rv[YZJsonProperty.children] = children;

            foreach (ProcessNode node in humanNodes)
            {
                JObject item = new JObject();
                children.Add(item);
                item["NodeName"] = node.Name;
            }

            //输出数据
            rv[YZJsonProperty.success] = true;
            return rv;
        }

        public virtual object GetTaskSummaryInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");

            BPMTask task = new BPMTask();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                task.Open(cn, taskid);
            }

            return new
            {
                success = true,
                ProcessVersion = task.ProcessVersion.ToString(2),
                SerialNum = task.SerialNum,
                OwnerAccount = task.OwnerAccount,
                OwnerDisplayName = task.OwnerFullName,
                AgentAccount = task.AgentAccount,
                AgentDisplayName = task.AgentFullName,
                TaskState = task.TaskState.ToString()
            };
        }

        public virtual object GetTaskInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");

            BPMTask task = new BPMTask();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                task.Open(cn, taskid);
            }

            return new
            {
                TaskID = task.TaskID,
                ProcessName = task.ProcessName,
                ProcessVersion = task.ProcessVersion.ToString(2),
                SerialNum = task.SerialNum,
            };
        }

        internal static JObject Serialize(BPMConnection cn, BPMProcStep step)
        {
            return Serialize(cn, step, false);
        }

        internal static JObject Serialize(BPMConnection cn, BPMProcStep step, bool withDepencyInfo)
        {
            JObject item = new JObject();

            string stepMemo = null;
            if (withDepencyInfo && (step.IsIndicateStep || step.IsInformStep) && String.IsNullOrEmpty(step.Memo))
            {
                BPMStepCollection prevSteps = step.LoadPrevSteps(cn);
                if (prevSteps.Count != 0)
                {
                    BPMProcStep prevStep = prevSteps[0];
                    stepMemo = "<span class='yz-stepraiser'>" + String.Format(Resources.YZStrings.Aspx_StepRaiser, YZStringHelper.GetUserShortName(prevStep.HandlerAccount, prevStep.HandlerFullName)) + "</span>";
                }
            }

            item["TaskID"] = step.TaskID;
            item["StepID"] = step.StepID;
            item["ProcessName"] = step.ProcessName;
            item["ProcessVersion"] = step.ProcessVersion.ToString(2);
            item["NodeName"] = step.NodeName;
            item["NodeDisplayName"] = HttpUtility.HtmlEncode(step.StepDisplayName) + stepMemo;
            item["OwnerAccount"] = step.OwnerAccount;
            item["OwnerDisplayName"] = step.OwnerFullName;
            item["AgentAccount"] = step.AgentAccount;
            item["AgentDisplayName"] = step.AgentFullName;
            item["RecipientAccount"] = step.RecipientAccount;
            item["RecipientDisplayName"] = step.RecipientFullName;
            item["HandlerAccount"] = step.HandlerAccount;
            item["HandlerDisplayName"] = step.HandlerFullName;
            item["ReceiveAt"] = step.ReceiveAt;
            item["Finished"] = step.Finished;
            item["FinishAt"] = step.FinishAt;
            item["UsedMinutesWork"] = step.UsedMinutesWork;
            item["UsedMinutes"] = step.UsedMinutes;
            item["UsedMinutesToNow"] = Math.Max((DateTime.Now - step.ReceiveAt).TotalMinutes, 0);
            item["SelAction"] = step.SelAction;
            item["SelActionDisplayString"] = step.SelActionDisplayString;
            item["Comments"] = step.Comments;
            item["IsConsignStep"] = step.IsConsignStep;
            item["IsTaskOptStep"] = step.IsTaskOptStep;
            item["IsInformStep"] = step.IsInformStep;
            item["IsIndicateStep"] = step.IsIndicateStep;
            item["IsStartStep"] = step.Posted;
            item["IsHumanStep"] = step.IsHumanStep;
            item["Share"] = step.Share;
            item["RisedConsignID"] = step.RisedConsignID;
            item["Memo"] = step.Memo;
            item["AutoProcess"] = step.AutoProcess;

            return item;
        }

        internal static JObject SerializeTraceStep(BPMConnection cn, BPMProcStep step, bool deep)
        {
            JObject item = Serialize(cn, step, false);

            JArray nextSteps = new JArray();
            item["nextSteps"] = nextSteps;
            foreach (BPMProcStep step1 in step.TraceNextSteps)
            {
                nextSteps.Add(SerializeTraceStep(cn, step1, false));
            }

            JArray prevSteps = new JArray();
            item["prevSteps"] = nextSteps;
            foreach (BPMProcStep step1 in step.TracePrevSteps)
            {
                prevSteps.Add(SerializeTraceStep(cn, step1, false));
            }

            if (deep)
            {
                item["consignUsers"] = JArray.FromObject(step.ConsignUsers);

                JArray consignSteps = new JArray();
                item["consignSteps"] = consignSteps;
                foreach (BPMProcStep step1 in step.ConsignSteps)
                {
                    consignSteps.Add(SerializeTraceStep(cn, step1, false));
                }

                JArray fllowSteps = new JArray();
                item["fllowSteps"] = fllowSteps;
                foreach (BPMProcStep step1 in step.InformSteps)
                {
                    fllowSteps.Add(SerializeTraceStep(cn, step1, false));
                }

                foreach (BPMProcStep step1 in step.IndicateSteps)
                {
                    fllowSteps.Add(SerializeTraceStep(cn, step1, false));
                }
            }

            return item;
        }
    }
}