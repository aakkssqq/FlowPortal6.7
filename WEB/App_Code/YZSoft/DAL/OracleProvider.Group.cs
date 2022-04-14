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
using Oracle.ManagedDataAccess.Client;
using BPM;

namespace YZSoft.Web.DAL
{
    partial class OracleProvider
    {
        public IDataReader GetGroups(IDbConnection cn, string uid, string groupType, string filter, string sort)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                //查询条件
                filter = this.CombinCond(filter, "GROUPTYPE = :GROUPTYPE");
                cmd.Parameters.Add(":GroupType", OracleDbType.NVarchar2).Value = groupType;

                filter = this.CombinCond(filter, "Deleted <> 1");

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "GROUPID ASC";

                //Query
                string query = @"
WITH A AS(
	SELECT GROUPID FROM YZAPPGROUPMEMBERS WHERE (:PM_UID IS NULL OR " + "\"UID\"" + @"=:PM_UID)
),
B AS(
	SELECT * FROM YZAPPGROUP WHERE GROUPID IN (SELECT GROUPID FROM A)
)
SELECT * FROM B {0} ORDER BY {1}";

                cmd.CommandText = String.Format(query, filter, sort);
                cmd.Parameters.Add(":PM_UID", OracleDbType.NVarchar2).Value = this.Convert(uid,true);

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetGroupsAndMemberCount(IDbConnection cn, string uid, string filter, string sort)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                //查询条件
                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "LastMessageId DESC";

                //Query
                string query = @"
WITH A AS(
	SELECT GroupID FROM YZAppGroupMembers WHERE " + "\"UID\"" + @"=:PM_UID GROUP BY GroupID
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
                cmd.Parameters.Add(":PM_UID", OracleDbType.NVarchar2).Value = this.Convert(uid, true);

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetGroup(IDbConnection cn, int groupid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"SELECT * FROM YZAPPGROUP WHERE GROUPID=:GROUPID";
                cmd.Parameters.Add(":GROUPID", OracleDbType.Int32).Value = groupid;
          //      cmd.Parameters.Add(":GROUPID", OracleDbType.Int32).Value = groupid;
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetGroupFromFolderID(IDbConnection cn, int folderid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"SELECT * FROM YZAPPGROUP WHERE FolderID=:FolderID";
                cmd.Parameters.Add(":FolderID", OracleDbType.Int32).Value = folderid;
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetGroupMembers(IDbConnection cn, int groupid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"
SELECT YZAPPGROUPMEMBERS.*,
DECODE(ROLE,'Owner',1,'Admin',2,'Editor',3,'Author',4,'Guest',5,999) AS ROLECODE
FROM YZAPPGROUPMEMBERS
WHERE GROUPID=:GROUPID ORDER BY ROLECODE ASC,ITEMID ASC";

                cmd.Parameters.Add(":GROUPID", OracleDbType.Int32).Value = groupid;
                return cmd.ExecuteReader();
            }
        }

        public int GetGroupMemberCount(IDbConnection cn, int groupid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"SELECT count(*) FROM YZAppGroupMembers WHERE GroupID=:GroupID";
                cmd.Parameters.Add(":GroupID", OracleDbType.Int32).Value = groupid;
                return System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public IDataReader GetGroupMember(IDbConnection cn, int groupid, string uid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "SELECT * FROM YZAPPGROUPMEMBERS WHERE GROUPID=:GROUPID AND \"UID\"=:PM_UID";
                cmd.Parameters.Add(":GROUPID", OracleDbType.Int32).Value = groupid;
                cmd.Parameters.Add(":PM_UID", OracleDbType.NVarchar2).Value = uid;
                return cmd.ExecuteReader();
            }
        }

        public void DeleteGroupMember(IDbConnection cn, int groupid, string uid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "DELETE FROM YZAPPGROUPMEMBERS WHERE GROUPID=:GROUPID AND \"UID\"=:PM_UID";
                cmd.Parameters.Add(":GROUPID", OracleDbType.Int32).Value = groupid;
                cmd.Parameters.Add(":PM_UID", OracleDbType.NVarchar2).Value = uid;
                cmd.ExecuteNonQuery();
            }
        }

        public void ChangeMemberRole(IDbConnection cn, int groupid, string uid, string newrole)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "UPDATE YZAPPGROUPMEMBERS SET \"ROLE\"=:ROLE1 WHERE GROUPID=:GROUPID AND \"UID\"=:PM_UID";
                cmd.Parameters.Add(":ROLE1", OracleDbType.NVarchar2).Value = this.Convert(newrole,true);
                cmd.Parameters.Add(":GROUPID", OracleDbType.Int32).Value = groupid;
                cmd.Parameters.Add(":PM_UID", OracleDbType.NVarchar2).Value = uid;
                cmd.ExecuteNonQuery();
            }
        }

        public void Insert(IDbConnection cn, YZSoft.Group.Member member)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "SELECT BPMSEQ_YZAPPGROUPMEMBERS.NEXTVAL FROM DUAL";
                member.ItemID = System.Convert.ToInt32(cmd.ExecuteScalar());

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO YZAPPGROUPMEMBERS(");
                sb.Append("ITEMID,");
                sb.Append("GROUPID,");
                sb.Append("\"UID\",");
                sb.Append("\"ROLE\") ");
                sb.Append("VALUES(");
                sb.Append(":ITEMID,");
                sb.Append(":GROUPID,");
                sb.Append(":PM_UID,");
                sb.Append(":ROLE1)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":ITEMID", OracleDbType.Int32).Value = member.ItemID;
                cmd.Parameters.Add(":GROUPID", OracleDbType.Int32).Value = member.GroupID;
                cmd.Parameters.Add(":PM_UID", OracleDbType.NVarchar2).Value = this.Convert(member.UID, false);
                cmd.Parameters.Add(":ROLE1", OracleDbType.NVarchar2).Value = this.Convert(member.Role, false);

                cmd.ExecuteNonQuery();
            }
        }

        public void Insert(IDbConnection cn, YZSoft.Group.Group group)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "SELECT BPMSEQ_YZAPPGROUP.NEXTVAL FROM DUAL";
                group.GroupID = System.Convert.ToInt32(cmd.ExecuteScalar());

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO YZAppGroup(");
                sb.Append("GroupID,");
                sb.Append("GroupType,");
                sb.Append("\"NAME\",");
                sb.Append("\"DESC\",");
                sb.Append("FolderID,");
                sb.Append("DocumentFolderID,");
                sb.Append("Owner,");
                sb.Append("CreateAt,");
                sb.Append("ImageFileID,");
                sb.Append("Deleted,");
                sb.Append("DeleteBy,");
                sb.Append("DeleteAt) ");
                sb.Append("VALUES(");
                sb.Append(":GroupID,");
                sb.Append(":GroupType,");
                sb.Append(":Name1,");
                sb.Append(":Desc1,");
                sb.Append(":FolderID,");
                sb.Append(":DocumentFolderID,");
                sb.Append(":Owner,");
                sb.Append(":CreateAt,");
                sb.Append(":ImageFileID,");
                sb.Append(":Deleted,");
                sb.Append(":DeleteBy,");
                sb.Append(":DeleteAt)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":GroupID", OracleDbType.Int32).Value = group.GroupID;
                cmd.Parameters.Add(":GroupType", OracleDbType.NVarchar2).Value = this.Convert(group.GroupType, false);
                cmd.Parameters.Add(":Name1", OracleDbType.NVarchar2).Value = this.Convert(group.Name, false);
                cmd.Parameters.Add(":Desc1", OracleDbType.NVarchar2).Value = this.Convert(group.Desc, true);
                cmd.Parameters.Add(":FolderID", OracleDbType.Int32).Value = this.Convert(group.FolderID, true);
                cmd.Parameters.Add(":DocumentFolderID", OracleDbType.Int32).Value = this.Convert(group.DocumentFolderID, true);
                cmd.Parameters.Add(":Owner", OracleDbType.NVarchar2).Value = this.Convert(group.Owner, true);
                cmd.Parameters.Add(":CreateAt", OracleDbType.Date).Value = this.Convert(group.CreateAt, true);
                cmd.Parameters.Add(":ImageFileID", OracleDbType.NVarchar2).Value = this.Convert(group.ImageFileID, true);
                cmd.Parameters.Add(":Deleted", OracleDbType.Int16).Value = this.ConvertBoolToInt16(group.Deleted);
                cmd.Parameters.Add(":DeleteBy", OracleDbType.NVarchar2).Value = this.Convert(group.DeleteBy, true);
                cmd.Parameters.Add(":DeleteAt", OracleDbType.Date).Value = this.Convert(group.DeleteAt, true);

                cmd.ExecuteNonQuery();
            }
        }

        public void Update(IDbConnection cn, YZSoft.Group.Group group)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZAppGroup SET ");
                sb.Append("GroupType=:GroupType,");
                sb.Append("\"NAME\"=:Name1,");
                sb.Append("\"DESC\"=:Desc1,");
                sb.Append("FolderID=:FolderID,");
                sb.Append("DocumentFolderID=:DocumentFolderID,");
                sb.Append("Owner=:Owner,");
                sb.Append("CreateAt=:CreateAt,");
                sb.Append("ImageFileID=:ImageFileID,");
                sb.Append("Deleted=:Deleted,");
                sb.Append("DeleteBy=:DeleteBy,");
                sb.Append("DeleteAt=:DeleteAt ");
                sb.Append("WHERE GroupID=:GroupID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":GroupType", OracleDbType.NVarchar2).Value = this.Convert(group.GroupType, false);
                cmd.Parameters.Add(":Name1", OracleDbType.NVarchar2).Value = this.Convert(group.Name, false);
                cmd.Parameters.Add(":Desc1", OracleDbType.NVarchar2).Value = this.Convert(group.Desc, true);
                cmd.Parameters.Add(":FolderID", OracleDbType.Int32).Value = this.Convert(group.FolderID, true);
                cmd.Parameters.Add(":DocumentFolderID", OracleDbType.Int32).Value = this.Convert(group.DocumentFolderID, true);
                cmd.Parameters.Add(":Owner", OracleDbType.NVarchar2).Value = this.Convert(group.Owner, true);
                cmd.Parameters.Add(":CreateAt", OracleDbType.Date).Value = this.Convert(group.CreateAt, true);
                cmd.Parameters.Add(":ImageFileID", OracleDbType.NVarchar2).Value = this.Convert(group.ImageFileID, true);
                cmd.Parameters.Add(":Deleted", OracleDbType.Int16).Value = this.ConvertBoolToInt16(group.Deleted);
                cmd.Parameters.Add(":DeleteBy", OracleDbType.NVarchar2).Value = this.Convert(group.DeleteBy, true);
                cmd.Parameters.Add(":DeleteAt", OracleDbType.Date).Value = this.Convert(group.DeleteAt, true);
                cmd.Parameters.Add(":GroupID", OracleDbType.Int32).Value = group.GroupID;

                cmd.ExecuteNonQuery();
            }
        }
    }
}
