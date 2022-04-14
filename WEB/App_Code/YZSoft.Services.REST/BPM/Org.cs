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
    public class OrgHandler : YZServiceHandler
    {
        public virtual object GetOrgTree(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("node", null);
            string srcoupath = request.GetString("srcoupath", null);
            GetRootOUsType getRootOUsType = request.GetEnum<GetRootOUsType>("getRootOUsType",GetRootOUsType.All);

            if (YZStringHelper.EquName(path, "root"))
                path = null;

            JObject rv = new JObject();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                JArray children = new JArray();
                rv[YZJsonProperty.children] = children;

                if (String.IsNullOrEmpty(path))
                {
                    SecurityToken token = cn.Token;
                    JObject dirParentItem = null;

                    this.Expand(cn, children, path, token, ref dirParentItem, getRootOUsType, srcoupath);

                    if (dirParentItem != null)
                    {
                        dirParentItem["dirou"] = true;

                        //没必要列出所在部门的子部门
                        //dirParentItem["expanded"] = false;
                        //dirParentItem.ChildItems.Clear();
                    }
                }
                else
                {
                    OUCollection ous = OU.GetChildren(cn, path);

                    foreach (OU ou in ous)
                    {
                        JObject item = new JObject();
                        item["leaf"] = false;
                        item["glyph"] = ou.IsRootOU ? 0xeb28 : 0xeb26;
                        item["text"] = ou.Name;
                        item["id"] = ou.FullName;
                        item["enpandable"] = true;
                        children.Add(item);

                        item["data"] = this.GetNodeData(ou);
                    }
                }
            }

            //输出数据
            return rv;
        }

        protected virtual void Expand(BPMConnection cn, JArray items, string path, SecurityToken token, ref JObject dirParentItem, GetRootOUsType getRootOUsType, string srcoupath)
        {
            OUCollection ous;
            if (String.IsNullOrEmpty(path))
            {
                if (getRootOUsType != GetRootOUsType.All && !String.IsNullOrEmpty(srcoupath))
                    ous = cn.GetRootOUs(srcoupath, getRootOUsType);
                else
                    ous = cn.GetRootOUs();
            }
            else
            {
                ous = OU.GetChildren(cn, path);
            }

            bool parentOuExpanded = false;
            foreach (OU ou in ous)
            {
                JObject item = new JObject();
                item["leaf"] = false;
                item["glyph"] = ou.IsRootOU ? 0xeb28 : 0xeb26;
                item["text"] = ou.Name;
                item["id"] = ou.FullName;
                item["expandable"] = true;
                items.Add(item);

                item["data"] = this.GetNodeData(ou);

                if ((ous.Count == 1 && String.IsNullOrEmpty(path)) || (!parentOuExpanded && token.ContainsSID(ou.SID)))
                {
                    dirParentItem = item;
                    parentOuExpanded = true;

                    item["expanded"] = true;

                    JArray children = new JArray();
                    item[YZJsonProperty.children] = children;
                    Expand(cn, children, ou.FullName, token, ref dirParentItem, getRootOUsType, srcoupath);
                }
            }
        }

        public virtual object GetOULevels(HttpContext context)
        {
            BPMObjectNameCollection levels;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                levels = cn.GetDeptLevels();
            }

            List<object> rv = new List<object>();
            foreach (string value in levels)
            {
                string strValue = value != null ? value.Trim() : value;
                if (!String.IsNullOrEmpty(strValue))
                    rv.Add(new { name = value });
            }

            return rv;
        }

        public virtual object GetOUNames(HttpContext context)
        {
            BPMObjectNameCollection names;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                names = cn.GetDeptNames();
            }

            List<object> rv = new List<object>();
            foreach (string value in names)
                rv.Add(new { name = value });

            return rv;
        }

        public virtual object GetLeaderTitles(HttpContext context)
        {
            BPMObjectNameCollection titles;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                titles = cn.GetLeaderTitles();
            }

            List<object> rv = new List<object>();
            foreach (string value in titles)
                rv.Add(new { name = value });

            return rv;
        }

        public virtual object GetRoleNames(HttpContext context)
        {
            BPMObjectNameCollection names;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                names = cn.GetRoleNames();
            }

            List<object> rv = new List<object>();
            foreach (string value in names)
                rv.Add(new { name = value });

            return rv;
        }

        public virtual object SearchUser(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string keyword = request.GetString("kwd",null);
            bool includeDisabledUser = request.GetBool("includeDisabledUser", false);

            //将数据转化为Json集合
            JObject rv = new JObject();

            JArray children = new JArray();
            rv[YZJsonProperty.children] = children;

            if (!String.IsNullOrEmpty(keyword))
            {
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();
                    UserCollection users = OrgSvr.SearchUser(cn, keyword, includeDisabledUser);
                    foreach (User user in users)
                    {
                        MemberCollection positions = OrgSvr.GetUserPositions(cn, user.Account);
                        MemberCollection members = new MemberCollection();

                        if (positions.Count != 0)
                            members.Add(positions[0]);

                        foreach (Member member in members)
                        {
                            JObject jItem = this.JObjectFromMember(cn, member, user, false);
                            OU parentou = member.GetParentOU(cn);
                            string oufullName = parentou.GetFriendlyFullName(cn);
                            jItem["parentouName"] = parentou.Name;
                            jItem["parentouFullNameFriendly"] = oufullName;
                            jItem["memberFriendlyName"] = oufullName + "/" + user.Account;
                            jItem["search"] = true;
                            children.Add(jItem);
                        }
                    }
                }
            }

            //输出数据
            return rv;
        }

        public virtual object SearchMember(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string keyword = request.GetString("kwd", null);
            bool includeDisabledUser = request.GetBool("includeDisabledUser", false);
            bool defaultPosition = request.GetBool("defaultPosition", false);

            //将数据转化为Json集合
            JObject rv = new JObject();

            JArray children = new JArray();
            rv[YZJsonProperty.children] = children;

            if (!String.IsNullOrEmpty(keyword))
            {
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();
                    MemberCollection members = OrgSvr.SearchMember(cn, keyword, includeDisabledUser);
                    UserCollection users = new UserCollection();
                    foreach (Member member in members)
                    {
                        User user = users.TryGetItem(member.UserAccount);
                        if (user == null)
                        {
                            user = User.FromAccount(cn, member.UserAccount);
                            users.Add(user);
                        }

                        JObject jItem = this.JObjectFromMember(cn, member, user, defaultPosition);
                        OU parentou = member.GetParentOU(cn);
                        string oufullName = parentou.GetFriendlyFullName(cn);
                        jItem["parentouName"] = parentou.Name;
                        jItem["parentouFullNameFriendly"] = oufullName;
                        jItem["memberFriendlyName"] = oufullName + "/" + user.Account;
                        jItem["search"] = true;
                        children.Add(jItem);
                    }
                }
            }

            //输出数据
            return rv;
        }

        public virtual object GetUsersInPath(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path",null);
            UserCollection users = new UserCollection();
            MemberCollection members = new MemberCollection();

            if (!String.IsNullOrEmpty(path))
            {
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    members = OU.GetMembers(cn, path);
                    foreach (Member member in members)
                    {
                        User user = User.TryGetUser(cn, member.UserAccount);
                        users.Add(user);
                    }
                }
            }

            //将数据转化为Json集合
            JObject rv = new JObject();

            JArray children = new JArray();
            rv[YZJsonProperty.children] = children;

            for (int i = 0; i < members.Count; i++)
            {
                User user = users[i];

                //已删除和禁用的用户不显示
                if (user == null || user.Disabled)
                    continue;

                children.Add(this.JObjectFromMember(null, members[i], user, false));
            }

            //输出数据
            return rv;
        }

        public virtual JObject UserFromUIDs(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JArray jPost = request.GetPostData<JArray>();
            BPMObjectNameCollection uids = jPost.ToObject<BPMObjectNameCollection>();
            JObject rv = new JObject();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach (string uid in uids)
                {
                    User user = User.TryGetUser(cn, uid);

                    //已删除和禁用的用户不显示
                    if (user == null || user.Disabled)
                        continue;

                    rv[uid] = this.JObjectFromMember(null, new Member(), user, false);
                }
            }

            return rv;
        }

        public virtual object GetRolesInPath(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path",null);
            RoleCollection roles = new RoleCollection();

            if (!String.IsNullOrEmpty(path))
            {
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    roles = OU.GetRoles(cn, path);
                }
            }

            //将数据转化为Json集合
            JObject rv = new JObject();

            JArray children = new JArray();
            rv[YZJsonProperty.children] = children;

            foreach (Role role in roles)
            {
                JObject item = new JObject();
                children.Add(item);
                item["Name"] = role.Name;
                item["SID"] = role.SID;
                item["FullName"] = role.FullName;
            }

            //输出数据
            return rv;
        }

        public virtual User GetUserFromAccount(HttpContext context)
        {
            YZRequest request = new YZRequest(context);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return User.FromAccount(cn,request.GetString("uid"));
            }
        }

        public virtual object GetLoginUserACEInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = YZAuthHelper.LoginUserAccount;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                User user = User.FromAccount(cn, uid);

                ACE ace = new ACE();
                ace.SIDType = SIDType.UserSID;
                ace.SID = user.SID;

                return new {
                    SID = user.SID,
                    DisplayName = ace.GetSIDDisplayName(cn)
                };
            }
        }

        public virtual object GetUsersFromAccounts(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            UserCollection users = new UserCollection();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                int count = request.GetInt32("Count",0);

                for (int i = 0; i < count; i++)
                {
                    string account = request.GetString("Account" + i.ToString());

                    User user = User.TryGetUser(cn, account);
                    if (user != null)
                        users.Add(user);
                }
            }

            //将数据转化为Json集合
            JObject rv = new JObject();

            JArray children = new JArray();
            rv[YZJsonProperty.children] = children;

            for (int i = 0; i < users.Count; i++)
            {
                User user = users[i];

                //已删除和禁用的用户不显示
                if (user == null || user.Disabled)
                    continue;

                Member member = new Member();
                member.UserAccount = user.Account;

                children.Add(this.JObjectFromMember(null, member, user, false));
            }

            //输出数据
            return rv;
        }

        public virtual JArray GetUserPositions(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = request.GetString("uid", YZAuthHelper.LoginUserAccount);

            JArray rv = new JArray();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                MemberCollection positions = OrgSvr.GetUserPositions(cn, uid);

                foreach (Member member in positions)
                {
                    JObject jPos = new JObject();
                    rv.Add(jPos);

                    string shortName = member.GetParentOU(cn).Name + "/" + member.UserAccount;
                    string name = member.GetFriendlyFullName(cn);
                    if (member.IsLeader)
                    {
                        name += "(" + member.LeaderTitle + ")";
                        shortName += "(" + member.LeaderTitle + ")";
                    }

                    jPos["shortName"] = shortName;
                    jPos["name"] = name;
                    jPos["value"] = member.FullName;
                }
            }

            return rv;
        }

        public virtual JArray GetPositionsFromFullName(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string memberfullname = request.GetString("memberfullname");

            JArray rv = new JArray();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                Member themember = Member.FromFullName(cn, memberfullname);

                MemberCollection positions = OrgSvr.GetUserPositions(cn, themember.UserAccount);
                foreach (Member member in positions)
                {
                    JObject jPos = new JObject();
                    rv.Add(jPos);

                    string shortName = member.GetParentOU(cn).Name + "/" + member.UserAccount;
                    string name = member.GetFriendlyFullName(cn);
                    if (member.IsLeader)
                    {
                        name += "(" + member.LeaderTitle + ")";
                        shortName += "(" + member.LeaderTitle + ")";
                    }

                    jPos["shortName"] = shortName;
                    jPos["name"] = name;
                    jPos["value"] = member.FullName;
                }
            }

            return rv;
        }

        protected virtual JObject JObjectFromMember(BPMConnection cn, Member member, User user, bool defaultPosition)
        {
            JObject item = new JObject();
            item["Account"] = user.Account;
            item["SID"] = user.SID;
            item["DisplayName"] = user.DisplayName;
            item["MemberFullName"] = member.FullName;
            item["Disabled"] = user.Disabled;
            item["LeaderTitle"] = member.LeaderTitle;
            item["Department"] = member.Department;
            item["Description"] = user.Description;
            item["Sex"] = user.Sex == Sex.Unknown ? "" : user.Sex.ToString();
            item["Birthday"] = YZStringHelper.DateToStringL(user.Birthday);
            item["HRID"] = user.HRID;
            item["DateHired"] = YZStringHelper.DateToStringL(user.DateHired);
            item["Office"] = user.Office;
            item["CostCenter"] = user.CostCenter;
            item["OfficePhone"] = user.OfficePhone;
            item["HomePhone"] = user.HomePhone;
            item["Mobile"] = user.Mobile;
            item["EMail"] = user.EMail;
            item["WWWHomePage"] = user.WWWHomePage;
            item["ShortName"] = user.ShortName;
            item["FriendlyName"] = user.FriendlyName;

            foreach (string attrName in user.ExtAttrNames)
                item[attrName] = Convert.ToString(user[attrName]);

            item["User"] = JObject.FromObject(user);
            item["Member"] = JObject.FromObject(member);

            if (defaultPosition)
            {
                item["IsDefaultPosition"] = User.IsDefaultPosition(cn, user.Account, member.FullName);
            }

            return item;
        }

        protected virtual JObject GetNodeData(OU ou)
        {
            JObject node = new JObject();

            node["Name"] = ou.Name;
            node["Code"] = ou.Code;
            node["FullName"] = ou.FullName;
            node["Level"] = ou.OULevel;
            node["SID"] = ou.SID;

            foreach (string attrName in ou.ExtAttrNames)
                node[attrName] = Convert.ToString(ou[attrName]);

            return node;
        }
    }
}