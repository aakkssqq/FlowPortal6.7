using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using YZSoft.Web.DAL;
using BPM;
using BPM.Client;

namespace YZSoft.Group
{
    public class GroupManager
    {
        private static GroupManager _instance = null;

        static GroupManager()
        {
            GroupManager._instance = new GroupManager();
        }

        #region 公共属性

        internal static GroupManager Instance
        {
            get
            {
                return GroupManager._instance;
            }
        }

        #endregion

        #region 服务

        public static GroupCollection GetGroups(IYZDbProvider provider, IDbConnection cn, string uid, string groupType, string filter, string sort)
        {
            try
            {
                GroupCollection groups = new GroupCollection();
                using (YZReader reader = new YZReader(provider.GetGroups(cn, uid, groupType, filter, sort)))
                {
                    while (reader.Read())
                    {
                        Group group = new Group(reader);

                        if (!String.IsNullOrEmpty(group.Name))
                            groups.Add(group);
                    }

                }
                return groups;
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppGroup", e.Message);
            }
        }

        public static GroupCollection GetGroupsAndMemberCount(IYZDbProvider provider, IDbConnection cn, string uid, string filter, string sort)
        {
            try
            {
                GroupCollection groups = new GroupCollection();
                using (YZReader reader = new YZReader(provider.GetGroupsAndMemberCount(cn, uid, filter, sort)))
                {
                    while (reader.Read())
                    {
                        Group group = new Group(reader);
                        group.MemberCount = reader.ReadInt32("MemberCount");

                        if (!String.IsNullOrEmpty(group.Name))
                            groups.Add(group);
                    }

                }
                return groups;
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppGroup", e.Message);
            }
        }

        public static Group GetGroup(IYZDbProvider provider, IDbConnection cn, int groupid)
        {
            Group group = null;
            try
            {
                using (YZReader reader = new YZReader(provider.GetGroup(cn, groupid)))
                {
                    if (reader.Read())
                        group = new Group(reader);

                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppGroup", e.Message);
            }

            if (group == null)
                throw new BPMException(String.Format(Resources.YZStrings.Aspx_Group_Ext_GroupNotExist, groupid));

            return group;
        }

        public static Group GetGroupFromFolderID(IYZDbProvider provider, IDbConnection cn, int folderid)
        {
            Group group = null;
            try
            {
                using (YZReader reader = new YZReader(provider.GetGroupFromFolderID(cn, folderid)))
                {
                    if (reader.Read())
                        group = new Group(reader);

                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppGroup", e.Message);
            }

            if (group == null)
                throw new BPMException(String.Format(Resources.YZStrings.Aspx_Group_Ext_GroupNotExistFromFolderID, folderid));

            return group;
        }

        public static Member TryGetGroupMember(IYZDbProvider provider, IDbConnection cn, int groupid, string uid)
        {
            Member member = null;
            try
            {
                using (IDataReader reader = provider.GetGroupMember(cn, groupid, uid))
                {
                    if (reader.Read())
                        member = new Member(reader);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppGroupMembers", e.Message);
            }

            return member;
        }

        public static Member GetGroupMember(IYZDbProvider provider, IDbConnection cn, int groupid,string uid)
        {
            Member member = TryGetGroupMember(provider,cn,groupid,uid);

            if (member == null)
                throw new BPMException(String.Format(Resources.YZStrings.Aspx_Group_Ext_MemberNotExist, groupid, uid));

            return member;
        }

        public static MemberCollection GetGroupMembers(IYZDbProvider provider, IDbConnection cn, int groupid)
        {
            try
            {
                MemberCollection members = new MemberCollection();
                using (IDataReader reader = provider.GetGroupMembers(cn, groupid))
                {
                    while (reader.Read())
                    {
                        Member member = new Member(reader);

                        if (!String.IsNullOrEmpty(member.UID))
                            members.Add(member);
                    }

                }
                return members;
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppGroupMembers", e.Message);
            }
        }

        public static int GetGroupMemberCount(IYZDbProvider provider, IDbConnection cn, int groupid)
        {
            try
            {
                MemberCollection members = new MemberCollection();
                return provider.GetGroupMemberCount(cn, groupid);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppGroupMembers", e.Message);
            }
        }

        public static void DeleteGroupMember(IYZDbProvider provider, IDbConnection cn, int groupid, string uid)
        {
            provider.DeleteGroupMember(cn, groupid, uid);
        }

        public static void ChangeMemberRole(IYZDbProvider provider, IDbConnection cn, int groupid, string uid, string newrole)
        {
            provider.ChangeMemberRole(cn, groupid, uid, newrole);
        }

        public static void Insert(IYZDbProvider provider, IDbConnection cn, Member member)
        {
            try
            {
                provider.Insert(cn, member);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBInsertDataErr, "YZAppGroupMembers", e.Message);
            }
        }

        public static BPMObjectNameCollection AddGroupMembers(IYZDbProvider provider, IDbConnection cn, int groupid, BPMObjectNameCollection uids, string role)
        {
            BPMObjectNameCollection added = new BPMObjectNameCollection();
            MemberCollection members = GroupManager.GetGroupMembers(provider, cn, groupid);

            foreach (string uid in uids)
            {
                Member member = new Member();
                member.GroupID = groupid;
                member.UID = uid;
                member.Role = role;

                if (!members.Contains(uid))
                {
                    GroupManager.Insert(provider, cn, member);
                    added.Add(uid);
                }
            }

            return added;
        }

        public static void DisbandGroup(IYZDbProvider provider, IDbConnection cn, int groupid)
        {
            Group group = GetGroup(provider, cn, groupid);
            group.Deleted = true;
            group.DeleteAt = DateTime.Now;
            group.DeleteBy = YZAuthHelper.LoginUserAccount;
            Update(provider, cn, group);
        }

        public static void RenameGroup(IYZDbProvider provider, IDbConnection cn, int groupid, string newName)
        {
            Group group = GetGroup(provider, cn, groupid);
            group.Name = newName;
            Update(provider, cn, group);
        }

        public static void Insert(IYZDbProvider provider, IDbConnection cn, Group group)
        {
            try
            {
                provider.Insert(cn, group);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBInsertDataErr, "YZAppGroup", e.Message);
            }
        }

        public static void Update(IYZDbProvider provider, IDbConnection cn, Group group)
        {
            try
            {
                provider.Update(cn, group);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZAppGroup", e.Message);
            }
        }

        #endregion
    }
}