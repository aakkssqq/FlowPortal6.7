using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;

namespace YZSoft.Services.REST.BPM
{
    public class AssemblyHandler : YZServiceHandler
    {
        public virtual JObject GetFolders(HttpContext context)
        {
            YZRequest request = new YZRequest(context);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                JObject rv = new JObject();

                JArray items = new JArray();
                rv[YZJsonProperty.children] = items;

                this.ExpandTree(cn, items, null);

                rv[YZJsonProperty.success] = true;
                return rv;
            }
        }

        protected virtual void ExpandTree(BPMConnection cn, JArray items, string path)
        {
            BPMObjectNameCollection folderNames = cn.GetFolders(StoreZoneType.Dll, path);

            foreach (String folderName in folderNames)
            {
                string folderPath;

                if (String.IsNullOrEmpty(path))
                    folderPath = folderName;
                else
                    folderPath = path + "/" + folderName;

                JObject item = new JObject();
                items.Add(item);
                item["leaf"] = false;
                item["text"] = folderName;
                item["expanded"] = false;
                item["path"] = folderPath;

                JArray children = new JArray();
                item[YZJsonProperty.children] = children;
                this.ExpandTree(cn, children, folderPath);
            }
        }

        public virtual JObject GetFilesInFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path",null);

            BPMFileInfoCollection fileInfos;

            //获得数据
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                fileInfos = cn.GetFileInfoList(StoreZoneType.Dll, path);
            }

            //将数据转化为Json集合
            JObject rv = new JObject();
            rv[YZJsonProperty.total] = fileInfos.Count;

            JArray children = new JArray();
            rv[YZJsonProperty.children] = children;

            foreach (BPMFileInfo fileInfo in fileInfos)
            {
                string fullName = String.IsNullOrEmpty(path) ? fileInfo.FileName : path + "/" + fileInfo.FileName;

                JObject item = new JObject();
                children.Add(item);

                item["FileName"] = fileInfo.FileName;
                item["FullName"] = fullName;
                item["Length"] = fileInfo.Length;
                item["LengthString"] = fileInfo.LengthString;
            }

            return rv;
        }

        public virtual BPMTypeInfoCollection GetTypes(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string assembly = request.GetString("assembly");

            using(BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return SafeAssembly.GetTypes(cn, StoreZoneType.Dll, assembly);
            }
        }

        public virtual BPMMethodInfoCollection GetMethods(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string assembly = request.GetString("assembly");
            string typeFullName = request.GetString("typeFullName");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return SafeAssembly.GetMethods(cn, StoreZoneType.Dll, assembly, typeFullName);
            }
        }
    }
}