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
using System.Data;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;
using YZSoft.Web.ESB.Instance;
using BPM.Client.ESB;

namespace YZSoft.Services.REST.ESB.Instance
{
    public class ServiceHandler : YZServiceHandler
    {
        public virtual object GetLog(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            DateTime date = request.GetDateTime("date");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return WebESBInstanceManager.GetLog(provider, cn, date, this.GetFilterString(request, provider), request.GetSortString("TaskID DESC"), request.Start, request.Limit);
                }
            }
        }

        public virtual object GetInterruptedInstance(HttpContext context)
        {
            YZRequest request = new YZRequest(context);

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return WebESBInstanceManager.GetInterruptedInstance(provider, cn, this.GetFilterString(request, provider), request.GetSortString("TaskID DESC"), request.Start, request.Limit);
                }
            }
        }

        public virtual object GetInstanceTraceInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskId = request.GetInt32("taskId");

            return this.GetInstanceTraceInfo(taskId);
        }

        public virtual void UpdateStepInput(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepId = request.GetInt32("stepId");
            JObject jPostData = request.GetPostData<JObject>();
            string input = Convert.ToString(jPostData["input"]);
            input = this.CompressInputString(input);

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    WebESBInstanceManager.UpdateStepInput(provider, cn, stepId, input);
                }
            }
        }

        public virtual void UpdateTaskRequest(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepId = request.GetInt32("stepId");
            int taskId = request.GetInt32("taskId");
            JObject jPostData = request.GetPostData<JObject>();
            string input = Convert.ToString(jPostData["input"]);
            input = this.CompressInputString(input);

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    WebESBInstanceManager.UpdateStepInput(provider, cn, stepId, input);
                    WebESBInstanceManager.UpdateStepOutput(provider, cn, stepId, input);
                    WebESBInstanceManager.UpdateTaskRequest(provider, cn, taskId, input);
                }
            }
        }

        public virtual void UpdateTaskResponse(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepId = request.GetInt32("stepId");
            int taskId = request.GetInt32("taskId");
            JObject jPostData = request.GetPostData<JObject>();
            string output = Convert.ToString(jPostData["output"]);
            output = this.CompressInputString(output);

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    WebESBInstanceManager.UpdateStepOutput(provider, cn, stepId, output);
                    WebESBInstanceManager.UpdateTaskResponse(provider, cn, taskId, output);
                }
            }
        }

        public virtual void UpdateTaskVariables(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskId = request.GetInt32("taskId");
            JObject jPostData = request.GetPostData<JObject>();
            string variables = Convert.ToString(jPostData["variables"]);
            variables = this.CompressInputString(variables);

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    WebESBInstanceManager.UpdateTaskVariables(provider, cn, taskId, variables);
                }
            }
        }

        public virtual object RunContinue(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskId = request.GetInt32("taskId");

            try
            {
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();
                    ESBInstanceManager.RunContinue(cn, taskId);
                }

                return new
                {
                    success = true,
                    trace = this.GetInstanceTraceInfo(taskId)
                };
            }
            catch (Exception e)
            {
                return new
                {
                    success = true,
                    error = true,
                    errorMessage = e.Message,
                    trace = this.GetInstanceTraceInfo(taskId)
                };
            }
        }

        private object GetInstanceTraceInfo(int taskId)
        {
            DataTable task;
            DataTable steps;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    task = WebESBInstanceManager.LoadTask(provider, cn, taskId);
                    steps = WebESBInstanceManager.LoadSteps(provider, cn, taskId);
                }
            }

            string flowName = Convert.ToString(task.Rows[0]["FlowName"]);
            ESBFlow flowDefine;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                flowDefine = cn.GetGlobalObjectDefine<ESBFlow>(StoreZoneType.ESBFlow, flowName);
            }

            return new
            {
                flow = flowDefine,
                task = JArray.FromObject(task)[0],
                steps = steps
            };
        }

        protected string CompressInputString(string strJToken)
        {
            if (strJToken != null)
                strJToken = strJToken.Trim();

            if (String.IsNullOrEmpty(strJToken))
                return null;

            JToken jToken = JToken.Parse(strJToken);
            return jToken.ToString(Newtonsoft.Json.Formatting.None);
        }

        protected virtual string GetFilterString(YZRequest request, IYZDbProvider provider)
        {
            return null;
        }
    }
}