using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using YZSoft.Web.DAL;
using YZSoft.Group;
using BPM;
using BPM.Client;
using YZSoft.FileSystem;

namespace YZSoft.Services.REST.core
{
    public class GroupHandler : YZServiceHandler
    {
        public virtual GroupCollection GetUserGroups(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = YZAuthHelper.LoginUserAccount;
            string groupType = request.GetString("groupType");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return GroupManager.GetGroups(provider, cn, uid, groupType, null, null);
                }
            }
        }

        public virtual GroupCollection GetUserGroupsAndMemberCount(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = YZAuthHelper.LoginUserAccount;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return GroupManager.GetGroupsAndMemberCount(provider, cn, uid, null, null);
                }
            }
        }

        public virtual object GetGroup(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int groupid = request.GetInt32("groupid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return GroupManager.GetGroup(provider, cn, groupid);
                }
            }
        }

        public virtual YZSoft.Group.MemberCollection GetGroupMembers(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int groupid = request.GetInt32("groupid");

            Group.MemberCollection members;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    members = GroupManager.GetGroupMembers(provider, cn, groupid);
                }
            }

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                for(int i = 0; i < members.Count ; i++)
                {
                    YZSoft.Group.Member member = members[i];
                    member.User = User.TryGetUser(cn, member.UID);
                    if (member.User == null)
                    {
                        members.RemoveAt(i);
                        i--;
                    }
                }
            }

            return members;
        }

        public virtual object GetGroupShortcut(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int groupid = request.GetInt32("groupid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return new
                    {
                        group = GroupManager.GetGroup(provider, cn, groupid),
                        membercount = GroupManager.GetGroupMemberCount(provider, cn, groupid)
                    };
                }
            }
        }

        public virtual UserCollection GetGroupUsers(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int groupid = request.GetInt32("groupid");

            Group.MemberCollection members;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    members = GroupManager.GetGroupMembers(provider, cn, groupid);
                }
            }

            UserCollection users = new UserCollection();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach(Group.Member member in members)
                {
                    User user = User.TryGetUser(cn, member.UID);
                    if (user!= null)
                        users.Add(user);
                }
            }

            return users;
        }

        public virtual object GetGroupAndMembers(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int groupid = request.GetInt32("groupid");

            Group.Group group;
            Group.MemberCollection members;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    group =  GroupManager.GetGroup(provider, cn, groupid);
                    members = GroupManager.GetGroupMembers(provider, cn, groupid);
                }
            }

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                for (int i = 0; i < members.Count; i++)
                {
                    YZSoft.Group.Member member = members[i];
                    member.User = User.TryGetUser(cn, member.UID);
                    if (member.User == null)
                    {
                        members.RemoveAt(i);
                        i--;
                    }
                }
            }

            return new{
                group = group,
                members = members
            };
        }

        public virtual void DeleteGroupMembers(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int groupid = request.GetInt32("groupid");
            JArray jPost = request.GetPostData<JArray>();
            BPMObjectNameCollection uids = jPost.ToObject<BPMObjectNameCollection>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    foreach (string uid in uids)
                        GroupManager.DeleteGroupMember(provider, cn, groupid, uid);
                }
            }
        }

        public virtual void ExitGroup(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int groupid = request.GetInt32("groupid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                   GroupManager.DeleteGroupMember(provider, cn, groupid, YZAuthHelper.LoginUserAccount);
                }
            }
        }

        public virtual void ChangeMemberRole(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int groupid = request.GetInt32("groupid");
            string uid = request.GetString("uid");
            string newrole = request.GetString("newrole");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    GroupManager.ChangeMemberRole(provider, cn, groupid, uid, newrole);
                }
            }
        }

        public virtual object GetGroupAndUserPerm(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int groupid = request.GetInt32("groupid");
            string uid = request.GetString("uid",YZAuthHelper.LoginUserAccount);

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    YZSoft.Group.Group group = GroupManager.GetGroup(provider, cn, groupid);
                    YZSoft.Group.Member member = GroupManager.GetGroupMember(provider, cn, groupid, uid);

                    return new
                    {
                        Group = group,
                        Member = member,
                        Perm = member.GroupPerm
                    };
                }
            }
        }

        public virtual BPMObjectNameCollection AddGroupMembers(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int groupid = request.GetInt32("groupid");
            string role = request.GetString("role");
            JArray jPost = request.GetPostData<JArray>();
            BPMObjectNameCollection uids = jPost.ToObject<BPMObjectNameCollection>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return GroupManager.AddGroupMembers(provider, cn, groupid, uids, role);
                }
            }
        }

        public virtual void DisbandGroups(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JObject post = request.GetPostData<JObject>();
            List<int> groupids = post["groupids"].ToObject<List<int>>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    foreach (int groupid in groupids)
                        GroupManager.DisbandGroup(provider, cn, groupid);
                }
            }
        }

        public virtual void RenameGroup(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int groupid = request.GetInt32("groupid");
            string newName = request.GetString("newName");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    GroupManager.RenameGroup(provider, cn, groupid, newName);
                }
            }
        }

        public virtual void UpdateImageFile(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int groupid = request.GetInt32("groupid");
            string imageid = request.GetString("imageid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    Group.Group group = GroupManager.GetGroup(provider, cn, groupid);
                    group.ImageFileID = imageid;
                    GroupManager.Update(provider, cn, group);
                }
            }
        }

        public virtual Group.Group UpdateGroup(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int groupid = request.GetInt32("groupid");
            JObject jPost = request.GetPostData<JObject>();
            Group.Group groupPost = jPost["data"].ToObject<Group.Group>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    Group.Group group = GroupManager.GetGroup(provider, cn, groupid);
                    group.ImageFileID = groupPost.ImageFileID;
                    group.Name = groupPost.Name;
                    group.Desc = groupPost.Desc;

                    GroupManager.Update(provider, cn, group);
                    return group;
                }
            }
        }

        public virtual Group.Group CreateGroup(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string groupType = request.GetString("groupType");
            string FolderID = request.GetString("FolderID", null);
            string DocumentFolderID = request.GetString("DocumentFolderID", null);
            JObject jPost = request.GetPostData<JObject>();
            Group.Group groupPost = jPost["data"].ToObject<Group.Group>();

            BPMObjectNameCollection uids = new BPMObjectNameCollection();
            if (jPost["uids"] != null)
                uids = jPost["uids"].ToObject<BPMObjectNameCollection>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    Group.Group group = new Group.Group();
                    group.GroupType = groupType;
                    group.Name = groupPost.Name;
                    group.Desc = groupPost.Desc;

                    if (!String.IsNullOrEmpty(FolderID))
                    {
                        Folder folder = this.CreateGroupFolder(provider, cn, groupPost.Name, FolderID);
                        group.FolderID = folder.FolderID;
                    }

                    if (!String.IsNullOrEmpty(DocumentFolderID))
                    {
                        Folder folder = this.CreateGroupFolder(provider, cn, groupPost.Name, DocumentFolderID);
                        group.DocumentFolderID = folder.FolderID;
                    }

                    group.Owner = YZAuthHelper.LoginUserAccount;
                    group.CreateAt = DateTime.Now;
                    group.ImageFileID = groupPost.ImageFileID;
                    group.Deleted = false;

                    GroupManager.Insert(provider, cn, group);

                    YZSoft.Group.Member member;
                    
                    member = new YZSoft.Group.Member();
                    member.GroupID = group.GroupID;
                    member.UID = YZAuthHelper.LoginUserAccount;
                    member.Role = "Owner";
                    GroupManager.Insert(provider, cn, member);

                    foreach (string uid in uids)
                    {
                        member = new YZSoft.Group.Member();
                        member.GroupID = group.GroupID;
                        member.UID = uid;
                        member.Role = "Member";
                        GroupManager.Insert(provider, cn, member);
                    }

                    return group;
                }
            }
        }

        public virtual object GetClassicsGroupImage(HttpContext context)
        {
            return new object[]{
                new {
                    Code = "Group01",
                    Text = Resources.YZStrings.Aspx_GroupImageName_Group01,
                    NameSpace = "YZSoft$Local",
                    Image = "YZSoft$Local/resources/images/group/Group01.png"
                },
                new {
                    Code = "Group02",
                    Text = Resources.YZStrings.Aspx_GroupImageName_Group02,
                    NameSpace = "YZSoft$Local",
                    Image = "YZSoft$Local/resources/images/group/Group02.png"
                },
                new {
                    Code = "Group03",
                    Text = Resources.YZStrings.Aspx_GroupImageName_Group03,
                    NameSpace = "YZSoft$Local",
                    Image = "YZSoft$Local/resources/images/group/Group03.png"
                },
                new {
                    Code = "Group04",
                    Text = Resources.YZStrings.Aspx_GroupImageName_Group04,
                    NameSpace = "YZSoft$Local",
                    Image = "YZSoft$Local/resources/images/group/Group04.png"
                },
                new {
                    Code = "Group99",
                    Text = Resources.YZStrings.Aspx_GroupImageName_Group99,
                    NameSpace = "YZSoft$Local",
                    Image = "YZSoft$Local/resources/images/group/Group99.png"
                }
            };
        }

        protected virtual Folder CreateGroupFolder(IYZDbProvider provider, IDbConnection cn, string name, string folderType)
        {
            string uid = YZAuthHelper.LoginUserAccount;

            Folder folder = new Folder();
            folder.FolderType = folderType;
            folder.ParentID = -1;
            folder.Name = name;
            folder.Desc = "";
            folder.Owner = uid;
            folder.CreateAt = DateTime.Now;
            folder.OrderIndex = 1;

            DirectoryManager.Insert(provider, cn, folder);
            folder.RootID = folder.FolderID;
            DirectoryManager.Update(provider, cn, folder);

            if (NameCompare.EquName(folderType, "BPAGroup"))
            {
                Folder childFolder = new Folder();

                childFolder.ParentID = folder.FolderID;
                childFolder.RootID = folder.RootID;
                childFolder.Owner = uid;
                childFolder.CreateAt = DateTime.Now;
                folder.Desc = "";

                childFolder.FolderType = "BPAProcess";
                childFolder.Name = Resources.YZStrings.BPA_Process;
                childFolder.OrderIndex = 1;
                DirectoryManager.Insert(provider, cn, childFolder);

                childFolder.FolderType = "BPAOU";
                childFolder.Name = Resources.YZStrings.BPA_OU;
                childFolder.OrderIndex = 2;
                DirectoryManager.Insert(provider, cn, childFolder);

                childFolder.FolderType = "BPAProduct";
                childFolder.Name = Resources.YZStrings.BPA_Product;
                childFolder.OrderIndex = 3;
                DirectoryManager.Insert(provider, cn, childFolder);

                childFolder.FolderType = "BPAData";
                childFolder.Name = Resources.YZStrings.BPA_Data;
                childFolder.OrderIndex = 4;
                DirectoryManager.Insert(provider, cn, childFolder);

                childFolder.FolderType = "BPAITSystem";
                childFolder.Name = Resources.YZStrings.BPA_ITSystem;
                childFolder.OrderIndex = 5;
                DirectoryManager.Insert(provider, cn, childFolder);

                childFolder.FolderType = "BPAControl";
                childFolder.Name = Resources.YZStrings.BPA_Control;
                childFolder.OrderIndex = 6;
                DirectoryManager.Insert(provider, cn, childFolder);
            }

            return folder;
        }
    }
}