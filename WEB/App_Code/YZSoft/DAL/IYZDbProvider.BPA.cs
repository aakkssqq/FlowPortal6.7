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
        IDataReader GetSpriteUsedByLinks(IDbConnection cn, string fileid, string spriteid, string property);
        IDataReader GetFileUsedByLinks(IDbConnection cn, string fileid, string property);
        IDataReader GetUserPositions(IDbConnection cn, string uid);
        IDataReader GetSpriteIdentity(IDbConnection cn, string fileid, string spriteid);
        void ClearSpriteIdentityOfFile(IDbConnection cn, string fileid);
        void ClearLinkOfFile(IDbConnection cn, string fileid);
        void ClearUserPositions(IDbConnection cn, string uid);
        void Insert(IDbConnection cn, YZSoft.Web.BPA.SpriteIdentity spriteIdentity);
        void Insert(IDbConnection cn, YZSoft.Web.BPA.SpriteLink spriteLink);
        void Insert(IDbConnection cn, YZSoft.Web.BPA.UserPosition userPosition);
    }
}
