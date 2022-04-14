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
        public IDataReader GetP2PGroup(IDbConnection cn, int groupid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SELECT * FROM YZAppP2PGroup WHERE GroupID=@GroupID";
                cmd.Parameters.Add("@GroupID", SqlDbType.Int).Value = groupid;
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetP2PGroup(IDbConnection cn, string account1, string account2)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SELECT * FROM YZAppP2PGroup WHERE (Account1=@Account1 AND Account2=@Account2) OR (Account2=@Account1 AND Account1=@Account2)";
                cmd.Parameters.Add("@Account1", SqlDbType.NVarChar).Value = account1;
                cmd.Parameters.Add("@Account2", SqlDbType.NVarChar).Value = account2;
                return cmd.ExecuteReader();
            }
        }

        public void Insert(IDbConnection cn, YZSoft.P2PGroup.P2PGroup group)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("SET NOCOUNT ON;");
                sb.Append("INSERT INTO YZAppP2PGroup(");
                sb.Append("Account1,");
                sb.Append("Account2,");
                sb.Append("UserName1,");
                sb.Append("UserName2,");
                sb.Append("FolderID,");
                sb.Append("CreateBy,");
                sb.Append("CreateAt) ");
                sb.Append("VALUES(");
                sb.Append("@Account1,");
                sb.Append("@Account2,");
                sb.Append("@UserName1,");
                sb.Append("@UserName2,");
                sb.Append("@FolderID,");
                sb.Append("@CreateBy,");
                sb.Append("@CreateAt);");
                sb.Append("SELECT SCOPE_IDENTITY()");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@Account1", SqlDbType.NVarChar).Value = this.Convert(group.Account1, false);
                cmd.Parameters.Add("@Account2", SqlDbType.NVarChar).Value = this.Convert(group.Account2, false);
                cmd.Parameters.Add("@UserName1", SqlDbType.NVarChar).Value = this.Convert(group.UserName1, false);
                cmd.Parameters.Add("@UserName2", SqlDbType.NVarChar).Value = this.Convert(group.UserName2, false);
                cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = this.Convert(group.FolderID, false);
                cmd.Parameters.Add("@CreateBy", SqlDbType.NVarChar).Value = this.Convert(group.CreateBy, false);
                cmd.Parameters.Add("@CreateAt", SqlDbType.DateTime).Value = this.Convert(group.CreateAt, false);

                group.GroupID = System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }
    }
}
