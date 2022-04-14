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
using YZSoft.Web.DAL;
using System.Data;
using YZSoft.Web;

namespace YZSoft.Services.REST.BPM
{
    public class ProcessHandler : YZServiceHandler
    {
        public virtual JObject GetTree(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string bpmServer = request.GetString("bpmServer", null);
            bool process = request.GetBool("process", false);
            bool checkbox = request.GetBool("checkbox",false);
            bool expand = request.GetBool("expand",false);
            BPMPermision perm = request.GetEnum<BPMPermision>("perm");

            using (BPMConnection cn = new BPMConnection())
            {
                this.OpenConnection(cn, bpmServer);

                JObject rv = new JObject();

                JArray items = new JArray();
                rv[YZJsonProperty.children] = items;

                this.ExpandTree(cn, items, null, perm, expand, process, checkbox);

                rv[YZJsonProperty.success] = true;
                return rv;
            }
        }

        protected virtual void ExpandTree(BPMConnection cn, JArray items, string path, BPMPermision perm, bool expand, bool withProcess, bool checkbox)
        {
            BPMObjectNameCollection folderNames = cn.GetFolders(StoreZoneType.Process, path, perm);

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

                JArray children = new JArray();
                item[YZJsonProperty.children] = children;
                this.ExpandTree(cn, children, folderPath, perm, expand, withProcess, checkbox);
            }

            if (withProcess)
            {
                BPMProcessCollection processes = cn.GetProcessList(path, perm, true);
                foreach (BPMProcess process in processes)
                {
                    string processPath;

                    if (String.IsNullOrEmpty(path))
                        processPath = process.Name;
                    else
                        processPath = path + "/" + process.Name;

                    JObject item = new JObject();
                    items.Add(item);
                    item["leaf"] = true;
                    item["glyph"] = 0xeaf5;
                    item["text"] = process.Name;
                    if (checkbox)
                        item["checked"] = false;
                    item["path"] = processPath;
                    item["ProcessName"] = process.Name;
                    item["ProcessVersion"] = process.Version.ToString(2);
                    item["Description"] = process.Property.Description;
                }
            }
        }

        public virtual JObject GetProcessesInFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string bpmServer = request.GetString("bpmServer", null);
            string path = request.GetString("path", null);
            BPMPermision perm = request.GetEnum<BPMPermision>("perm");
            string searchType = request.GetString("searchType", null);
            string keyword = request.GetString("kwd", null);
            bool favorite = request.GetBool("favorite", false);
            string uid = YZAuthHelper.LoginUserAccount;
            BPMProcessCollection processes;

            //获得数据
            using (BPMConnection cn = new BPMConnection())
            {
                this.OpenConnection(cn, bpmServer);
                if (searchType == "QuickSearch" && !String.IsNullOrEmpty(keyword))
                    processes = cn.SearchProcess(null, perm, keyword, false, 100);
                else
                    processes = cn.GetProcessList(path, perm, true);
            }

            //将数据转化为Json集合
            JObject rv = new JObject();
            rv[YZJsonProperty.total] = processes.Count;

            JArray children = new JArray();
            rv[YZJsonProperty.children] = children;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    foreach (BPMProcess process in processes)
                    {
                        JObject item = new JObject();
                        children.Add(item);

                        item["ProcessName"] = process.Name;
                        item["Active"] = process.Active;
                        item["ProcessVersion"] = process.Version.ToString(2);
                        item["Description"] = process.Property.Description;
                        item["RelatedFile"] = process.Property.RelatedFile;
                        item["MobileInitiation"] = process.Property.MobileInitiation;

                        if (favorite)
                        {
                            item["Favorited"] = FavoriteManager.HasFavorited(provider, cn, uid, YZResourceType.Process, process.Name);
                        }
                    }
                }
            }

            return rv;
        }

        public virtual JObject GetFavoriteProcesses(HttpContext context)
        {
            //System.Threading.Thread.Sleep(3000);
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path", null);
            BPMPermision perm = request.GetEnum<BPMPermision>("perm",BPMPermision.Execute);
            string uid = YZAuthHelper.LoginUserAccount;

            FavoriteCollection favirites;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    favirites = FavoriteManager.GetFavorites(provider, cn, uid, YZResourceType.Process);
                }
            }

            BPMProcessCollection processes;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                processes = cn.GetProcessList(path, favirites.ResIDs, perm);
            }

            //将数据转化为Json集合
            JObject rv = new JObject();
            rv[YZJsonProperty.total] = processes.Count;

            JArray children = new JArray();
            rv[YZJsonProperty.children] = children;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    foreach (BPMProcess process in processes)
                    {
                        JObject item = new JObject();
                        children.Add(item);

                        item["ProcessName"] = process.Name;
                        item["Active"] = process.Active;
                        item["ProcessVersion"] = process.Version.ToString(2);
                        item["Description"] = process.Property.Description;
                        item["RelatedFile"] = process.Property.RelatedFile;

                        item["ShortName"] = process.Property.ShortName;
                        item["Color"] = process.Property.Color;

                        if (String.IsNullOrEmpty(process.Property.ShortName))
                            item["ShortName"] = YZStringHelper.GetProcessDefaultShortName(process.Name);
                    }
                }
            }

            return rv;
        }

        public virtual JObject GetAllProcessNames(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string bpmServer = request.GetString("bpmServer", null);
            BPMObjectNameCollection processNames = new BPMObjectNameCollection();
            using (BPMConnection cn = new BPMConnection())
            {
                this.OpenConnection(cn, bpmServer);
                processNames = ProcessNameManager.GetProcessNames(cn);
            }

            //将数据转化为Json集合
            JObject rv = new JObject();

            rv[YZJsonProperty.total] = processNames.Count;
            JArray children = new JArray();
            rv[YZJsonProperty.children] = children;

            foreach (string processName in processNames)
            {
                JObject item = new JObject();
                children.Add(item);
                item["ProcessName"] = processName;
            }

            //输出数据
            rv[YZJsonProperty.success] = true;
            return rv;
        }

        public virtual TableIdentityCollection GetProcessGlobalTableIdentitys(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string serverName = request.GetString("ServerName", null);
            string processName = request.GetString("ProcessName");

            using (BPMConnection cn = new BPMConnection())
            {
                this.OpenConnection(cn, serverName);
                return BPMProcess.GetProcessGlobalTableIdentitys(cn, processName);
            }
        }
    }
}