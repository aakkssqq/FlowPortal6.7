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
        IDataReader GetQueueLogSucceed(IDbConnection cn, DateTime date, string filter, string sort, int startRowIndex, int rows);
        IDataReader GetQueueLogFailed(IDbConnection cn, DateTime date, string filter, string sort, int startRowIndex, int rows);
        IDataReader GetQueueMessages(IDbConnection cn, string filter, string sort, int startRowIndex, int rows);

    }
}
