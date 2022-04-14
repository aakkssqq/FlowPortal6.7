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

namespace YZSoft.Web.DAL
{
    partial class SqlServerProvider
    {
        public IDataReader GetFavorites(IDbConnection cn, string uid, YZResourceType resType)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                cmd.CommandText = "SELECT * FROM YZSysFavorites WHERE uid=@uid AND resType=@resType ORDER BY orderIndex ASC";

                cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = this.Convert(uid, false);
                cmd.Parameters.Add("@resType", SqlDbType.NVarChar).Value = resType.ToString();

                return cmd.ExecuteReader();
            }
        }

        public IDataReader HasFavorited(IDbConnection cn, string uid, YZResourceType resType, string resId)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SELECT count(*) FROM YZSysFavorites WHERE uid=@uid AND resType=@resType AND resId=@resId";
                cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = this.Convert(uid, false);
                cmd.Parameters.Add("@resType", SqlDbType.NVarChar).Value = resType.ToString();
                cmd.Parameters.Add("@resId", SqlDbType.NVarChar).Value = this.Convert(resId, false);
                return cmd.ExecuteReader();
            }
        }

        public void DeleteFavorite(IDbConnection cn, string uid, YZResourceType resType, string resId)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"DELETE FROM YZSysFavorites WHERE uid=@uid AND resType=@resType AND resId=@resId";
                cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = this.Convert(uid, false);
                cmd.Parameters.Add("@resType", SqlDbType.NVarChar).Value = resType.ToString();
                cmd.Parameters.Add("@resId", SqlDbType.NVarChar).Value = this.Convert(resId, false);
                cmd.ExecuteNonQuery();
            }
        }

        public void Insert(IDbConnection cn, Favorite favorite)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO YZSysFavorites(");
                sb.Append("uid,");
                sb.Append("resType,");
                sb.Append("resId,");
                sb.Append("date,");
                sb.Append("orderIndex) ");
                sb.Append("VALUES(");
                sb.Append("@uid,");
                sb.Append("@resType,");
                sb.Append("@resId,");
                sb.Append("@date,");
                sb.Append("@orderIndex)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = this.Convert(favorite.uid, false);
                cmd.Parameters.Add("@resType", SqlDbType.NVarChar).Value = favorite.resType.ToString();
                cmd.Parameters.Add("@resId", SqlDbType.NVarChar).Value = this.Convert(favorite.resId, false);
                cmd.Parameters.Add("@date", SqlDbType.DateTime).Value = this.Convert(favorite.date, true);
                cmd.Parameters.Add("@orderIndex", SqlDbType.Int).Value = favorite.orderIndex;

                cmd.ExecuteNonQuery();
            }
        }

        public void UpdateOrderIndex(IDbConnection cn, Favorite favorite)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "UPDATE YZSysFavorites SET orderIndex=@orderIndex WHERE  uid=@uid AND resType=@resType AND resId=@resId";
                cmd.Parameters.Add("@orderIndex", SqlDbType.Int).Value = favorite.orderIndex;
                cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = this.Convert(favorite.uid, false);
                cmd.Parameters.Add("@resType", SqlDbType.NVarChar).Value = favorite.resType.ToString();
                cmd.Parameters.Add("@resId", SqlDbType.NVarChar).Value = this.Convert(favorite.resId, false);

                cmd.ExecuteNonQuery();
            }
        }
    }
}
