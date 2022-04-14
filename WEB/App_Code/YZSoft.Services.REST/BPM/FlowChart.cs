using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Drawing;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.TaskTrace;

namespace YZSoft.Services.REST.BPM
{
    public class FlowChartHandler : YZServiceHandler
    {
        public virtual object GetProcessDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string processName = request.GetString("processName");
            Version version = request.GetVersion("version");

            NodeItemCollection nodes = new NodeItemCollection();
            LinkItemCollection links = new LinkItemCollection();

            //获得数据
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                BPMProcess.GetTaskTraceInfo(cn, processName, version, out nodes, out links);
            }

            return new {
                Nodes = nodes,
                Links = links
            };
        }

        public virtual object GetTaskTraceInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");

            BPMTask task;
            NodeItemCollection nodes = new NodeItemCollection();
            LinkItemCollection links = new LinkItemCollection();
            BPMStepCollection steps = new BPMStepCollection();

            //获得数据
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                task = BPMTask.Load(cn, taskid);
                BPMProcess.GetTaskTraceInfo(cn, task.ProcessName, task.ProcessVersion, out nodes, out links);
                steps = BPMTask.GetAllSteps(cn, taskid);
            }

            return new
            {
                Task = this.SerializeTask(task),
                Process = new
                {
                    Nodes = nodes,
                    Links = links
                },
                Steps = this.SerializeSteps(steps)
            };
        }

        public virtual object GetTaskLastSteps(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            int lastStepId = request.GetInt32("LastStepID");

            BPMStepCollection steps;

            //获得数据
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                steps = BPMTask.GetAllSteps(cn, taskid);
            }

            BPMStepCollection newSteps = new BPMStepCollection();
            foreach (BPMProcStep step in steps)
            {
                if (step.StepID > lastStepId)
                    newSteps.Add(step);
            }

            return new
            {
                Steps = this.SerializeSteps(newSteps)
            };
        }

        protected virtual object SerializeTask(BPMTask task)
        {
            return new
            {
                ProcessName = task.ProcessName,
                ProcessVersion = task.ProcessVersion.ToString(2)
            };
        }

        protected virtual JArray SerializeSteps(BPMStepCollection steps)
        {
            JArray jsteps = new JArray();

            foreach (BPMProcStep step in steps)
            {
                JObject item = new JObject();
                jsteps.Add(item);

                item["StepID"] = step.StepID;
                item["Finished"] = step.Finished;
                item["IsHumanStep"] = step.IsHumanStep;
                item["AutoProcess"] = step.AutoProcess;
                item["NodeNameOrg"] = step.RegularNodeName;
                item["NodeName"] = step.StepDisplayName;
                item["SelAction"] = step.SelAction;
                item["SelActionDisplayString"] = step.SelActionDisplayString;
                item["OwnerAccount"] = step.OwnerAccount;
                item["OwnerDisplayName"] = step.OwnerFullName;
                item["AgentAccount"] = step.AgentAccount;
                item["AgentDisplayName"] = step.AgentFullName;
                item["RecipientAccount"] = step.RecipientAccount;
                item["RecipientDisplayName"] = step.RecipientFullName;
                item["HandlerAccount"] = step.HandlerAccount;
                item["HandlerDisplayName"] = step.HandlerFullName;
                item["ReceiveAt"] = step.ReceiveAt;
                item["FinishAt"] = step.FinishAt;
                item["Comments"] = step.Comments;
                item["Memo"] = step.Memo;
                item["Share"] = step.Share;
            }

            return jsteps;
        }
    }
}