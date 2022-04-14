using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Drawing;
using System.IO;
using System.Data.Common;
using System.Runtime.Serialization;
using BPM;

namespace YZSoft.Web.DAL
{
    partial interface IYZDbProvider
    {
        IDataReader GetFolders(IDbConnection cn, int parentFolderID, string filter, string sort);
        IDataReader GetAllChildFolders(IDbConnection cn, int rootFolderID, string filter, string sort);
        IDataReader GetFiles(IDbConnection cn, int parentFolderID, string filter, string sort, int top);
        IDataReader GetFiles(IDbConnection cn, int[] folderids, string filter, string sort, int top);
        IDataReader GetFiles(IDbConnection cn, string fileid);
        IDataReader GetFileByID(IDbConnection cn, int fileid);
        IDataReader GetFolderByID(IDbConnection cn, int folderid);
        void Insert(IDbConnection cn, YZSoft.FileSystem.File file);
        void Insert(IDbConnection cn, YZSoft.FileSystem.Folder folder);
        void Update(IDbConnection cn, YZSoft.FileSystem.File file);
        void Update(IDbConnection cn, YZSoft.FileSystem.Folder folder);
        void UpdateParent(IDbConnection cn, YZSoft.FileSystem.Folder folder);
        void UpdateOrderIndex(IDbConnection cn, YZSoft.FileSystem.Folder folder);
        void UpdateOrderIndex(IDbConnection cn, YZSoft.FileSystem.File file);
        void RenameFolder(IDbConnection cn, int folderid, string newName);
        void DeleteFolder(IDbConnection cn, int folderid, string uid);
        void RestoreFile(IDbConnection cn, int fileid);
        void RestoreFolder(IDbConnection cn, int folderid);
        void DeleteFilePhysical(IDbConnection cn, int fileid);
        void DeleteFolderPhysical(IDbConnection cn, int folderid);
        IDataReader GetDeletedObjects(IDbConnection cn, BPMObjectNameCollection libTypes, string deletedBy);
    }
}
