using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;

namespace YZSoft.Services.REST.BPM
{
    public class SystemAccessControlHandler : YZServiceHandler
    {
        public virtual JObject GetACL(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string rsid = request.GetString("rsid");

            JObject rv = new JObject();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                ACL acl = SecurityManager.GetACL(cn, rsid);

                rv["acl"] = this.Serialize(cn,acl);
            }

            return rv;
        }

        public virtual JObject GenInheriACL(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string rsid = request.GetString("rsid");

            JObject rv = new JObject();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                ACL acl = SecurityManager.GenInheriACL(cn, rsid);

                rv["acl"] = this.Serialize(cn, acl);
            }

            return rv;
        }

        protected virtual JObject Serialize(BPMConnection cn, ACL acl)
        {
            JObject jacl = new JObject();

            JArray jaces = new JArray();
            jacl["aces"] = jaces;

            foreach (ACE ace in acl.ACEs)
            {
                //获得ACE角色的显示名
                string displayName = ace.GetSIDDisplayName(cn);
                if (String.IsNullOrEmpty(displayName))
                    continue;

                JObject jace = JObject.FromObject(ace);
                jaces.Add(jace);

                jace["DisplayName"] = displayName;
            }

            return jacl;
        }

        public virtual void SaveACL(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            SecurityResType securityResType = request.GetEnum<SecurityResType>("securityResType");
            string resName = request.GetString("resName", "");
            string rsid = request.GetString("rsid", "");
            JArray post = request.GetPostData<JArray>();
            ACECollection aces = post.ToObject<ACECollection>(request.Serializer);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                ACL acl = new ACL();
                acl.ACEs = aces;

                SecurityManager.SaveACL(cn, securityResType, resName,rsid, acl);
            }
        }

        public virtual JObject CheckPermisions(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string rsid = request.GetString("rsid");
            string strPerms = request.GetString("perms", null);
            BPMObjectNameCollection perms = BPMObjectNameCollection.FromStringList(strPerms,',');

            JObject rv = new JObject();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                ACL acl = SecurityManager.GetACL(cn,rsid);

                foreach(string strPerm in perms)
                {
                    BPMPermision perm;
                    if (Enum.TryParse<BPMPermision>(strPerm,out perm))                    
                        rv[strPerm] = acl.HasPermision(cn.Token,perm);
                }
            }

            return rv;
        }

        public virtual JArray CheckResourcesPermision(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string strRsids = request.GetString("rsids");
            BPMPermision perm = request.GetEnum<BPMPermision>("perm");
            BPMObjectNameCollection rsids = BPMObjectNameCollection.FromStringList(strRsids, ',');

            JArray rv = new JArray();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach(string rsid in rsids){
                    rv.Add(SecurityManager.CheckPermision(cn, rsid, perm));
                }
            }

            return rv;
        }
    }
}