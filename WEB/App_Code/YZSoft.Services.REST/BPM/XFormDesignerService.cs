using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.IO;
using System.Collections;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;

namespace YZSoft.Services.REST.BPM
{
    public class XFormDesignerServiceHandler : YZServiceHandler
    {
        public virtual object GetFormDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
           
                return new
                {
                    text = Convert.ToBase64String(cn.GetFormDefine(path))
                };
            }
        }

        public virtual object GetFormTemplate(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                return new
                {
                    text = Convert.ToBase64String(cn.GetFormTemplate(path))
                };
            }
        }

        public virtual object GetFormTemplates(HttpContext context)
        {
            YZRequest request = new YZRequest(context);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                BPMObjectNameCollection templateNames = cn.GetFormTemplates();

                return new
                {
                    templates = templateNames.ToArray()
                };
            }
        }

        public virtual object IsFormExist(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string folder = request.GetString("folder","");
            string fileName = request.GetString("fileName");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                return new
                {
                    exist = cn.IsObjectExist(StoreZoneType.Form, Path.Combine(folder, fileName))
                };
            }
        }

        public virtual void SaveFormDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string folder = request.GetString("folder","");
            string fileName = request.GetString("fileName");

            string path = request.GetString("path", "");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                JObject version = new JObject();
                version["lastUpdateTime"] = DateTime.Now;

                cn.SaveFormDefine(Path.Combine(folder, fileName), true, context.Request.InputStream);

                DataVersionManager.FormFolderVersion.UpdateVersion(folder, version);
            }
        }

        public virtual JObject GetDataVersionOfFormsInFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string folder = request.GetString("folder","");

            return DataVersionManager.FormFolderVersion.GetVersion(folder, null);
        }

        public virtual object GetAssemblies(HttpContext context)
        {
            string path = context.Server.MapPath("~/YZSoft/BPM/XFormAdmin/Install/SyncFiles/");
            return this.GetAssemblies(path);
        }

        protected virtual ArrayList GetAssemblies(string path)
        {
            ArrayList rv = new ArrayList();
            if (!Directory.Exists(path))
                return rv;

            DirectoryInfo dir = new DirectoryInfo(path);

            foreach (FileInfo fileInfo in dir.GetFiles())
            {
                if ((fileInfo.Attributes & FileAttributes.Directory) == 0 &&
                    (fileInfo.Attributes & FileAttributes.System) == 0 &&
                    (fileInfo.Attributes & FileAttributes.Hidden) == 0)
                {
                    rv.Add(new
                    {
                        Name = fileInfo.Name,
                        isFile = true,
                        Hash = this.HashFile(fileInfo.FullName)
                    });
                }
            }

            ArrayList folders = new ArrayList();
            foreach (DirectoryInfo dirInfo in dir.GetDirectories())
            {
                if ((dirInfo.Attributes & FileAttributes.Directory) != 0 &&
                    (dirInfo.Attributes & FileAttributes.System) == 0 &&
                    (dirInfo.Attributes & FileAttributes.Hidden) == 0)
                {
                    ArrayList children = this.GetAssemblies(dirInfo.FullName);

                    if (children.Count != 0)
                    {
                        rv.Add(new
                        {
                            Name = dirInfo.Name,
                            isFile = false,
                            isFolder = true,
                            Children = children
                        });
                    }
                }
            }

            return rv;
        }

        protected virtual string HashFile(string fileName)
        {
            if (!System.IO.File.Exists(fileName))
                return string.Empty;

            System.IO.FileStream fs = new System.IO.FileStream(fileName, System.IO.FileMode.Open, System.IO.FileAccess.Read);
            byte[] hashBytes = HashData(fs);
            fs.Close();
            return ByteArrayToHexString(hashBytes);
        }

        protected virtual byte[] HashData(System.IO.Stream stream)
        {
            System.Security.Cryptography.HashAlgorithm algorithm;
            algorithm = System.Security.Cryptography.SHA1.Create();
            return algorithm.ComputeHash(stream);
        }

        protected virtual string ByteArrayToHexString(byte[] buf)
        {
            return BitConverter.ToString(buf).Replace("-", "");
        }
    }
}