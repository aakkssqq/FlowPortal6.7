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
        public IDataReader GetNotesCashs(IDbConnection cn, string account, string filter, string sort, int startRowIndex, int rows)
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

                this.GeneratePageCommand(cmd, "SELECT * FROM YZAppNotesCash" + filter, sort, startRowIndex, rows);

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetNotesCash(IDbConnection cn, int itemid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "SELECT * FROM YZAppNotesCash WHERE ItemID=:ItemID";
                cmd.Parameters.Add(":ItemID", OracleDbType.Int32).Value = itemid;
                return cmd.ExecuteReader();
            }
        }

        public void Insert(IDbConnection cn, Cash cash)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "SELECT BPMSEQ_YZAPPNOTESCASH.NEXTVAL FROM DUAL";
                cash.ItemID = System.Convert.ToInt32(cmd.ExecuteScalar());

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO YZAppNotesCash(");
                sb.Append("ItemID,");
                sb.Append("Account,");
                sb.Append("Type,");
                sb.Append("\"DATE\",");
                sb.Append("Amount,");
                sb.Append("Invoice,");
                sb.Append("Comments,");
                sb.Append("CreateAt) ");
                sb.Append("VALUES(");
                sb.Append(":ItemID,");
                sb.Append(":Account,");
                sb.Append(":Type,");
                sb.Append(":PM_Date,");
                sb.Append(":Amount,");
                sb.Append(":Invoice,");
                sb.Append(":Comments,");
                sb.Append(":CreateAt)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":ItemID", OracleDbType.Int32).Value = cash.ItemID;
                cmd.Parameters.Add(":Account", OracleDbType.NVarchar2).Value = this.Convert(cash.Account, false);
                cmd.Parameters.Add(":Type", OracleDbType.NVarchar2).Value = this.Convert(cash.Type, false);
                cmd.Parameters.Add(":PM_Date", OracleDbType.Date).Value = this.Convert(cash.Date, true);
                cmd.Parameters.Add(":Amount", OracleDbType.Decimal).Value = cash.Amount;
                cmd.Parameters.Add(":Invoice", OracleDbType.NVarchar2).Value = this.Convert(cash.Invoice, true);
                cmd.Parameters.Add(":Comments", OracleDbType.NVarchar2).Value = this.Convert(cash.Comments, true);
                cmd.Parameters.Add(":CreateAt", OracleDbType.Date).Value = this.Convert(cash.CreateAt, false);

                cmd.ExecuteNonQuery();
            }
        }

        public void Update(IDbConnection cn, Cash cash)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZAppNotesCash SET ");
                sb.Append("Account=:Account,");
                sb.Append("Type=:Type,");
                sb.Append("\"DATE\"=:PM_Date,");
                sb.Append("Amount=:Amount,");
                sb.Append("Invoice=:Invoice,");
                sb.Append("Comments=:Comments,");
                sb.Append("CreateAt=:CreateAt ");
                sb.Append("WHERE ItemID=:ItemID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":Account", OracleDbType.NVarchar2).Value = this.Convert(cash.Account, false);
                cmd.Parameters.Add(":Type", OracleDbType.NVarchar2).Value = this.Convert(cash.Type, false);
                cmd.Parameters.Add(":PM_Date", OracleDbType.Date).Value = this.Convert(cash.Date, true);
                cmd.Parameters.Add(":Amount", OracleDbType.Decimal).Value = cash.Amount;
                cmd.Parameters.Add(":Invoice", OracleDbType.NVarchar2).Value = this.Convert(cash.Invoice, true);
                cmd.Parameters.Add(":Comments", OracleDbType.NVarchar2).Value = this.Convert(cash.Comments, true);
                cmd.Parameters.Add(":CreateAt", OracleDbType.Date).Value = this.Convert(cash.CreateAt, false);
                cmd.Parameters.Add(":ItemID", OracleDbType.Int32).Value = cash.ItemID;

                cmd.ExecuteNonQuery();
            }
        }

        public void DeleteNotesCash(IDbConnection cn, int itemid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "DELETE from YZAppNotesCash WHERE ItemID=:ItemID";
                cmd.Parameters.Add(":ItemID", OracleDbType.Int32).Value = itemid;

                cmd.ExecuteNonQuery();
            }
        }
    }
}
