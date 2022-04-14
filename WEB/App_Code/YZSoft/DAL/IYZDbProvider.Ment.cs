using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Drawing;
using System.IO;
using System.Data.Common;
using System.Runtime.Serialization;
using BPM;

namespace YZSoft.Web.DAL
{
    partial interface IYZDbProvider
    {
        //任务移交
        IDataReader GetHandoverMyRequests(IDbConnection cn, string uid, string filter, string sort, int startRowIndex, int rows);

        //日志
        IDataReader GetAppLog(IDbConnection cn, BPMObjectNameCollection sids, DateTime date, string filter, string sort, int startRowIndex, int rows);
    }
}
