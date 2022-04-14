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
using YZSoft.Web.Social;

namespace YZSoft.Web.DAL
{
    partial interface IYZDbProvider
    {
        IDataReader GetProcessAnalysisTrend(IDbConnection cn, int year, BPMObjectNameCollection include, BPMObjectNameCollection exclude);
        IDataReader GetProcessAnalysisTrend(IDbConnection cn, int year, int month, BPMObjectNameCollection include, BPMObjectNameCollection exclude);

        IDataReader GetProcessUsage(IDbConnection cn, int year, int month);
        IDataReader GetProcessUsageKPI(IDbConnection cn, int year, int month, BPMObjectNameCollection include, BPMObjectNameCollection exclude);

        IDataReader GetProcessPerformanceByProcess(IDbConnection cn, int year, int month, string orderBy);
        IDataReader GetProcessPerformanceKPI(IDbConnection cn, int year, int month, BPMObjectNameCollection include, BPMObjectNameCollection exclude);

        IDataReader GetProcessAnalysisByNode(IDbConnection cn, int year, int month, string processName, string orderBy);
        IDataReader GetProcessAnalysisByHandlerAccount(IDbConnection cn, int year, int month, string processName, string orderBy, BPMObjectNameCollection include, BPMObjectNameCollection exclude);
    }
}
