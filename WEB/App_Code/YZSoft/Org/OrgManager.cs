using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;
using System.Data;

/// <summary>
///Employee 的摘要说明
/// </summary>
///
namespace YZSoft.Web.Org
{
    public class OrgManager
    {
        public static object[] GetSupervisors(BPMConnection cn,string memberFullName, bool includeDisabledUser)
        {
            List<object> rv = new List<object>();

            SupervisorCollection supervisors = Member.GetSupervisors(cn, memberFullName);
            foreach (Supervisor supervisor in supervisors)
            {
                Member supervisorMember = Member.TryGetMember(cn, supervisor.MemberFullName);
                if (supervisorMember == null)
                    continue;

                User user = supervisorMember.TryGetUser(cn);
                if (user == null)
                    continue;

                if (user.Disabled && !includeDisabledUser)
                    continue;

                rv.Add(
                    new
                    {
                        ou = supervisorMember.GetParentOU(cn).GetFriendlyFullName(cn),
                        LeaderTitle = supervisorMember.LeaderTitle,
                        Level = supervisorMember.Level,
                        Account = supervisor.UserAccount,
                        UserName = YZStringHelper.GetUserShortName(supervisor.UserAccount, supervisor.UserFullName),
                        FGYWEnabled = supervisor.FGYWEnabled,
                        FGYWs = supervisor.FGYWs,
                        Disabled = user.Disabled
                    }
                );
            }

            return rv.ToArray();
        }

        public static object[] GetDirectXSs(BPMConnection cn, string memberFullName, bool includeDisabledUser)
        {
            List<object> rv = new List<object>();

            DirectXSCollection directXSs = Member.GetDirectXSs(cn, memberFullName);
            foreach (DirectXS xs in directXSs)
            {
                Member xsMember = Member.TryGetMember(cn, xs.MemberFullName);
                if (xsMember == null)
                    continue;

                User user = xsMember.TryGetUser(cn);
                if (user == null)
                    continue;

                if (user.Disabled && !includeDisabledUser)
                    continue;

                rv.Add(
                    new
                    {
                        ou = xsMember.GetParentOU(cn).GetFriendlyFullName(cn),
                        LeaderTitle = xsMember.LeaderTitle,
                        Level = xsMember.Level,
                        Account = xsMember.UserAccount,
                        UserName = YZStringHelper.GetUserShortName(xs.UserAccount, xs.UserFullName)
                    }
                );
            }

            return rv.ToArray();
        }

        public static object[] GetRoles(BPMConnection cn, string memberFullName)
        {
            List<object> rv = new List<object>();

            BPMObjectNameCollection roleSids = SecurityManager.GetMemberRoleSIDs(cn, memberFullName);
            foreach (string sid in roleSids)
            {
                string dept = null;
                string roleName = SecurityManager.TryGetObjectNameFromSID(cn, SIDType.RoleSID, sid);
                if (String.IsNullOrEmpty(roleName))
                    roleName = sid;
                else
                {
                    Role role = new Role();
                    role.Open(cn, roleName);
                    roleName = role.Name;
                    OU ou = role.GetParentOU(cn);
                    dept = ou.GetFriendlyFullName(cn);
                }

                rv.Add(
                    new
                    {
                        ou = dept,
                        RoleName = roleName
                    }
                );
            }

            return rv.ToArray();
        }

        public static object[] GetGroups(BPMConnection cn, string account)
        {
            List<object> rv = new List<object>();

            SecurityToken token = SecurityToken.GetTokenOf(cn, account);
            foreach (SIDPair sid in token.SIDPairs)
            {
                if (sid.SIDType != SIDType.GroupSID)
                    continue;

                if (sid.SID == WellKnownSID.Everyone)
                    continue;

                string groupName = SecurityManager.TryGetObjectNameFromSID(cn, SIDType.GroupSID, sid.SID);
                if (String.IsNullOrEmpty(groupName))
                    groupName = sid.SID;

                rv.Add(
                    new
                    {
                        GroupName = groupName
                    }
                );
            }

            return rv.ToArray();
        }

        public static void AddRecentlyUser(IDbConnection cn, string uid, string usedAccount, string usedMemberfullName)
        {
            //IDbCommand cmd = provider.DbProviderFactory.CreateCommand();
            //cmd.Connection = provider.Connection;

            //cmd.CommandText = String.Format("");
            //cmd.Parameters.Add(provider.CreateParameter("",usedAccount));

            //cmd.ExecuteNonQuery();
        }
    }
}