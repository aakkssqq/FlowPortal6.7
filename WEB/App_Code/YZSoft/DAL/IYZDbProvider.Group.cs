using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Drawing;
using System.IO;
using System.Data.Common;
using System.Runtime.Serialization;
using BPM;

namespace YZSoft.Web.DAL
{
    partial interface IYZDbProvider
    {
        IDataReader GetGroups(IDbConnection cn, string uid, string groupType, string filter, string sort);
        IDataReader GetGroupsAndMemberCount(IDbConnection cn, string uid, string filter, string sort);
        IDataReader GetGroup(IDbConnection cn, int groupid);
        IDataReader GetGroupFromFolderID(IDbConnection cn, int folderid);
        IDataReader GetGroupMembers(IDbConnection cn, int groupid);
        int GetGroupMemberCount(IDbConnection cn, int groupid);
        IDataReader GetGroupMember(IDbConnection cn, int groupid, string uid);
        void DeleteGroupMember(IDbConnection cn, int groupid, string uid);
        void ChangeMemberRole(IDbConnection cn, int groupid, string uid, string newrole);
        void Insert(IDbConnection cn, YZSoft.Group.Member member);
        void Insert(IDbConnection cn, YZSoft.Group.Group group);
        void Update(IDbConnection cn, YZSoft.Group.Group group);
    }
}
