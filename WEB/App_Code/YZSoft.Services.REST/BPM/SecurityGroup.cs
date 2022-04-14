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

namespace YZSoft.Services.REST.BPM
{
    public class SecurityGroupHandler : YZServiceHandler
    {
        public virtual object[] GetGroups(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            bool excludeEveryone = request.GetBool("excludeEveryone", false);
            string addtosid = request.GetString("addtosid", null);

            SecurityGroupCollection groups = new SecurityGroupCollection();
            bool writePerm;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                writePerm = SecurityManager.CheckPermision(cn,WellKnownRSID.SecurityGroupRoot,BPMPermision.Write);
                if (SecurityManager.CheckPermision(cn,WellKnownRSID.SecurityGroupRoot,BPMPermision.Read))
                    groups = GroupManager.GetSecurityGroups(cn);
            }

            List<object> rv = new List<object>();
            foreach (SecurityGroup group in groups)
            {
                if (excludeEveryone && group.SID == WellKnownSID.Everyone)
                    continue;

                if (!String.IsNullOrEmpty(addtosid) && group.SID == addtosid)
                    continue;

                rv.Add(new
                {
                    GroupName = group.GroupName,
                    SID = group.SID,
                    perm = new {
                        Delete = writePerm && !group.IsSystemGroup
                    }
                });
            }

            return rv.ToArray();
        }

        public virtual List<object> GetGroupUsers(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string groupName = request.GetString("GroupName");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                return this.GetGroupSIDs(cn, groupName);
            }
        }

        public virtual object GetGroupDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string groupName = request.GetString("GroupName");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                SecurityGroup group = SecurityGroup.FromName(cn, groupName);
                return new {
                    group = group,
                    sids = this.GetGroupSIDs(cn,groupName)
                };
            }
        }

        public virtual void SaveSecurityGroup(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string mode = request.GetString("mode");
            string groupName = request.GetString("GroupName", mode == "new", null);

            JsonSerializer serializer = new JsonSerializer();
            StreamReader reader = new StreamReader(context.Request.InputStream);
            using (JsonTextReader streamReader = new JsonTextReader(reader))
            {
                JArray @params = serializer.Deserialize(streamReader) as JArray;

                SecurityGroup group = @params[0].ToObject<SecurityGroup>(serializer);
                SIDPairCollection sids = @params[1].ToObject<SIDPairCollection>(serializer);

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    if (mode == "edit")
                    {
                        if (groupName != group.GroupName)
                            GroupManager.RenameSecurityGroup(cn, groupName, group.GroupName);

                        GroupManager.UpdateSecutiryGroup(cn, group.GroupName, sids);
                    }
                    else
                        GroupManager.AddSecutiryGroup(cn, group.GroupName, sids);
                }
            }
        }

        public virtual void RenameSecurityGroup(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string name = request.GetString("name");
            string newname = request.GetString("newname");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                GroupManager.RenameSecurityGroup(cn, name, newname);
            }
        }

        public virtual object DeleteGroups(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JArray jPost = request.GetPostData<JArray>();
            BPMObjectNameCollection groupNames = jPost.ToObject<BPMObjectNameCollection>();

            JObject rv = new JObject();
            JArray deletedItems = new JArray();
            rv["deletedItems"] = deletedItems;

            try
            {
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach(string groupName in groupNames)
                    {
                        GroupManager.DeleteSecurityGroup(cn, groupName);

                        JObject deletedItem = new JObject();
                        deletedItems.Add(deletedItem);
                        deletedItem["GroupName"] = groupName;
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

        protected virtual List<object> GetGroupSIDs(BPMConnection cn, string groupName)
        {
            List<object> sids = new List<object>();

            SIDPairCollection sidPairs = GroupManager.GetSecurityGroupSIDs(cn, groupName);
            foreach (SIDPair sid in sidPairs)
            {
                string displayName = SecurityManager.TryGetObjectNameFromSID(cn, sid.SIDType, sid.SID);
                if (String.IsNullOrEmpty(displayName))
                    continue;

                sids.Add(
                    new
                    {
                        SIDType = sid.SIDType.ToString(),
                        SID = sid.SID,
                        DisplayName = displayName
                    }
                );
            }

            return sids;
        }
    }
}