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
using YZSoft.Apps;

namespace YZSoft.Web.DAL
{
    partial class SqlServerProvider
    {
        public IDataReader GetDailyReports(IDbConnection cn, string account, int year, int month)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "SELECT * FROM iDailyReport WHERE Account = @Account AND year(Date) = @Year AND month(Date) = @Month ORDER BY Date DESC,ItemID DESC";

                cmd.Parameters.Add("@Account", SqlDbType.NVarChar).Value = account;
                cmd.Parameters.Add("@Year", SqlDbType.Int).Value = year;
                cmd.Parameters.Add("@Month", SqlDbType.Int).Value = month;
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetDailyReport(IDbConnection cn, string account, DateTime date)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "SELECT * FROM iDailyReport WHERE Account = @Account AND year(Date) = @Year AND month(Date) = @Month AND day(Date) = @day ORDER BY Date DESC,ItemID DESC";

                cmd.Parameters.Add("@Account", SqlDbType.NVarChar).Value = account;
                cmd.Parameters.Add("@Year", SqlDbType.Int).Value = date.Year;
                cmd.Parameters.Add("@Month", SqlDbType.Int).Value = date.Month;
                cmd.Parameters.Add("@day", SqlDbType.Int).Value = date.Day;
                return cmd.ExecuteReader();
            }
        }
    }
}
