using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using YZSoft.Web.DAL;
using YZSoft.Group;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.FileSystem;
using YZSoft.Library;

namespace YZSoft.Services.REST.core
{
    public class LibraryHandler : YZServiceHandler
    {
        public virtual LibraryCollection GetUserLibraries(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = YZAuthHelper.LoginUserAccount;
            string libType = request.GetString("libType");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return LibraryManager.GetLibraries(provider, cn, uid, libType, null, null);
                }
            }
        }

        public virtual object GetLibrary(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int libid = request.GetInt32("libid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return LibraryManager.GetLibrary(provider, cn, libid);
                }
            }
        }

        public virtual object GetRootFolders(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string libType = request.GetString("libType");
            string uid = YZAuthHelper.LoginUserAccount;
            FolderCollection rootFolders = new FolderCollection();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    LibraryCollection libs = LibraryManager.GetLibraries(provider, cn, uid, libType, null, null);
                    foreach (Library.Library lib in libs)
                    {
                        Folder folder = DirectoryManager.GetFolderByID(provider,cn,lib.FolderID);
                        folder.Name = lib.Name;

                        rootFolders.Add(folder);
                    }
                }
            }

            return rootFolders;
        }

        public virtual void DeleteLibraries(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JObject post = request.GetPostData<JObject>();
            List<int> libids = post["libids"].ToObject<List<int>>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    foreach (int libid in libids)
                        LibraryManager.DeleteLibrary(provider, cn, libid);
                }
            }
        }

        public virtual void RenameLibrary(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int libid = request.GetInt32("libid");
            string newName = request.GetString("newName");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    LibraryManager.RenameLibrary(provider, cn, libid, newName);
                }
            }
        }

        public virtual Library.Library UpdateLibrary(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int libid = request.GetInt32("libid");
            bool updateProperty = request.GetBool("property", true);
            bool updateAcl = request.GetBool("acl",true);
            JObject jPost = request.GetPostData<JObject>();
            Library.Library libPost = jPost["data"].ToObject<Library.Library>();
            ACL acl = jPost["acl"].ToObject<ACL>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    Library.Library lib = LibraryManager.GetLibrary(provider, cn, libid);

                    if (updateProperty)
                    {
                        lib.ImageFileID = libPost.ImageFileID;
                        lib.Name = libPost.Name;
                        lib.Desc = libPost.Desc;

                        LibraryManager.Update(provider, cn, lib);
                    }

                    if (updateAcl)
                    {
                        using (BPMConnection bpmcn = new BPMConnection())
                        {
                            bpmcn.WebOpen();
                            SecurityManager.SaveACL(bpmcn, SecurityResType.Library, lib.LibID.ToString(), null, acl);
                        }
                    }

                    return lib;
                }
            }
        }

        public virtual Library.Library CreateLibrary(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string libType = request.GetString("libType");
            string FolderID = request.GetString("FolderID", null);
            string DocumentFolderID = request.GetString("DocumentFolderID", null);
            JObject jPost = request.GetPostData<JObject>();
            Library.Library libPost = jPost["data"].ToObject<Library.Library>();
            ACL acl = jPost["acl"].ToObject<ACL>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    Library.Library lib = new Library.Library();
                    lib.LibType = libType;
                    lib.Name = libPost.Name;
                    lib.Desc = libPost.Desc;

                    if (!String.IsNullOrEmpty(FolderID))
                    {
                        Folder folder = this.CreateLibFolder(provider,cn,libPost.Name,FolderID);
                        lib.FolderID = folder.FolderID;
                    }

                    if (!String.IsNullOrEmpty(DocumentFolderID))
                    {
                        Folder folder = this.CreateLibFolder(provider, cn, libPost.Name, DocumentFolderID);
                        lib.DocumentFolderID = folder.FolderID;
                    }

                    lib.Owner = YZAuthHelper.LoginUserAccount;
                    lib.CreateAt = DateTime.Now;
                    lib.ImageFileID = libPost.ImageFileID;
                    lib.OrderIndex = LibraryManager.GetLibraryNextOrderIndex(provider, cn, libType);
                    lib.Deleted = false;

                    LibraryManager.Insert(provider, cn, lib);

                    using (BPMConnection bpmcn = new BPMConnection())
                    {
                        bpmcn.WebOpen();
                        SecurityManager.SaveACL(bpmcn, SecurityResType.Library, lib.LibID.ToString(),null, acl);
                    }

                    return lib;
                }
            }
        }

        public virtual void MoveLibraries(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = YZAuthHelper.LoginUserAccount;
            string libType = request.GetString("libType");
            int targetlibid = request.GetInt32("targetlibid");
            MovePosition position = request.GetEnum<MovePosition>("position");
            JArray post = request.GetPostData<JArray>();
            List<int> libids = post.ToObject<List<int>>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    LibraryManager.MoveLibraries(provider, cn, libType, libids.ToArray(), targetlibid, position);
                }
            }
        }

        protected virtual Folder CreateLibFolder(IYZDbProvider provider, IDbConnection cn, string name, string folderType)
        {
            string uid = YZAuthHelper.LoginUserAccount;

            Folder folder = new Folder();
            folder.FolderType = folderType;
            folder.ParentID = -1;
            folder.Name = name;
            folder.Desc = "";
            folder.Owner = uid;
            folder.CreateAt = DateTime.Now;
            folder.OrderIndex = 1;

            DirectoryManager.Insert(provider, cn, folder);
            folder.RootID = folder.FolderID;
            DirectoryManager.Update(provider, cn, folder);

            if (NameCompare.EquName(folderType, "BPALibrary"))
            {
                Folder childFolder = new Folder();

                childFolder.ParentID = folder.FolderID;
                childFolder.RootID = folder.RootID;
                childFolder.Owner = uid;
                childFolder.CreateAt = DateTime.Now;
                folder.Desc = "";

                childFolder.FolderType = "BPAProcess";
                childFolder.Name = Resources.YZStrings.BPA_Process;
                childFolder.OrderIndex = 1;
                DirectoryManager.Insert(provider, cn, childFolder);

                childFolder.FolderType = "BPAOU";
                childFolder.Name = Resources.YZStrings.BPA_OU;
                childFolder.OrderIndex = 2;
                DirectoryManager.Insert(provider, cn, childFolder);

                childFolder.FolderType = "BPAProduct";
                childFolder.Name = Resources.YZStrings.BPA_Product;
                childFolder.OrderIndex = 3;
                DirectoryManager.Insert(provider, cn, childFolder);

                childFolder.FolderType = "BPAData";
                childFolder.Name = Resources.YZStrings.BPA_Data;
                childFolder.OrderIndex = 4;
                DirectoryManager.Insert(provider, cn, childFolder);

                childFolder.FolderType = "BPAITSystem";
                childFolder.Name = Resources.YZStrings.BPA_ITSystem;
                childFolder.OrderIndex = 5;
                DirectoryManager.Insert(provider, cn, childFolder);

                childFolder.FolderType = "BPAControl";
                childFolder.Name = Resources.YZStrings.BPA_Control;
                childFolder.OrderIndex = 6;
                DirectoryManager.Insert(provider, cn, childFolder);
            }

            return folder;
        }
    }
}