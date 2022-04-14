
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
    partial class TaskOptHandler
    {
        public virtual JObject PickupShareTaskExt(HttpContext context)
        {
            JArray processedItems = new JArray();
            try
            {
                YZRequest request = new YZRequest(context);
                JObject jPost = request.GetPostData<JObject>();
                JArray items = (JArray)jPost["items"];

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach(JObject item in items)
                    {
                        int id = (int)item["ID"];
                        int stepid = (int)item["StepID"];
                        BPMProcStep.PickupShareStep(cn, stepid);

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

        public virtual JObject PutbackShareTaskExt(HttpContext context)
        {
            JArray processedItems = new JArray();
            try
            {
                YZRequest request = new YZRequest(context);
                JObject jPost = request.GetPostData<JObject>();
                JArray items = (JArray)jPost["items"];

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach(JObject item in items)
                    {
                        int id = (int)item["ID"];
                        int stepid = (int)item["StepID"];
                        BPMProcStep.PutbackShareStep(cn, stepid);

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

        public virtual JObject BatchApprove(HttpContext context)
        {
            JArray processedItems = new JArray();
            try
            {
                YZRequest request = new YZRequest(context);
                JObject jPost = request.GetPostData<JObject>();
                JArray items = (JArray)jPost["items"];

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach(JObject item in items)
                    {
                        int id = (int)item["ID"];
                        int stepid = (int)item["StepID"];
                        PostResult result = BPMProcStep.Approve(cn, stepid);

                        JObject processedItem = new JObject();
                        processedItem["ID"] = id;
                        processedItem["SerialNum"] = result.SN;
                        processedItem["Result"] = YZStringHelper.GetPostResultDisplayStringShort(result);
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

        public virtual JObject RejectExt(HttpContext context)
        {
            JArray processedItems = new JArray();
            try
            {
                YZRequest request = new YZRequest(context);
                JObject jPost = request.GetPostData<JObject>();
                string comments = (string)jPost["comments"];
                JArray items = (JArray)jPost["items"];

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach(JObject item in items)
                    {
                        int id = (int)item["ID"];
                        int taskid = (int)item["TaskID"];
                        int stepid = (int)item["StepID"];

                        if (stepid != -1)
                            BPMProcStep.Reject(cn, stepid, comments);
                        else
                            BPMTask.Reject(cn, taskid, comments);

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

        public virtual JObject AboutExt(HttpContext context)
        {
            JArray processedItems = new JArray();
            try
            {
                YZRequest request = new YZRequest(context);
                JObject jPost = request.GetPostData<JObject>();
                string comments = (string)jPost["comments"];
                JArray items = (JArray)jPost["items"];

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach(JObject item in items)
                    {
                        int id = (int)item["ID"];
                        int taskid = (int)item["TaskID"];
                        BPMTask.Abort(cn, taskid, comments);

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

        public virtual JObject DeleteExt(HttpContext context)
        {
            JArray processedItems = new JArray();
            try
            {
                YZRequest request = new YZRequest(context);
                JObject jPost = request.GetPostData<JObject>();
                string comments = (string)jPost["comments"];
                JArray items = (JArray)jPost["items"];

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach(JObject item in items)
                    {
                        int id = (int)item["ID"];
                        int taskid = (int)item["TaskID"];
                        BPMTask.Delete(cn, taskid, comments);

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

        public virtual JObject RestoreExt(HttpContext context)
        {
            JArray processedItems = new JArray();
            try
            {
                YZRequest request = new YZRequest(context);
                JObject jPost = request.GetPostData<JObject>();
                string comments = (string)jPost["comments"];
                JArray items = (JArray)jPost["items"];

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach (JObject item in items)
                    {
                        int id = (int)item["ID"];
                        int taskid = (int)item["TaskID"];
                        BPMTask.Continue(cn, taskid);

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

        public virtual JObject ReturnToInitiatorExt(HttpContext context)
        {
            JArray processedItems = new JArray();
            try
            {
                YZRequest request = new YZRequest(context);
                JObject jPost = request.GetPostData<JObject>();
                string comments = (string)jPost["comments"];
                JArray items = (JArray)jPost["items"];

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach(JObject item in items)
                    {
                        int id = (int)item["ID"];
                        int taskid = (int)item["TaskID"];
                        int stepid = (int)item["StepID"];

                        if (stepid != -1)
                            BPMProcStep.RecedeRestart(cn, stepid, comments);
                        else
                            BPMTask.RecedeRestart(cn, taskid, comments);

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

        public virtual JObject PickbackRestartExt(HttpContext context)
        {
            JArray processedItems = new JArray();
            try
            {
                YZRequest request = new YZRequest(context);
                JObject jPost = request.GetPostData<JObject>();
                string comments = (string)jPost["comments"];
                JArray items = (JArray)jPost["items"];

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach (JObject item in items)
                    {
                        int id = (int)item["ID"];
                        int taskid = (int)item["TaskID"];
                        BPMTask.PickBackRestart(cn, taskid, comments);

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

        public virtual JObject TransferExt(HttpContext context)
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
                        int stepid = (int)item["StepID"];
                        int id = (int)item["ID"];
                        BPMProcStep.Transfer(cn, stepid, memberFullName, comments);

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

        public virtual JObject PublicExt(HttpContext context)
        {
            JArray processedItems = new JArray();
            try
            {
                YZRequest request = new YZRequest(context);
                JObject jPost = request.GetPostData<JObject>();
                JArray items = jPost["items"] as JArray;
                BPMObjectNameCollection accounts = jPost["accounts"].ToObject<BPMObjectNameCollection>();

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach(JObject item in items)
                    {
                        int id = (int)item["ID"];
                        int taskid = (int)item["TaskID"];

                        foreach(string account in accounts)
                            BPMTask.Public(cn, taskid, account);

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

        public virtual JObject InviteIndicateExt(HttpContext context)
        {
            JArray processedItems = new JArray();
            try
            {
                YZRequest request = new YZRequest(context);
                JObject jPost = request.GetPostData<JObject>();
                string comments = (string)jPost["comments"];
                JArray items = jPost["items"] as JArray;
                BPMObjectNameCollection accounts = jPost["accounts"].ToObject<BPMObjectNameCollection>();

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach(JObject item in items)
                    {
                        int id = (int)item["ID"];
                        int taskid = (int)item["TaskID"];

                        BPMTask.InviteIndicate(cn, taskid, accounts, comments);

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

        public virtual JObject InformExt(HttpContext context)
        {
            JArray processedItems = new JArray();
            try
            {
                YZRequest request = new YZRequest(context);
                JObject jPost = request.GetPostData<JObject>();
                string comments = (string)jPost["comments"];
                JArray items = jPost["items"] as JArray;
                BPMObjectNameCollection accounts = jPost["accounts"].ToObject<BPMObjectNameCollection>();

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach(JObject item in items)
                    {
                        int id = (int)item["ID"];
                        int taskid = (int)item["TaskID"];

                        BPMTask.Inform(cn, taskid, accounts, comments);

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

        public virtual JObject HandoverRequests(HttpContext context)
        {
            JArray processedItems = new JArray();
            try
            {
                YZRequest request = new YZRequest(context);
                string leavingUid = request.GetString("uid");
                string memberFullName = request.GetString("MemberFullName");
                JObject jPost = request.GetPostData<JObject>();
                string comments = (string)jPost["comments"];
                JArray items = jPost["items"] as JArray;

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach(JObject item in items)
                    {
                        int taskid = (int)item["TaskID"];
                        int id = (int)item["ID"];

                        BPMTask.HandOverRequest(cn, taskid, leavingUid, memberFullName, comments);

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

        public virtual JObject HandoverSteps(HttpContext context)
        {
            JArray processedItems = new JArray();
            try
            {
                YZRequest request = new YZRequest(context);
                string leavingUid = request.GetString("uid");
                string memberFullName = request.GetString("MemberFullName");
                JObject jPost = request.GetPostData<JObject>();
                string comments = (string)jPost["comments"];
                JArray items = jPost["items"] as JArray;

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach(JObject item in items)
                    {
                        int stepid = (int)item["StepID"];
                        int id = (int)item["ID"];

                        BPMProcStep.HandOverStep(cn, stepid, leavingUid, memberFullName, comments);

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
    }
}