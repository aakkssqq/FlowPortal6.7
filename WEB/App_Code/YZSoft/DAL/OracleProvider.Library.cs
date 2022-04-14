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

namespace YZSoft.Web.DAL
{
    partial class OracleProvider
    {
        public IDataReader GetLibraries(IDbConnection cn, string libType, string filter, string sort)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                //查询条件
                filter = this.CombinCond(filter, "LibType = :LibType");
                cmd.Parameters.Add(":LibType", OracleDbType.NVarchar2).Value = libType;

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
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "SELECT * FROM YZAppLibrary WHERE LibID=:LibID";
                cmd.Parameters.Add(":LibID", OracleDbType.Int32).Value = libid;
                return cmd.ExecuteReader();
            }
        }

        public void Insert(IDbConnection cn, YZSoft.Library.Library lib)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "SELECT BPMSEQ_YZAPPLIBRARY.NEXTVAL FROM DUAL";
                lib.LibID = System.Convert.ToInt32(cmd.ExecuteScalar());

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO YZAppLibrary(");
                sb.Append("LibID,");
                sb.Append("LibType,");
                sb.Append("Name,");
                sb.Append("\"DESC\",");
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
                sb.Append(":LibID,");
                sb.Append(":LibType,");
                sb.Append(":Name,");
                sb.Append(":Desc1,");
                sb.Append(":FolderID,");
                sb.Append(":DocumentFolderID,");
                sb.Append(":Owner,");
                sb.Append(":CreateAt,");
                sb.Append(":ImageFileID,");
                sb.Append(":OrderIndex,");
                sb.Append(":Deleted,");
                sb.Append(":DeleteBy,");
                sb.Append(":DeleteAt)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":LibID", OracleDbType.Int32).Value = lib.LibID;
                cmd.Parameters.Add(":LibType", OracleDbType.NVarchar2).Value = this.Convert(lib.LibType, false);
                cmd.Parameters.Add(":Name", OracleDbType.NVarchar2).Value = this.Convert(lib.Name, false);
                cmd.Parameters.Add(":Desc1", OracleDbType.NVarchar2).Value = this.Convert(lib.Desc, true);
                cmd.Parameters.Add(":FolderID", OracleDbType.Int32).Value = this.Convert(lib.FolderID, true);
                cmd.Parameters.Add(":DocumentFolderID", OracleDbType.Int32).Value = this.Convert(lib.DocumentFolderID, true);
                cmd.Parameters.Add(":Owner", OracleDbType.NVarchar2).Value = this.Convert(lib.Owner, true);
                cmd.Parameters.Add(":CreateAt", OracleDbType.Date).Value = this.Convert(lib.CreateAt, true);
                cmd.Parameters.Add(":ImageFileID", OracleDbType.NVarchar2).Value = this.Convert(lib.ImageFileID, true);
                cmd.Parameters.Add(":OrderIndex", OracleDbType.Int32).Value = this.Convert(lib.OrderIndex, false);
                cmd.Parameters.Add(":Deleted", OracleDbType.Int16).Value = this.ConvertBoolToInt16(lib.Deleted);
                cmd.Parameters.Add(":DeleteBy", OracleDbType.NVarchar2).Value = this.Convert(lib.DeleteBy, true);
                cmd.Parameters.Add(":DeleteAt", OracleDbType.Date).Value = this.Convert(lib.DeleteAt, true);

                cmd.ExecuteNonQuery();
            }
        }

        public void Update(IDbConnection cn, YZSoft.Library.Library lib)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZAppLibrary SET ");
                sb.Append("LibType=:LibType,");
                sb.Append("Name=:Name,");
                sb.Append("\"DESC\"=:Desc1,");
                sb.Append("FolderID=:FolderID,");
                sb.Append("DocumentFolderID=:DocumentFolderID,");
                sb.Append("Owner=:Owner,");
                sb.Append("CreateAt=:CreateAt,");
                sb.Append("ImageFileID=:ImageFileID,");
                sb.Append("Deleted=:Deleted,");
                sb.Append("DeleteBy=:DeleteBy,");
                sb.Append("DeleteAt=:DeleteAt ");
                sb.Append("WHERE LibID=:LibID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":LibType", OracleDbType.NVarchar2).Value = this.Convert(lib.LibType, false);
                cmd.Parameters.Add(":Name", OracleDbType.NVarchar2).Value = this.Convert(lib.Name, false);
                cmd.Parameters.Add(":Desc1", OracleDbType.NVarchar2).Value = this.Convert(lib.Desc, true);
                cmd.Parameters.Add(":FolderID", OracleDbType.Int32).Value = this.Convert(lib.FolderID, true);
                cmd.Parameters.Add(":DocumentFolderID", OracleDbType.Int32).Value = this.Convert(lib.DocumentFolderID, true);
                cmd.Parameters.Add(":Owner", OracleDbType.NVarchar2).Value = this.Convert(lib.Owner, true);
                cmd.Parameters.Add(":CreateAt", OracleDbType.Date).Value = this.Convert(lib.CreateAt, true);
                cmd.Parameters.Add(":ImageFileID", OracleDbType.NVarchar2).Value = this.Convert(lib.ImageFileID, true);
                cmd.Parameters.Add(":Deleted", OracleDbType.Int16).Value = this.ConvertBoolToInt16(lib.Deleted);
                cmd.Parameters.Add(":DeleteBy", OracleDbType.NVarchar2).Value = this.Convert(lib.DeleteBy, true);
                cmd.Parameters.Add(":DeleteAt", OracleDbType.Date).Value = this.Convert(lib.DeleteAt, true);
                cmd.Parameters.Add(":LibID", OracleDbType.Int32).Value = lib.LibID;

                cmd.ExecuteNonQuery();
            }
        }

        public void UpdateOrderIndex(IDbConnection cn, YZSoft.Library.Library lib)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZAppLibrary SET ");
                sb.Append("OrderIndex=:OrderIndex ");
                sb.Append("WHERE LibID=:LibID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":OrderIndex", OracleDbType.Int32).Value = this.Convert(lib.OrderIndex, true);
                cmd.Parameters.Add(":LibID", OracleDbType.Int32).Value = lib.LibID;

                cmd.ExecuteNonQuery();
            }
        }
    }
}
