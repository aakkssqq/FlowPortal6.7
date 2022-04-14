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
    public class StoreServiceHandler : YZServiceHandler
    {
        public virtual JObject GetFolders(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            StoreZoneType zone = request.GetEnum<StoreZoneType>("zone");
            string path = request.GetString("node");
            BPMPermision perm = request.GetEnum<BPMPermision>("perm", BPMPermision.Read);
            bool expand = request.GetBool("expand",false);

            if (path == "root")
                path = null;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                JObject rv = new JObject();

                JArray items = new JArray();
                rv[YZJsonProperty.children] = items;

                this.ExpandTree(cn, items, path, zone, perm, expand);

                rv[YZJsonProperty.success] = true;
                return rv;
            }
        }

        protected virtual void ExpandTree(BPMConnection cn, JArray items, string path, StoreZoneType zone, BPMPermision perm, bool expand)
        {
            BPMObjectNameCollection folderNames = cn.GetFolders(zone, path, perm);

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
                this.ExpandTree(cn, children, folderPath, zone, perm, expand);
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

        public virtual StoreObjectIdentityCollection CloneObjects(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            StoreZoneType zone = request.GetEnum<StoreZoneType>("zone");
            string folder = request.GetString("folder", "");
            JArray jPost = request.GetPostData<JArray>();
            StoreObjectIdentityCollection objects = jPost.ToObject<StoreObjectIdentityCollection>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return cn.CloneObjects(zone, folder, objects);
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

        public virtual object MoveFolders(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            StoreZoneType zone = request.GetEnum<StoreZoneType>("zone");
            string targetPath = request.GetString("targetPath",null);
            MovePosition position = request.GetEnum<MovePosition>("position");
            JArray post = request.GetPostData<JArray>();
            BPMObjectNameCollection paths = post.ToObject<BPMObjectNameCollection>();

            List<string> rv = new List<string>();
            using(BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach (string path in paths)
                {
                    rv.Add(cn.MoveFolder(zone, path, targetPath, position));
                }
            }

            return rv;
        }

        public virtual void MoveObjects(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            StoreZoneType zone = request.GetEnum<StoreZoneType>("zone");
            string folder = request.GetString("folder", null);
            string tergetname = request.GetString("tergetname", null);
            MovePosition position = request.GetEnum<MovePosition>("position");
            JArray post = request.GetPostData<JArray>();
            BPMObjectNameCollection names = post.ToObject<BPMObjectNameCollection>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                cn.MoveObjects(zone, folder, names, tergetname, position);
            }
        }

        public virtual void MoveObjectsToFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            StoreZoneType zone = request.GetEnum<StoreZoneType>("zone");
            string srcfolder = request.GetString("srcfolder", null);
            string tagfolder = request.GetString("tagfolder", null);
            bool copy = request.GetBool("copy", false);
            JArray post = request.GetPostData<JArray>();
            BPMObjectNameCollection objectNames = post.ToObject<BPMObjectNameCollection>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                cn.MoveObjectsToFolder(zone, srcfolder, objectNames, tagfolder, copy);
            }
        }
    }
}