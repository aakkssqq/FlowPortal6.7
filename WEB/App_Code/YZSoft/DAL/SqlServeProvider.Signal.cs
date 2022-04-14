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
        public int GetSignalCount(IDbConnection cn, string signalId)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "SELECT count(*) FROM YZSysSignal WHERE SignalId=@SignalId";
                cmd.Parameters.Add("@SignalId", SqlDbType.NVarChar).Value = signalId;

                return System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }
        public void DeleteSignal(IDbConnection cn, string signalId)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "DELETE YZSysSignal WHERE SignalId=@SignalId";
                cmd.Parameters.Add("@SignalId", SqlDbType.NVarChar).Value = signalId;

                cmd.ExecuteNonQuery();
            }
        }

        public void InsertSignal(IDbConnection cn, string signalId)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO YZSysSignal(");
                sb.Append("SignalId,");
                sb.Append("CreateAt,");
                sb.Append("CreateBy) ");
                sb.Append("VALUES(");
                sb.Append("@SignalId,");
                sb.Append("@CreateAt,");
                sb.Append("@CreateBy)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@SignalId", SqlDbType.NVarChar).Value = this.Convert(signalId, false);
                cmd.Parameters.Add("@CreateAt", SqlDbType.DateTime).Value = DateTime.Now;
                cmd.Parameters.Add("@CreateBy", SqlDbType.NVarChar).Value = YZAuthHelper.LoginUserAccount;

                cmd.ExecuteNonQuery();
            }
        }
    }
}
