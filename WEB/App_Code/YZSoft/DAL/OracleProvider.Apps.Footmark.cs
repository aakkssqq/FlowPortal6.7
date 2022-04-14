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
        public int GetNotesFootmarkSignCount(IDbConnection cn, string account, DateTime date)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "SELECT count(*) FROM YZAppNotesFootmark WHERE Account=:Account AND \"DATE\" = :PM_Date";
                cmd.Parameters.Add(":Account", OracleDbType.NVarchar2).Value = account;
                cmd.Parameters.Add(":PM_Date", OracleDbType.Date).Value = date;

                return System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public IDataReader GetNotesFootmarks(IDbConnection cn, BPMObjectNameCollection accounts, DateTime date)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = String.Format("SELECT * FROM YZAppNotesFootmark WHERE \"DATE\" = :PM_Date AND Account IN({0}) ORDER BY ItemID DESC", this.GetDbInList(accounts));
                cmd.Parameters.Add(":PM_Date", OracleDbType.Date).Value = date;

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetNotesFootmarks(IDbConnection cn, string account, int year, int month, string filterext, string sort, int startRowIndex, int rows)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                //查询条件
                string filter = null;

                filter = this.CombinCond(filter, "Account = :Account");
                cmd.Parameters.Add(":Account", OracleDbType.NVarchar2).Value = account;

                filter = this.CombinCond(filter, "extract(year from time) = :Year");
                cmd.Parameters.Add(":Year", OracleDbType.Int32).Value = year;

                filter = this.CombinCond(filter, "extract(month from time) = :Month");
                cmd.Parameters.Add(":Month", OracleDbType.Int32).Value = month;

                filter = this.CombinCond(filter, filterext);

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "ItemID DESC";

                this.GeneratePageCommand(cmd, "SELECT * FROM YZAppNotesFootmark" + filter, sort, startRowIndex, rows);

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetNotesFootmark(IDbConnection cn, int itemid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "SELECT * FROM YZAppNotesFootmark WHERE ItemID=:ItemID";
                cmd.Parameters.Add(":ItemID", OracleDbType.Int32).Value = itemid;
                return cmd.ExecuteReader();
            }
        }

        public void Insert(IDbConnection cn, Footmark footmark)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "SELECT BPMSEQ_YZAPPNOTESFOOTMARK.NEXTVAL FROM DUAL";
                footmark.ItemID = System.Convert.ToInt32(cmd.ExecuteScalar());

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO YZAppNotesFootmark(");
                sb.Append("ItemID,");
                sb.Append("Account,");
                sb.Append("Time,");
                sb.Append("Rawlat,");
                sb.Append("Rawlon,");
                sb.Append("Lat,");
                sb.Append("Lon,");
                sb.Append("LocId,");
                sb.Append("LocName,");
                sb.Append("LocAddress,");
                sb.Append("Contact,");
                sb.Append("Comments,");
                sb.Append("Attachments,");
                sb.Append("\"DATE\") ");
                sb.Append("VALUES(");
                sb.Append(":ItemID,");
                sb.Append(":Account,");
                sb.Append(":Time,");
                sb.Append(":Rawlat,");
                sb.Append(":Rawlon,");
                sb.Append(":Lat,");
                sb.Append(":Lon,");
                sb.Append(":LocId,");
                sb.Append(":LocName,");
                sb.Append(":LocAddress,");
                sb.Append(":Contact,");
                sb.Append(":Comments,");
                sb.Append(":Attachments,");
                sb.Append(":PM_Date)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":ItemID", OracleDbType.Int32).Value = footmark.ItemID;
                cmd.Parameters.Add(":Account", OracleDbType.NVarchar2).Value = this.Convert(footmark.Account, false);
                cmd.Parameters.Add(":Time", OracleDbType.Date).Value = this.Convert(footmark.Time, false);
                cmd.Parameters.Add(":Rawlat", OracleDbType.Decimal).Value = footmark.Position.RawLat;
                cmd.Parameters.Add(":Rawlon", OracleDbType.Decimal).Value = footmark.Position.RawLon;
                cmd.Parameters.Add(":Lat", OracleDbType.Decimal).Value = footmark.Position.Lat;
                cmd.Parameters.Add(":Lon", OracleDbType.Decimal).Value = footmark.Position.Lon;
                cmd.Parameters.Add(":LocId", OracleDbType.NVarchar2).Value = this.Convert(footmark.Position.Id, false);
                cmd.Parameters.Add(":LocName", OracleDbType.NVarchar2).Value = this.Convert(footmark.Position.Name, false);
                cmd.Parameters.Add(":LocAddress", OracleDbType.NVarchar2).Value = this.Convert(footmark.Position.Address, false);
                cmd.Parameters.Add(":Contact", OracleDbType.NVarchar2).Value = this.Convert(footmark.Contact, true);
                cmd.Parameters.Add(":Comments", OracleDbType.NVarchar2).Value = this.Convert(footmark.Comments, true);
                cmd.Parameters.Add(":Attachments", OracleDbType.NVarchar2).Value = this.Convert(footmark.Attachments, true);
                cmd.Parameters.Add(":PM_Date", OracleDbType.Date).Value = new DateTime(footmark.Time.Year, footmark.Time.Month, footmark.Time.Day);

                cmd.ExecuteNonQuery();
            }
        }

        public void Update(IDbConnection cn, Footmark footmark)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                //StringBuilder sb = new StringBuilder();
                //sb.Append("UPDATE YZAppNotesFootmark SET ");
                //sb.Append("Account=:Account,");
                //sb.Append("FileID=:FileID,");
                //sb.Append("Duration=:Duration,");
                //sb.Append("Comments=:Comments,");
                //sb.Append("CreateAt=:CreateAt ");
                //sb.Append("WHERE ItemID=:ItemID");
                //cmd.CommandText = sb.ToString();

                //cmd.Parameters.Add(":Account", OracleDbType.NVarchar2).Value = this.Convert(footmark.Account, false);
                //cmd.Parameters.Add(":FileID", OracleDbType.NVarchar2).Value = this.Convert(footmark.FileID, false);
                //cmd.Parameters.Add(":Duration", OracleDbType.Int32).Value = footmark.Duration;
                //cmd.Parameters.Add(":Comments", OracleDbType.NVarchar2).Value = this.Convert(footmark.Comments, true);
                //cmd.Parameters.Add(":CreateAt", OracleDbType.Date).Value = this.Convert(footmark.CreateAt, false);
                //cmd.Parameters.Add(":ItemID", OracleDbType.Int32).Value = footmark.ItemID;

                cmd.ExecuteNonQuery();
            }
        }

        public void DeleteNotesFootmark(IDbConnection cn, int itemid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "DELETE from YZAppNotesFootmark WHERE ItemID=:ItemID";
                cmd.Parameters.Add(":ItemID", OracleDbType.Int32).Value = itemid;

                cmd.ExecuteNonQuery();
            }
        }
    }
}
