using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using System.IO;

namespace YZSoft.Web.Zone
{
    public abstract class LibraryHandler<T, TC> : YZServiceHandler where T : IStoreObject
    {
        protected abstract StoreZoneType ZoneType { get; }
        protected abstract string RootRSID { get; }
        protected abstract SecurityResType ObjectSecurityResType { get; }

        protected string GetRSID(string folderPath)
        {
            if (String.IsNullOrEmpty(folderPath))
                return this.RootRSID;

            return this.ZoneType.ToString() + "://" + folderPath;
        }

        public virtual JObject GetFolders(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("node");
            BPMPermision perm = request.GetEnum<BPMPermision>("perm", BPMPermision.Read);
            bool expand = request.GetBool("expand", false);

            if (path == "root")
                path = null;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                JObject rv = new JObject();

                JArray items = new JArray();
                rv[YZJsonProperty.children] = items;

                this.ExpandTree(cn, items, path, perm, expand);

                rv[YZJsonProperty.success] = true;
                return rv;
            }
        }

        protected virtual void ExpandTree(BPMConnection cn, JArray items, string path, BPMPermision perm, bool expand)
        {
            BPMObjectNameCollection folderNames = cn.GetFolders(this.ZoneType, path, perm);

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
                item["id"] = folderPath;
                item["rsid"] = this.GetRSID(folderPath);

                JArray children = new JArray();
                item[YZJsonProperty.children] = children;
                this.ExpandTree(cn, children, folderPath, perm, expand);
            }
        }

        public virtual object GetFolderObjects(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("folderid", null);
            BPMPermision perm = request.GetEnum<BPMPermision>("perm", BPMPermision.Read);
            string rsid = String.IsNullOrEmpty(path) ? this.RootRSID : StoreZoneType.ExtServer.ToString() + "://" + path;

            TC objects = Activator.CreateInstance<TC>();
            BPMObjectNameCollection folders = new BPMObjectNameCollection();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (SecurityManager.CheckPermision(cn, rsid, perm))
                {
                    objects = cn.GetObjectList<TC>(this.ZoneType, path, perm);
                    folders = cn.GetFolders(this.ZoneType, path, perm);
                }
            }

            return new
            {
                folders = folders,
                objects = objects
            };
        }

        public virtual JObject CreateChildFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("parentFolderId", null);

            string folderName;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                folderName = cn.CreateNewFolder(this.ZoneType, path);
            }

            string folderPath;
            if (String.IsNullOrEmpty(path))
                folderPath = folderName;
            else
                folderPath = path + "/" + folderName;

            JObject item = new JObject();
            item["leaf"] = false;
            item["text"] = folderName;
            item["id"] = folderPath;
            item["rsid"] = this.ZoneType.ToString() + "://" + folderPath;
            return item;
        }

        public virtual string RenameFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("folderid");
            string newname = request.GetString("newname");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return cn.RenameFolder(this.ZoneType, path, newname);
            }
        }

        public virtual void DeleteFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("folderid");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                cn.DeleteFolder(this.ZoneType, path);
            }
        }

        public virtual object MoveFolders(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string targetPath = request.GetString("targetFolderId", null);
            MovePosition position = request.GetEnum<MovePosition>("position");
            JArray post = request.GetPostData<JArray>();
            BPMObjectNameCollection paths = post.ToObject<BPMObjectNameCollection>();

            List<string> rv = new List<string>();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach (string path in paths)
                {
                    rv.Add(cn.MoveFolder(this.ZoneType, path, targetPath, position));
                }
            }

            return rv;
        }

        public virtual JObject CheckFolderPermisions(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("folderid", null);
            string strPerms = request.GetString("perms", null);
            BPMObjectNameCollection perms = BPMObjectNameCollection.FromStringList(strPerms, ',');
            string rsid = this.GetRSID(path);

            JObject rv = new JObject();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                ACL acl = SecurityManager.GetACL(cn, rsid);

                foreach (string strPerm in perms)
                {
                    BPMPermision perm;
                    if (Enum.TryParse<BPMPermision>(strPerm, out perm))
                        rv[strPerm] = acl.HasPermision(cn.Token, perm);
                }
            }

            return rv;
        }

        public virtual object GetObjectDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path", null);

            if (String.IsNullOrEmpty(path))
            {
                string folder = request.GetString("folder", "");
                string objectName = request.GetString("objectName");
                path = System.IO.Path.Combine(folder, objectName);
            }

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                T obj = cn.GetObjectDefine<T>(this.ZoneType, path);
                return obj;
            }
        }

        public virtual object SaveNewObject(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string folder = request.GetString("folder", "");
            JObject post = request.GetPostData<JObject>();
            T objectDefine = post["data"].ToObject<T>();
            ACL acl = post["acl"] != null ? post["acl"].ToObject<ACL>():null;

            string path = Path.Combine(folder, objectDefine.Name);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                cn.SaveObjectDefine(this.ZoneType, null, path, (Version)null, false, objectDefine, null);

                if (acl != null)
                    SecurityManager.SaveACL(cn, this.ObjectSecurityResType, path, acl);
            }

            return new
            {
                path = path
            };
        }

        public virtual void SaveObject(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string folder = request.GetString("folder", "");
            string orgObjectName = request.GetString("orgObjectName");
            JObject post = request.GetPostData<JObject>();
            T objectDefine = post["data"].ToObject<T>();
            ACL acl = post["acl"] != null ? post["acl"].ToObject<ACL>() : null;
            string path = Path.Combine(folder, orgObjectName);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (orgObjectName != objectDefine.Name)
                    path = cn.RenameObject(this.ZoneType, path, objectDefine.Name);

                cn.SaveObjectDefine(this.ZoneType, path, true, objectDefine, null);

                if (acl != null)
                    SecurityManager.SaveACL(cn, this.ObjectSecurityResType, path, acl);
            }
        }

        public virtual void DeleteViewObjects(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string folder = request.GetString("folder", "");
            JArray jPost = request.GetPostData<JArray>();
            StoreObjectIdentityCollection objects = jPost.ToObject<StoreObjectIdentityCollection>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                cn.DeleteObjects(this.ZoneType, folder, objects);
            }
        }

        public virtual StoreObjectIdentityCollection CloneViewObjects(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string folder = request.GetString("folder", "");
            JArray jPost = request.GetPostData<JArray>();
            StoreObjectIdentityCollection objects = jPost.ToObject<StoreObjectIdentityCollection>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return cn.CloneObjects(this.ZoneType, folder, objects);
            }
        }

        public virtual void MoveObjectsToFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string srcfolder = request.GetString("srcfolder", null);
            string tagfolder = request.GetString("tagfolder", null);
            bool copy = request.GetBool("copy", false);
            JArray post = request.GetPostData<JArray>();
            BPMObjectNameCollection objectNames = post.ToObject<BPMObjectNameCollection>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                cn.MoveObjectsToFolder(this.ZoneType, srcfolder, objectNames, tagfolder, copy);
            }
        }

        public virtual void RenameViewObject(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string folder = request.GetString("folder", "");
            string name = request.GetString("name");
            string newname = request.GetString("newname");
            string path = System.IO.Path.Combine(folder, name);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                cn.RenameObject(this.ZoneType, path, newname);
            }
        }
    }
}