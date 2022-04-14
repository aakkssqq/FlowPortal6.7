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
    public class PermisionHandler : YZServiceHandler
    {
        public virtual JObject GetTaskPermision(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string strPerms = request.GetString("perms",null);
            string strIds = request.GetString("ids","");

            JObject rv = new JObject();
            JObject perms = new JObject();
            rv["perms"] = perms;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach (string strTaskId in strIds.Split(','))
                {
                    int taskid = Int32.Parse(strTaskId);
                    perms[taskid.ToString()] = this.CheckPermision(cn, taskid, -1, strPerms);
                }
            }

            rv[YZJsonProperty.success] = true;
            return rv;
        }

        public virtual JObject GetProcessingPermision(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string strPerms = request.GetString("perms",null);
            string strIds = request.GetString("ids","");

            JObject rv = new JObject();
            JObject perms = new JObject();
            rv["perms"] = perms;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach (string strStepId in strIds.Split(','))
                {
                    int stepid = Int32.Parse(strStepId);
                    perms[stepid.ToString()] = this.CheckPermision(cn, -1, stepid, strPerms);
                }
            }

            rv[YZJsonProperty.success] = true;
            return rv;
        }

        public virtual JObject GetRecordPermision(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string datasource = request.GetString("datasource", null);
            string rsid = request.GetString("rsid");
            string strPerms = request.GetString("perms", null);
            string strIds = request.GetString("ids", "");
            BPMObjectNameCollection permNames = BPMObjectNameCollection.FromStringList(strPerms,',');

            JObject rv = new JObject();
            JObject perms = new JObject();
            rv["perms"] = perms;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach (string id in strIds.Split(',')){
                    bool[] checkResult = RecordSecurityManager.CheckPermision(cn, rsid, id, permNames, datasource);

                   JObject jPerm = new JObject();
                   perms[id] = jPerm;

                   for (int i = 0; i < permNames.Count; i++)
                       jPerm[permNames[i]] = checkResult[i];
                }
            }

            rv[YZJsonProperty.success] = true;
            return rv;
        }

        public virtual JObject GetStoreObjectPerms(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            StoreZoneType zone = request.GetEnum<StoreZoneType>("zone");
            string path = request.GetString("path",null);
            string strPerms = request.GetString("perms", null);
            BPMObjectNameCollection ids = BPMObjectNameCollection.FromStringList(request.GetString("ids", ""), ','); ;
            BPMPermision[] bpmPerms = YZSecurityHelper.ParsePermisions(strPerms);

            JObject rv = new JObject();
            JObject perms = new JObject();
            rv["perms"] = perms;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach (string id in ids)
                {
                    string fullName;
                    if (String.IsNullOrEmpty(path))
                        fullName = id;
                    else
                        fullName = path + "/" + id;

                    ACL acl = SecurityManager.GetACL(cn,zone.ToString() + "://" + fullName);

                    JObject jPerm = new JObject();
                    perms[id] = jPerm;

                    foreach (BPMPermision perm in bpmPerms)
                        jPerm[perm.ToString()] = acl.HasPermision(cn.Token, perm);
                }
            }

            rv[YZJsonProperty.success] = true;
            return rv;
        }

        protected virtual JObject CheckPermision(BPMConnection cn, int taskid, int stepid, string permString)
        {
            JObject rv = new JObject();
            NodePermision[] perms = YZSecurityHelper.ParseNodePermisions(permString);

            bool[] allows = BPMTask.TaskOptPermCheckExt(cn, taskid, stepid, perms);

            for (int i = 0; i < perms.Length; i++)
                rv[perms[i].ToString()] = allows[i];

            return rv;
        }
    }
}