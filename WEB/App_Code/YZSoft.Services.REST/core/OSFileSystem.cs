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
using System.IO;
using YZSoft.FileSystem;
using YZSoft.Web.DAL;

namespace YZSoft.Services.REST.core
{
    public class OSFileSystemHandler : YZServiceHandler
    {
        public virtual object GetFolderDocuments(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string root = request.GetString("root");
            string path = request.GetString("path", "");
            BPMObjectNameCollection excludes = BPMObjectNameCollection.FromStringList(request.GetString("excludes", null), ',');

            string rootPath = OSDirectoryManager.GetRootPath(context, root);
            string folderPath = Path.Combine(rootPath,path);

            OSFileInfoCollection files = OSDirectoryManager.GetFiles(folderPath, excludes);
            return this.Serialize(files, path);
        }

        public virtual void DeleteFiles(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string root = request.GetString("root");
            string path = request.GetString("path", null);
            string rootPath = OSDirectoryManager.GetRootPath(context, root);
            string folderPath = Path.Combine(rootPath, path);
            JArray post = request.GetPostData<JArray>();
            List<string> filenames = post.ToObject<List<string>>();

            foreach (string filename in filenames)
            {
                OSDirectoryManager.DeleteFile(folderPath, filename);
            }
        }

        public virtual JObject RenameFile(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string root = request.GetString("root");
            string path = request.GetString("path", null);
            string name = request.GetString("name");
            string newname = request.GetString("newname");

            string rootPath = OSDirectoryManager.GetRootPath(context, root);
            string folderPath = Path.Combine(rootPath, path);

            OSDirectoryManager.RenameFile(folderPath, name, newname);

            OSFileInfo fileinfo = new OSFileInfo(Path.Combine(folderPath, newname));
            return this.Serialize(fileinfo, path);
        }

        public virtual void MoveFiles(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string root = request.GetString("root");
            string path = request.GetString("path", null);
            BPMObjectNameCollection excludes = BPMObjectNameCollection.FromStringList(request.GetString("excludes", null), ',');
            string tergetfilename = request.GetString("tergetfilename");
            MovePosition position = request.GetEnum<MovePosition>("position");

            string rootPath = OSDirectoryManager.GetRootPath(context, root);
            string folderPath = Path.Combine(rootPath, path);
            JArray post = request.GetPostData<JArray>();
            List<string> filenames = post.ToObject<List<string>>();

            OSDirectoryManager.MoveFiles(folderPath, excludes, filenames.ToArray(), tergetfilename, position);
        }

        public virtual JObject AddFileFromFileSystem(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            bool thumbnail = request.GetBool("thumbnail",false);
            string root = request.GetString("root");
            string path = request.GetString("path", null);
            string fileid = request.GetString("fileid");

            string rootPath = OSDirectoryManager.GetRootPath(context, root);
            string folderPath = Path.Combine(rootPath, path);

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    string file = OSDirectoryManager.AddFileFromFileSystem(provider, cn, folderPath, fileid, thumbnail);
                    OSFileInfo fileinfo = new OSFileInfo(file);
                    return this.Serialize(fileinfo, path);
                }
            }
        }

        protected virtual JArray Serialize(OSFileInfoCollection fileInfos, string path)
        {
            JArray rv = new JArray();
            foreach (OSFileInfo fileInfo in fileInfos)
                rv.Add(this.Serialize(fileInfo, path));

            return rv;
        }

        protected virtual JObject Serialize(OSFileInfo fileinfo, string path)
        {
            JObject jFile = JObject.FromObject(fileinfo);

            jFile["Path"] = path;
            jFile["Ext"] = fileinfo.FileInfo.Extension;
            jFile["NameNoExt"] = Path.GetFileNameWithoutExtension(fileinfo.FileInfo.Name);
            jFile["Name"] = fileinfo.FileInfo.Name;
            jFile["Size"] = fileinfo.FileInfo.Length;
            jFile["AddAt"] = fileinfo.FileInfo.CreationTime;
            jFile["LastUpdate"] = fileinfo.FileInfo.LastWriteTime;
            jFile["LastUpdate"] = fileinfo.FileInfo.LastWriteTime;

            return jFile;
        }
    }
}