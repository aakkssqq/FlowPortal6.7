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
        public int GetNotesFootmarkSignCount(IDbConnection cn, string account, DateTime date)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "SELECT count(*) FROM YZAppNotesFootmark WHERE Account=@Account AND Date = @Date";
                cmd.Parameters.Add("@Account", SqlDbType.NVarChar).Value = account;
                cmd.Parameters.Add("@Date", SqlDbType.DateTime).Value = date;

                return System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public IDataReader GetNotesFootmarks(IDbConnection cn, BPMObjectNameCollection accounts, DateTime date)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = String.Format("SELECT * FROM YZAppNotesFootmark WHERE Date = @Date AND Account IN({0}) ORDER BY ItemID DESC", this.GetDbInList(accounts));
                cmd.Parameters.Add("@Date", SqlDbType.DateTime).Value = date;

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetNotesFootmarks(IDbConnection cn, string account, int year, int month, string filterext, string sort, int startRowIndex, int rows)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                //查询条件
                string filter = null;

                filter = this.CombinCond(filter, "Account = @Account");
                cmd.Parameters.Add("@Account", SqlDbType.NVarChar).Value = account;

                filter = this.CombinCond(filter, "year(time) = @Year");
                cmd.Parameters.Add("@Year", SqlDbType.Int).Value = year;

                filter = this.CombinCond(filter, "month(time) = @Month");
                cmd.Parameters.Add("@Month", SqlDbType.Int).Value = month;

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
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "SELECT * FROM YZAppNotesFootmark WHERE ItemID=@ItemID";
                cmd.Parameters.Add("@ItemID", SqlDbType.Int).Value = itemid;
                return cmd.ExecuteReader();
            }
        }

        public void Insert(IDbConnection cn, Footmark footmark)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("SET NOCOUNT ON;");
                sb.Append("INSERT INTO YZAppNotesFootmark(");
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
                sb.Append("Date) ");
                sb.Append("VALUES(");
                sb.Append("@Account,");
                sb.Append("@Time,");
                sb.Append("@Rawlat,");
                sb.Append("@Rawlon,");
                sb.Append("@Lat,");
                sb.Append("@Lon,");
                sb.Append("@LocId,");
                sb.Append("@LocName,");
                sb.Append("@LocAddress,");
                sb.Append("@Contact,");
                sb.Append("@Comments,");
                sb.Append("@Attachments,");
                sb.Append("@Date);");
                sb.Append("SELECT SCOPE_IDENTITY()");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@Account", SqlDbType.NVarChar).Value = this.Convert(footmark.Account, false);
                cmd.Parameters.Add("@Time", SqlDbType.DateTime).Value = this.Convert(footmark.Time, false);
                cmd.Parameters.Add("@Rawlat", SqlDbType.Float).Value = footmark.Position.RawLat;
                cmd.Parameters.Add("@Rawlon", SqlDbType.Float).Value = footmark.Position.RawLon;
                cmd.Parameters.Add("@Lat", SqlDbType.Float).Value = footmark.Position.Lat;
                cmd.Parameters.Add("@Lon", SqlDbType.Float).Value = footmark.Position.Lon;
                cmd.Parameters.Add("@LocId", SqlDbType.NVarChar).Value = this.Convert(footmark.Position.Id,false);
                cmd.Parameters.Add("@LocName", SqlDbType.NVarChar).Value = this.Convert(footmark.Position.Name,false);
                cmd.Parameters.Add("@LocAddress", SqlDbType.NVarChar).Value = this.Convert(footmark.Position.Address, false);
                cmd.Parameters.Add("@Contact", SqlDbType.NVarChar).Value = this.Convert(footmark.Contact,true);
                cmd.Parameters.Add("@Comments", SqlDbType.NVarChar).Value = this.Convert(footmark.Comments, true);
                cmd.Parameters.Add("@Attachments", SqlDbType.NVarChar).Value = this.Convert(footmark.Attachments, true);
                cmd.Parameters.Add("@Date", SqlDbType.DateTime).Value = new DateTime(footmark.Time.Year,footmark.Time.Month,footmark.Time.Day);

                footmark.ItemID = System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public void Update(IDbConnection cn, Footmark footmark)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                //StringBuilder sb = new StringBuilder();
                //sb.Append("UPDATE YZAppNotesFootmark SET ");
                //sb.Append("Account=@Account,");
                //sb.Append("FileID=@FileID,");
                //sb.Append("Duration=@Duration,");
                //sb.Append("Comments=@Comments,");
                //sb.Append("CreateAt=@CreateAt ");
                //sb.Append("WHERE ItemID=@ItemID");
                //cmd.CommandText = sb.ToString();

                //cmd.Parameters.Add("@Account", SqlDbType.NVarChar).Value = this.Convert(footmark.Account, false);
                //cmd.Parameters.Add("@FileID", SqlDbType.NVarChar).Value = this.Convert(footmark.FileID, false);
                //cmd.Parameters.Add("@Duration", SqlDbType.Int).Value = footmark.Duration;
                //cmd.Parameters.Add("@Comments", SqlDbType.NVarChar).Value = this.Convert(footmark.Comments, true);
                //cmd.Parameters.Add("@CreateAt", SqlDbType.DateTime).Value = this.Convert(footmark.CreateAt, false);
                //cmd.Parameters.Add("@ItemID", SqlDbType.Int).Value = footmark.ItemID;

                cmd.ExecuteNonQuery();
            }
        }

        public void DeleteNotesFootmark(IDbConnection cn, int itemid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                cmd.CommandText = "DELETE from YZAppNotesFootmark WHERE ItemID=@ItemID";
                cmd.Parameters.Add("@ItemID", SqlDbType.Int).Value = itemid;

                cmd.ExecuteNonQuery();
            }
        }
    }
}
