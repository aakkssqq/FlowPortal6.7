using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.Org;
using System.IO;

namespace YZSoft.Services.REST.BPM
{
    public class OrgAdminHandler : YZServiceHandler
    {
        protected virtual JObject SerializeOUObject(Role role)
        {
            JObject item = new JObject();

            item["Type"] = "Role";
            item["Name"] = role.Name;
            item["FullName"] = role.FullName;
            item["Disabled"] = false;
            item["Editable"] = role.HasPermision(BPMObjectPermision.Edit);

            return item;
        }

        protected virtual JObject SerializeOUObject(BPMConnection cn, Member member, bool defaultPosition)
        {
            User user = User.TryGetUser(cn, member.UserAccount);
            if (user == null)
            {
                user = new User();
                user.Account = member.UserAccount;
                user.Disabled = true;
            }

            JObject item = new JObject();

            item["Type"] = "Member";
            item["Name"] = user.Account;
            item["FullName"] = member.FullName;
            item["Disabled"] = user.Disabled;

            item["IsLeader"] = member.IsLeader;
            item["DisplayName"] = user.DisplayName;
            item["LeaderTitle"] = member.LeaderTitle;
            item["Level"] = member.Level;
            item["Description"] = user.Description;
            item["HRID"] = user.HRID;
            item["CostCenter"] = user.CostCenter;
            item["OfficePhone"] = user.OfficePhone;
            item["HomePhone"] = user.HomePhone;
            item["Mobile"] = user.Mobile;
            item["EMail"] = user.EMail;
            item["Supervisors"] = JArray.FromObject(OrgManager.GetSupervisors(cn, member.FullName,false));

            item["Editable"] = member.HasPermision(BPMObjectPermision.Edit);
            item["UserEditable"] = user.HasPermision(BPMObjectPermision.Edit);

            if (defaultPosition)
            {
                item["IsDefaultPosition"] = User.IsDefaultPosition(cn, user.Account, member.FullName);
            }

            return item;
        }

        protected virtual bool SaveHeadshot(HttpContext context, string headshot, string sign, string account)
        {
            bool rv = false;

            //headshot
            if (!String.IsNullOrEmpty(headshot) && !NameCompare.EquName(headshot, account))
            {
                string tagPath = Path.Combine(this.GetSystemUserDataPath(context), account, "Headshot");
                string srcPath = Path.Combine(this.GetSystemUserDataPath(context), headshot, "Headshot");

                if (Directory.Exists(tagPath))
                    Directory.Delete(tagPath, true);

                Directory.CreateDirectory(Path.Combine(this.GetSystemUserDataPath(context), account));

                if (Directory.Exists(srcPath))
                    Directory.Move(srcPath, tagPath);

                rv = true;
            }

            //sign
            if (!String.IsNullOrEmpty(sign) && !NameCompare.EquName(sign, account))
            {
                string tagPath = Path.Combine(this.GetSystemUserDataPath(context), account, "Sign");
                string srcPath = Path.Combine(this.GetSystemUserDataPath(context), sign, "Sign");

                if (Directory.Exists(tagPath))
                    Directory.Delete(tagPath, true);

                Directory.CreateDirectory(Path.Combine(this.GetSystemUserDataPath(context), account));

                if (Directory.Exists(srcPath))
                    Directory.Move(srcPath, tagPath);
            }

            if (!String.IsNullOrEmpty(headshot) && !NameCompare.EquName(headshot, account))
            {
                string srcPath = Path.Combine(this.GetSystemUserDataPath(context), headshot);
                if (Directory.Exists(srcPath))
                    Directory.Delete(srcPath, true);
            }

            if (!String.IsNullOrEmpty(sign) && !NameCompare.EquName(sign, account))
            {
                string srcPath = Path.Combine(this.GetSystemUserDataPath(context), sign);
                if (Directory.Exists(srcPath))
                    Directory.Delete(srcPath, true);
            }

            return rv;
        }

        protected virtual string GetSystemUserDataPath(HttpContext context)
        {
            if (YZSetting.UserDataPath.StartsWith("~/"))
                return context.Server.MapPath(YZSetting.UserDataPath);
            return YZSetting.UserDataPath;
        }

        public virtual OUProviderInfo GetProviderInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string nameSpace = request.GetString("nameSpace");
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return OrgSvr.GetProviderInfo(cn, nameSpace);
            }
        }

        public virtual JArray GetChildOUs(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("node", null);
            if (path == "root")
                path = null;

            OUCollection ous;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                if (String.IsNullOrEmpty(path))
                    ous = cn.GetRootOUs(false);
                else
                    ous = OU.GetChildren(cn, path);
            }

            JArray rv = new JArray();
            foreach (OU ou in ous)
            {
                JObject item = new JObject();
                rv.Add(item);
                item["leaf"] = false;
                item["glyph"] = ou.IsRootOU ? 0xeb28 : 0xeb26;
                item["text"] = ou.Name;
                item["rsid"] = ou.RSID;
                item["path"] = ou.FullName;
                item["editable"] = ou.HasPermision(BPMObjectPermision.Edit);
                item["enpandable"] = true;
            }
            return rv;
        }

        public virtual JObject GetOUObjects(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path",null);
            bool defaultPosition = request.GetBool("defaultPosition", false);

            //获得数据
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                RoleCollection roles;
                MemberCollection members;
                OU ou = null;

                if (String.IsNullOrEmpty(path))
                {
                    ou = new OU();
                    roles = new RoleCollection();
                    members = new MemberCollection();
                }
                else
                {
                    ou = OU.FromFullName(cn,path);
                    roles = OU.GetRoles(cn, path);
                    members = OU.GetMembers(cn, path);
                }

                //将数据转化为Json集合
                JObject rv = new JObject();
                JObject metaData = new JObject();
                rv[YZJsonProperty.metaData] = metaData;

                rv[YZJsonProperty.total] = roles.Count + members.Count;

                JArray children = new JArray();
                rv[YZJsonProperty.children] = children;

                metaData["Editable"] = ou.HasPermision(BPMObjectPermision.Edit);
                metaData["NewRole"] = ou.HasPermision(BPMObjectPermision.NewRole);

                foreach (Role role in roles)
                    children.Add(this.SerializeOUObject(role));

                foreach (Member member in members)
                    children.Add(this.SerializeOUObject(cn,member, defaultPosition));

                return rv;
            }
        }

        public virtual JObject GetOUDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string oufullname = request.GetString("fullName");

            OU ou;
            DataColumnCollection columns;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                ou = OU.FromFullName(cn,oufullname);
                columns = OU.GetExtColumns(cn,ou.NameSpace);
            }

            JObject rv;
            rv = JObject.FromObject(ou);
            rv["ExtAttrsSchema"] = YZJsonHelper.SerializeExtAttrSchema(columns);
            return rv;
        }

        public virtual JArray GetOUExtAttrs(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            DataColumnCollection columns;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                columns = OU.GetExtColumns(cn, request.GetString("namespace"));
            }

            return YZJsonHelper.SerializeExtAttrSchema(columns);
        }

        public virtual OU SaveOU(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JObject post = request.GetPostData<JObject>();
            OU ou = post["data"].ToObject<OU>();
            ACL acl = post["acl"].ToObject<ACL>();
            string mode = request.GetString("mode");
            OU newou = null;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (mode == "edit")
                {  
                    string fullname = request.GetString("fullname");
                    OUProviderInfo providerInfo = OrgSvr.GetProviderInfo(cn, fullname);
                    if (providerInfo.Editable)
                        newou = OU.UpdateOU(cn, fullname, ou);
                    else
                        newou = OU.FromFullName(cn, fullname);
                }
                else
                {
                    string parentou = request.GetString("parentou","");
                    if (String.IsNullOrEmpty(parentou))
                        newou = cn.CreateOrg("BPMOU://", ou);
                    else
                        newou = OU.AddChildOU(cn, parentou, ou);
                }

                SecurityManager.SaveACL(cn, SecurityResType.OU, newou.FullName, null, acl);

                return newou;
            }
        }

        public virtual OU RenameOU(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fullname = request.GetString("fullname");
            string newname = request.GetString("newname");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return OU.Rename(cn, fullname, newname);
            }
        }

        public virtual void DeleteOU(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fullname = request.GetString("fullname");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                OU.Delete(cn, fullname);
            }
        }

        public virtual JObject GetRoleDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fullname = request.GetString("fullname");

            Role role;
            MemberCollection members = new MemberCollection();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                role = Role.FromFullName(cn, fullname);
                members = Role.GetMembers(cn, fullname);
            }

            JObject rv = JObject.FromObject(role);
            rv["Members"] = JArray.FromObject(members);
            return rv;
        }

        public virtual JObject SaveRole(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string mode = request.GetString("mode");

            JObject data = request.GetPostData<JObject>();
            Role role = data["Role"].ToObject<Role>();
            BPMObjectNameCollection members = data["Members"].ToObject<BPMObjectNameCollection>();
            Role newRole = null;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (mode == "edit")
                    newRole = Role.UpdateRole(cn, request.GetString("fullname"), role, members);
                else
                    newRole = OU.AddRole(cn, request.GetString("parentou"), role, members);
            }

            return this.SerializeOUObject(newRole);
        }

        public virtual object GetMemberDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fullname = request.GetString("fullname");
            string parentou = request.GetString("parentou");

            Member member;
            User user;
            UserCommonInfo userCommonInfo;
            DataColumnCollection userExtAttrsSchema;
            OUCollection childOUs;
            OUCollection fgOUs;
            BPMObjectNameCollection fgYWs;
            SupervisorCollection supervisors;
            DirectXSCollection directXSs;
            TaskRuleCollection taskRules;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                member = Member.FromFullName(cn, fullname);
                user = member.GetUser(cn);
                userExtAttrsSchema = User.GetExtColumns(cn, user.NameSpace);
                userCommonInfo = UserCommonInfo.FromAccount(cn, user.Account);
                childOUs = OU.GetChildren(cn, parentou);

                fgOUs = member.GetFGOUs(cn);
                fgYWs = member.GetFGYWs(cn);
                supervisors = member.GetSupervisors(cn);
                directXSs = member.GetDirectXSs(cn);

                taskRules = User.GetTaskRules(cn, user.Account);
            }

            return new {
                User = user,
                UserExtAttrsSchema = YZJsonHelper.SerializeExtAttrSchema(userExtAttrsSchema),
                Member = member,
                UserCommonInfo = userCommonInfo,
                ChildOUs = YZJsonHelper.SerializeSimpleOU(childOUs),
                FGOUs = YZJsonHelper.Serialize2Array(fgOUs),
                FGYWs = fgYWs,
                Supervisors = supervisors,
                DirectXSs = directXSs,
                TaskRules = taskRules,
                temporaryUid = "temporary/" + Guid.NewGuid().ToString()
            };
        }

        public virtual object GetNewMemberDefaults(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string parentou = request.GetString("parentou");

            DataColumnCollection userExtAttrsSchema;
            OUCollection childOUs;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                userExtAttrsSchema = User.GetExtColumns(cn, parentou);
                childOUs = OU.GetChildren(cn, parentou);
            }

            return new
            {
                UserExtAttrsSchema = YZJsonHelper.SerializeExtAttrSchema(userExtAttrsSchema),
                ChildOUs = YZJsonHelper.SerializeSimpleOU(childOUs),
                temporaryUid = "temporary/" + Guid.NewGuid().ToString()
            };
        }

        public virtual JObject SaveMember(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string mode = request.GetString("mode");
            string parentou = request.GetString("parentou","");

            JObject data = request.GetPostData<JObject>();
            Member member = data["Member"].ToObject<Member>();
            User user = data["User"].ToObject<User>(request.Serializer);
            BPMObjectNameCollection fgOUs = data["Member"]["FGOUs"].ToObject<BPMObjectNameCollection>();
            BPMObjectNameCollection fgYWs = data["Member"]["FGYWs"].ToObject<BPMObjectNameCollection>();
            SupervisorCollection spvs = data["Supervisors"].ToObject<SupervisorCollection>();

            string headshot = (string)data["User"]["headshot"];
            string sign = (string)data["User"]["sign"];

            Member newMember = null;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (mode == "edit")
                {
                    string fullname = request.GetString("fullname");
                    OUProviderInfo providerInfo = OrgSvr.GetProviderInfo(cn, fullname);
                    if (providerInfo.Editable)
                        newMember = Member.UpdateMember(cn, parentou, fullname, member, user, fgOUs, fgYWs, spvs);
                    else
                        newMember = Member.FromFullName(cn, fullname);
                }
                else
                {
                    newMember = OU.AddMember(cn, request.GetString("parentou"), null, member, user, fgOUs, fgYWs, spvs);
                }

                //设置外出
                UserCommonInfo userCommonInfo = data["UserCommonInfo"].ToObject<UserCommonInfo>();
                User.SetOutOfOffice(cn, user.Account, userCommonInfo.OutOfOfficeState, userCommonInfo.OutOfOfficeFrom, userCommonInfo.OutOfOfficeTo);

                //设置主管
                TaskRuleCollection taskRules = data["TaskRules"].ToObject<TaskRuleCollection>();
                User.SaveTaskRules(cn, user.Account, taskRules);

                //头像与签名
                bool headshotChanged = this.SaveHeadshot(context, headshot, sign, user.Account);

                JObject rv = this.SerializeOUObject(cn, newMember, false);
                rv["headshotChanged"] = headshotChanged;

                return rv;
            }
        }

        public virtual void DeleteObjects(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string parentou = request.GetString("parentou");

            JObject post = request.GetPostData<JObject>();
            BPMObjectNameCollection roles = post["roles"].ToObject<BPMObjectNameCollection>();
            BPMObjectNameCollection members = post["members"].ToObject<BPMObjectNameCollection>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                OU.DeleteRoleAndMembers(cn, parentou, roles, members);
            }
        }

        public virtual JObject AddExistUsers(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string parentou = request.GetString("parentou");

            JArray post = request.GetPostData<JArray>();
            BPMObjectNameCollection accounts = post.ToObject<BPMObjectNameCollection>();

            JObject rv = new JObject();
            JArray added = new JArray();
            rv["added"] = added;

            try
            {
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach (string account in accounts)
                    {
                        OU.AddMember(cn, parentou, account);
                        added.Add(account);
                    }
                }
            }
            catch (Exception e)
            {
                rv[YZJsonProperty.success] = false;
                rv[YZJsonProperty.errorMessage] = e.Message;
            }

            return rv;
        }

        public virtual void ResetPassword(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string parentou = request.GetString("parentou");
            string uid = request.GetString("uid");
            JObject post = request.GetPostData<JObject>();
            string pwd = (string)post["Password"];

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                User.ResetPassword(cn, parentou, uid, pwd);
            }
        }

        public virtual SupervisorCollection GetSupervisors(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string memberfullname = request.GetString("memberfullname");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return Member.GetSupervisors(cn, memberfullname);
            }
        }

        public virtual void SetSupervisors(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JObject post = request.GetPostData<JObject>();
            BPMObjectNameCollection memberfullnames = post["members"].ToObject<BPMObjectNameCollection>();
            SupervisorCollection spvs = post["supervisors"].ToObject<SupervisorCollection>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach(string memberfullname in memberfullnames)
                    Member.SetSupervisors(cn, memberfullname, spvs);
            }
        }

        public virtual void MoveOUObjects(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string src = request.GetString("src");
            string tag = request.GetString("tag");
            bool copy = request.GetBool("copy");

            JObject post = request.GetPostData<JObject>();
            BPMObjectNameCollection roles = post["roles"].ToObject<BPMObjectNameCollection>();
            BPMObjectNameCollection members = post["members"].ToObject<BPMObjectNameCollection>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (copy)
                    OU.CopyRoleAndMembers(cn, src, tag, roles, members);
                else
                    OU.MoveRoleAndMembers(cn, src, tag, roles, members);
            }
        }

        public virtual void MoveOU(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string src = request.GetString("src");
            string tag = request.GetString("tag");
            bool copy = request.GetBool("copy");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (copy)
                    OU.CopyOU(cn, src, tag);
                else
                    OU.MoveOU(cn, src, tag);
            }
        }

        public virtual void MoveUpMembers(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string parentou = request.GetString("parentou");

            JArray post = request.GetPostData<JArray>();
            BPMObjectNameCollection members = post.ToObject<BPMObjectNameCollection>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                OU.MoveUpMembers(cn,parentou,members);
            }
        }

        public virtual void MoveDownMembers(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string parentou = request.GetString("parentou");

            JArray post = request.GetPostData<JArray>();
            BPMObjectNameCollection members = post.ToObject<BPMObjectNameCollection>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                OU.MoveDownMembers(cn, parentou, members);
            }
        }

        public virtual object GetNewOrderIndex(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string parentou = request.GetString("parentou",null);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return new {
                    OrderIndex = OU.GetNewOrderIndex(cn, parentou)
                };
            }
        }

        public virtual void SetUserDefaultPosition(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = request.GetString("uid");
            string memberFullName = request.GetString("memberFullName");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                User.SetDefaultPosition(cn, uid, memberFullName);
            }
        }
    }
}