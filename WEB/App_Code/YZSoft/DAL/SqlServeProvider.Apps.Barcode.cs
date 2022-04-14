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
        public IDataReader GetNotesBarcodes(IDbConnection cn, string account, string filter, string sort, int startRowIndex, int rows)
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

                this.GeneratePageCommand(cmd, "SELECT * FROM YZAppNotesBarcode" + filter, sort, startRowIndex, rows);

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetNotesBarcode(IDbConnection cn, int itemid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "SELECT * FROM YZAppNotesBarcode WHERE ItemID=@ItemID";
                cmd.Parameters.Add("@ItemID", SqlDbType.Int).Value = itemid;
                return cmd.ExecuteReader();
            }
        }

        public void Insert(IDbConnection cn, Barcode barcode)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("SET NOCOUNT ON;");
                sb.Append("INSERT INTO YZAppNotesBarcode(");
                sb.Append("Account,");
                sb.Append("Barcode,");
                sb.Append("Format,");
                sb.Append("ProductName,");
                sb.Append("Comments,");
                sb.Append("CreateAt) ");
                sb.Append("VALUES(");
                sb.Append("@Account,");
                sb.Append("@Barcode,");
                sb.Append("@Format,");
                sb.Append("@ProductName,");
                sb.Append("@Comments,");
                sb.Append("@CreateAt);");
                sb.Append("SELECT SCOPE_IDENTITY()");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@Account", SqlDbType.NVarChar).Value = this.Convert(barcode.Account, false);
                cmd.Parameters.Add("@Barcode", SqlDbType.NVarChar).Value = this.Convert(barcode.BarcodeValue, false);
                cmd.Parameters.Add("@Format", SqlDbType.NVarChar).Value = this.Convert(barcode.Format, false);
                cmd.Parameters.Add("@ProductName", SqlDbType.NVarChar).Value = this.Convert(barcode.ProductName, true);
                cmd.Parameters.Add("@Comments", SqlDbType.NVarChar).Value = this.Convert(barcode.Comments, true);
                cmd.Parameters.Add("@CreateAt", SqlDbType.DateTime).Value = this.Convert(barcode.CreateAt, false);

                barcode.ItemID = System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public void Update(IDbConnection cn, Barcode barcode)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZAppNotesBarcode SET ");
                sb.Append("Account=@Account,");
                sb.Append("Barcode=@Barcode,");
                sb.Append("Format=@Format,");
                sb.Append("ProductName=@ProductName,");
                sb.Append("Comments=@Comments,");
                sb.Append("CreateAt=@CreateAt ");
                sb.Append("WHERE ItemID=@ItemID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@Account", SqlDbType.NVarChar).Value = this.Convert(barcode.Account, false);
                cmd.Parameters.Add("@Barcode", SqlDbType.NVarChar).Value = this.Convert(barcode.BarcodeValue, false);
                cmd.Parameters.Add("@Format", SqlDbType.NVarChar).Value = this.Convert(barcode.Format, false);
                cmd.Parameters.Add("@ProductName", SqlDbType.NVarChar).Value = this.Convert(barcode.ProductName, true);
                cmd.Parameters.Add("@Comments", SqlDbType.NVarChar).Value = this.Convert(barcode.Comments, true);
                cmd.Parameters.Add("@CreateAt", SqlDbType.DateTime).Value = this.Convert(barcode.CreateAt, false);
                cmd.Parameters.Add("@ItemID", SqlDbType.Int).Value = barcode.ItemID;

                cmd.ExecuteNonQuery();
            }
        }

        public void DeleteNotesBarcode(IDbConnection cn, int itemid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                cmd.CommandText = "DELETE from YZAppNotesBarcode WHERE ItemID=@ItemID";
                cmd.Parameters.Add("@ItemID", SqlDbType.Int).Value = itemid;

                cmd.ExecuteNonQuery();
            }
        }
    }
}
