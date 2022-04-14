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
using YZSoft.Web.Social;

namespace YZSoft.Web.DAL
{
    partial class OracleProvider
    {
        public IDataReader GetFavorites(IDbConnection cn, string uid, YZResourceType resType)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "SELECT * FROM YZSysFavorites WHERE " + "\"UID\"" + @"=:PM_UID AND resType=:resType ORDER BY orderIndex ASC";

                cmd.Parameters.Add(":PM_UID", OracleDbType.NVarchar2).Value = this.Convert(uid, false);
                cmd.Parameters.Add(":resType", OracleDbType.NVarchar2).Value = resType.ToString();

                return cmd.ExecuteReader();
            }
        }

        public IDataReader HasFavorited(IDbConnection cn, string uid, YZResourceType resType, string resId)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = @"SELECT count(*) FROM YZSysFavorites WHERE " + "\"UID\"" + @"=:PM_UID AND resType=:resType AND resId=:resId";
                cmd.Parameters.Add(":PM_UID", OracleDbType.NVarchar2).Value = this.Convert(uid, false);
                cmd.Parameters.Add(":resType", OracleDbType.NVarchar2).Value = resType.ToString();
                cmd.Parameters.Add(":resId", OracleDbType.NVarchar2).Value = this.Convert(resId, false);
                return cmd.ExecuteReader();
            }
        }

        public void DeleteFavorite(IDbConnection cn, string uid, YZResourceType resType, string resId)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = @"DELETE FROM YZSysFavorites WHERE " + "\"UID\"" + @"=:PM_UID AND resType=:resType AND resId=:resId";
                cmd.Parameters.Add(":PM_UID", OracleDbType.NVarchar2).Value = this.Convert(uid, false);
                cmd.Parameters.Add(":resType", OracleDbType.NVarchar2).Value = resType.ToString();
                cmd.Parameters.Add(":resId", OracleDbType.NVarchar2).Value = this.Convert(resId, false);
                cmd.ExecuteNonQuery();
            }
        }

        public void Insert(IDbConnection cn, Favorite favorite)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO YZSysFavorites(");
                sb.Append("\"UID\",");
                sb.Append("resType,");
                sb.Append("resId,");
                sb.Append("\"DATE\",");
                sb.Append("orderIndex) ");
                sb.Append("VALUES(");
                sb.Append(":PM_UID,");
                sb.Append(":resType,");
                sb.Append(":resId,");
                sb.Append(":PM_DATE,");
                sb.Append(":orderIndex)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":PM_UID", OracleDbType.NVarchar2).Value = this.Convert(favorite.uid, false);
                cmd.Parameters.Add(":resType", OracleDbType.NVarchar2).Value = favorite.resType.ToString();
                cmd.Parameters.Add(":resId", OracleDbType.NVarchar2).Value = this.Convert(favorite.resId, false);
                cmd.Parameters.Add(":PM_DATE", OracleDbType.Date).Value = this.Convert(favorite.date, true);
                cmd.Parameters.Add(":orderIndex", OracleDbType.Int32).Value = favorite.orderIndex;

                cmd.ExecuteNonQuery();
            }
        }

        public void UpdateOrderIndex(IDbConnection cn, Favorite favorite)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "UPDATE YZSysFavorites SET orderIndex=:orderIndex WHERE " + "\"UID\"" + @"=:PM_UID AND resType=:resType AND resId=:resId";
                cmd.Parameters.Add(":orderIndex", OracleDbType.Int32).Value = favorite.orderIndex;
                cmd.Parameters.Add(":PM_UID", OracleDbType.NVarchar2).Value = this.Convert(favorite.uid, false);
                cmd.Parameters.Add(":resType", OracleDbType.NVarchar2).Value = favorite.resType.ToString();
                cmd.Parameters.Add(":resId", OracleDbType.NVarchar2).Value = this.Convert(favorite.resId, false);

                cmd.ExecuteNonQuery();
            }
        }
    }
}
