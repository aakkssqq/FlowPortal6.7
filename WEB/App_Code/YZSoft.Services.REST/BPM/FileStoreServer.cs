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
    public class FileStoreServerHandler : YZServiceHandler
    {
        public virtual object GetFolders(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string serverName = request.GetString("serverName");
            string path = request.GetString("node", null);
            if (YZStringHelper.EquName(path, "root"))
                path = null;

            LocalServer localServer = new LocalServer();
            localServer.Name = "localhost";

            JObject rv = new JObject();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                JArray children = new JArray();
                rv[YZJsonProperty.children] = children;

                if (String.IsNullOrEmpty(path))
                {
                    FSSDriveInfoCollection drivers = FileStoreManager.GetDrivers(cn, serverName);
                    foreach (FSSDriveInfo driveInfo in drivers)
                    {
                        JObject item = new JObject();
                        children.Add(item);
                        item["leaf"] = false;
                        item["glyph"] = 0xeaf3;
                        item["text"] = driveInfo.VolumeLabel + " (" + driveInfo.Name.Substring(0, 2) + ")";
                        item["path"] = driveInfo.Path;
                        item["expanded"] = false;
                        item["enpandable"] = true;
                    }
                }

                FSSFolderInfoCollection folders = FileStoreManager.GetFolders(cn, serverName, path);
                foreach (FSSFolderInfo folderInfo in folders)
                {
                    JObject item = new JObject();
                    children.Add(item);
                    item["text"] = folderInfo.Name;
                    item["path"] = folderInfo.Path;
                    item["leaf"] = false;
                    item["expanded"] = false;
                    item["enpandable"] = true;
                }
            }

            //输出数据
            return rv;
        }

        protected virtual JObject GetNodeData(OU ou)
        {
            JObject node = new JObject();

            node["Name"] = ou.Name;
            node["Code"] = ou.Code;
            node["FullName"] = ou.FullName;
            node["Level"] = ou.OULevel;
            node["SID"] = ou.SID;

            foreach (string attrName in ou.ExtAttrNames)
                node[attrName] = Convert.ToString(ou[attrName]);

            return node;
        }
    }
}