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
        IDataReader GetLibraries(IDbConnection cn, string libType, string filter, string sort);
        IDataReader GetLibrary(IDbConnection cn, int libid);
        void Update(IDbConnection cn, YZSoft.Library.Library lib);
        void Insert(IDbConnection cn, YZSoft.Library.Library lib);
        void UpdateOrderIndex(IDbConnection cn, YZSoft.Library.Library lib);
    }
}
