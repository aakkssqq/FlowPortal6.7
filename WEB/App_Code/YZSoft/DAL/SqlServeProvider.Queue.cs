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
        public IDataReader GetQueueLogSucceed(IDbConnection cn, DateTime date, string filter, string sort, int startRowIndex, int rows)
        {
            date = new DateTime(date.Year, date.Month, date.Day, 0, 0, 0);

            //Command
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                //获得查询条件
                filter = this.CombinCond("ExtDate=@ExtDate", filter);
                cmd.Parameters.Add("@ExtDate", SqlDbType.DateTime).Value = date;

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "MessageID DESC";

                this.GeneratePageCommand(cmd, "SELECT * FROM BPMInstQueueSucceed" + filter, sort, startRowIndex, rows);
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetQueueLogFailed(IDbConnection cn, DateTime date, string filter, string sort, int startRowIndex, int rows)
        {
            date = new DateTime(date.Year, date.Month, date.Day, 0, 0, 0);

            //Command
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                //获得查询条件
                filter = this.CombinCond("ExtDate=@ExtDate", filter);
                cmd.Parameters.Add("@ExtDate", SqlDbType.DateTime).Value = date;

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "MessageID DESC";

                this.GeneratePageCommand(cmd, "SELECT * FROM BPMInstQueueFailed" + filter, sort, startRowIndex, rows);
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetQueueMessages(IDbConnection cn, string filter, string sort, int startRowIndex, int rows)
        {
            //Command
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                //获得查询条件
                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "MessageID DESC";

                this.GeneratePageCommand(cmd, "SELECT * FROM BPMInstQueue" + filter, sort, startRowIndex, rows);
                return cmd.ExecuteReader();
            }
        }
    }
}
