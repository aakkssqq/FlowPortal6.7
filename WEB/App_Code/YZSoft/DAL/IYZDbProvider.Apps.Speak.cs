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
        IDataReader GetNotesSpeaks(IDbConnection cn, string account, string filter, string sort, int startRowIndex, int rows);
        IDataReader GetNotesSpeak(IDbConnection cn, int itemid);
        void Insert(IDbConnection cn, Speak speak);
        void Update(IDbConnection cn, Speak speak);
        void DeleteNotesSpeak(IDbConnection cn, int itemid);
    }
}
