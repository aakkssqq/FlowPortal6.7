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
        IDataReader GetP2PGroup(IDbConnection cn, int groupid);
        IDataReader GetP2PGroup(IDbConnection cn, string account1, string account2);
        void Insert(IDbConnection cn, YZSoft.P2PGroup.P2PGroup group);
    }
}
