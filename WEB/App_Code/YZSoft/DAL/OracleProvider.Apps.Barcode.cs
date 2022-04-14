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
using Oracle.ManagedDataAccess.Client;
using BPM;
using YZSoft.Apps;

namespace YZSoft.Web.DAL
{
    partial class OracleProvider
    {
        public IDataReader GetNotesBarcodes(IDbConnection cn, string account, string filter, string sort, int startRowIndex, int rows)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                //查询条件
                filter = this.CombinCond(filter, "Account = :Account");
                cmd.Parameters.Add(":Account", OracleDbType.NVarchar2).Value = account;

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
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "SELECT * FROM YZAppNotesBarcode WHERE ItemID=:ItemID";
                cmd.Parameters.Add(":ItemID", OracleDbType.Int32).Value = itemid;
                return cmd.ExecuteReader();
            }
        }

        public void Insert(IDbConnection cn, Barcode barcode)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "SELECT BPMSEQ_YZAPPNOTESBARCODE.NEXTVAL FROM DUAL";
                barcode.ItemID = System.Convert.ToInt32(cmd.ExecuteScalar());

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO YZAppNotesBarcode(");
                sb.Append("ItemID,");
                sb.Append("Account,");
                sb.Append("Barcode,");
                sb.Append("Format,");
                sb.Append("ProductName,");
                sb.Append("Comments,");
                sb.Append("CreateAt) ");
                sb.Append("VALUES(");
                sb.Append(":ItemID,");
                sb.Append(":Account,");
                sb.Append(":Barcode,");
                sb.Append(":Format,");
                sb.Append(":ProductName,");
                sb.Append(":Comments,");
                sb.Append(":CreateAt)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":ItemID", OracleDbType.Int32).Value = barcode.ItemID;
                cmd.Parameters.Add(":Account", OracleDbType.NVarchar2).Value = this.Convert(barcode.Account, false);
                cmd.Parameters.Add(":Barcode", OracleDbType.NVarchar2).Value = this.Convert(barcode.BarcodeValue, false);
                cmd.Parameters.Add(":Format", OracleDbType.NVarchar2).Value = this.Convert(barcode.Format, false);
                cmd.Parameters.Add(":ProductName", OracleDbType.NVarchar2).Value = this.Convert(barcode.ProductName, true);
                cmd.Parameters.Add(":Comments", OracleDbType.NVarchar2).Value = this.Convert(barcode.Comments, true);
                cmd.Parameters.Add(":CreateAt", OracleDbType.Date).Value = this.Convert(barcode.CreateAt, false);

                cmd.ExecuteNonQuery();
            }
        }

        public void Update(IDbConnection cn, Barcode barcode)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZAppNotesBarcode SET ");
                sb.Append("Account=:Account,");
                sb.Append("Barcode=:Barcode,");
                sb.Append("Format=:Format,");
                sb.Append("ProductName=:ProductName,");
                sb.Append("Comments=:Comments,");
                sb.Append("CreateAt=:CreateAt ");
                sb.Append("WHERE ItemID=:ItemID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":Account", OracleDbType.NVarchar2).Value = this.Convert(barcode.Account, false);
                cmd.Parameters.Add(":Barcode", OracleDbType.NVarchar2).Value = this.Convert(barcode.BarcodeValue, false);
                cmd.Parameters.Add(":Format", OracleDbType.NVarchar2).Value = this.Convert(barcode.Format, false);
                cmd.Parameters.Add(":ProductName", OracleDbType.NVarchar2).Value = this.Convert(barcode.ProductName, true);
                cmd.Parameters.Add(":Comments", OracleDbType.NVarchar2).Value = this.Convert(barcode.Comments, true);
                cmd.Parameters.Add(":CreateAt", OracleDbType.Date).Value = this.Convert(barcode.CreateAt, false);
                cmd.Parameters.Add(":ItemID", OracleDbType.Int32).Value = barcode.ItemID;

                cmd.ExecuteNonQuery();
            }
        }

        public void DeleteNotesBarcode(IDbConnection cn, int itemid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "DELETE from YZAppNotesBarcode WHERE ItemID=:ItemID";
                cmd.Parameters.Add(":ItemID", OracleDbType.Int32).Value = itemid;

                cmd.ExecuteNonQuery();
            }
        }
    }
}
