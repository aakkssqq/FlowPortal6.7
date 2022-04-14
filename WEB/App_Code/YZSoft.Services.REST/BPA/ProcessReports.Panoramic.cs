using System;
using System.Web;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Web.UI.WebControls;
using BPM;
using YZSoft.Web.DAL;
using YZSoft.Library;
using YZSoft.Group;
using YZSoft.Web.BPA;

namespace YZSoft.Services.REST.BPA
{
    partial class ProcessReportsHandler
    {
        public virtual object GetPanoramicTree(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int folderid = request.GetInt32("node");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    FileCollection files = new FileCollection();

                    FileSystem.FileCollection allfiles = new FileSystem.FileCollection();
                    FileSystem.FolderCollection allfolders = FileSystem.DirectoryManager.GetAllChildFolders(provider, cn, folderid, null, null);
                    FileSystem.FolderCollection rootFolders = allfolders.BuildTree(folderid);
                    allfolders = rootFolders.Expand();

                    FileSystem.FileCollection folderfiles = FileSystem.DirectoryManager.GetFiles(provider, cn, allfolders.IDs, null, null, -1);
                    allfiles.AppendUnique(folderfiles);

                    foreach (FileSystem.File folderfile in allfiles)
                    {
                        File file = File.TryLoad(provider, cn, folderfile.FileID);
                        if (file == null)
                            continue;

                        files.Add(file);
                    }

                    JObject rv = new JObject();

                    JArray items = new JArray();
                    rv[YZJsonProperty.children] = items;

                    this.ExpandTree(provider, cn, items, this.GetRootFiles(files), files);

                    rv[YZJsonProperty.success] = true;
                    return rv;
                }
            }
        }

        protected virtual void ExpandTree(IYZDbProvider provider, IDbConnection cn, JArray items, FileCollection files, FileCollection allFiles)
        {
            foreach (File file in files)
            {
                FileCollection childFiles = this.GetAllChildrenFiles(file, allFiles);

                JObject item = new JObject();
                items.Add(item);
                item["leaf"] = childFiles.Count == 0;
                item["text"] = file.FileName;
                item["fileid"] = file.FileName;
                item["type"] = file.isStrategicProces ? "Strategic" : (file.isOperationProcess ? "Operation" : "Support");

                if (childFiles.Count != 0)
                {
                    JArray children = new JArray();
                    item[YZJsonProperty.children] = children;
                    this.ExpandTree(provider, cn, children, childFiles, allFiles);
                }
            }
        }

        protected virtual FileCollection GetRootFiles(FileCollection allfiles)
        {
            FileCollection files = new FileCollection();

            foreach (File file in allfiles)
            {
                if (file.isStrategicProces ||
                    file.isOperationProcess)
                {
                    FileCollection usedByFiles = this.GetAllUsedByFiles(file, allfiles);
                    if (usedByFiles.Count == 0)
                    {
                        files.Add(file);
                    }
                }
            }

            return files.SortByOrder();
        }

        protected virtual FileCollection GetAllUsedByFiles(File file, FileCollection allfiles)
        {
            FileCollection files = new FileCollection();

            foreach (File tmpfile in allfiles)
            {
                if (Object.ReferenceEquals(tmpfile, file))
                    continue;

                if (files.Contains(tmpfile.FileID))
                    continue;

                foreach (Sprite sprite in tmpfile.Sprites.SortByOrder())
                {
                    if (sprite.RelatiedFile == file.FileID)
                    {
                        files.Add(tmpfile);
                        break;
                    }
                }
            }

            return files.SortByOrder();
        }

        protected virtual FileCollection GetAllChildrenFiles(File file, FileCollection allfiles)
        {
            FileCollection files = new FileCollection();

            foreach (Sprite sprite in file.Sprites.SortByOrder())
            {
                if (sprite.RelatiedFile == file.FileID)
                    continue;

                File relatiedFile = allfiles.TryGetItem(sprite.RelatiedFile);

                if (relatiedFile != null && !files.Contains(relatiedFile.FileID))
                    files.Add(relatiedFile);
            }

            return files.SortByOrder();
        }
    }
}