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
    public class RecordAccessControlHandler : YZServiceHandler
    {
        public virtual JObject GetACL(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string rsid = request.GetString("rsid");
            string table = request.GetString("table");
            string key = request.GetString("key");
            string datasource = request.GetString("datasource",null);

            JObject rv = new JObject();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                UserResource userResource = UserResource.Open(cn, rsid);
                UserResourcePermisionCollection perms = UserResource.GetPermisions(cn, rsid);
                RDACL acl = RecordSecurityManager.LoadACL(cn, table, key,datasource);

                JArray jperms = new JArray();
                rv["perms"] = jperms;
                foreach (UserResourcePermision perm in perms)
                {
                    if (perm.PermType != UserResourcePermisionType.Record)
                        continue;
                    
                    JObject jperm = new JObject();
                    jperms.Add(jperm);

                    jperm["PermName"] = perm.PermName;
                    jperm["PermType"] = perm.PermType.ToString();
                    jperm["PermDisplayName"] = perm.PermDisplayName;
                }

                JObject jacl = new JObject();
                rv["acl"] = jacl;

                JArray jaces = new JArray();
                jacl["aces"] = jaces;

                URACECollection uraces = this.RDACEs2URACEs(acl.ACEs);
                foreach (URACE ace in uraces)
                {
                    //获得ACE角色的显示名
                    string displayName = ace.GetSIDDisplayName(cn);
                    if (String.IsNullOrEmpty(displayName))
                        continue;

                    JObject jace = JObject.FromObject(ace);
                    jaces.Add(jace);

                    jace["DisplayName"] = displayName;
                }
            }

            return rv;
        }

        public virtual void SaveACL(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string rsid = request.GetString("rsid");
            string table = request.GetString("table");
            string key = request.GetString("key");
            string datasource = request.GetString("datasource", null);

            JArray post = request.GetPostData<JArray>();
            URACECollection uraces = post.ToObject<URACECollection>(request.Serializer);

            RDACECollection rdaces = this.URACEs2RDACEs(uraces);
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                RDACL acl = new RDACL();
                acl.ACEs = rdaces;

                RecordSecurityManager.SaveACL(cn, table, key, acl, datasource);
            }
        }

        public virtual JObject Public(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int count = request.GetInt32("Count");
            int sidCount = request.GetInt32("SIDCount");
            string dataSource = request.GetString("DataSource",null);
            string rsid = request.GetString("RSID");
            string publicPermision = request.GetString("PublicPerm");
            bool leadershipToken = request.GetBool("LeadershipToken",false);
            string comments = request.GetString("Comments",null);

            JArray processedItems = new JArray();

            BPMObjectNameCollection permisions = new BPMObjectNameCollection();
            permisions.Add(publicPermision);

            SIDPairCollection sidPairs = new SIDPairCollection();
            for (int j = 0; j < sidCount; j++)
            {
                string sid = request.GetString("SID" + j.ToString());
                sidPairs.Add(new SIDPair(SIDType.UserSID, sid));
            }

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                for (int i = 0; i < count; i++)
                {
                    string key = request.GetString("ID" + i.ToString());

                    RecordSecurityManager.Public(cn, rsid, key, sidPairs, permisions, leadershipToken, comments, dataSource);

                    JObject processedItem = new JObject();
                    processedItem["ID"] = key;
                    processedItems.Add(processedItem);
                }

                JObject rv = new JObject();
                rv["success"] = true;
                rv["processedItems"] = processedItems;
                return rv;
            }
        }

        protected virtual RDACECollection URACEs2RDACEs(URACECollection uraces)
        {
            RDACECollection rdaces = new RDACECollection();
            foreach (URACE urace in uraces)
            {
                if (urace.AllowPermision.Count == 0)
                    urace.AllowPermision.Add("");

                foreach (string permision in urace.AllowPermision)
                {
                    RDACE rdace = new RDACE();
                    rdaces.Add(rdace);

                    rdace.SIDType = urace.SIDType;
                    rdace.SID = urace.SID;
                    rdace.Permision = permision;
                    rdace.LeadershipToken = urace.LeadershipTokenPermision.Contains(permision);
                }
            }

            return rdaces;
        }

        protected virtual URACECollection RDACEs2URACEs(RDACECollection rdaces)
        {
            URACECollection uraces = new URACECollection();
            foreach (RDACE rdace in rdaces)
            {
                URACE urace = this.FindURACE(uraces, rdace);
                if (urace != null)
                {
                    if (!urace.AllowPermision.Contains(rdace.Permision))
                        urace.AllowPermision.Add(rdace.Permision);
                }
                else
                {
                    urace = new URACE();
                    uraces.Add(urace);
                    urace.SIDType = rdace.SIDType;
                    urace.SID = rdace.SID;
                    urace.AllowPermision.Add(rdace.Permision);

                    if (rdace.LeadershipToken)
                        urace.LeadershipTokenPermision.Add(rdace.Permision);

                    urace.Inherited = false;
                    urace.Inheritable = false;
                    urace.CreateDate = rdace.CreateDate;
                    urace.CreateBy = rdace.CreateBy;
                }
            }

            return uraces;
        }

        protected virtual URACE FindURACE(URACECollection uraces, RDACE rdace)
        {
            foreach (URACE urace in uraces)
            {
                if (urace.SIDType == rdace.SIDType &&
                    urace.SID == rdace.SID)
                    return urace;
            }

            return null;
        }
    }
}