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
        public IDataReader GetNotesCashs(IDbConnection cn, string account, string filter, string sort, int startRowIndex, int rows)
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

                this.GeneratePageCommand(cmd, "SELECT * FROM YZAppNotesCash" + filter, sort, startRowIndex, rows);

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetNotesCash(IDbConnection cn, int itemid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "SELECT * FROM YZAppNotesCash WHERE ItemID=@ItemID";
                cmd.Parameters.Add("@ItemID", SqlDbType.Int).Value = itemid;
                return cmd.ExecuteReader();
            }
        }

        public void Insert(IDbConnection cn, Cash cash)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("SET NOCOUNT ON;");
                sb.Append("INSERT INTO YZAppNotesCash(");
                sb.Append("Account,");
                sb.Append("Type,");
                sb.Append("Date,");
                sb.Append("Amount,");
                sb.Append("Invoice,");
                sb.Append("Comments,");
                sb.Append("CreateAt) ");
                sb.Append("VALUES(");
                sb.Append("@Account,");
                sb.Append("@Type,");
                sb.Append("@Date,");
                sb.Append("@Amount,");
                sb.Append("@Invoice,");
                sb.Append("@Comments,");
                sb.Append("@CreateAt);");
                sb.Append("SELECT SCOPE_IDENTITY()");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@Account", SqlDbType.NVarChar).Value = this.Convert(cash.Account, false);
                cmd.Parameters.Add("@Type", SqlDbType.NVarChar).Value = this.Convert(cash.Type, false);
                cmd.Parameters.Add("@Date", SqlDbType.DateTime).Value = this.Convert(cash.Date, true);
                cmd.Parameters.Add("@Amount", SqlDbType.Decimal).Value = cash.Amount;
                cmd.Parameters.Add("@Invoice", SqlDbType.NVarChar).Value = this.Convert(cash.Invoice, true);
                cmd.Parameters.Add("@Comments", SqlDbType.NVarChar).Value = this.Convert(cash.Comments, true);
                cmd.Parameters.Add("@CreateAt", SqlDbType.DateTime).Value = this.Convert(cash.CreateAt, false);

                cash.ItemID = System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public void Update(IDbConnection cn, Cash cash)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZAppNotesCash SET ");
                sb.Append("Account=@Account,");
                sb.Append("Type=@Type,");
                sb.Append("Date=@Date,");
                sb.Append("Amount=@Amount,");
                sb.Append("Invoice=@Invoice,");
                sb.Append("Comments=@Comments,");
                sb.Append("CreateAt=@CreateAt ");
                sb.Append("WHERE ItemID=@ItemID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@Account", SqlDbType.NVarChar).Value = this.Convert(cash.Account, false);
                cmd.Parameters.Add("@Type", SqlDbType.NVarChar).Value = this.Convert(cash.Type, false);
                cmd.Parameters.Add("@Date", SqlDbType.DateTime).Value = this.Convert(cash.Date, true);
                cmd.Parameters.Add("@Amount", SqlDbType.Decimal).Value = cash.Amount;
                cmd.Parameters.Add("@Invoice", SqlDbType.NVarChar).Value = this.Convert(cash.Invoice, true);
                cmd.Parameters.Add("@Comments", SqlDbType.NVarChar).Value = this.Convert(cash.Comments, true);
                cmd.Parameters.Add("@CreateAt", SqlDbType.DateTime).Value = this.Convert(cash.CreateAt, false);
                cmd.Parameters.Add("@ItemID", SqlDbType.Int).Value = cash.ItemID;

                cmd.ExecuteNonQuery();
            }
        }

        public void DeleteNotesCash(IDbConnection cn, int itemid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                cmd.CommandText = "DELETE from YZAppNotesCash WHERE ItemID=@ItemID";
                cmd.Parameters.Add("@ItemID", SqlDbType.Int).Value = itemid;

                cmd.ExecuteNonQuery();
            }
        }
    }
}
