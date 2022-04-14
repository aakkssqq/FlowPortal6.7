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
        public IDataReader GetFolders(IDbConnection cn, int parentFolderID, string filter, string sort)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                //查询条件
                filter = this.CombinCond(filter, "Deleted <> 1 AND ParentID = @ParentID");
                cmd.Parameters.Add("@ParentID", SqlDbType.Int).Value = parentFolderID;

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "OrderIndex ASC";

                //Query
                string query = @"SELECT * FROM YZAppFolders {0} ORDER BY {1}";

                cmd.CommandText = String.Format(query, filter, sort);

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetAllChildFolders(IDbConnection cn, int parentFolderID, string filter, string sort)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                //查询条件
                filter = this.CombinCond(filter, "Deleted <> 1 AND RootID = @RootID");
                cmd.Parameters.Add("@RootID", SqlDbType.Int).Value = parentFolderID;

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "OrderIndex ASC";

                //Query
                string query = @"SELECT * FROM YZAppFolders {0} ORDER BY {1}";

                cmd.CommandText = String.Format(query, filter, sort);

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetFiles(IDbConnection cn, int parentFolderID, string filter, string sort, int top)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                //查询条件
                filter = this.CombinCond(filter, "Deleted <> 1 AND FolderID = @FolderID");
                cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = parentFolderID;

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "OrderIndex ASC";

                //Query
                string query = @"SELECT {0} * FROM YZAppFolderFiles {1} ORDER BY {2}";

                cmd.CommandText = String.Format(query,
                    top == -1 ? null : "TOP " + top.ToString(),
                    filter, sort);

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetFiles(IDbConnection cn, int[] folderids, string filter, string sort, int top)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                //查询条件
                filter = this.CombinCond(filter, String.Format("Deleted <> 1 AND FolderID IN ({0})",this.GetDbInList(folderids,-1)));

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "OrderIndex ASC";

                //Query
                string query = @"SELECT {0} * FROM YZAppFolderFiles {1} ORDER BY {2}";

                cmd.CommandText = String.Format(query,
                    top == -1 ? null : "TOP " + top.ToString(),
                    filter, sort);

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetFileByID(IDbConnection cn, int fileid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SELECT * FROM YZAppFolderFiles WHERE ID=@ID";
                cmd.Parameters.Add("@ID", SqlDbType.Int).Value = fileid;
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetFiles(IDbConnection cn, string fileid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "SELECT * FROM YZAppFolderFiles WHERE FileID=@FileID";
                cmd.Parameters.Add("@FileID", SqlDbType.NVarChar).Value = fileid;

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetFolderByID(IDbConnection cn, int folderid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SELECT * FROM YZAppFolders WHERE FolderID=@FolderID";
                cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = folderid;
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetDeletedObjects(IDbConnection cn, BPMObjectNameCollection libTypes, string deletedBy)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                //查询条件
                string libFilter = null;
                for (int i = 0; i < libTypes.Count; i++)
                {
                    string paramName = "@LibType" + i.ToString();
                    string libType = libTypes[i];

                    libFilter = this.CombinCondOR(libFilter, String.Format("LibType = {0}", paramName));
                    cmd.Parameters.Add(paramName, SqlDbType.NVarChar).Value = libType;
                }

                if (!String.IsNullOrEmpty(libFilter))
                    libFilter = " WHERE " + libFilter;

                cmd.CommandText = String.Format(@"
WITH A AS(
	SELECT * FROM YZV_RootFolders {0}
),
FA AS(
	SELECT * FROM YZAppFolderFiles WHERE Recyclebin=1 AND (@DeleteBy IS NULL OR DeleteBy=@DeleteBy)
),
FB AS(
	SELECT YZAppFolders.RootID,FA.* FROM FA,YZAppFolders WHERE FA.FolderID = YZAppFolders.FolderID
),
FC AS(
	SELECT A.*,FB.* FROM A,FB WHERE A.RootFolderID=FB.RootID
),
FD AS(
	SELECT FC.LibID,FC.LibType,FC.LibName,FC.LibDesc,FC.DeleteBy,FC.DeleteAt,dbo.YZDirectoryGetPath(FC.FolderID) as [Path],null as FolderID,YZAppAttachment.[Name],FC.ID,FC.FileID,YZAppAttachment.Ext,YZAppAttachment.[Size] FROM FC,YZAppAttachment WHERE FC.FileID=YZAppAttachment.FileID
),
FDA AS(
	SELECT * FROM YZAppFolders WHERE Recyclebin=1 AND (@DeleteBy IS NULL OR DeleteBy=@DeleteBy)
),
FDB AS(
	SELECT A.LibID,A.LibType,A.LibName,A.LibDesc,FDA.DeleteBy,FDA.DeleteAt,dbo.YZDirectoryGetPath(FDA.ParentID) as [Path],FDA.FolderID,FDA.[Name],null as ID,null as FileID,null as Ext,null as [Size] FROM A,FDA WHERE A.RootFolderID=FDA.RootID
),
Z AS(
	SELECT * FROM FD UNION SELECT * FROM FDB
)
SELECT * FROM Z Order BY DeleteAt desc
", libFilter);

                //查询条件
                cmd.Parameters.Add("@DeleteBy", SqlDbType.NVarChar).Value = this.Convert(deletedBy, true);

                return cmd.ExecuteReader();
            }
        }

        public void Insert(IDbConnection cn, YZSoft.FileSystem.File file)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("SET NOCOUNT ON;");
                sb.Append("INSERT INTO YZAppFolderFiles(");
                sb.Append("FolderID,");
                sb.Append("FileID,");
                sb.Append("AddBy,");
                sb.Append("AddAt,");
                sb.Append("Comments,");
                sb.Append("OrderIndex,");
                sb.Append("Flag) ");
                sb.Append("VALUES(");
                sb.Append("@FolderID,");
                sb.Append("@FileID,");
                sb.Append("@AddBy,");
                sb.Append("@AddAt,");
                sb.Append("@Comments,");
                sb.Append("@OrderIndex,");
                sb.Append("@Flag);");
                sb.Append("SELECT SCOPE_IDENTITY()");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = this.Convert(file.FolderID, false);
                cmd.Parameters.Add("@FileID", SqlDbType.NVarChar).Value = this.Convert(file.FileID, false);
                cmd.Parameters.Add("@AddBy", SqlDbType.NVarChar).Value = this.Convert(file.AddBy, true);
                cmd.Parameters.Add("@AddAt", SqlDbType.DateTime).Value = this.Convert(file.AddAt, true);
                cmd.Parameters.Add("@Comments", SqlDbType.NVarChar).Value = this.Convert(file.Comments, true);
                cmd.Parameters.Add("@OrderIndex", SqlDbType.Int).Value = this.Convert(file.OrderIndex, false);
                cmd.Parameters.Add("@Flag", SqlDbType.NVarChar).Value = this.Convert(file.Flag, true);

                file.ID = System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public void Insert(IDbConnection cn, YZSoft.FileSystem.Folder folder)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("SET NOCOUNT ON;");
                sb.Append("INSERT INTO YZAppFolders(");
                sb.Append("RootID,");
                sb.Append("ParentID,");
                sb.Append("FolderType,");
                sb.Append("Name,");
                sb.Append("[Desc],");
                sb.Append("Owner,");
                sb.Append("CreateAt,");
                sb.Append("OrderIndex) ");
                sb.Append("VALUES(");
                sb.Append("@RootID,");
                sb.Append("@ParentID,");
                sb.Append("@FolderType,");
                sb.Append("@Name,");
                sb.Append("@Desc,");
                sb.Append("@Owner,");
                sb.Append("@CreateAt,");
                sb.Append("@OrderIndex);");
                sb.Append("SELECT SCOPE_IDENTITY()");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@RootID", SqlDbType.Int).Value = this.Convert(folder.RootID, true);
                cmd.Parameters.Add("@ParentID", SqlDbType.Int).Value = this.Convert(folder.ParentID, true);
                cmd.Parameters.Add("@FolderType", SqlDbType.NVarChar).Value = this.Convert(folder.FolderType, true);
                cmd.Parameters.Add("@Name", SqlDbType.NVarChar).Value = this.Convert(folder.Name, false);
                cmd.Parameters.Add("@Desc", SqlDbType.NVarChar).Value = this.Convert(folder.Desc, true);
                cmd.Parameters.Add("@Owner", SqlDbType.NVarChar).Value = this.Convert(folder.Owner, true);
                cmd.Parameters.Add("@CreateAt", SqlDbType.DateTime).Value = this.Convert(folder.CreateAt, false);
                cmd.Parameters.Add("@OrderIndex", SqlDbType.Int).Value = this.Convert(folder.OrderIndex, true);

                folder.FolderID = System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public void Update(IDbConnection cn, YZSoft.FileSystem.File file)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZAppFolderFiles SET ");
                sb.Append("FolderID=@FolderID,");
                sb.Append("FileID=@FileID,");
                sb.Append("AddBy=@AddBy,");
                sb.Append("AddAt=@AddAt,");
                sb.Append("Comments=@Comments,");
                sb.Append("Deleted=@Deleted,");
                sb.Append("DeleteBy=@DeleteBy,");
                sb.Append("DeleteAt=@DeleteAt,");
                sb.Append("Recyclebin=@Recyclebin ");
                sb.Append("WHERE ID=@ID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = this.Convert(file.FolderID, false);
                cmd.Parameters.Add("@FileID", SqlDbType.NVarChar).Value = this.Convert(file.FileID, false);
                cmd.Parameters.Add("@AddBy", SqlDbType.NVarChar).Value = this.Convert(file.AddBy, true);
                cmd.Parameters.Add("@AddAt", SqlDbType.DateTime).Value = this.Convert(file.AddAt, true);
                cmd.Parameters.Add("@Comments", SqlDbType.NVarChar).Value = this.Convert(file.Comments, true);
                cmd.Parameters.Add("@Deleted", SqlDbType.Bit).Value = file.Deleted;
                cmd.Parameters.Add("@DeleteBy", SqlDbType.NVarChar).Value = this.Convert(file.DeleteBy, true);
                cmd.Parameters.Add("@DeleteAt", SqlDbType.DateTime).Value = this.Convert(file.DeleteAt, true);
                cmd.Parameters.Add("@Recyclebin", SqlDbType.Bit).Value = file.Recyclebin;
                cmd.Parameters.Add("@ID", SqlDbType.Int).Value = file.ID;

                cmd.ExecuteNonQuery();
            }
        }

        public void Update(IDbConnection cn, YZSoft.FileSystem.Folder folder)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZAppFolders SET ");
                sb.Append("RootID=@RootID,");
                sb.Append("ParentID=@ParentID,");
                sb.Append("Name=@Name,");
                sb.Append("[Desc]=@Desc,");
                sb.Append("Owner=@Owner,");
                sb.Append("CreateAt=@CreateAt,");
                sb.Append("Deleted=@Deleted,");
                sb.Append("DeleteBy=@DeleteBy,");
                sb.Append("DeleteAt=@DeleteAt ");
                sb.Append("WHERE FolderID=@FolderID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@RootID", SqlDbType.Int).Value = this.Convert(folder.RootID, true);
                cmd.Parameters.Add("@ParentID", SqlDbType.Int).Value = this.Convert(folder.ParentID, true);
                cmd.Parameters.Add("@Name", SqlDbType.NVarChar).Value = this.Convert(folder.Name, false);
                cmd.Parameters.Add("@Desc", SqlDbType.NVarChar).Value = this.Convert(folder.Desc, true);
                cmd.Parameters.Add("@Owner", SqlDbType.NVarChar).Value = this.Convert(folder.Owner, true);
                cmd.Parameters.Add("@CreateAt", SqlDbType.DateTime).Value = this.Convert(folder.CreateAt, false);
                cmd.Parameters.Add("@Deleted", SqlDbType.Bit).Value = folder.Deleted;
                cmd.Parameters.Add("@DeleteBy", SqlDbType.NVarChar).Value = this.Convert(folder.DeleteBy, true);
                cmd.Parameters.Add("@DeleteAt", SqlDbType.DateTime).Value = this.Convert(folder.DeleteAt, true);
                cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = folder.FolderID;

                cmd.ExecuteNonQuery();
            }
        }

        public void UpdateParent(IDbConnection cn, YZSoft.FileSystem.Folder folder)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZAppFolders SET ");
                sb.Append("RootID=@RootID,");
                sb.Append("ParentID=@ParentID ");
                sb.Append("WHERE FolderID=@FolderID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@RootID", SqlDbType.Int).Value = this.Convert(folder.RootID, true);
                cmd.Parameters.Add("@ParentID", SqlDbType.Int).Value = this.Convert(folder.ParentID, true);
                cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = folder.FolderID;

                cmd.ExecuteNonQuery();
            }
        }

        public void UpdateOrderIndex(IDbConnection cn, YZSoft.FileSystem.Folder folder)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZAppFolders SET ");
                sb.Append("OrderIndex=@OrderIndex ");
                sb.Append("WHERE FolderID=@FolderID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@OrderIndex", SqlDbType.Int).Value = this.Convert(folder.OrderIndex, true);
                cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = folder.FolderID;

                cmd.ExecuteNonQuery();
            }
        }

        public void UpdateOrderIndex(IDbConnection cn, YZSoft.FileSystem.File file)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZAppFolderFiles SET ");
                sb.Append("OrderIndex=@OrderIndex ");
                sb.Append("WHERE ID=@ID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@OrderIndex", SqlDbType.Int).Value = this.Convert(file.OrderIndex, true);
                cmd.Parameters.Add("@ID", SqlDbType.Int).Value = file.ID;

                cmd.ExecuteNonQuery();
            }
        }

        public void RenameFolder(IDbConnection cn, int folderid, string newName)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "UPDATE YZAppFolders SET Name=@Name WHERE FolderID=@FolderID";

                cmd.Parameters.Add("@Name", SqlDbType.NVarChar).Value = this.Convert(newName, false);
                cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = folderid;

                cmd.ExecuteNonQuery();
            }
        }

        public void DeleteFolder(IDbConnection cn, int folderid, string uid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"
--删除目录
WITH A AS
(
	SELECT FolderID FROM YZAppFolders WHERE FolderID=@FolderID
	UNION ALL
	SELECT YZAppFolders.FolderID FROM YZAppFolders,A WHERE YZAppFolders.ParentID = A.FolderID AND YZAppFolders.Recyclebin<>1
)
UPDATE YZAppFolders SET Deleted=1, DeleteBy=@DeleteBy, DeleteAt=@DeleteAt WHERE FolderID IN (SELECT FolderID FROM A);
UPDATE YZAppFolders SET Recyclebin=1 WHERE FolderID=@FolderID;

--删除文件
WITH A AS
(
	SELECT FolderID FROM YZAppFolders WHERE FolderID=@FolderID
	UNION ALL
	SELECT YZAppFolders.FolderID FROM YZAppFolders,A WHERE YZAppFolders.ParentID = A.FolderID AND YZAppFolders.Recyclebin<>1
)
UPDATE YZAppFolderFiles SET Deleted=1, DeleteBy=@DeleteBy, DeleteAt=@DeleteAt WHERE FolderID IN (SELECT FolderID FROM A) AND Recyclebin<>1;
";
                cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = folderid;
                cmd.Parameters.Add("@DeleteBy", SqlDbType.NVarChar).Value = this.Convert(uid,false);
                cmd.Parameters.Add("@DeleteAt", SqlDbType.DateTime).Value = DateTime.Now;

                cmd.ExecuteNonQuery();
            }
        }

        public void RestoreFile(IDbConnection cn, int fileid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"
--恢复文件
UPDATE YZAppFolderFiles SET Recyclebin=0, Deleted=0, DeleteBy=null, DeleteAt=null WHERE ID=@FileID;

--上级目录
WITH A AS
(
	SELECT YZAppFolders.FolderID,YZAppFolders.ParentID FROM YZAppFolders,YZAppFolderFiles WHERE YZAppFolders.FolderID=YZAppFolderFiles.FolderID AND YZAppFolderFiles.ID=@FileID
	UNION ALL
	SELECT YZAppFolders.FolderID,YZAppFolders.ParentID FROM YZAppFolders,A WHERE A.ParentID=YZAppFolders.FolderID
)
UPDATE YZAppFolders SET Deleted=0 WHERE FolderID IN (SELECT FolderID FROM A);
";
                cmd.Parameters.Add("@FileID", SqlDbType.Int).Value = fileid;

                cmd.ExecuteNonQuery();
            }
        }

        public void RestoreFolder(IDbConnection cn, int folderid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"
--恢复目录
WITH A AS
(
	SELECT FolderID FROM YZAppFolders WHERE FolderID=@FolderID
	UNION ALL
	SELECT YZAppFolders.FolderID FROM YZAppFolders,A WHERE YZAppFolders.ParentID = A.FolderID AND YZAppFolders.Recyclebin<>1
)
UPDATE YZAppFolders SET Deleted=0, DeleteBy=null, DeleteAt=null WHERE FolderID IN (SELECT FolderID FROM A);
UPDATE YZAppFolders SET Recyclebin=0 WHERE FolderID=@FolderID;

--恢复文件
WITH A AS
(
	SELECT FolderID FROM YZAppFolders WHERE FolderID=@FolderID
	UNION ALL
	SELECT YZAppFolders.FolderID FROM YZAppFolders,A WHERE YZAppFolders.ParentID = A.FolderID AND YZAppFolders.Recyclebin<>1
)
UPDATE YZAppFolderFiles SET Deleted=0, DeleteBy=null, DeleteAt=null WHERE FolderID IN (SELECT FolderID FROM A) AND Recyclebin<>1;

--上级目录
WITH A AS
(
	SELECT FolderID,ParentID FROM YZAppFolders WHERE FolderID=@FolderID
	UNION ALL
	SELECT YZAppFolders.FolderID,YZAppFolders.ParentID FROM YZAppFolders,A WHERE A.ParentID=YZAppFolders.FolderID
)
UPDATE YZAppFolders SET Deleted=0 WHERE FolderID IN (SELECT ParentID FROM A);
";
                cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = folderid;

                cmd.ExecuteNonQuery();
            }
        }

        public void DeleteFilePhysical(IDbConnection cn, int fileid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "DELETE YZAppFolderFiles WHERE ID=@ID";
                cmd.Parameters.Add("@ID", SqlDbType.Int).Value = fileid;

                cmd.ExecuteNonQuery();
            }
        }

        public void DeleteFolderPhysical(IDbConnection cn, int folderid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"
--删除文件
WITH A AS
(
	SELECT FolderID FROM YZAppFolders WHERE FolderID=@FolderID
	UNION ALL
	SELECT YZAppFolders.FolderID FROM YZAppFolders,A WHERE YZAppFolders.ParentID = A.FolderID AND YZAppFolders.Recyclebin<>1
)
DELETE FROM YZAppFolderFiles WHERE FolderID IN (SELECT FolderID FROM A) AND Recyclebin<>1;

--删除目录
WITH A AS
(
	SELECT FolderID,ParentID,Recyclebin FROM YZAppFolders WHERE FolderID=@FolderID
	UNION ALL
	SELECT YZAppFolders.FolderID,YZAppFolders.ParentID,YZAppFolders.Recyclebin FROM YZAppFolders,A WHERE YZAppFolders.ParentID = A.FolderID AND (A.FolderID=@FolderID OR A.Recyclebin<>1)
),
B AS
(
	SELECT * FROM A WHERE Recyclebin=1 AND FolderID <> @FolderID
),
C AS
(
	SELECT * FROM B
	UNION ALL
	SELECT A.* FROM A,C WHERE C.ParentID=A.FolderID
),
D AS
(
	SELECT FolderID FROM A WHERE FolderID NOT IN(SELECT FolderID FROM C)
)
DELETE YZAppFolders WHERE FolderID IN (SELECT FolderID FROM D);
UPDATE YZAppFolders SET Recyclebin=0 WHERE FolderID = @FolderID;
";
                cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = folderid;

                cmd.ExecuteNonQuery();
            }
        }
    }
}
