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
using System.Data;

namespace YZSoft.Services.REST.BPM
{
    public class TaskRuleHandler : YZServiceHandler
    {
        public virtual TaskRuleCollection GetLoginUserTaskRules(HttpContext context)
        {
            //获得数据
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                TaskRuleCollection rules = User.GetTaskRules(cn, YZAuthHelper.LoginUserAccount);

                foreach (TaskRule rule in rules)
                {
                    ITaskRuleDelegators itaskRuleDelegators = rule as ITaskRuleDelegators;
                    if (itaskRuleDelegators != null)
                    {
                        foreach (Participant participant in itaskRuleDelegators.Delegators)
                        {
                            participant.RuntimeDisplayString = participant.GetDisplayString(cn);
                        }
                    }
                }

                return rules;
            }   
        }

        public virtual TaskRule OpenTaskRule(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int ruleid = request.GetInt32("ruleid");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return TaskRule.Open(cn, ruleid);
            }
        }

        public virtual object SaveTaskRule(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string ruleType = request.GetString("ruleType");

            JsonSerializer serializer = new JsonSerializer();
            StreamReader reader = new StreamReader(context.Request.InputStream);
            using (JsonTextReader streamReader = new JsonTextReader(reader))
            {
                JArray @params = serializer.Deserialize(streamReader) as JArray;

                TaskRule taskRule;
                if (ruleType == "DelegationRule")
                    taskRule = @params[0].ToObject<DelegationRule>(serializer);
                else
                    taskRule = @params[0].ToObject<AssistantRule>(serializer);

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    if (taskRule.RuleID != -1)
                    {
                        TaskRule orgRule = TaskRule.Open(cn, taskRule.RuleID);
                        taskRule.Account = orgRule.Account;
                    }

                    return new
                    {
                        RuleID = taskRule.Save(cn)
                    };
                }
            }
        }

        public virtual object DeleteTaskRules(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JArray jPost = request.GetPostData<JArray>();
            List<int> ids = jPost.ToObject<List<int>>();

            JObject rv = new JObject();
            JArray deletedItems = new JArray();
            rv["deletedItems"] = deletedItems;

            try
            {
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach (int ruleId in ids)
                    {
                        TaskRule.Delete(cn, ruleId);

                        JObject deletedItem = new JObject();
                        deletedItems.Add(deletedItem);
                        deletedItem["RuleID"] = ruleId;
                    }

                    rv[YZJsonProperty.success] = true;
                }
            }
            catch (Exception exp)
            {
                rv[YZJsonProperty.success] = false;
                rv[YZJsonProperty.errorMessage] = exp.Message;
            }

            return rv;
        }

        public virtual void MoveRules(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int targetruleid = request.GetInt32("targetruleid");
            MovePosition position = request.GetEnum<MovePosition>("position");
            JArray post = request.GetPostData<JArray>();
            List<int> ruleids = post.ToObject<List<int>>();
            string uid = YZAuthHelper.LoginUserAccount;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                TaskRule.MoveTaskRules(cn, uid, ruleids.ToArray(), targetruleid, position);
            }
        }
    }
}