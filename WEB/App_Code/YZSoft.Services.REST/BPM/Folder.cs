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
    public class FolderHandler : YZServiceHandler
    {
        public virtual JObject GetFolders(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            StoreZoneType zone = request.GetEnum<StoreZoneType>("zone");
            string path = request.GetString("node");
            bool expand = request.GetBool("expand",false);

            if (path == "root")
                path = null;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                JObject rv = new JObject();

                JArray items = new JArray();
                rv[YZJsonProperty.children] = items;

                this.ExpandTree(cn, items, path, zone, expand);

                rv[YZJsonProperty.success] = true;
                return rv;
            }
        }

        protected virtual void ExpandTree(BPMConnection cn, JArray items, string path, StoreZoneType zone, bool expand)
        {
            BPMObjectNameCollection folderNames = cn.GetFolders(zone, path, BPMPermision.Read);

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
                item["expanded"] = expand;
                item["path"] = folderPath;
                item["rsid"] = zone.ToString() + "://" + folderPath;

                JArray children = new JArray();
                item[YZJsonProperty.children] = children;
                this.ExpandTree(cn, children, folderPath, zone, expand);
            }
        }

        public virtual JObject CreateNewFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            StoreZoneType zone = request.GetEnum<StoreZoneType>("zone");
            string path = request.GetString("path","");

            string folderName;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                folderName = cn.CreateNewFolder(zone, path);
            }

            string folderPath;
            if (String.IsNullOrEmpty(path))
                folderPath = folderName;
            else
                folderPath = path + "/" + folderName;

            JObject item = new JObject();
            item["leaf"] = false;
            item["text"] = folderName;
            item["path"] = folderPath;
            item["rsid"] = zone.ToString() + "://" + folderPath;
            return item;
        }

        public virtual void DeleteFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            StoreZoneType zone = request.GetEnum<StoreZoneType>("zone");
            string path = request.GetString("path");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                cn.DeleteFolder(zone, path);
            }
        }

        public virtual string RenameFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            StoreZoneType zone = request.GetEnum<StoreZoneType>("zone");
            string path = request.GetString("path");
            string newname = request.GetString("newname");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return cn.RenameFolder(zone, path, newname);
            }
        }

        public virtual void SaveFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            SecurityResType securityResType = request.GetEnum<SecurityResType>("securityResType");
            string path = request.GetString("path", "");
            JObject post = request.GetPostData<JObject>();
            ACL acl = post["acl"].ToObject<ACL>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                SecurityManager.SaveACL(cn, securityResType, path, null, acl);
            }
        }

        public virtual void DeleteObjects(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            StoreZoneType zone = request.GetEnum<StoreZoneType>("zone");
            string folder = request.GetString("folder", "");
            JArray jPost = request.GetPostData<JArray>();
            StoreObjectIdentityCollection objects = jPost.ToObject<StoreObjectIdentityCollection>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                cn.DeleteObjects(zone, folder, objects);
            }
        }

        public virtual void RenameObject(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            StoreZoneType zone = request.GetEnum<StoreZoneType>("zone");
            string folder = request.GetString("folder", "");
            string name = request.GetString("name");
            string newname = request.GetString("newname");
            string path = System.IO.Path.Combine(folder, name);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                cn.RenameObject(zone, path, newname);
            }
        }
    }
}