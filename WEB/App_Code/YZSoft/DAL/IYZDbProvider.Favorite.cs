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
        IDataReader GetFavorites(IDbConnection cn, string uid, YZResourceType resType);

        IDataReader HasFavorited(IDbConnection cn, string uid, YZResourceType resType,string resId);
        void DeleteFavorite(IDbConnection cn, string uid, YZResourceType resType, string resId);
        void Insert(IDbConnection cn, Favorite favorite);

        void UpdateOrderIndex(IDbConnection cn, Favorite favorite);

    }
}
