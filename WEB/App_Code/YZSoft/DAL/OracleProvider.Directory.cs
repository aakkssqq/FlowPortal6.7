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
        public IDataReader GetFolders(IDbConnection cn, int parentFolderID, string filter, string sort)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                //查询条件
                filter = this.CombinCond(filter, "DELETED <> 1 AND PARENTID = :PARENTID");
                cmd.Parameters.Add(":PARENTID", OracleDbType.Int32).Value = parentFolderID;

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "ORDERINDEX ASC";

                //Query
                string query = @"SELECT * FROM YZAPPFOLDERS {0} ORDER BY {1}";

                cmd.CommandText = String.Format(query, filter, sort);

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetAllChildFolders(IDbConnection cn, int rootFolderID, string filter, string sort)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                //查询条件
                filter = this.CombinCond(filter, "DELETED <> 1 AND ROOTID = :ROOTID");
                cmd.Parameters.Add(":ROOTID", OracleDbType.Int32).Value = rootFolderID;

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "ORDERINDEX ASC";

                //Query
                string query = @"SELECT * FROM YZAPPFOLDERS {0} ORDER BY {1}";

                cmd.CommandText = String.Format(query, filter, sort);

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetFiles(IDbConnection cn, int parentFolderID, string filter, string sort, int top)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                //查询条件
                filter = this.CombinCond(filter, "DELETED <> 1 AND FOLDERID = :FOLDERID");
                cmd.Parameters.Add(":FOLDERID", OracleDbType.Int32).Value = parentFolderID;

                if(top != -1)
                    filter = this.CombinCond(filter,"ROWNUM <= " + top.ToString());

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "OrderIndex ASC";

                //Query
                string query = @"SELECT * FROM YZAPPFOLDERFILES {1} ORDER BY {2}";

                cmd.CommandText = String.Format(query,
                    null,
                    filter, sort);

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetFiles(IDbConnection cn, int[] folderids, string filter, string sort,int top)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                //查询条件
                filter = this.CombinCond(filter, String.Format("Deleted <> 1 AND FolderID IN ({0})", this.GetDbInList(folderids,-1)));

                if (top != -1)
                    filter = this.CombinCond(filter, "ROWNUM <= " + top.ToString());

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "OrderIndex ASC";

                //Query
                string query = @"SELECT * FROM YZAPPFOLDERFILES {1} ORDER BY {2}";

                cmd.CommandText = String.Format(query,
                    null,
                    filter, sort);

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetFileByID(IDbConnection cn, int fileid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"SELECT * FROM YZAPPFOLDERFILES WHERE ID=:ID";
                cmd.Parameters.Add(":ID", OracleDbType.Int32).Value = fileid;
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetFiles(IDbConnection cn, string fileid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"SELECT * FROM YZAPPFOLDERFILES WHERE FileID=:FileID";
                cmd.Parameters.Add(":FileID", OracleDbType.NVarchar2).Value = fileid;
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetFolderByID(IDbConnection cn, int folderid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"SELECT * FROM YZAPPFOLDERS WHERE FOLDERID=:FOLDERID";
                cmd.Parameters.Add(":FolderID", OracleDbType.Int32).Value = folderid;
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetDeletedObjects(IDbConnection cn, BPMObjectNameCollection libTypes, string deletedBy)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                //查询条件
                string libFilter = null;
                for (int i = 0; i < libTypes.Count; i++)
                {
                    string paramName = ":LibType" + i.ToString();
                    string libType = libTypes[i];

                    libFilter = this.CombinCondOR(libFilter, String.Format("LibType = {0}", paramName));
                    cmd.Parameters.Add(paramName, OracleDbType.NVarchar2).Value = libType;
                }

                if (!String.IsNullOrEmpty(libFilter))
                    libFilter = " WHERE " + libFilter;

                cmd.CommandText = String.Format(@"
WITH A AS(
	SELECT * FROM YZV_RootFolders {0}
),
FA AS(
	SELECT * FROM YZAppFolderFiles WHERE Recyclebin=1 AND (:DeleteBy IS NULL OR DeleteBy=:DeleteBy)
),
FB AS(
	SELECT YZAppFolders.RootID,FA.* FROM FA,YZAppFolders WHERE FA.FolderID = YZAppFolders.FolderID
),
FC AS(
	SELECT A.*,FB.* FROM A,FB WHERE A.RootFolderID=FB.RootID
),
FD AS(
	SELECT FC.LibID,FC.LibType,FC.LibName,FC.LibDesc,FC.DeleteBy,FC.DeleteAt,YZDirectoryGetPath(FC.FolderID) as Path,null as FolderID,YZAppAttachment." + "\"NAME\"" + @",FC." + "\"ID\"" + @",FC.FileID,YZAppAttachment.Ext,YZAppAttachment." + "\"SIZE\"" + @" FROM FC,YZAppAttachment WHERE FC.FileID=YZAppAttachment.FileID
),
FDA AS(
	SELECT * FROM YZAppFolders WHERE Recyclebin=1 AND (:DeleteBy IS NULL OR DeleteBy=:DeleteBy)
),
FDB AS(
	SELECT A.LibID,A.LibType,A.LibName,A.LibDesc,FDA.DeleteBy,FDA.DeleteAt,YZDirectoryGetPath(FDA.ParentID) as Path,FDA.FolderID,FDA." + "\"NAME\"" + @",null as " + "\"ID\"" + @",null as FileID,null as Ext,null as " + "\"SIZE\"" + @" FROM A,FDA WHERE A.RootFolderID=FDA.RootID
),
Z AS(
	SELECT * FROM FD UNION SELECT * FROM FDB
)
SELECT * FROM Z Order BY DeleteAt desc
", libFilter);

                //查询条件
                cmd.Parameters.Add(":DeleteBy", OracleDbType.NVarchar2).Value = this.Convert(deletedBy, true);

                return cmd.ExecuteReader();
            }
        }

        public void Insert(IDbConnection cn, YZSoft.FileSystem.File file)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "SELECT BPMSEQ_YZAPPFOLDERFILES.NEXTVAL FROM DUAL";
                file.ID = System.Convert.ToInt32(cmd.ExecuteScalar());

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO YZAPPFOLDERFILES(");
                sb.Append("ID,");
                sb.Append("FOLDERID,");
                sb.Append("FILEID,");
                sb.Append("ADDBY,");
                sb.Append("ADDAT,");
                sb.Append("COMMENTS,");
                sb.Append("ORDERINDEX,");
                sb.Append("FLAG) ");
                sb.Append("VALUES(");
                sb.Append(":ID,");
                sb.Append(":FOLDERID,");
                sb.Append(":FILEID,");
                sb.Append(":ADDBY,");
                sb.Append(":ADDAT,");
                sb.Append(":COMMENTS,");
                sb.Append(":ORDERINDEX,");
                sb.Append(":FLAG)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":ID", OracleDbType.Int32).Value = file.ID;
                cmd.Parameters.Add(":FOLDERID", OracleDbType.Int32).Value = this.Convert(file.FolderID, false);
                cmd.Parameters.Add(":FILEID", OracleDbType.NVarchar2).Value = this.Convert(file.FileID, false);
                cmd.Parameters.Add(":ADDBY", OracleDbType.NVarchar2).Value = this.Convert(file.AddBy, true);
                cmd.Parameters.Add(":ADDAT", OracleDbType.Date).Value = this.Convert(file.AddAt, true);
                cmd.Parameters.Add(":COMMENTS", OracleDbType.NVarchar2).Value = this.Convert(file.Comments, true);
                cmd.Parameters.Add(":ORDERINDEX", OracleDbType.Int32).Value = this.Convert(file.OrderIndex, false);
                cmd.Parameters.Add(":FLAG", OracleDbType.NVarchar2).Value = this.Convert(file.Flag, true);

                cmd.ExecuteNonQuery();
            }
        }

        public void Insert(IDbConnection cn, YZSoft.FileSystem.Folder folder)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "SELECT BPMSEQ_YZAPPFOLDERS.NEXTVAL FROM DUAL";
                folder.FolderID = System.Convert.ToInt32(cmd.ExecuteScalar());

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO YZAPPFOLDERS(");
                sb.Append("FOLDERID,");
                sb.Append("ROOTID,");
                sb.Append("PARENTID,");
                sb.Append("FOLDERTYPE,");
                sb.Append("\"NAME\",");
                sb.Append("\"DESC\",");
                sb.Append("OWNER,");
                sb.Append("CREATEAT,");
                sb.Append("ORDERINDEX) ");
                sb.Append("VALUES(");
                sb.Append(":FOLDERID,");
                sb.Append(":ROOTID,");
                sb.Append(":PARENTID,");
                sb.Append(":FOLDERTYPE,");
                sb.Append(":NAME1,");
                sb.Append(":DESC1,");
                sb.Append(":OWNER,");
                sb.Append(":CREATEAT,");
                sb.Append(":ORDERINDEX)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":FOLDERID", OracleDbType.Int32).Value = folder.FolderID;
                cmd.Parameters.Add(":ROOTID", OracleDbType.Int32).Value = this.Convert(folder.RootID, true);
                cmd.Parameters.Add(":PARENTID", OracleDbType.Int32).Value = this.Convert(folder.ParentID, true);
                cmd.Parameters.Add(":FOLDERTYPE", OracleDbType.NVarchar2).Value = this.Convert(folder.FolderType, true);
                cmd.Parameters.Add(":NAME1", OracleDbType.NVarchar2).Value = this.Convert(folder.Name, false);
                cmd.Parameters.Add(":DESC1", OracleDbType.NVarchar2).Value = this.Convert(folder.Desc, true);
                cmd.Parameters.Add(":OWNER", OracleDbType.NVarchar2).Value = this.Convert(folder.Owner, true);
                cmd.Parameters.Add(":CREATEAT", OracleDbType.Date).Value = this.Convert(folder.CreateAt, false);
                cmd.Parameters.Add(":ORDERINDEX", OracleDbType.Int32).Value = this.Convert(folder.OrderIndex, true);

                cmd.ExecuteNonQuery();
            }
        }

        public void Update(IDbConnection cn, YZSoft.FileSystem.File file)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZAppFolderFiles SET ");
                sb.Append("FolderID=:FolderID,");
                sb.Append("FileID=:FileID,");
                sb.Append("AddBy=:AddBy,");
                sb.Append("AddAt=:AddAt,");
                sb.Append("Comments=:Comments,");
                sb.Append("Deleted=:Deleted,");
                sb.Append("DeleteBy=:DeleteBy,");
                sb.Append("DeleteAt=:DeleteAt,");
                sb.Append("Recyclebin=:Recyclebin ");
                sb.Append("WHERE ID=:ID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":FolderID", OracleDbType.Int32).Value = this.Convert(file.FolderID, false);
                cmd.Parameters.Add(":FileID", OracleDbType.NVarchar2).Value = this.Convert(file.FileID, false);
                cmd.Parameters.Add(":AddBy", OracleDbType.NVarchar2).Value = this.Convert(file.AddBy, true);
                cmd.Parameters.Add(":AddAt", OracleDbType.Date).Value = this.Convert(file.AddAt, true);
                cmd.Parameters.Add(":Comments", OracleDbType.NVarchar2).Value = this.Convert(file.Comments, true);
                cmd.Parameters.Add(":Deleted", OracleDbType.Int16).Value = this.ConvertBoolToInt16(file.Deleted);
                cmd.Parameters.Add(":DeleteBy", OracleDbType.NVarchar2).Value = this.Convert(file.DeleteBy, true);
                cmd.Parameters.Add(":DeleteAt", OracleDbType.Date).Value = this.Convert(file.DeleteAt, true);
                cmd.Parameters.Add(":Recyclebin", OracleDbType.Int16).Value = this.ConvertBoolToInt16(file.Recyclebin);
                cmd.Parameters.Add(":ID", OracleDbType.Int32).Value = file.ID;

                cmd.ExecuteNonQuery();
            }
        }

        public void Update(IDbConnection cn, YZSoft.FileSystem.Folder folder)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZAPPFOLDERS SET ");
                sb.Append("RootID=:RootID,");
                sb.Append("ParentID=:ParentID,");
                sb.Append("\"NAME\"=:Name1,");
                sb.Append("\"DESC\"=:Desc1,");
                sb.Append("Owner=:Owner,");
                sb.Append("CreateAt=:CreateAt,");
                sb.Append("Deleted=:Deleted,");
                sb.Append("DeleteBy=:DeleteBy,");
                sb.Append("DeleteAt=:DeleteAt ");
                sb.Append("WHERE FolderID=:FolderID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":RootID", OracleDbType.Int32).Value = this.Convert(folder.RootID, true);
                cmd.Parameters.Add(":ParentID", OracleDbType.Int32).Value = this.Convert(folder.ParentID, true);
                cmd.Parameters.Add(":Name1", OracleDbType.NVarchar2).Value = this.Convert(folder.Name, false);
                cmd.Parameters.Add(":Desc1", OracleDbType.NVarchar2).Value = this.Convert(folder.Desc, true);
                cmd.Parameters.Add(":Owner", OracleDbType.NVarchar2).Value = this.Convert(folder.Owner, true);
                cmd.Parameters.Add(":CreateAt", OracleDbType.Date).Value = this.Convert(folder.CreateAt, false);
                cmd.Parameters.Add(":Deleted", OracleDbType.Int16).Value = this.ConvertBoolToInt16(folder.Deleted);
                cmd.Parameters.Add(":DeleteBy", OracleDbType.NVarchar2).Value = this.Convert(folder.DeleteBy, true);
                cmd.Parameters.Add(":DeleteAt", OracleDbType.Date).Value = this.Convert(folder.DeleteAt, true);
                cmd.Parameters.Add(":FolderID", OracleDbType.Int32).Value = folder.FolderID;

                cmd.ExecuteNonQuery();
            }
        }

        public void UpdateParent(IDbConnection cn, YZSoft.FileSystem.Folder folder)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZAppFolders SET ");
                sb.Append("RootID=:RootID,");
                sb.Append("ParentID=:ParentID ");
                sb.Append("WHERE FolderID=:FolderID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":RootID", OracleDbType.Int32).Value = this.Convert(folder.RootID, true);
                cmd.Parameters.Add(":ParentID", OracleDbType.Int32).Value = this.Convert(folder.ParentID, true);
                cmd.Parameters.Add(":FolderID", OracleDbType.Int32).Value = folder.FolderID;

                cmd.ExecuteNonQuery();
            }
        }

        public void UpdateOrderIndex(IDbConnection cn, YZSoft.FileSystem.Folder folder)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZAppFolders SET ");
                sb.Append("OrderIndex=:OrderIndex ");
                sb.Append("WHERE FolderID=:FolderID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":OrderIndex", OracleDbType.Int32).Value = this.Convert(folder.OrderIndex, true);
                cmd.Parameters.Add(":FolderID", OracleDbType.Int32).Value = folder.FolderID;

                cmd.ExecuteNonQuery();
            }
        }

        public void UpdateOrderIndex(IDbConnection cn, YZSoft.FileSystem.File file)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZAppFolderFiles SET ");
                sb.Append("OrderIndex=:OrderIndex ");
                sb.Append("WHERE ID=:ID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":OrderIndex", OracleDbType.Int32).Value = this.Convert(file.OrderIndex, true);
                cmd.Parameters.Add(":ID", OracleDbType.Int32).Value = file.ID;

                cmd.ExecuteNonQuery();
            }
        }

        public void RenameFolder(IDbConnection cn, int folderid, string newName)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "UPDATE YZAppFolders SET \"NAME\"=:Name1 WHERE FolderID=:FolderID";

                cmd.Parameters.Add(":Name1", OracleDbType.NVarchar2).Value = this.Convert(newName, false);
                cmd.Parameters.Add(":FolderID", OracleDbType.Int32).Value = folderid;

                cmd.ExecuteNonQuery();
            }
        }

        public void DeleteFolder(IDbConnection cn, int folderid, string uid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = @"
--删除目录
BEGIN
UPDATE YZAppFolders SET Deleted=1, DeleteBy=:DeleteBy, DeleteAt=:DeleteAt WHERE FolderID IN (
    select FolderID from YZAppFolders start with YZAppFolders.FolderID=:FolderID connect by YZAppFolders.ParentID=prior YZAppFolders.FolderID and YZAppFolders.Recyclebin<>1
);
UPDATE YZAppFolders SET Recyclebin=1 WHERE FolderID=:FolderID;

--删除文件
UPDATE YZAppFolderFiles SET Deleted=1, DeleteBy=:DeleteBy, DeleteAt=:DeleteAt WHERE FolderID IN (
    select FolderID from YZAppFolders start with YZAppFolders.FolderID=:FolderID connect by YZAppFolders.ParentID=prior YZAppFolders.FolderID and YZAppFolders.Recyclebin<>1
) AND Recyclebin<>1;
END;
";
                cmd.Parameters.Add(":FolderID", OracleDbType.Int32).Value = folderid;
                cmd.Parameters.Add(":DeleteBy", OracleDbType.NVarchar2).Value = this.Convert(uid, false);
                cmd.Parameters.Add(":DeleteAt", OracleDbType.Date).Value = DateTime.Now;

                cmd.ExecuteNonQuery();
            }
        }

        public void RestoreFile(IDbConnection cn, int fileid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = @"
BEGIN
--恢复文件
UPDATE YZAppFolderFiles SET Recyclebin=0, Deleted=0, DeleteBy=null, DeleteAt=null WHERE ID=:FileID;

--上级目录
UPDATE YZAppFolders SET Deleted=0 WHERE FolderID IN (
    select FolderID from YZAppFolders start with YZAppFolders.FolderID IN (select FolderID from YZAppFolderFiles where ID=:FileID) connect by YZAppFolders.FolderID=prior YZAppFolders.ParentID
);
END;
";
                cmd.Parameters.Add(":FileID", OracleDbType.Int32).Value = fileid;

                cmd.ExecuteNonQuery();
            }
        }

        public void RestoreFolder(IDbConnection cn, int folderid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = @"
BEGIN
--恢复目录
UPDATE YZAppFolders SET Deleted=0, DeleteBy=null, DeleteAt=null WHERE FolderID IN (
    select FolderID from YZAppFolders start with YZAppFolders.FolderID=:FolderID connect by YZAppFolders.ParentID=prior YZAppFolders.FolderID and YZAppFolders.Recyclebin<>1
);
UPDATE YZAppFolders SET Recyclebin=0 WHERE FolderID=:FolderID;

--恢复文件
UPDATE YZAppFolderFiles SET Deleted=0, DeleteBy=null, DeleteAt=null WHERE FolderID IN (
    select FolderID from YZAppFolders start with YZAppFolders.FolderID=:FolderID connect by YZAppFolders.ParentID=prior YZAppFolders.FolderID and YZAppFolders.Recyclebin<>1
) AND Recyclebin<>1;

--上级目录
UPDATE YZAppFolders SET Deleted=0 WHERE FolderID IN (
    select FolderID from YZAppFolders start with YZAppFolders.FolderID=:FolderID connect by YZAppFolders.FolderID=prior YZAppFolders.ParentID
);
END;
";
                cmd.Parameters.Add(":FolderID", OracleDbType.Int32).Value = folderid;

                cmd.ExecuteNonQuery();
            }
        }

        public void DeleteFilePhysical(IDbConnection cn, int fileid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "DELETE YZAppFolderFiles WHERE ID=:ID";
                cmd.Parameters.Add(":ID", OracleDbType.Int32).Value = fileid;

                cmd.ExecuteNonQuery();
            }
        }

        public void DeleteFolderPhysical(IDbConnection cn, int folderid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = @"
BEGIN
--删除文件
DELETE FROM YZAppFolderFiles WHERE FolderID IN (
    select FolderID from YZAppFolders start with YZAppFolders.FolderID=:FolderID connect by YZAppFolders.ParentID=prior YZAppFolders.FolderID and YZAppFolders.Recyclebin<>1
) AND Recyclebin<>1;

--删除目录
DELETE YZAppFolders WHERE FolderID IN (
    WITH A AS
    (
        select FolderID,ParentID,Recyclebin from YZAppFolders start with YZAppFolders.FolderID=:FolderID connect by YZAppFolders.ParentID=prior YZAppFolders.FolderID and (prior FolderID=:FolderID or prior Recyclebin<>1)
    ),
    B AS
    (
	    SELECT * FROM A WHERE Recyclebin=1 AND FolderID <> :FolderID
    ),
    C AS
    (
        select * from A start with FolderID in (select FolderID from B) connect by FolderID = prior ParentID
    ),
    D AS
    (
	    SELECT FolderID FROM A WHERE FolderID NOT IN(SELECT FolderID FROM C)
    )
    SELECT FolderID FROM D
);
UPDATE YZAppFolders SET Recyclebin=0 WHERE FolderID = :FolderID;
END;
";
                cmd.Parameters.Add(":FolderID", OracleDbType.Int32).Value = folderid;
                cmd.ExecuteNonQuery();
            }
        }
    }
}
