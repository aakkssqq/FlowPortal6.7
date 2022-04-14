using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.IO;
using System.Drawing;
using System.Threading;
using System.Collections.Generic;
using System.Text;
using System.Data.Common;
using System.Data.SqlClient;
using BPM;
using YZSoft.Apps;

namespace YZSoft.Web.DAL
{
    partial class SqlServerProvider
    {
        public IDataReader GetNotesSpeaks(IDbConnection cn, string account, string filter, string sort, int startRowIndex, int rows)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                //查询条件
                filter = this.CombinCond(filter, "Account = @Account");
                cmd.Parameters.Add("@Account", SqlDbType.NVarChar).Value = account;

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "ItemID DESC";

                this.GeneratePageCommand(cmd, "SELECT * FROM YZAppNotesSpeak" + filter, sort, startRowIndex, rows);

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetNotesSpeak(IDbConnection cn, int itemid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "SELECT * FROM YZAppNotesSpeak WHERE ItemID=@ItemID";
                cmd.Parameters.Add("@ItemID", SqlDbType.Int).Value = itemid;
                return cmd.ExecuteReader();
            }
        }

        public void Insert(IDbConnection cn, Speak speak)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("SET NOCOUNT ON;");
                sb.Append("INSERT INTO YZAppNotesSpeak(");
                sb.Append("Account,");
                sb.Append("FileID,");
                sb.Append("Duration,");
                sb.Append("Comments,");
                sb.Append("CreateAt) ");
                sb.Append("VALUES(");
                sb.Append("@Account,");
                sb.Append("@FileID,");
                sb.Append("@Duration,");
                sb.Append("@Comments,");
                sb.Append("@CreateAt);");
                sb.Append("SELECT SCOPE_IDENTITY()");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@Account", SqlDbType.NVarChar).Value = this.Convert(speak.Account, false);
                cmd.Parameters.Add("@FileID", SqlDbType.NVarChar).Value = this.Convert(speak.FileID, false);
                cmd.Parameters.Add("@Duration", SqlDbType.Int).Value = speak.Duration;
                cmd.Parameters.Add("@Comments", SqlDbType.NVarChar).Value = this.Convert(speak.Comments, true);
                cmd.Parameters.Add("@CreateAt", SqlDbType.DateTime).Value = this.Convert(speak.CreateAt, false);

                speak.ItemID = System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public void Update(IDbConnection cn, Speak speak)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZAppNotesSpeak SET ");
                sb.Append("Account=@Account,");
                sb.Append("FileID=@FileID,");
                sb.Append("Duration=@Duration,");
                sb.Append("Comments=@Comments,");
                sb.Append("CreateAt=@CreateAt ");
                sb.Append("WHERE ItemID=@ItemID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@Account", SqlDbType.NVarChar).Value = this.Convert(speak.Account, false);
                cmd.Parameters.Add("@FileID", SqlDbType.NVarChar).Value = this.Convert(speak.FileID, false);
                cmd.Parameters.Add("@Duration", SqlDbType.Int).Value = speak.Duration;
                cmd.Parameters.Add("@Comments", SqlDbType.NVarChar).Value = this.Convert(speak.Comments, true);
                cmd.Parameters.Add("@CreateAt", SqlDbType.DateTime).Value = this.Convert(speak.CreateAt, false);
                cmd.Parameters.Add("@ItemID", SqlDbType.Int).Value = speak.ItemID;

                cmd.ExecuteNonQuery();
            }
        }

        public void DeleteNotesSpeak(IDbConnection cn, int itemid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                cmd.CommandText = "DELETE from YZAppNotesSpeak WHERE ItemID=@ItemID";
                cmd.Parameters.Add("@ItemID", SqlDbType.Int).Value = itemid;

                cmd.ExecuteNonQuery();
            }
        }
    }
}
