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
        //任务移交
        public IDataReader GetHandoverMyRequests(IDbConnection cn, string uid, string filter, string sort, int startRowIndex, int rows)
        {
            //Command
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                filter = this.CombinCond("TaskID IN (SELECT TasKID FROM YZV_TaskList WHERE OwnerAccount=@uid OR AgentAccount=@uid)", filter);
                cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = uid;

                //查询条件
                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "TaskID ASC";

                this.GeneratePageCommand(cmd, "SELECT * FROM BPMInstTasks" + filter, sort, startRowIndex, rows);
                return cmd.ExecuteReader();
            }
        }

        //日志
        public IDataReader GetAppLog(IDbConnection cn, BPMObjectNameCollection sids, DateTime date, string filter, string sort, int startRowIndex, int rows)
        {
            date = new DateTime(date.Year, date.Month, date.Day, 0, 0, 0);

            //Command
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                //获得查询条件
                filter = this.CombinCond("ExtDate=@ExtDate", filter);
                cmd.Parameters.Add("@ExtDate", SqlDbType.DateTime).Value = date;

                if (!sids.Contains(WellKnownSID.Administrators))
                {
                    string sidfilter = String.Format("ObjectID IN(SELECT ObjectID FROM BPMSysAppLogACL WITH(INDEX(YZIX_BPMSysAppLogACL_ExtDate)) WHERE ExtDate=@ExtDate AND SID IN({0}))", this.GetDbInList(sids));
                    filter = this.CombinCond(filter, sidfilter);
                }

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "LogDate DESC";

                this.GeneratePageCommand(cmd, "SELECT * FROM BPMSysAppLog" + filter, sort, startRowIndex, rows);
                return cmd.ExecuteReader();
            }
        }
    }
}
