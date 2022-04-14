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
        public IDataReader GetWeeklyReports(IDbConnection cn, string account, int year)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "SELECT * FROM iWeeklyReport WHERE Account = @Account AND year(Date) = @Year ORDER BY Date DESC,ItemID DESC";

                cmd.Parameters.Add("@Account", SqlDbType.NVarChar).Value = account;
                cmd.Parameters.Add("@Year", SqlDbType.Int).Value = year;
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetWeeklyReport(IDbConnection cn, string account, DateTime date)
        {
            DateTime firstDate;
            DateTime lastDate;
            YZDateHelper.GetWeekStartEndDate(date, out firstDate, out lastDate);
            lastDate = lastDate.AddDays(1);

            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "SELECT * FROM iWeeklyReport WHERE Account = @Account AND Date >= @firstDate AND Date < @lastDate ORDER BY Date DESC,ItemID DESC";

                cmd.Parameters.Add("@Account", SqlDbType.NVarChar).Value = account;
                cmd.Parameters.Add("@firstDate", SqlDbType.DateTime).Value = firstDate;
                cmd.Parameters.Add("@lastDate", SqlDbType.DateTime).Value = lastDate;
                return cmd.ExecuteReader();
            }
        }
    }
}
