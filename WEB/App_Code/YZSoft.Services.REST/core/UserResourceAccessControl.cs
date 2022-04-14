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

namespace YZSoft.Services.REST.Core
{
    public class UserResourceAccessControlHandler : YZServiceHandler
    {
        public virtual JObject GetFolders(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string rsid = request.GetString("node",null);
            BPMPermision perm = request.GetEnum<BPMPermision>("perm");
            if (rsid == "root")
                rsid = null;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                JObject rv = new JObject();

                JArray items = new JArray();
                rv[YZJsonProperty.children] = items;

                //if (SecurityManager.CheckPermision(cn, WellKnownRSID.SecurityResourceRoot, BPMPermision.Read))
                this.ExpandTree(cn, items, rsid, perm);

                rv[YZJsonProperty.success] = true;
                return rv;
            }
        }

        protected virtual void ExpandTree(BPMConnection cn, JArray items, string rsid, BPMPermision perm)
        {
            UserResourceCollection resources = UserResource.GetChildren(cn, rsid, perm);

            foreach (UserResource resource in resources)
            {
                JObject item = new JObject();
                items.Add(item);
                item["leaf"] = false;
                item["text"] = resource.ResourceName;
                item["expanded"] = false;
                item["path"] = resource.RSID;

                JArray children = new JArray();
                item[YZJsonProperty.children] = children;
                this.ExpandTree(cn, children, resource.RSID, perm);
            }
        }

        public virtual JObject GetResourcePerms(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string rsid = request.GetString("rsid");
            JObject rv = new JObject();

            //获得数据
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                UserResource userResource = UserResource.Open(cn, rsid);
                rv["ResourceName"] = userResource.ResourceName;

                UserResourcePermisionCollection perms = UserResource.GetPermisions(cn, rsid);
                URACL acl = UserResource.GetACL(cn, rsid);

                JArray jperms = new JArray();
                rv["perms"] = jperms;
                foreach (UserResourcePermision perm in perms)
                {
                    JObject jperm = JObject.FromObject(perm);
                    jperms.Add(jperm);
                    JArray jRoles = new JArray();
                    jperm["roles"] = jRoles;
                    BPMObjectNameCollection checkedSids = new BPMObjectNameCollection();

                    foreach (URACE ace in acl.ACEs)
                    {
                        if (checkedSids.Contains(ace.SID))
                            continue;

                        checkedSids.Add(ace.SID);

                        SecurityToken token = new SecurityToken();
                        token.SIDs.Add(ace.SID);
                        if(acl.HasPermision(token,perm.PermName))
                        {
                            JObject jRole = new JObject();
                            jRoles.Add(jRole);

                            jRole["Name"] = ace.GetSIDDisplayName(cn);
                        }
                    }
                }
            }

            return rv;
        }

        public virtual object GetResourceDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string rsid = request.GetString("rsid");

            UserResource resource;
            UserResourcePermisionCollection perms;
            //获得数据
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                
                resource = UserResource.Open(cn,rsid);
                perms = UserResource.GetPermisions(cn, rsid);
            }

            return new
            {
                resource = resource,
                perms = perms
            };
        }

        public virtual object GetNewResource(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string parentRsid = request.GetString("parentRsid", null);

            UserResourceCollection existResources;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                existResources = UserResource.GetChildren(cn, parentRsid);
            }

            //获得新加项OrderIndex
            int orderIndex = 0;
            foreach (UserResource existResource in existResources)
            {
                if (existResource.OrderIndex >= orderIndex)
                    orderIndex = existResource.OrderIndex + 1;
            }

            return new
            {
                RSID = Guid.NewGuid().ToString(),
                OrderIndex = orderIndex
            };
        }

        public virtual void SaveResource(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string mode = request.GetString("mode");
            JObject jPost = request.GetPostData<JObject>();
            UserResource resource = jPost["resource"].ToObject<UserResource>();
            UserResourcePermisionCollection perms = jPost["perms"].ToObject<UserResourcePermisionCollection>();
            ACL acl = jPost["acl"].ToObject<ACL>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (mode == "edit")
                {
                    string rsid = request.GetString("rsid");
                    UserResource.Save(cn, rsid, resource, perms);
                }
                else
                {
                    string parentRsid = request.GetString("parentRsid", null);
                    UserResource.SaveAs(cn, parentRsid, resource, perms);
                }

                SecurityManager.SaveACL(cn, SecurityResType.UserResource, resource.RSID, null, acl);
            }
        }

        public virtual void DeleteResource(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string rsid = request.GetString("rsid");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();                
                UserResource.Delete(cn, rsid);
            }
        }

        public virtual JObject GetACL(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string rsid = request.GetString("rsid");

            JObject rv = new JObject();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                UserResource userResource = UserResource.Open(cn, rsid);
                UserResourcePermisionCollection perms = UserResource.GetPermisions(cn, rsid);
                URACL acl = UserResource.GetACL(cn, rsid);

                JArray jperms = new JArray();
                rv["perms"] = jperms;
                foreach (UserResourcePermision perm in perms)
                {
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
                
                foreach (URACE ace in acl.ACEs)
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

            JArray post = request.GetPostData<JArray>();
            URACECollection aces = post.ToObject<URACECollection>(request.Serializer);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                URACL acl = new URACL();
                acl.RSID = rsid;
                acl.ACEs = aces;

                UserResource.SaveACL(cn, acl);
            }
        }
    }
}