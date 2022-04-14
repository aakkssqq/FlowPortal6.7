using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using YZSoft.Web.DAL;
using BPM;
using BPM.Client;
using System.IO;

namespace YZSoft.FileSystem
{
    public class DirectoryManager
    {
        private static DirectoryManager _instance = null;

        static DirectoryManager()
        {
            DirectoryManager._instance = new DirectoryManager();
        }

        #region 公共属性

        internal static DirectoryManager Instance
        {
            get
            {
                return DirectoryManager._instance;
            }
        }

        #endregion

        #region 服务

        public static FolderCollection GetFolders(IYZDbProvider provider, IDbConnection cn, int parentFolderID, string filter, string sort)
        {
            try
            {
                FolderCollection folders = new FolderCollection();
                using (YZReader reader = new YZReader(provider.GetFolders(cn, parentFolderID, filter, sort)))
                {
                    while (reader.Read())
                    {
                        Folder folder = new Folder(reader);

                        if (!String.IsNullOrEmpty(folder.Name))
                            folders.Add(folder);
                    }

                }
                return folders;
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppFolders", e.Message);
            }
        }

        public static FolderCollection GetAllChildFolders(IYZDbProvider provider, IDbConnection cn, int rootfolderid, string filter, string sort)
        {
            try
            {
                FolderCollection folders = new FolderCollection();
                using (YZReader reader = new YZReader(provider.GetAllChildFolders(cn, rootfolderid, filter, sort)))
                {
                    while (reader.Read())
                    {
                        Folder folder = new Folder(reader);

                        if (!String.IsNullOrEmpty(folder.Name))
                            folders.Add(folder);
                    }
                }
                return folders;
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppFolders", e.Message);
            }
        }

        public static FileCollection GetFiles(IYZDbProvider provider, IDbConnection cn, int parentFolderID, string filter, string sort, int top)
        {
            try
            {
                FileCollection files = new FileCollection();
                using (YZReader reader = new YZReader(provider.GetFiles(cn, parentFolderID, filter, sort, top)))
                {
                    while (reader.Read())
                    {
                        File file = new File(reader);
                        files.Add(file);
                    }

                }
                return files;
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppFolderFiles", e.Message);
            }
        }

        public static FileCollection GetFiles(IYZDbProvider provider, IDbConnection cn, int[] folderids, string filter, string sort, int top)
        {
            try
            {
                FileCollection files = new FileCollection();
                using (YZReader reader = new YZReader(provider.GetFiles(cn, folderids, filter, sort, top)))
                {
                    while (reader.Read())
                    {
                        File file = new File(reader);
                        files.Add(file);
                    }

                }
                return files;
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppFolderFiles", e.Message);
            }
        }

        public static FileCollection GetFiles(IYZDbProvider provider, IDbConnection cn, string fileid)
        {
            try
            {
                FileCollection files = new FileCollection();
                using (YZReader reader = new YZReader(provider.GetFiles(cn, fileid)))
                {
                    while (reader.Read())
                    {
                        File file = new File(reader);
                        files.Add(file);
                    }

                }
                return files;
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppFolderFiles", e.Message);
            }
        }

        public static File TryGetFileByID(IYZDbProvider provider, IDbConnection cn, int fileid)
        {
            File file = null;
            try
            {
                using (YZReader reader = new YZReader(provider.GetFileByID(cn, fileid)))
                {
                    if (reader.Read())
                        file = new File(reader);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppFolders", e.Message);
            }

            return file;
        }

        public static File GetFileByID(IYZDbProvider provider, IDbConnection cn, int fileid)
        {
            File file = TryGetFileByID(provider,cn,fileid);

            if (file == null)
                throw new BPMException(String.Format(Resources.YZStrings.Aspx_FileSystem_Exp_FileNotExist, fileid));

            return file;
        }

        public static Folder TryGetFolderByID(IYZDbProvider provider, IDbConnection cn, int folderid)
        {
            Folder folder = null;
            try
            {
                using (YZReader reader = new YZReader(provider.GetFolderByID(cn, folderid)))
                {
                    if (reader.Read())
                        folder = new Folder(reader);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppFolders", e.Message);
            }

            return folder;
        }

        public static Folder GetFolderByID(IYZDbProvider provider, IDbConnection cn, int folderid)
        {
            Folder folder = TryGetFolderByID(provider, cn, folderid);
            if (folder == null)
                throw new BPMException(String.Format(Resources.YZStrings.Aspx_FileSystem_Exp_FolderNotExist, folderid));

            return folder;
        }

        public static int GetFolderNextOrderIndex(IYZDbProvider provider, IDbConnection cn, int folderid)
        {
            try
            {
                return provider.GetNextOrderIndex(cn, "YZAppFolders", "ParentID", folderid);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppFolders", e.Message);
            }
        }

        public static int GetFileNextOrderIndex(IYZDbProvider provider, IDbConnection cn, int folderid)
        {
            try
            {
                return provider.GetNextOrderIndex(cn, "YZAppFolderFiles", "FolderID", folderid);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppFolderFiles", e.Message);
            }
        }

        public static void Insert(IYZDbProvider provider, IDbConnection cn, File file)
        {
            try
            {
                provider.Insert(cn, file);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBInsertDataErr, "YZAppFolderFiles", e.Message);
            }
        }

        public static void Insert(IYZDbProvider provider, IDbConnection cn, Folder folder)
        {
            try
            {
                provider.Insert(cn, folder);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBInsertDataErr, "YZAppFolders", e.Message);
            }
        }

        public static void Update(IYZDbProvider provider, IDbConnection cn, File file)
        {
            try
            {
                provider.Update(cn, file);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZAppFolderFiles", e.Message);
            }
        }

        public static void Update(IYZDbProvider provider, IDbConnection cn, Folder folder)
        {
            try
            {
                provider.Update(cn, folder);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZAppFolders", e.Message);
            }
        }

        public static void UpdateParent(IYZDbProvider provider, IDbConnection cn, Folder folder)
        {
            try
            {
                provider.UpdateParent(cn, folder);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZAppFolders", e.Message);
            }
        }

        public static void UpdateOrderIndex(IYZDbProvider provider, IDbConnection cn, Folder folder)
        {
            try
            {
                provider.UpdateOrderIndex(cn, folder);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZAppFolders", e.Message);
            }
        }

        public static void UpdateOrderIndex(IYZDbProvider provider, IDbConnection cn, File file)
        {
            try
            {
                provider.UpdateOrderIndex(cn, file);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZAppFolderFiles", e.Message);
            }
        }

        public static string RenameFolder(IYZDbProvider provider, IDbConnection cn, int folderid, string newName)
        {
            provider.RenameFolder(cn, folderid, newName);
            return newName;
        }

        public static void DeleteFile(IYZDbProvider provider, IDbConnection cn, int fileid)
        {
            File file = GetFileByID(provider, cn, fileid);
            file.Deleted = true;
            file.DeleteAt = DateTime.Now;
            file.DeleteBy = YZAuthHelper.LoginUserAccount;
            file.Recyclebin = true;
            Update(provider, cn, file);
        }

        public static File CloneFile(IYZDbProvider provider, IDbConnection cn, int fileid)
        {
            File file = GetFileByID(provider, cn, fileid);
            AttachmentInfo attachmentInfo = AttachmentManager.GetAttachmentInfo(provider, cn, file.FileID);

            string newFileName = GetNewFileName(provider, cn,file.FolderID, attachmentInfo.Name);
            attachmentInfo = AttachmentManager.CloneFile(provider, cn, attachmentInfo, newFileName);

            file.FileID = attachmentInfo.FileID;
            file.OrderIndex = YZSoft.FileSystem.DirectoryManager.GetFileNextOrderIndex(provider, cn, file.FolderID);
            Insert(provider, cn, file);

            return file;
        }

        public static string GetNewFileName(IYZDbProvider provider, IDbConnection cn, int folderid, string oldName)
        {
            string perfix = Path.GetFileNameWithoutExtension(oldName);
            string ext = Path.GetExtension(oldName);
            FileCollection files = DirectoryManager.GetFiles(provider, cn, folderid, null, null, -1);
            AttachmentInfoCollection attachments = files.GetAllAttachmentInfo(provider, cn);
            BPMObjectNameCollection fileNames = attachments.Names;

            for (int i = 1; true; i++)
            {
                string newFileName = perfix + "(" + i.ToString() + ")" + ext;

                if (fileNames.Contains(newFileName))
                    continue;

                return newFileName;
            }
        }

        public static void DeleteFilePhysical(IYZDbProvider provider, IDbConnection cn, int fileid)
        {
            provider.DeleteFilePhysical(cn, fileid);
        }

        public static void DeleteFolder(IYZDbProvider provider, IDbConnection cn, int folderid)
        {
            provider.DeleteFolder(cn, folderid, YZAuthHelper.LoginUserAccount);
        }

        public static void DeleteFolderPhysical(IYZDbProvider provider, IDbConnection cn, int folderid)
        {
            provider.DeleteFolderPhysical(cn, folderid);
        }

        public static void RestoreFile(IYZDbProvider provider, IDbConnection cn, int fileid)
        {
            provider.RestoreFile(cn, fileid);
        }

        public static void RestoreFolder(IYZDbProvider provider, IDbConnection cn, int folderid)
        {
            provider.RestoreFolder(cn, folderid);
        }

        public static void MoveFolders(IYZDbProvider provider, IDbConnection cn, int[] folderids, int targetfolderid, MovePosition position)
        {
            Folder targetFolder = DirectoryManager.GetFolderByID(provider, cn, targetfolderid);
            FolderCollection folders;
            int parentFolderId;

            if (position == MovePosition.Append)
            {
                parentFolderId = targetFolder.FolderID;
            }
            else
            {
                parentFolderId = targetFolder.ParentID;
            }

            foreach (int folderid in folderids)
            {
                Folder folder = new Folder();
                folder.FolderID = folderid;
                folder.ParentID = parentFolderId;
                folder.RootID = targetFolder.RootID;
                DirectoryManager.UpdateParent(provider, cn, folder);
            }

            folders = DirectoryManager.GetFolders(provider, cn, parentFolderId, null, null);

            folders.Move<int>("FolderID", folderids, targetfolderid, position);

            for (int i = 0; i < folders.Count; i++)
            {
                Folder folder = folders[i];
                folder.OrderIndex = i;
                DirectoryManager.UpdateOrderIndex(provider, cn, folder);
            }
        }

        public static void MoveFiles(IYZDbProvider provider, IDbConnection cn, int folderid, int[] fileids, int targetfileid, MovePosition position)
        {
            FileCollection files = GetFiles(provider,cn, folderid,null,null,-1);

            files.Move<int>("ID", fileids, targetfileid, position);

            for (int i = 0; i < files.Count; i++)
            {
                File file = files[i];
                file.OrderIndex = i;
                DirectoryManager.UpdateOrderIndex(provider, cn, file);
            }
        }

        public static void MoveFilesToFolder(IYZDbProvider provider, IDbConnection cn, int[] fileids, int targetfolderid)
        {
            foreach (int fileid in fileids)
            {
                File file = DirectoryManager.TryGetFileByID(provider,cn,fileid);
                if(file == null)
                    continue;

                file.FolderID = targetfolderid;
                DirectoryManager.Update(provider, cn, file);
            }
        }

        #endregion
    }
}