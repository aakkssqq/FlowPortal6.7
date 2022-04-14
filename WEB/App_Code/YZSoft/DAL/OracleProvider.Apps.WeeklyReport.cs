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
using YZSoft.Apps;

namespace YZSoft.Web.DAL
{
    partial class OracleProvider
    {
        public IDataReader GetWeeklyReports(IDbConnection cn, string account, int year)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "SELECT * FROM iWeeklyReport WHERE Account = :Account AND extract(year from \"DATE\") = :Year ORDER BY \"DATE\" DESC,ItemID DESC";

                cmd.Parameters.Add(":Account", OracleDbType.NVarchar2).Value = account;
                cmd.Parameters.Add(":Year", OracleDbType.Int32).Value = year;
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetWeeklyReport(IDbConnection cn, string account, DateTime date)
        {
            DateTime firstDate;
            DateTime lastDate;
            YZDateHelper.GetWeekStartEndDate(date, out firstDate, out lastDate);
            lastDate = lastDate.AddDays(1);

            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "SELECT * FROM iWeeklyReport WHERE Account = :Account AND \"DATE\" >= :firstDate AND \"DATE\" < :lastDate ORDER BY \"DATE\" DESC,ItemID DESC";

                cmd.Parameters.Add(":Account", OracleDbType.NVarchar2).Value = account;
                cmd.Parameters.Add(":firstDate", OracleDbType.Date).Value = firstDate;
                cmd.Parameters.Add(":lastDate", OracleDbType.Date).Value = lastDate;
                return cmd.ExecuteReader();
            }
        }
    }
}
