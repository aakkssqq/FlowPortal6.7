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
        public IDataReader GetP2PGroup(IDbConnection cn, int groupid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"SELECT * FROM YZAppP2PGroup WHERE GroupID=:GroupID";
                cmd.Parameters.Add(":GroupID", OracleDbType.Int32).Value = groupid;
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetP2PGroup(IDbConnection cn, string account1, string account2)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"SELECT * FROM YZAppP2PGroup WHERE (Account1=:Account1 AND Account2=:Account2) OR (Account2=:Account1 AND Account1=:Account2)";
                cmd.Parameters.Add(":Account1", OracleDbType.NVarchar2).Value = account1;
                cmd.Parameters.Add(":Account2", OracleDbType.NVarchar2).Value = account2;
                return cmd.ExecuteReader();
            }
        }

        public void Insert(IDbConnection cn, YZSoft.P2PGroup.P2PGroup group)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "SELECT BPMSEQ_YZAPPP2PGROUP.NEXTVAL FROM DUAL";
                group.GroupID = System.Convert.ToInt32(cmd.ExecuteScalar());

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO YZAppP2PGroup(");
                sb.Append("GroupID,");
                sb.Append("Account1,");
                sb.Append("Account2,");
                sb.Append("UserName1,");
                sb.Append("UserName2,");
                sb.Append("FolderID,");
                sb.Append("CreateBy,");
                sb.Append("CreateAt) ");
                sb.Append("VALUES(");
                sb.Append(":GroupID,");
                sb.Append(":Account1,");
                sb.Append(":Account2,");
                sb.Append(":UserName1,");
                sb.Append(":UserName2,");
                sb.Append(":FolderID,");
                sb.Append(":CreateBy,");
                sb.Append(":CreateAt)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":GroupID", OracleDbType.Int32).Value = group.GroupID;
                cmd.Parameters.Add(":Account1", OracleDbType.NVarchar2).Value = this.Convert(group.Account1, false);
                cmd.Parameters.Add(":Account2", OracleDbType.NVarchar2).Value = this.Convert(group.Account2, false);
                cmd.Parameters.Add(":UserName1", OracleDbType.NVarchar2).Value = this.Convert(group.UserName1, false);
                cmd.Parameters.Add(":UserName2", OracleDbType.NVarchar2).Value = this.Convert(group.UserName2, false);
                cmd.Parameters.Add(":FolderID", OracleDbType.Int32).Value = this.Convert(group.FolderID, true);
                cmd.Parameters.Add(":CreateBy", OracleDbType.NVarchar2).Value = this.Convert(group.CreateBy, false);
                cmd.Parameters.Add(":CreateAt", OracleDbType.Date).Value = this.Convert(group.CreateAt, false);

                cmd.ExecuteNonQuery();
            }
        }
    }
}
