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
        public int GetSignalCount(IDbConnection cn, string signalId)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "SELECT count(*) FROM YZSysSignal WHERE SignalId=:SignalId";
                cmd.Parameters.Add(":SignalId", OracleDbType.NVarchar2).Value = signalId;

                return System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public void DeleteSignal(IDbConnection cn, string signalId)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "DELETE from YZSysSignal WHERE SignalId=:SignalId";
                cmd.Parameters.Add(":SignalId", OracleDbType.NVarchar2).Value = this.Convert(signalId, false);

                cmd.ExecuteNonQuery();
            }
        }

        public void InsertSignal(IDbConnection cn, string signalId)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO YZSysSignal(");
                sb.Append("SignalId,");
                sb.Append("CreateAt,");
                sb.Append("CreateBy) ");
                sb.Append("VALUES(");
                sb.Append(":SignalId,");
                sb.Append(":CreateAt,");
                sb.Append(":CreateBy)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":SignalId", OracleDbType.NVarchar2).Value = this.Convert(signalId, false);
                cmd.Parameters.Add(":CreateAt", OracleDbType.Date).Value = DateTime.Now;
                cmd.Parameters.Add(":CreateBy", OracleDbType.NVarchar2).Value = YZAuthHelper.LoginUserAccount;

                cmd.ExecuteNonQuery();
            }
        }
    }
}
