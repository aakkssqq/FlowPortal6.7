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
        //附件
        IDataReader GetAttachmentsInfo(IDbConnection cn, string[] fileids);
        void Insert(IDbConnection cn, AttachmentInfo attInfo);
        void Update(IDbConnection cn, AttachmentInfo attInfo);
        void RenameAttachment(IDbConnection cn, string fileId, string newName);
        void DeleteAttachment(IDbConnection cn, string fileid);
    }
}
