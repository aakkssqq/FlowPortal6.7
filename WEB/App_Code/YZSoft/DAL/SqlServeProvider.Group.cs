using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.IO;
using System.Drawing;
using System.Threading;
using System.Collections.Generic;
using System.Text;
using System.Data.Common;
using System.Data.SqlClient;
using BPM;

namespace YZSoft.Web.DAL
{
    partial class SqlServerProvider
    {
        public IDataReader GetGroups(IDbConnection cn, string uid, string groupType, string filter, string sort)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                //查询条件
                filter = this.CombinCond(filter, "GroupType = @GroupType");
                cmd.Parameters.Add("@GroupType", SqlDbType.NVarChar).Value = groupType;

                filter = this.CombinCond(filter, "Deleted <> 1");

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "GroupID ASC";

                //Query
                string query = @"
                WITH A AS(
	                SELECT GroupID FROM YZAppGroupMembers WHERE (@UID IS NULL OR UID=@UID)
                ),
                B AS(
	                SELECT * FROM YZAppGroup WHERE GroupID IN (SELECT GroupID FROM A)
                )
                SELECT * FROM B {0} ORDER BY {1}";

                cmd.CommandText = String.Format(query, filter, sort);
                cmd.Parameters.Add("@UID", SqlDbType.NVarChar).Value = this.Convert(uid,true);

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetGroupsAndMemberCount(IDbConnection cn, string uid, string filter, string sort)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                //查询条件
                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "LastMessageId DESC";

                //Query
                string query = @"
WITH A AS(
	SELECT GroupID FROM YZAppGroupMembers WHERE UID=@UID GROUP BY GroupID
),
B AS(
	SELECT GroupID FROM YZAppGroup WHERE GroupID IN (SELECT GroupID FROM A) AND Deleted<>1
),
C AS(
	SELECT GroupID,count(*) MemberCount FROM YZAppGroupMembers WHERE GroupID IN (SELECT GroupID FROM B) GROUP BY GroupID
),
D AS(
	SELECT YZAppGroup.*,C.MemberCount FROM C LEFT JOIN YZAppGroup ON C.GroupID=YZAppGroup.GroupID
),
E AS(
	SELECT resId, max(id) LastMessageId FROM YZAppCommunication WHERE resType='Group' AND resId in(SELECT GroupID FROM B) GROUP BY resId 
),
F AS(
	SELECT D.*,LastMessageId FROM D LEFT JOIN E ON D.GroupID=E.resId
)
SELECT * FROM F {0} ORDER BY {1}
";

                cmd.CommandText = String.Format(query, filter, sort);
                cmd.Parameters.Add("@UID", SqlDbType.NVarChar).Value = this.Convert(uid, true);

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetGroup(IDbConnection cn, int groupid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SELECT * FROM YZAppGroup WHERE GroupID=@GroupID";
                cmd.Parameters.Add("@GroupID", SqlDbType.Int).Value = groupid;
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetGroupFromFolderID(IDbConnection cn, int folderid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SELECT * FROM YZAppGroup WHERE FolderID=@FolderID";
                cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = folderid;
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetGroupMembers(IDbConnection cn, int groupid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"
SELECT *,
CASE Role
WHEN 'Owner' THEN 1
WHEN 'Admin' THEN 2
WHEN 'Editor' THEN 3
WHEN 'Author' THEN 4
WHEN 'Guest' THEN 5
ELSE 999
END as RoleCode
FROM YZAppGroupMembers WHERE GroupID=@GroupID ORDER BY RoleCode ASC,ItemID ASC";

                cmd.Parameters.Add("@GroupID", SqlDbType.Int).Value = groupid;
                return cmd.ExecuteReader();
            }
        }

        public int GetGroupMemberCount(IDbConnection cn, int groupid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "SELECT count(*) FROM YZAppGroupMembers WHERE GroupID=@GroupID";
                cmd.Parameters.Add("@GroupID", SqlDbType.Int).Value = groupid;
                return System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public IDataReader GetGroupMember(IDbConnection cn, int groupid, string uid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SELECT * FROM YZAppGroupMembers WHERE GroupID=@GroupID AND UID=@UID";
                cmd.Parameters.Add("@GroupID", SqlDbType.Int).Value = groupid;
                cmd.Parameters.Add("@UID", SqlDbType.NVarChar).Value = uid;
                return cmd.ExecuteReader();
            }
        }

        public void DeleteGroupMember(IDbConnection cn, int groupid, string uid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"DELETE FROM YZAppGroupMembers WHERE GroupID=@GroupID AND UID=@UID";
                cmd.Parameters.Add("@GroupID", SqlDbType.Int).Value = groupid;
                cmd.Parameters.Add("@UID", SqlDbType.NVarChar).Value = uid;
                cmd.ExecuteNonQuery();
            }
        }

        public void ChangeMemberRole(IDbConnection cn, int groupid, string uid, string newrole)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"UPDATE YZAppGroupMembers SET Role=@Role WHERE GroupID=@GroupID AND UID=@UID";
                cmd.Parameters.Add("@Role", SqlDbType.NVarChar).Value = this.Convert(newrole,true);
                cmd.Parameters.Add("@GroupID", SqlDbType.Int).Value = groupid;
                cmd.Parameters.Add("@UID", SqlDbType.NVarChar).Value = uid;
                cmd.ExecuteNonQuery();
            }
        }

        public void Insert(IDbConnection cn, YZSoft.Group.Member member)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("SET NOCOUNT ON;");
                sb.Append("INSERT INTO YZAppGroupMembers(");
                sb.Append("GroupID,");
                sb.Append("UID,");
                sb.Append("Role) ");
                sb.Append("VALUES(");
                sb.Append("@GroupID,");
                sb.Append("@UID,");
                sb.Append("@Role);");
                sb.Append("SELECT SCOPE_IDENTITY()");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@GroupID", SqlDbType.Int).Value = member.GroupID;
                cmd.Parameters.Add("@UID", SqlDbType.NVarChar).Value = this.Convert(member.UID, false);
                cmd.Parameters.Add("@Role", SqlDbType.NVarChar).Value = this.Convert(member.Role, false);

                member.ItemID = System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public void Insert(IDbConnection cn, YZSoft.Group.Group group)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("SET NOCOUNT ON;");
                sb.Append("INSERT INTO YZAppGroup(");
                sb.Append("GroupType,");
                sb.Append("Name,");
                sb.Append("[Desc],");
                sb.Append("FolderID,");
                sb.Append("DocumentFolderID,");
                sb.Append("Owner,");
                sb.Append("CreateAt,");
                sb.Append("ImageFileID,");
                sb.Append("Deleted,");
                sb.Append("DeleteBy,");
                sb.Append("DeleteAt) ");
                sb.Append("VALUES(");
                sb.Append("@GroupType,");
                sb.Append("@Name,");
                sb.Append("@Desc,");
                sb.Append("@FolderID,");
                sb.Append("@DocumentFolderID,");
                sb.Append("@Owner,");
                sb.Append("@CreateAt,");
                sb.Append("@ImageFileID,");
                sb.Append("@Deleted,");
                sb.Append("@DeleteBy,");
                sb.Append("@DeleteAt);");
                sb.Append("SELECT SCOPE_IDENTITY()");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@GroupType", SqlDbType.NVarChar).Value = this.Convert(group.GroupType, false);
                cmd.Parameters.Add("@Name", SqlDbType.NVarChar).Value = this.Convert(group.Name, false);
                cmd.Parameters.Add("@Desc", SqlDbType.NVarChar).Value = this.Convert(group.Desc, true);
                cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = this.Convert(group.FolderID, true);
                cmd.Parameters.Add("@DocumentFolderID", SqlDbType.Int).Value = this.Convert(group.DocumentFolderID, true);
                cmd.Parameters.Add("@Owner", SqlDbType.NVarChar).Value = this.Convert(group.Owner, true);
                cmd.Parameters.Add("@CreateAt", SqlDbType.DateTime).Value = this.Convert(group.CreateAt, true);
                cmd.Parameters.Add("@ImageFileID", SqlDbType.NVarChar).Value = this.Convert(group.ImageFileID, true);
                cmd.Parameters.Add("@Deleted", SqlDbType.Bit).Value = group.Deleted;
                cmd.Parameters.Add("@DeleteBy", SqlDbType.NVarChar).Value = this.Convert(group.DeleteBy, true);
                cmd.Parameters.Add("@DeleteAt", SqlDbType.DateTime).Value = this.Convert(group.DeleteAt, true);

                group.GroupID = System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public void Update(IDbConnection cn, YZSoft.Group.Group group)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZAppGroup SET ");
                sb.Append("GroupType=@GroupType,");
                sb.Append("Name=@Name,");
                sb.Append("[Desc]=@Desc,");
                sb.Append("FolderID=@FolderID,");
                sb.Append("DocumentFolderID=@DocumentFolderID,");
                sb.Append("Owner=@Owner,");
                sb.Append("CreateAt=@CreateAt,");
                sb.Append("ImageFileID=@ImageFileID,");
                sb.Append("Deleted=@Deleted,");
                sb.Append("DeleteBy=@DeleteBy,");
                sb.Append("DeleteAt=@DeleteAt ");
                sb.Append("WHERE GroupID=@GroupID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@GroupType", SqlDbType.NVarChar).Value = this.Convert(group.GroupType, false);
                cmd.Parameters.Add("@Name", SqlDbType.NVarChar).Value = this.Convert(group.Name, false);
                cmd.Parameters.Add("@Desc", SqlDbType.NVarChar).Value = this.Convert(group.Desc, true);
                cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = this.Convert(group.FolderID, true);
                cmd.Parameters.Add("@DocumentFolderID", SqlDbType.Int).Value = this.Convert(group.DocumentFolderID, true);
                cmd.Parameters.Add("@Owner", SqlDbType.NVarChar).Value = this.Convert(group.Owner, true);
                cmd.Parameters.Add("@CreateAt", SqlDbType.DateTime).Value = this.Convert(group.CreateAt, true);
                cmd.Parameters.Add("@ImageFileID", SqlDbType.NVarChar).Value = this.Convert(group.ImageFileID, true);
                cmd.Parameters.Add("@Deleted", SqlDbType.Bit).Value = group.Deleted;
                cmd.Parameters.Add("@DeleteBy", SqlDbType.NVarChar).Value = this.Convert(group.DeleteBy, true);
                cmd.Parameters.Add("@DeleteAt", SqlDbType.DateTime).Value = this.Convert(group.DeleteAt, true);
                cmd.Parameters.Add("@GroupID", SqlDbType.Int).Value = group.GroupID;

                cmd.ExecuteNonQuery();
            }
        }
    }
}
