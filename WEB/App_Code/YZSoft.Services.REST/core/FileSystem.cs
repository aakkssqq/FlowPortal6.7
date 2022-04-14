using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using BPM.Client.Notify;
using YZSoft.Web.DAL;
using YZSoft.FileSystem;

namespace YZSoft.Services.REST.core
{
    public class FileSystemHandler : YZServiceHandler
    {
        public virtual JObject GetFolders(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int folderid = request.GetInt32("node");
            bool checkpermision = request.GetBool("checkpermision", false);
            SecurityModel securitymodel = request.GetEnum<SecurityModel>("securitymodel",SecurityModel.RBAC);
            bool withfolder = request.GetBool("folder", true);
            bool withfile = request.GetBool("file", false);
            bool iconFromExt = request.GetBool("iconFromExt", false);
            bool expand = request.GetBool("expand", false);

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    using (BPMConnection bpmcn = new BPMConnection())
                    {
                        if (checkpermision && securitymodel == SecurityModel.RBAC)
                            bpmcn.WebOpen();

                        JObject rv = new JObject();

                        JArray items = new JArray();
                        rv[YZJsonProperty.children] = items;

                        this.ExpandTree(provider, cn, bpmcn, items, folderid, withfolder, withfile, expand, iconFromExt, checkpermision, securitymodel, true);

                        rv[YZJsonProperty.success] = true;
                        return rv;
                    }
                }
            }
        }

        public virtual JArray GetDeletedObjects(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            BPMObjectNameCollection libTypes = BPMObjectNameCollection.FromStringList(request.GetString("libTypes"), ',');
            string uid = YZAuthHelper.LoginUserAccount;

            JArray rv = new JArray();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    using (YZReader reader = new YZReader(provider.GetDeletedObjects(cn, libTypes, uid)))
                    {
                        while (reader.Read())
                        {
                            JObject jItem = new JObject();
                            rv.Add(jItem);

                            jItem["LibID"] = reader.ReadInt32("LibID");
                            jItem["LibType"] = reader.ReadString("LibType");
                            jItem["LibName"] = reader.ReadString("LibName");
                            jItem["LibDesc"] = reader.ReadString("LibDesc");
                            jItem["DeleteBy"] = reader.ReadString("DeleteBy");
                            jItem["DeleteAt"] = reader.ReadDateTime("DeleteAt");
                            jItem["Path"] = reader.ReadString("Path");
                            jItem["FolderID"] = reader.ReadInt32("FolderID");
                            jItem["Name"] = reader.ReadString("Name");
                            jItem["ID"] = reader.ReadInt32("ID");
                            jItem["FileID"] = reader.ReadString("FileID");
                            jItem["Ext"] = reader.ReadString("Ext");
                            jItem["Size"] = reader.ReadInt32("Size");
                            jItem["ObjectID"] = (int)jItem["ID"] == -1 ? String.Format("Folder-{0}", jItem["FolderID"]) : String.Format("File-{0}", jItem["ID"]);
                        }
                    }
                }
            }

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach(JObject jItem in rv)
                {
                    string deleteBy = (string)jItem["DeleteBy"];
                    User user = User.TryGetUser(cn, deleteBy);
                    jItem["DeleteByShortName"] = user == null ? deleteBy : user.ShortName;
                }
            }

            return rv;
        }

        public virtual object GetFolderObjects(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int parentFolderID = request.GetInt32("folderid");
            bool checkpermision = request.GetBool("checkpermision", false);
            SecurityModel securitymodel = request.GetEnum<SecurityModel>("securitymodel", SecurityModel.RBAC);
            string ext = request.GetString("ext", null);
            bool withfolder = request.GetBool("folder");
            bool withfile = request.GetBool("file");
            bool userName = request.GetBool("username", false);

            Folder folder = new Folder();
            List<object> children = new List<object>();

            bool haspermision = true;
            using(BPMConnection bpmcn = new BPMConnection())
            {
                if (checkpermision && securitymodel == SecurityModel.RBAC)
                {
                    bpmcn.WebOpen();
                    haspermision = SecurityManager.CheckPermision(bpmcn, Folder.GetRSID(parentFolderID), BPMPermision.Read);
                }
            }

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    folder = DirectoryManager.GetFolderByID(provider, cn, parentFolderID);

                    if (haspermision)
                    {
                        if (withfile)
                        {
                            FileCollection files = DirectoryManager.GetFiles(provider, cn, parentFolderID, null, null, -1);
                            foreach (File file in files)
                            {
                                AttachmentInfo attachmentInfo = AttachmentManager.TryGetAttachmentInfo(provider, cn, file.FileID);
                                if (attachmentInfo == null)
                                    continue;

                                if (!String.IsNullOrEmpty(ext) && !NameCompare.EquName(attachmentInfo.Ext, ext))
                                    continue;

                                JObject jFile = JObject.FromObject(file);
                                children.Add(jFile);

                                jFile["Name"] = attachmentInfo.Name;
                                jFile["Size"] = attachmentInfo.Size;
                                jFile["LastUpdate"] = attachmentInfo.LastUpdate;
                                jFile["OwnerAccount"] = attachmentInfo.OwnerAccount;
                            }
                        }

                        if (withfolder)
                            children.AddRange(DirectoryManager.GetFolders(provider, cn, parentFolderID, null, null));
                    }
                }
            }

            if (userName)
            {
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach (object item in children)
                    {
                        JObject jFile = item as JObject;
                        if (jFile != null)
                        {
                            User user = User.TryGetUser(cn,(string)jFile["OwnerAccount"]);
                            jFile["OwnerDisplayName"] = user != null ? user.ShortName : jFile["OwnerAccount"];
                        }
                    }
                }
            }

            return new {
                metaData = folder,
                children = children
            };
        }

        public virtual string RenameFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int folderid = request.GetInt32("folderid");
            string newName = request.GetString("newName");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return DirectoryManager.RenameFolder(provider, cn, folderid, newName);
                }  
            }
        }

        public virtual object CreateFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int folderid = request.GetInt32("folderid");
            SecurityModel securitymodel = request.GetEnum<SecurityModel>("securitymodel",SecurityModel.Empty);
            string name = request.GetString("name");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    Folder parentFolder = DirectoryManager.GetFolderByID(provider, cn, folderid);
                    
                    Folder folder = new Folder();
                    folder.RootID = parentFolder.RootID;
                    folder.FolderType = parentFolder.FolderType;
                    folder.ParentID = folderid;
                    folder.Name = name;
                    folder.Desc = "";
                    folder.Owner = YZAuthHelper.LoginUserAccount;
                    folder.CreateAt = DateTime.Now;
                    folder.OrderIndex = DirectoryManager.GetFolderNextOrderIndex(provider, cn, folderid);

                    DirectoryManager.Insert(provider, cn, folder);

                    if (securitymodel == SecurityModel.RBAC)
                    {
                        using (BPMConnection bpmcn = new BPMConnection())
                        {
                            bpmcn.WebOpen();
                            SecurityManager.InheriACL(bpmcn, SecurityResType.FileSystemFolder.ToString() + "://" + folder.ParentID.ToString(), SecurityResType.FileSystemFolder + "://" + folder.FolderID.ToString());
                        }
                    }

                    return this.Serialize(folder, true);
                }
            }
        }

        public virtual Folder GetFolderInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int folderid = request.GetInt32("folderid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return DirectoryManager.GetFolderByID(provider, cn, folderid);
                }
            }
        }

        public virtual void DeleteObjects(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JObject post = request.GetPostData<JObject>();
            List<int> fileids = post["fileids"].ToObject<List<int>>();
            List<int> folderids = post["folderids"].ToObject<List<int>>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    foreach (int fileid in fileids)
                        DirectoryManager.DeleteFile(provider, cn, fileid);
                    foreach(int folderid in folderids)
                        DirectoryManager.DeleteFolder(provider, cn, folderid);
                }
            }
        }

        public virtual void DeleteObjectsPhysical(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JObject post = request.GetPostData<JObject>();
            List<int> fileids = post["fileids"].ToObject<List<int>>();
            List<int> folderids = post["folderids"].ToObject<List<int>>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    foreach (int fileid in fileids)
                        DirectoryManager.DeleteFilePhysical(provider, cn, fileid);
                    foreach (int folderid in folderids)
                        DirectoryManager.DeleteFolderPhysical(provider, cn, folderid);
                }
            }
        }

        public virtual void DeleteFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int folderid = request.GetInt32("folderid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    DirectoryManager.DeleteFolder(provider, cn, folderid);
                }
            }
        }

        public virtual void DeleteFiles(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JArray post = request.GetPostData<JArray>();
            List<int> fileids = post.ToObject<List<int>>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    foreach (int fileid in fileids)
                        DirectoryManager.DeleteFile(provider, cn, fileid);
                }
            }
        }

        public virtual File CloneFile(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int fileid = request.GetInt32("fileid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return DirectoryManager.CloneFile(provider, cn, fileid);
                }
            }
        }

        public virtual void RestoreObjects(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            bool phyDelete = request.GetBool("phyDelete", false);
            JObject post = request.GetPostData<JObject>();
            List<int> fileids = post["fileids"].ToObject<List<int>>();
            List<int> folderids = post["folderids"].ToObject<List<int>>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    foreach (int fileid in fileids)
                        DirectoryManager.RestoreFile(provider, cn, fileid);
                    foreach (int folderid in folderids)
                        DirectoryManager.RestoreFolder(provider, cn, folderid);
                }
            }
        }

        public virtual object GetFolderDocuments(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int folderid = request.GetInt32("folderid");
            int top = request.GetInt32("top",-1);
            string order = request.GetString("order", null);

            using (BPMConnection bpmcn = new BPMConnection())
            {
                bpmcn.WebOpen();
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {
                        List<object> rv = new List<object>();
                        FileCollection files = DirectoryManager.GetFiles(provider, cn, folderid, null, order, top);
                        foreach (File file in files)
                        {
                            AttachmentInfo attachmentInfo = AttachmentManager.TryGetAttachmentInfo(provider, cn, file.FileID);
                            if (attachmentInfo == null)
                                continue;

                            rv.Add(this.Serialize(bpmcn, file, attachmentInfo));
                        }

                        return rv;
                    }
                }
            }
        }

        public virtual object AddAttachmentToFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int folderid = request.GetInt32("folderid");
            string fileid = request.GetString("fileid");
            string flag = request.GetString("flag",null);

            AttachmentInfo attachmentInfo;
            File file = new File();
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    attachmentInfo = AttachmentManager.GetAttachmentInfo(provider, cn, fileid);

                    file.FolderID = folderid;
                    file.FileID = fileid;
                    file.AddBy = YZAuthHelper.LoginUserAccount;
                    file.AddAt = DateTime.Now;
                    file.Flag = flag;
                    file.OrderIndex = DirectoryManager.GetFileNextOrderIndex(provider, cn, folderid);

                    DirectoryManager.Insert(provider, cn, file);
                }
            }

            using (BPMConnection bpmcn = new BPMConnection())
            {
                bpmcn.WebOpen();
                return this.Serialize(bpmcn, file, attachmentInfo);
            }
        }

        public virtual object UpdateAttachment(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int id = request.GetInt32("id");
            string fileid = request.GetString("fileid");
            string replacewithfileid = request.GetString("replacewithfileid");

            File file;
            AttachmentInfo attachmentInfo;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    file = DirectoryManager.GetFileByID(provider, cn, id);
                    attachmentInfo = AttachmentManager.UpdateAttachment(provider, cn, fileid, replacewithfileid);
                }
            }

            using (BPMConnection bpmcn = new BPMConnection())
            {
                bpmcn.WebOpen();
                return this.Serialize(bpmcn, file, attachmentInfo);
            }
        }

        public virtual void MoveFolders(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int targetfolderid = request.GetInt32("targetfolderid");
            MovePosition position = request.GetEnum<MovePosition>("position");
            JArray post = request.GetPostData<JArray>();
            List<int> folderids = post.ToObject<List<int>>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    DirectoryManager.MoveFolders(provider, cn, folderids.ToArray(), targetfolderid, position);
                }
            }
        }

        public virtual void MoveFiles(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int folderid = request.GetInt32("folderid");
            int targetfileid = request.GetInt32("targetfileid");
            MovePosition position = request.GetEnum<MovePosition>("position");
            JArray post = request.GetPostData<JArray>();
            List<int> fileids = post.ToObject<List<int>>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    DirectoryManager.MoveFiles(provider, cn, folderid, fileids.ToArray(), targetfileid, position);
                }
            }
        }

        public virtual void MoveObjectsToFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int targetfolderid = request.GetInt32("targetfolderid");
            JObject post = request.GetPostData<JObject>();
            List<int> fileids = post["fileids"].ToObject<List<int>>();
            List<int> folderids = post["folderids"].ToObject<List<int>>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    DirectoryManager.MoveFilesToFolder(provider, cn, fileids.ToArray(), targetfolderid);
                    DirectoryManager.MoveFolders(provider, cn, folderids.ToArray(), targetfolderid, MovePosition.Append);
                }
            }
        }

        public virtual List<int> GetFolderPath(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int folderid = request.GetInt32("folderid");
            List<int> path = new List<int>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    while (true)
                    {
                        Folder folder = DirectoryManager.GetFolderByID(provider, cn, folderid);
                        path.Insert(0,folder.FolderID);

                        folderid = folder.ParentID;

                        if (folderid == -1)
                            return path;
                    }
                }
            }
        }

        protected virtual void ExpandTree(IYZDbProvider provider, IDbConnection cn, BPMConnection bpmcn, JArray items, int folderid, bool withfolder, bool withfile, bool expand, bool iconFromExt, bool checkpermision, SecurityModel securitymodel, bool listfilecheckpermision)
        {
            FolderCollection folders = DirectoryManager.GetFolders(provider, cn, folderid, null, null);

            if (withfolder)
            {
                foreach (Folder folder in folders)
                {
                    if (checkpermision && securitymodel == SecurityModel.RBAC && !SecurityManager.CheckPermision(bpmcn, folder.RSID, BPMPermision.Read))
                        continue;

                    JObject item = this.Serialize(folder, expand);
                    items.Add(item);

                    JArray children = new JArray();
                    item[YZJsonProperty.children] = children;
                    this.ExpandTree(provider, cn, bpmcn, children, folder.FolderID, withfolder, withfile, expand, iconFromExt, checkpermision, securitymodel, false);
                }
            }

            if (withfile)
            {
                if (checkpermision && listfilecheckpermision && securitymodel == SecurityModel.RBAC && !SecurityManager.CheckPermision(bpmcn, Folder.GetRSID(folderid), BPMPermision.Read))
                {
                }
                else
                {
                    FileCollection files = DirectoryManager.GetFiles(provider, cn, folderid, null, null, -1);
                    foreach (File file in files)
                    {
                        AttachmentInfo attachmentInfo = AttachmentManager.TryGetAttachmentInfo(provider, cn, file.FileID);
                        if (attachmentInfo == null)
                            continue;

                        JObject item = this.Serialize(file, attachmentInfo, iconFromExt);
                        items.Add(item);
                    }
                }
            }
        }

        protected virtual JObject Serialize(Folder folder, bool expand)
        {
            JObject item = new JObject();
            item["leaf"] = false;
            item["text"] = folder.Name;
            item["expanded"] = expand;
            item["path"] = folder.FolderID;
            item["folderid"] = folder.FolderID;
            item["isFolder"] = true;
            item["FolderType"] = folder.FolderType;
            return item;
        }

        protected virtual JObject Serialize(File file, AttachmentInfo attachmentInfo, bool iconFromExt)
        {
            JObject item = new JObject();
            item["leaf"] = true;
            item["text"] = attachmentInfo.Name;
            //item["iconCls"] = "file";
            item["path"] = file.FileID;
            item["fileid"] = file.FileID;
            item["isFile"] = true;
            item["Ext"] = attachmentInfo.Ext;
            return item;
        }

        protected virtual JObject Serialize(BPMConnection cn, File file, AttachmentInfo attachmentInfo)
        {
            JObject jFile = JObject.FromObject(file);

            jFile["Ext"] = attachmentInfo.Ext;
            jFile["Name"] = attachmentInfo.Name;
            jFile["Size"] = attachmentInfo.Size;
            jFile["LastUpdate"] = attachmentInfo.LastUpdate;
            jFile["OwnerAccount"] = attachmentInfo.OwnerAccount;

            User user = User.TryGetUser(cn, file.AddBy);
            jFile["CreatorShortName"] = user == null ? file.AddBy : user.ShortName;
            return jFile;
        }
    }
}