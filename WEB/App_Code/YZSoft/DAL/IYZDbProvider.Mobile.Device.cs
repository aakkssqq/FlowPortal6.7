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
using YZSoft.Web.Mobile;

namespace YZSoft.Web.DAL
{
    partial interface IYZDbProvider
    {
        IDataReader GetUserDevices(IDbConnection cn, string account, string filter, string sort, int startRowIndex, int rows);
        IDataReader GetDevice(IDbConnection cn, string account, string uuid);
        void Insert(IDbConnection cn, Device device);
        void Update(IDbConnection cn, Device device);
        void DeleteDevice(IDbConnection cn, string account, string uuid);

        IDataReader GetDevices(IDbConnection cn, string filter, string sort, int startRowIndex, int rows);
    }
}
