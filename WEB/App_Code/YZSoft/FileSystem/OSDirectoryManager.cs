using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using System.IO;
using BPM;
using YZSoft.Web.DAL;

namespace YZSoft.FileSystem
{
    public class OSDirectoryManager
    {
        private static OSDirectoryManager _instance = null;
        private Dictionary<string, string> _roots = null;

        static OSDirectoryManager()
        {
            OSDirectoryManager._instance = new OSDirectoryManager();
        }

        public OSDirectoryManager()
        {
            this._roots = new Dictionary<string, string>();
            this._roots.Add("BPAReportTemplates", "~/YZSoft/BPA/processreport/templates");
            this._roots.Add("BPAModuleTemplates", "~/YZSoft/BPA/templates");
            this._roots.Add("ESBTemplates", Path.Combine(AttachmentManager.AttachmentRootPath, "ESBTemplates"));
            this._roots.Add("ReportExportTemplates", Path.Combine(AttachmentManager.AttachmentRootPath, "ReportExportTemplates"));

            //Path.IsPathRooted
            //VirtualPathUtility.is
        }

        #region 公共属性

        internal static OSDirectoryManager Instance
        {
            get
            {
                return OSDirectoryManager._instance;
            }
        }

        #endregion

        #region 服务

        public static string TryGetRootPath(HttpContext context, string root)
        {
            string rootPath;
            if (OSDirectoryManager.Instance._roots.TryGetValue(root, out rootPath))
            {
                if (rootPath.StartsWith("~"))
                    return context.Server.MapPath(rootPath);
                else
                    return rootPath;
            }
            else
                return null;
        }

        public static string GetRootPath(HttpContext context, string root)
        {
            string rootPath = OSDirectoryManager.TryGetRootPath(context, root);
            if (rootPath == null)
                throw new Exception(String.Format("Root:{0}, Access Denied!", root));

            if (!Directory.Exists(rootPath))
                Directory.CreateDirectory(rootPath);

            return rootPath;
        }

        public static OSFileInfoCollection GetFiles(string folderPath, BPMObjectNameCollection excludes)
        {
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            DirectoryInfo folder = new DirectoryInfo(folderPath);
            FileInfo[] files = folder.GetFiles("*.*");

            OSFileInfoCollection rv = new OSFileInfoCollection();
            foreach (FileInfo fileInfo in files)
            {
                if ((fileInfo.Attributes & FileAttributes.Directory) == 0 &&
                    (fileInfo.Attributes & FileAttributes.System) == 0 &&
                    (fileInfo.Attributes & FileAttributes.Hidden) == 0)
                {
                    if (NameCompare.Equals(fileInfo.Extension, ".extension"))
                        continue;

                    if (excludes.Contains(fileInfo.Extension))
                        continue;

                    rv.Add(new OSFileInfo(fileInfo));
                }
            }

            rv.Sort();
            return rv;
        }

        public static void DeleteFile(string folderPath, string name)
        {
            string file = Path.Combine(folderPath, name);
            string extensionFile = OSFileInfo.GetExtensionFilePath(file);
            string thumbnailPath = AttachmentManager.GetThumbnailPath(file, "thumbnail", "png");

            System.IO.File.Delete(file);

            if (System.IO.File.Exists(extensionFile))
                System.IO.File.Delete(extensionFile);

            if (System.IO.File.Exists(thumbnailPath))
                System.IO.File.Delete(thumbnailPath);
        }

        public static void RenameFile(string folderPath, string name, string newname)
        {
            string oldFile = Path.Combine(folderPath,name);
            string newFile = Path.Combine(folderPath, newname);
            string oldExtensionFile = OSFileInfo.GetExtensionFilePath(oldFile);
            string newExtensionFile = OSFileInfo.GetExtensionFilePath(newFile);
            string oldThumbnailPath = AttachmentManager.GetThumbnailPath(oldFile, "thumbnail", "png");
            string newThumbnailPath = AttachmentManager.GetThumbnailPath(newFile, "thumbnail", "png");

            if (System.IO.File.Exists(newFile))
                throw new Exception(String.Format(Resources.YZStrings.Aspx_FileSystem_Ext_FileWithSameNameAleardyExist, newname));

            System.IO.File.Move(oldFile, newFile);

            if (System.IO.File.Exists(oldExtensionFile))
            {
                System.IO.File.Delete(newExtensionFile);
                System.IO.File.Move(oldExtensionFile, newExtensionFile);
            }

            if (System.IO.File.Exists(oldThumbnailPath))
            {
                System.IO.File.Delete(newThumbnailPath);
                System.IO.File.Move(oldThumbnailPath, newThumbnailPath);
            }
        }

        public static void MoveFiles(string folderPath, BPMObjectNameCollection excludes, string[] filenames, string targetfilename, MovePosition position)
        {
            OSFileInfoCollection fileInfos = GetFiles(folderPath,excludes);

            fileInfos.Move<string>("Name", filenames, targetfilename, position);

            for (int i = 0; i < fileInfos.Count; i++)
            {
                OSFileInfo fileInfo = fileInfos[i];
                fileInfo.OrderIndex = i;
                fileInfo.SaveExtensionInfo();
            }
        }

        public static string AddFileFromFileSystem(IYZDbProvider provider, IDbConnection cn, string folderPath, string fileid, bool thumbnail)
        {
            AttachmentInfo attachmentInfo = AttachmentManager.GetAttachmentInfo(provider, cn, fileid);

            string attachmentPath = AttachmentInfo.FileIDToPath(fileid, AttachmentManager.AttachmentRootPath);
            string newFilePath = GetUniqueFileName(Path.Combine(folderPath, attachmentInfo.Name + attachmentInfo.Ext));

            System.IO.File.Copy(attachmentPath, newFilePath, false);
            if (thumbnail)
            {
                string attachmentThumbnailPath = AttachmentManager.GetThumbnailPath(attachmentPath, "thumbnail", "png");
                string newFileThumbnailPath = AttachmentManager.GetThumbnailPath(newFilePath, "thumbnail", "png");

                if (System.IO.File.Exists(attachmentThumbnailPath))
                    System.IO.File.Copy(attachmentThumbnailPath, newFileThumbnailPath, true);
            }

            return newFilePath;
        }

        public static string GetUniqueFileName(string path)
        {
            if(!System.IO.File.Exists(path))
                return path;

            string folderPath = Path.GetDirectoryName(path);
            string fileNameNoExt = Path.GetFileNameWithoutExtension(path);
            string ext = Path.GetExtension(path);

            int i = 1;
            while(true)
            {
                string tempPath = Path.Combine(folderPath, fileNameNoExt + i.ToString() + ext);
                if (!System.IO.File.Exists(tempPath))
                    return tempPath;
                i++;
            }
        }

        #endregion
    }
}