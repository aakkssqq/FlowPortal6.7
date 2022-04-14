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
        //任务移交
        public IDataReader GetHandoverMyRequests(IDbConnection cn, string uid, string filter, string sort, int startRowIndex, int rows)
        {
            //Command
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                filter = this.CombinCond("TASKID IN (SELECT TASKID FROM YZV_TASKLIST WHERE OWNERACCOUNT=:PM_UID OR AGENTACCOUNT=:PM_UID)", filter);
                cmd.Parameters.Add(":PM_UID", OracleDbType.NVarchar2).Value = uid;

                //查询条件
                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "TASKID ASC";

                this.GeneratePageCommand(cmd, "SELECT * FROM BPMINSTTASKS" + filter, sort, startRowIndex, rows);
                return cmd.ExecuteReader();
            }
        }

        //日志
        public IDataReader GetAppLog(IDbConnection cn, BPMObjectNameCollection sids, DateTime date, string filter, string sort, int startRowIndex, int rows)
        {
            date = new DateTime(date.Year, date.Month, date.Day, 0, 0, 0);

            //Command
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                //获得查询条件
                filter = this.CombinCond("EXTDATE=:EXTDATE", filter);
                cmd.Parameters.Add(":EXTDATE", OracleDbType.Date).Value = date;

                if (!sids.Contains(WellKnownSID.Administrators))
                {
                    string sidfilter = String.Format("ObjectID IN(SELECT ObjectID FROM BPMSysAppLogACL WITH(INDEX(YZIX_BPMSysAppLogACL_ExtDate)) WHERE ExtDate=:ExtDate AND SID IN({0}))", this.GetDbInList(sids));
                    filter = this.CombinCond(filter, sidfilter);
                }

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "LOGDATE DESC";

                this.GeneratePageCommand(cmd, "SELECT * FROM BPMSYSAPPLOG" + filter, sort, startRowIndex, rows);
                return cmd.ExecuteReader();
            }
        }
    }
}
