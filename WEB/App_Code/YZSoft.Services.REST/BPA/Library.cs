using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using BPM;
using BPM.Client;
using YZSoft.Web.DAL;
using YZSoft.Group;
using YZSoft.Library;
using YZSoft.Web.BPA;


namespace YZSoft.Services.REST.BPA
{
    public class LibraryHandler : YZServiceHandler
    {
        public virtual object GetProcessDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid");
            string filePath = AttachmentInfo.FileIDToPath(fileid, AttachmentManager.AttachmentRootPath);
            string uid = YZAuthHelper.LoginUserAccount;

            AttachmentInfo attachment;
            JObject jProcess;

            if (!System.IO.File.Exists(filePath))
                throw new Exception(String.Format(Resources.YZStrings.Aspx_Upload_FileIDNotFount, fileid));

            using (System.IO.StreamReader rd = new System.IO.StreamReader(filePath))
                jProcess = JObject.Parse(rd.ReadToEnd());

            bool writable;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    attachment = AttachmentManager.GetAttachmentInfo(provider, cn, fileid);

                    //文件夹
                    if(attachment.LParam1 == -1)
                    {
                        FileSystem.Folder folder = new FileSystem.Folder();
                        folder.FolderType = "BPAFileAttachments";
                        folder.ParentID = -1;
                        folder.Name = "";
                        folder.Desc = "";
                        folder.Owner = uid;
                        folder.CreateAt = DateTime.Now;
                        folder.OrderIndex = 1;

                        FileSystem.DirectoryManager.Insert(provider, cn, folder);
                        folder.RootID = folder.FolderID;
                        FileSystem.DirectoryManager.Update(provider, cn, folder);

                        FileSystem.DirectoryManager.Insert(provider, cn, folder);
                        attachment.LParam1 = folder.FolderID;
                        AttachmentManager.Update(provider, cn, attachment);
                    }

                    this.ApplyLinkText(provider, cn, jProcess["Nodes"] as JArray);

                    using(BPMConnection bpmcn = new BPMConnection())
                    {
                        bpmcn.WebOpen();
                        writable = BPAManager.ISBPAFileWritable(provider,cn,bpmcn,fileid);
                    }
                }
            }

            JObject jProperty = jProcess["Property"] as JObject;
            if (jProperty != null)
            {
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    string account;
                    account = (string)jProperty["Creator"];
                    if (!String.IsNullOrEmpty(account))
                    {
                        User user = User.TryGetUser(cn, account);
                        jProperty["CreatorShortName"] = user != null ? user.ShortName : account;
                    }

                    account = (string)jProperty["ChangeBy"];
                    if (!String.IsNullOrEmpty(account))
                    {
                        User user = User.TryGetUser(cn, account);
                        jProperty["ChangeByShortName"] = user != null ? user.ShortName : account;
                    }
                }
            }

            return new
            {
                attachment = attachment,
                writable = writable,
                processDefine = jProcess
            };
        }

        public virtual object GetNewFileInfo(HttpContext context)
        {
            string uid = YZAuthHelper.LoginUserAccount;

            FileSystem.Folder folder = new FileSystem.Folder();
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {

                    folder.FolderType = "BPAFileAttachments";
                    folder.ParentID = -1;
                    folder.Name = "";
                    folder.Desc = "";
                    folder.Owner = uid;
                    folder.CreateAt = DateTime.Now;
                    folder.OrderIndex = 1;

                    FileSystem.DirectoryManager.Insert(provider, cn, folder);
                    folder.RootID = folder.FolderID;
                    FileSystem.DirectoryManager.Update(provider, cn, folder);
                }
            }

            return new
            {
                fileid = AttachmentManager.GetNewFileID(),
                folderid = folder.FolderID
            };
        }

        public virtual SpriteIdentityCollection GetFileSprites(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    File file = File.Load(provider, cn, fileid);
                    return file.Sprites.SortByOrder().Identities;
                }
            }
        }

        public virtual object SaveProcessAs(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int folder = request.GetInt32("folder");
            string fileid = request.GetString("fileid");
            int filefolderid = request.GetInt32("filefolderid");
            string processName = request.GetString("processName");
            string ext = request.GetString("ext");

            JObject jPost = request.GetPostData<JObject>();
            JObject jProcess = (JObject)jPost["process"];
            JObject jChart = (JObject)jPost["chart"];

            if (jProcess["Property"] == null)
                jProcess["Property"] = new JObject();

            jProcess["Property"]["CreateAt"] = DateTime.Now;
            jProcess["Property"]["Creator"] = YZAuthHelper.LoginUserAccount;
            jProcess["Property"]["LastChange"] = DateTime.Now;
            jProcess["Property"]["ChangeBy"] = YZAuthHelper.LoginUserAccount;

            string savePath = AttachmentInfo.FileIDToPath(fileid, AttachmentManager.AttachmentRootPath);
            System.IO.Directory.CreateDirectory(savePath.Substring(0, savePath.LastIndexOf(@"\")));

            using(System.IO.StreamWriter ws = new System.IO.StreamWriter(savePath,false,System.Text.Encoding.UTF8))
                ws.Write(jProcess.ToString());

            AttachmentInfo attachment = new AttachmentInfo();
            attachment.FileID = fileid;
            attachment.Name = processName;
            attachment.Ext = ext;
            attachment.Size = 101;
            attachment.LastUpdate = DateTime.Now;
            attachment.OwnerAccount = YZAuthHelper.LoginUserAccount;
            attachment.LParam1 = filefolderid;

            YZSoft.FileSystem.File file = new YZSoft.FileSystem.File();
            file.FolderID = folder;
            file.FileID = fileid;
            file.AddBy = YZAuthHelper.LoginUserAccount;
            file.AddAt = DateTime.Now;
            file.Comments = "";

            File bpafile = jProcess.ToObject<File>();
            bpafile.FileID = fileid;
            bpafile.FileName = attachment.Name;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    AttachmentManager.Delete(provider, cn, attachment.FileID);
                    AttachmentManager.Insert(provider, cn, attachment);
                    file.OrderIndex = YZSoft.FileSystem.DirectoryManager.GetFileNextOrderIndex(provider, cn, folder);
                    FileSystem.DirectoryManager.Insert(provider,cn, file);

                    bpafile.UpdateSpritesIdentityAndLink(provider, cn);
                }
            }

            this.SaveChart(savePath, jChart);

            return new
            {
                success = true,
                fileid = file.FileID
            };
        }

        public virtual void SaveProcess(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid");

            JObject jPost = request.GetPostData<JObject>();
            JObject jProcess = (JObject)jPost["process"];
            JObject jChart = (JObject)jPost["chart"];

            string savePath = AttachmentInfo.FileIDToPath(fileid, AttachmentManager.AttachmentRootPath);

            if (jProcess["Property"] == null)
                jProcess["Property"] = new JObject();

            if(jProcess["Property"]["CreateAt"] != null)
                jProcess["Property"]["CreateAt"] = DateTime.Parse((string)jProcess["Property"]["CreateAt"]);

            jProcess["Property"]["LastChange"] = DateTime.Now;
            jProcess["Property"]["ChangeBy"] = YZAuthHelper.LoginUserAccount;

            System.IO.Directory.CreateDirectory(savePath.Substring(0, savePath.LastIndexOf(@"\")));

            using (System.IO.StreamWriter ws = new System.IO.StreamWriter(savePath, false, System.Text.Encoding.UTF8))
            {
                ws.Write(jProcess.ToString());
            }

            AttachmentInfo attachment;
            File bpafile = jProcess.ToObject<File>();
            bpafile.FileID = fileid;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    attachment = AttachmentManager.GetAttachmentInfo(provider, cn, fileid);
                    attachment.LastUpdate = DateTime.Now;
                    //AttachmentManager.(provider, cn, attachment);

                    bpafile.FileName = attachment.Name;
                    bpafile.UpdateSpritesIdentityAndLink(provider, cn);
                }
            }

            this.SaveChart(savePath, jChart);
        }

        public virtual object GetRootFolders(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int groupid = request.GetInt32("groupid", -1);
            string folderType = request.GetString("folderType");
            string uid = YZAuthHelper.LoginUserAccount;
            FileSystem.FolderCollection rootFolders = new FileSystem.FolderCollection();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    string filter = String.Format("FolderType=N'{0}'", provider.EncodeText(folderType));

                    LibraryCollection libs = LibraryManager.GetLibraries(provider, cn, uid, LibraryType.BPAFile.ToString(), null, null);
                    foreach (Library.Library lib in libs)
                    {
                        FileSystem.FolderCollection folders = FileSystem.DirectoryManager.GetFolders(provider, cn, lib.FolderID, filter, null);
                        foreach (FileSystem.Folder folder in folders)
                            folder.Name = lib.Name;

                        rootFolders.AddRange(folders);
                    }

                    if (groupid != -1)
                    {
                        Group.Group group = GroupManager.GetGroup(provider, cn, groupid);

                        FileSystem.FolderCollection folders = FileSystem.DirectoryManager.GetFolders(provider, cn, group.FolderID, filter, null);
                        foreach (FileSystem.Folder folder in folders)
                            folder.Name = group.Name;

                        rootFolders.AddRange(folders);
                    }
                }
            }

            return rootFolders;
        }

        public virtual SpriteLinkCollection GetSpriteUsedByLinks(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid");
            string spriteid = request.GetString("spriteid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    SpriteLinkCollection links = BPAManager.GetSpriteUsedByLinks(provider, cn, fileid, spriteid, null);
                    foreach (SpriteLink link in links)
                    {
                        AttachmentInfo attachmentInfo = AttachmentManager.TryGetAttachmentInfo(provider, cn, link.FileID);
                        if (attachmentInfo != null)
                        {
                            link["FileName"] = attachmentInfo.Name;
                            link["FileExt"] = attachmentInfo.Ext;
                            link["Attachment"] = JObject.FromObject(attachmentInfo);
                        }

                        SpriteIdentity spriteIdentity = BPAManager.TryGetSpriteIdentity(provider, cn, link.FileID, link.SpriteID);
                        if (spriteIdentity != null)
                        {
                            link["SpriteName"] = spriteIdentity.Name;
                        }
                    }

                    return links;
                }
            }
        }

        public virtual SpriteLinkCollection GetFileUsedByLinks(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    SpriteLinkCollection links = BPAManager.GetFileUsedByLinks(provider, cn, fileid, null);
                    foreach (SpriteLink link in links)
                    {
                        AttachmentInfo attachmentInfo = AttachmentManager.TryGetAttachmentInfo(provider, cn, link.FileID);
                        if (attachmentInfo != null)
                        {
                            link["FileName"] = attachmentInfo.Name;
                            link["FileExt"] = attachmentInfo.Ext;
                            link["Attachment"] = JObject.FromObject(attachmentInfo);
                        }

                        SpriteIdentity spriteIdentity = BPAManager.TryGetSpriteIdentity(provider, cn, link.FileID, link.SpriteID);
                        if (spriteIdentity != null)
                        {
                            link["SpriteName"] = spriteIdentity.Name;
                        }

                        //ExtJS grid grouping bug fix
                        if (String.IsNullOrEmpty(link.LinkedSpriteID))
                        {
                            link.LinkedSpriteID = "process";
                            link["LinkedSpriteName"] = Resources.YZStrings.All_Process;
                        }
                    }

                    return links;
                }
            }
        }

        public virtual void SetUserPositions(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JObject jPost = request.GetPostData<JObject>();
            UserPositionCollection positions = jPost["positions"].ToObject<UserPositionCollection>();
            string uid = YZAuthHelper.LoginUserAccount;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    provider.ClearUserPositions(cn, uid);
                    foreach(UserPosition pos in positions){
                        pos.UID = uid;
                        provider.Insert(cn, pos);
                    }
                }
            }
        }

        public virtual void ShareFiles(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int folderid = request.GetInt32("folderid");
            JObject post = request.GetPostData<JObject>();
            List<string> fileids = post["fileids"].ToObject<List<string>>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    YZSoft.FileSystem.FileCollection files = FileSystem.DirectoryManager.GetFiles(provider, cn, folderid, null, null, -1);
                    foreach (string fileid in fileids)
                    {
                        if (files.TryGetFileByID(fileid) == null)
                        {
                            YZSoft.FileSystem.File file = new YZSoft.FileSystem.File();
                            file.FolderID = folderid;
                            file.FileID = fileid;
                            file.AddBy = YZAuthHelper.LoginUserAccount;
                            file.AddAt = DateTime.Now;
                            file.Comments = "share";
                            file.OrderIndex = YZSoft.FileSystem.DirectoryManager.GetFileNextOrderIndex(provider, cn, folderid);

                            FileSystem.DirectoryManager.Insert(provider, cn, file);
                        }
                    }
                }
            }
        }

        protected virtual void ApplyLinkText(IYZDbProvider provider, IDbConnection cn, JArray jSprites)
        {
            if (jSprites == null)
                return;

            List<JObject> result = new List<JObject>();
            foreach (JObject jSprite in jSprites)
            {
                string relatiedFile = (string)jSprite["relatiedFile"];
                if (!String.IsNullOrEmpty(relatiedFile))
                {
                    AttachmentInfo attachmentInfo = AttachmentManager.TryGetAttachmentInfo(provider, cn, relatiedFile);
                    jSprite["relatiedFileName"] = attachmentInfo == null ? relatiedFile : attachmentInfo.Name;
                }

                YZJsonHelper.FindBy(jSprite["property"], result, new JsonFindCompare(this.isBPAReferenceCompare));
            }

            foreach (JObject jLink in result)
            {
                Reference reference = jLink.ToObject<Reference>();
                reference.RefreshName(provider, cn);
                jLink["FileName"] = reference.FileName;
                jLink["SpriteName"] = reference.SpriteName;
            }
        }

        protected virtual bool isBPAReferenceCompare(JObject jObject)
        {
            JToken jIsBPAReference = jObject["isBPAReference"];
            if (jIsBPAReference != null && jIsBPAReference.Type == JTokenType.Boolean && (bool)jIsBPAReference == true)
                return true;
            else
                return false;
        }

        protected virtual void SaveChart(string savePath, JObject jChart)
        {
            int bboxX = (int)jChart["bboxX"];
            int bboxY = (int)jChart["bboxY"];
            int bboxWidth = (int)jChart["bboxWidth"];
            int bboxHeight = (int)jChart["bboxHeight"];
            string imageBase64data = (string)jChart["data"];

            using (Image image = this.CreateThumbnail(imageBase64data, bboxX, bboxY, bboxWidth, bboxHeight, 164, 164))
            {
                string path = AttachmentManager.GetThumbnailPath(savePath, "thumbnail", "png");
                image.Save(path, ImageFormat.Png);
            }
        }

        protected virtual Image CreateThumbnail(string imageBase64Data, int bboxX, int bboxY, int bboxWidth, int bboxHeight, int width, int height)
        {
            using (Bitmap image = YZImageHelper.FromBase64String(imageBase64Data))
            {
                using (Bitmap clipImage = YZImageHelper.ClipImage(image, new Rectangle(bboxX, bboxY, bboxWidth, bboxHeight)))
                {
                    using (Image thumbnailImage = YZImageHelper.CreateThumbnail(clipImage, width, height))
                    {
                        return YZImageHelper.CenterImage(thumbnailImage, width, height);
                    }
                }
            }
        }
    }
}