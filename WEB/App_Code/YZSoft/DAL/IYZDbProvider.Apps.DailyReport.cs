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
using YZSoft.Apps;

namespace YZSoft.Web.DAL
{
    partial interface IYZDbProvider
    {
        IDataReader GetDailyReports(IDbConnection cn, string account, int year, int month);
        IDataReader GetDailyReport(IDbConnection cn, string account, DateTime date);
    }
}
