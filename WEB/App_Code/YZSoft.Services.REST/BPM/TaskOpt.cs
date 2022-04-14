
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

namespace YZSoft.Services.REST.BPM
{
    public partial class TaskOptHandler : YZServiceHandler
    {
        public virtual JObject DeleteDrafts(HttpContext context)
        {
            JArray processedItems = new JArray();
            try
            {
                YZRequest request = new YZRequest(context);
                JObject jPost = request.GetPostData<JObject>();
                BPMObjectNameCollection guids = jPost["items"].ToObject<BPMObjectNameCollection>();

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach (string guid in guids)
                    {
                        Guid draftGuid = Guid.Parse(guid);
                        TaskManager.DeleteDraft(cn, draftGuid);

                        JObject processedItem = new JObject();
                        processedItem["DraftID"] = draftGuid.ToString();
                        processedItems.Add(processedItem);
                    }

                    JObject rv = new JObject();
                    rv[YZJsonProperty.success] = true;
                    rv[YZJsonProperty.processedItems] = processedItems;

                    return rv;
                }
            }
            catch (Exception exp)
            {
                JObject rv = new JObject();
                rv[YZJsonProperty.success] = false;
                rv[YZJsonProperty.errorMessage] = exp.Message;
                rv[YZJsonProperty.processedItems] = processedItems;

                return rv;
            }
        }

        public virtual JObject DeleteFormTemplates(HttpContext context)
        {
            JArray processedItems = new JArray();
            try
            {
                YZRequest request = new YZRequest(context);
                JObject jPost = request.GetPostData<JObject>();
                BPMObjectNameCollection guids = jPost["items"].ToObject<BPMObjectNameCollection>();

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach (string guid in guids)
                    {
                        Guid draftGuid = Guid.Parse(guid);
                        TaskManager.DeleteDraft(cn, draftGuid);

                        JObject processedItem = new JObject();
                        processedItem["DraftID"] = draftGuid.ToString();
                        processedItems.Add(processedItem);
                    }

                    JObject rv = new JObject();
                    rv[YZJsonProperty.success] = true;
                    rv[YZJsonProperty.processedItems] = processedItems;
                    return rv;
                }
            }
            catch (Exception exp)
            {
                JObject rv = new JObject();
                rv[YZJsonProperty.success] = false;
                rv[YZJsonProperty.errorMessage] = exp.Message;
                rv[YZJsonProperty.processedItems] = processedItems;
                return rv;
            }
        }

        public virtual void UpdateDraftName(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            Guid draftid = request.GetGuid("draftid", false);
            string newName = request.GetString("newName",null);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                TaskManager.UpdateDraftName(cn, draftid, newName);
            }
        }

        public virtual void Reject(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            this.ApproveCheck(context);

            int taskid = request.GetInt32("TaskID");
            int stepid = request.GetInt32("StepID", -1);
            JObject jPost = request.GetPostData<JObject>();
            string comments = (string)jPost["comments"];
            string formdata = (string)jPost["formdata"];

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                //移动审批不保存表单数据
                if (!String.IsNullOrEmpty(formdata))
                    BPMProcess.Post(cn, formdata);

                if (stepid != -1)
                    BPMProcStep.Reject(cn, stepid, comments);
                else
                    BPMTask.Reject(cn, taskid, comments);
            }
        }

        public virtual JObject ReturnToInitiator(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            this.ApproveCheck(context);

            int taskid = request.GetInt32("TaskID");
            int stepid = request.GetInt32("StepID", -1);
            JObject jPost = request.GetPostData<JObject>();
            string comments = (string)jPost["comments"];
            string formdata = (string)jPost["formdata"];

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                //移动审批不保存表单数据
                if (!String.IsNullOrEmpty(formdata))
                    BPMProcess.Post(cn, formdata);

                User user;
                if (stepid != -1)
                    user = BPMProcStep.RecedeRestart(cn, stepid, comments);
                else
                    user = BPMTask.RecedeRestart(cn, taskid, comments);

                JObject rv = new JObject();
                rv[YZJsonProperty.success] = true;
                rv["UserFriendlyName"] = user.FriendlyName;
                return rv;
            }
        }

        public virtual JObject RecedeBack(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            this.ApproveCheck(context);

            int stepid = request.GetInt32("StepID");
            JObject jPost = request.GetPostData<JObject>();
            string comments = (string)jPost["comments"];
            string formdata = (string)jPost["formdata"];
            List<int> toStepIDs = jPost["toStepIDs"].ToObject<List<int>>();

            BPMTask task;
            BPMProcStep srcStep;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                //移动审批不保存表单数据
                if (!String.IsNullOrEmpty(formdata))
                    BPMProcess.Post(cn, formdata);

                srcStep = BPMProcStep.Load(cn, stepid);
                task = BPMTask.Load(cn, srcStep.TaskID);

                BPMStepCollection newSteps = BPMProcStep.RecedeBack(cn, stepid, toStepIDs.ToArray(), comments);
                List<string> to = new List<string>();
                foreach (BPMProcStep step in newSteps)
                    to.Add(String.Format("{0}[{1}]", step.NodeName, YZStringHelper.GetUserFriendlyName(step.RecipientAccount, step.RecipientFullName)));

                JObject rv = new JObject();
                rv[YZJsonProperty.success] = true;
                rv["sn"] = task.SerialNum;
                rv["tosteps"] = String.Join(";", to.ToArray());

                return rv;
            }
        }

        public virtual JObject Transfer(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            this.ApproveCheck(context);

            int stepid = request.GetInt32("StepID");
            string memberFullName = request.GetString("MemberFullName");
            JObject jPost = request.GetPostData<JObject>();
            string comments = (string)jPost["comments"];
            string formdata = (string)jPost["formdata"];

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                //移动审批不保存表单数据
                if (!String.IsNullOrEmpty(formdata))
                    BPMProcess.Post(cn, formdata);

                User user = BPMProcStep.Transfer(cn, stepid, memberFullName, comments);

                JObject rv = new JObject();
                rv[YZJsonProperty.success] = true;
                rv["UserFriendlyName"] = user.FriendlyName;

                return rv;
            }
        }

        public virtual JObject Jump(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            this.ApproveCheck(context);

            int stepid = request.GetInt32("StepID",-1);
            int taskid = request.GetInt32("TaskID");
            string toStepName = request.GetString("ToStepName");
            JObject jPost = request.GetPostData<JObject>();
            string comments = (string)jPost["comments"];
            string formdata = (string)jPost["formdata"];
            List<int> fromStepIDs = jPost["fromStepIDs"].ToObject<List<int>>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                //移动审批不保存表单数据
                if (!String.IsNullOrEmpty(formdata))
                    BPMProcess.Post(cn, formdata);

                BPMProcStep step = BPMTask.Jump(cn, taskid, stepid, fromStepIDs.ToArray(), toStepName, comments);

                JObject rv = new JObject();
                rv[YZJsonProperty.success] = true;
                rv["StepName"] = step.NodeName;
                rv["UserFriendlyName"] = YZStringHelper.GetUserFriendlyName(step.RecipientAccount, step.RecipientFullName);

                return rv;
            }
        }

        public virtual JObject InviteIndicate(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            this.ApproveCheck(context);

            int taskid = request.GetInt32("TaskID");
            JObject jPost = request.GetPostData<JObject>();
            string comments = (string)jPost["comments"];
            BPMObjectNameCollection accounts = jPost["uids"].ToObject<BPMObjectNameCollection>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                BPMTask task = BPMTask.Load(cn, taskid);
                UserCollection users = BPMTask.InviteIndicate(cn, taskid, accounts, comments);

                JObject rv = new JObject();
                rv[YZJsonProperty.success] = true;
                rv["SN"] = task.SerialNum;
                rv["UserNameList"] = YZStringHelper.GetUserNameListString(users);

                return rv;
            }
        }

        public virtual JObject Inform(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            this.ApproveCheck(context);

            int taskid = request.GetInt32("TaskID");
            JObject jPost = request.GetPostData<JObject>();
            string comments = (string)jPost["comments"];
            BPMObjectNameCollection accounts = jPost["uids"].ToObject<BPMObjectNameCollection>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                UserCollection users = BPMTask.Inform(cn, taskid, accounts, comments);

                JObject rv = new JObject();
                rv[YZJsonProperty.success] = true;
                rv["UserNameList"] = YZStringHelper.GetUserNameListString(users);

                return rv;
            }
        }

        public virtual JObject Public(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            this.ApproveCheck(context);

            int taskid = request.GetInt32("TaskID");
            JObject jPost = request.GetPostData<JObject>();
            string comments = (string)jPost["comments"];
            BPMObjectNameCollection accounts = jPost["uids"].ToObject<BPMObjectNameCollection>();

            UserCollection users = new UserCollection();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach(string account in accounts)
                {
                    User user = BPMTask.Public(cn, taskid, account);
                    users.Add(user);
                }

                JObject rv = new JObject();
                rv[YZJsonProperty.success] = true;
                rv["UserNameList"] = YZStringHelper.GetUserNameListString(users);

                return rv;
            }
        }

        public virtual JObject Repair(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");

            JObject jPost = request.GetPostData<JObject>();
            string comments = (string)jPost["comments"];
            List<int> fromStepIDs = jPost["fromStepIDs"].ToObject<List<int>>();
            BPMObjectNameCollection toNodeNames = jPost["toNodeNames"].ToObject<BPMObjectNameCollection>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                BPMStepCollection steps = BPMTask.Repair(cn, taskid, fromStepIDs.ToArray(), toNodeNames, comments);

                List<string> to = new List<string>();
                foreach (BPMProcStep step in steps)
                    to.Add(String.Format("{0}[{1}]", step.NodeName, YZStringHelper.GetUserFriendlyName(step.RecipientAccount, step.RecipientFullName)));

                JObject rv = new JObject();
                rv[YZJsonProperty.success] = true;
                rv["tosteps"] = String.Join(";", to.ToArray());

                return rv;
            }
        }

        public virtual void Abort(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            this.ApproveCheck(context);

            int taskid = request.GetInt32("TaskID");
            string comments = request.GetString("Comments",null);
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                BPMTask.Abort(cn, taskid, comments);
            }
        }

        public virtual void Delete(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            this.ApproveCheck(context);

            int taskid = request.GetInt32("TaskID");
            string comments = request.GetString("Comments",null);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                BPMTask.Delete(cn, taskid, comments);
            }
        }

        public virtual void Restore(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            string comments = request.GetString("Comments",null);
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                BPMTask.Continue(cn, taskid, comments);
            }
        }

        public virtual void PutbackShareTask(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            this.ApproveCheck(context);

            int stepid = request.GetInt32("StepID");
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                BPMProcStep.PutbackShareStep(cn, stepid);
            }
        }

        public virtual object PickupShareTask(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            this.ApproveCheck(context);

            int stepid = request.GetInt32("StepID");
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return new
                {
                    stepid = BPMProcStep.PickupShareStep(cn, stepid)
                };
            }
        }

        public virtual JObject PickbackRestart(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            string comments = request.GetString("Comments",null);
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                BPMProcStep step = BPMTask.PickBackRestart(cn, taskid, comments);

                JObject rv = new JObject();
                rv[YZJsonProperty.success] = true;
                rv["StepName"] = step.NodeName;
                rv["UserFriendlyName"] = YZStringHelper.GetUserFriendlyName(step.RecipientAccount, step.RecipientFullName);
                return rv;
            }
        }

        public virtual JObject Pickback(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            int stepid = request.GetInt32("StepID");
            string comments = request.GetString("Comments",null);
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                BPMProcStep step = BPMTask.PickBack(cn, taskid, stepid, comments);

                JObject rv = new JObject();
                rv[YZJsonProperty.success] = true;
                rv["StepName"] = step.NodeName;
                rv["UserFriendlyName"] = YZStringHelper.GetUserFriendlyName(step.RecipientAccount, step.RecipientFullName);
                return rv;
            }
        }

        public virtual JObject AssignOwner(HttpContext context)
        {
            JArray processedItems = new JArray();
            try
            {
                YZRequest request = new YZRequest(context);
                string memberFullName = request.GetString("MemberFullName");
                JObject jPost = request.GetPostData<JObject>();
                string comments = (string)jPost["comments"];
                JArray items = (JArray)jPost["items"];

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach(JObject item in items)
                    {
                        int id = (int)item["ID"];
                        int stepid = (int)item["StepID"];
                        BPMProcStep.AssignOwner(cn, stepid, memberFullName, comments);

                        JObject processedItem = new JObject();
                        processedItem["ID"] = id;
                        processedItems.Add(processedItem);
                    }

                    JObject rv = new JObject();
                    rv[YZJsonProperty.success] = true;
                    rv[YZJsonProperty.processedItems] = processedItems;

                    return rv;
                }
            }
            catch (Exception exp)
            {
                JObject rv = new JObject();
                rv[YZJsonProperty.success] = false;
                rv[YZJsonProperty.errorMessage] = exp.Message;
                rv[YZJsonProperty.processedItems] = processedItems;

                return rv;
            }
        }

        public virtual JObject DirectSend(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepid = request.GetInt32("StepID");
            bool saveFormData = request.GetBool("SaveFormData");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (saveFormData)
                    BPMProcess.Post(cn, context.Request.InputStream);

                BPMStepCollection newsteps = BPMProcStep.DirectSend(cn, stepid);

                List<string> to = new List<string>();
                foreach (BPMProcStep step in newsteps)
                    to.Add(String.Format("{0}[{1}]", step.NodeName, YZStringHelper.GetUserFriendlyName(step.RecipientAccount, step.RecipientFullName)));

                JObject rv = new JObject();
                rv[YZJsonProperty.success] = true;
                rv["tosteps"] = String.Join(";", to.ToArray());

                return rv;
            }
        }

        public virtual void CancelIndicateInvite(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepid = request.GetInt32("StepID");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                BPMTask.CancelInviteIndicate(cn, stepid);
            }
        }

        public virtual void CancelInform(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepid = request.GetInt32("StepID");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                BPMTask.CancelInform(cn, stepid);
            }
        }

        public virtual JObject ReActive(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            JObject jPost = request.GetPostData<JObject>();
            string comments = (string)jPost["comments"];
            List<int> toStepIDs = jPost["toStepIDs"].ToObject<List<int>>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                BPMStepCollection newSteps = BPMTask.ReActive(cn, taskid, toStepIDs.ToArray(), comments);

                List<string> to = new List<string>();
                foreach (BPMProcStep step in newSteps)
                    to.Add(String.Format("{0}[{1}]", step.NodeName, YZStringHelper.GetUserFriendlyName(step.RecipientAccount, step.RecipientFullName)));

                JObject rv = new JObject();
                rv[YZJsonProperty.success] = true;
                rv["tosteps"] = String.Join(";", to.ToArray());

                return rv;
            }
        }

        public virtual JObject Remind(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JObject jPost = request.GetPostData<JObject>();
            string comments = (string)jPost["comments"];
            JArray jTargets = (JArray)jPost["targets"];
            UserCollection users = new UserCollection();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach (JObject jTarget in jTargets)
                {
                    int stepid = (int)jTarget["stepid"];
                    BPMObjectNameCollection uids = jTarget["uids"].ToObject<BPMObjectNameCollection>();
                    users.Append(BPMProcStep.Remind(cn, stepid, uids, comments));
                }
            }

            JObject rv = new JObject();
            rv[YZJsonProperty.success] = true;
            rv["UserNameList"] = YZStringHelper.GetUserNameListString(users);

            return rv;
        }
    }
}