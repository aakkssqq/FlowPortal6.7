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
    public class FormServiceHandler : YZServiceHandler
    {
        public virtual JObject GetFolders(HttpContext context)
        {
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
            BPMObjectNameCollection folderNames = cn.GetFolders(StoreZoneType.FormService, path, BPMPermision.Read);

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
                item["rsid"] = StoreZoneType.FormService.ToString() + "://" + folderPath;

                JArray children = new JArray();
                item[YZJsonProperty.children] = children;
                this.ExpandTree(cn, children, folderPath);
            }
        }

        public virtual JObject GetAppsInFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path",null);
            FormApplicationCollection formApplications;

            //获得数据
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                formApplications = cn.GetFormApplicationList(path, BPMPermision.Read);

                //将数据转化为Json集合
                JObject rv = new JObject();
                rv[YZJsonProperty.total] = formApplications.Count;

                JArray children = new JArray();
                rv[YZJsonProperty.children] = children;

                foreach (FormApplication tmpformapp in formApplications)
                {
                    string fullName;
                    if (String.IsNullOrEmpty(path))
                        fullName = tmpformapp.Name;
                    else
                        fullName = path + "/" + tmpformapp.Name;

                    FormApplication formapp = FormApplication.Open(cn, fullName);

                    JObject item = new JObject();
                    children.Add(item);

                    item["Name"] = formapp.Name;
                    item["FullName"] = fullName;
                    item["rsid"] = StoreZoneType.FormService.ToString() + "://" + fullName;

                    JArray jStates = new JArray();
                    item["States"] = jStates;
                    foreach (FormState state in formapp.FormStates)
                    {
                        JObject jState = new JObject();
                        jStates.Add(jState);

                        jState["Name"] = state.Name;
                    }

                    item["FormFile"] = formapp.Form;
                }

                return rv;
            }
        }

        public virtual FormApplication GetFormServiceDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return FormApplication.Open(cn, path);
            }
        }

        public virtual void SaveFormService(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JObject post = request.GetPostData<JObject>();
            FormApplication app = post["data"].ToObject<FormApplication>();
            ACL acl = post["acl"].ToObject<ACL>();
            string mode = request.GetString("mode");
            string path;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (mode == "edit")
                {
                    path = request.GetString("path");
                    string name = request.GetString("name");
                    if (name != app.Name)
                        path = cn.RenameObject(StoreZoneType.FormService, path, app.Name);

                    app.Save(cn, path, true);
                }
                else
                {
                    string folder = request.GetString("folder", "");
                    if (String.IsNullOrEmpty(folder))
                        path = app.Name;
                    else
                        path = folder + "/" + app.Name;

                    app.Save(cn, path, false);
                }

                SecurityManager.SaveACL(cn, SecurityResType.FormApplication, path, null, acl);
            }
        }
    }
}