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
        public IDataReader GetLibraries(IDbConnection cn, string libType, string filter, string sort)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                //查询条件
                filter = this.CombinCond(filter, "LibType = @LibType");
                cmd.Parameters.Add("@LibType", SqlDbType.NVarChar).Value = libType;

                filter = this.CombinCond(filter, "Deleted <> 1");

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "OrderIndex ASC";

                cmd.CommandText = String.Format("SELECT * FROM YZAppLibrary {0} Order By {1}", filter, sort);

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetLibrary(IDbConnection cn, int libid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SELECT * FROM YZAppLibrary WHERE LibID=@LibID";
                cmd.Parameters.Add("@LibID", SqlDbType.Int).Value = libid;
                return cmd.ExecuteReader();
            }
        }

        public void Insert(IDbConnection cn, YZSoft.Library.Library lib)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("SET NOCOUNT ON;");
                sb.Append("INSERT INTO YZAppLibrary(");
                sb.Append("LibType,");
                sb.Append("Name,");
                sb.Append("[Desc],");
                sb.Append("FolderID,");
                sb.Append("DocumentFolderID,");
                sb.Append("Owner,");
                sb.Append("CreateAt,");
                sb.Append("ImageFileID,");
                sb.Append("OrderIndex,");
                sb.Append("Deleted,");
                sb.Append("DeleteBy,");
                sb.Append("DeleteAt) ");
                sb.Append("VALUES(");
                sb.Append("@LibType,");
                sb.Append("@Name,");
                sb.Append("@Desc,");
                sb.Append("@FolderID,");
                sb.Append("@DocumentFolderID,");
                sb.Append("@Owner,");
                sb.Append("@CreateAt,");
                sb.Append("@ImageFileID,");
                sb.Append("@OrderIndex,");
                sb.Append("@Deleted,");
                sb.Append("@DeleteBy,");
                sb.Append("@DeleteAt);");
                sb.Append("SELECT SCOPE_IDENTITY()");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@LibType", SqlDbType.NVarChar).Value = this.Convert(lib.LibType, false);
                cmd.Parameters.Add("@Name", SqlDbType.NVarChar).Value = this.Convert(lib.Name, false);
                cmd.Parameters.Add("@Desc", SqlDbType.NVarChar).Value = this.Convert(lib.Desc, true);
                cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = this.Convert(lib.FolderID, true);
                cmd.Parameters.Add("@DocumentFolderID", SqlDbType.Int).Value = this.Convert(lib.DocumentFolderID, true);
                cmd.Parameters.Add("@Owner", SqlDbType.NVarChar).Value = this.Convert(lib.Owner, true);
                cmd.Parameters.Add("@CreateAt", SqlDbType.DateTime).Value = this.Convert(lib.CreateAt, true);
                cmd.Parameters.Add("@ImageFileID", SqlDbType.NVarChar).Value = this.Convert(lib.ImageFileID, true);
                cmd.Parameters.Add("@OrderIndex", SqlDbType.Int).Value = this.Convert(lib.OrderIndex, false);
                cmd.Parameters.Add("@Deleted", SqlDbType.Bit).Value = lib.Deleted;
                cmd.Parameters.Add("@DeleteBy", SqlDbType.NVarChar).Value = this.Convert(lib.DeleteBy, true);
                cmd.Parameters.Add("@DeleteAt", SqlDbType.DateTime).Value = this.Convert(lib.DeleteAt, true);

                lib.LibID = System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public void Update(IDbConnection cn, YZSoft.Library.Library lib)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZAppLibrary SET ");
                sb.Append("LibType=@LibType,");
                sb.Append("Name=@Name,");
                sb.Append("[Desc]=@Desc,");
                sb.Append("FolderID=@FolderID,");
                sb.Append("DocumentFolderID=@DocumentFolderID,");
                sb.Append("Owner=@Owner,");
                sb.Append("CreateAt=@CreateAt,");
                sb.Append("ImageFileID=@ImageFileID,");
                sb.Append("Deleted=@Deleted,");
                sb.Append("DeleteBy=@DeleteBy,");
                sb.Append("DeleteAt=@DeleteAt ");
                sb.Append("WHERE LibID=@LibID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@LibType", SqlDbType.NVarChar).Value = this.Convert(lib.LibType,false);
                cmd.Parameters.Add("@Name", SqlDbType.NVarChar).Value = this.Convert(lib.Name, false);
                cmd.Parameters.Add("@Desc", SqlDbType.NVarChar).Value = this.Convert(lib.Desc, true);
                cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = this.Convert(lib.FolderID, true);
                cmd.Parameters.Add("@DocumentFolderID", SqlDbType.Int).Value = this.Convert(lib.DocumentFolderID, true);
                cmd.Parameters.Add("@Owner", SqlDbType.NVarChar).Value = this.Convert(lib.Owner,true);
                cmd.Parameters.Add("@CreateAt", SqlDbType.DateTime).Value = this.Convert(lib.CreateAt, true);
                cmd.Parameters.Add("@ImageFileID", SqlDbType.NVarChar).Value = this.Convert(lib.ImageFileID, true);
                cmd.Parameters.Add("@Deleted", SqlDbType.Bit).Value = lib.Deleted;
                cmd.Parameters.Add("@DeleteBy", SqlDbType.NVarChar).Value = this.Convert(lib.DeleteBy, true);
                cmd.Parameters.Add("@DeleteAt", SqlDbType.DateTime).Value = this.Convert(lib.DeleteAt, true);
                cmd.Parameters.Add("@LibID", SqlDbType.Int).Value = lib.LibID;

                cmd.ExecuteNonQuery();
            }
        }

        public void UpdateOrderIndex(IDbConnection cn, YZSoft.Library.Library lib)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZAppLibrary SET ");
                sb.Append("OrderIndex=@OrderIndex ");
                sb.Append("WHERE LibID=@LibID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@OrderIndex", SqlDbType.Int).Value = this.Convert(lib.OrderIndex, true);
                cmd.Parameters.Add("@LibID", SqlDbType.Int).Value = lib.LibID;

                cmd.ExecuteNonQuery();
            }
        }
    }
}
