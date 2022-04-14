using System;
using System.Web;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using BPM;
using YZSoft.Web.DAL;
using YZSoft.FileSystem;

namespace YZSoft.Services.REST.BPA
{
    public class TemplatesHandler : YZServiceHandler
    {
        public virtual object GetTemplateCategories(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int folderid = request.GetInt32("folderid");
            BPMObjectNameCollection folderNames = new BPMObjectNameCollection();

            Folder folder;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    folder = DirectoryManager.GetFolderByID(provider, cn, folderid);
                }
            }

            switch (folder.FolderType)
            {
                case "BPAProcess":
                    folderNames.Add("EVC");
                    folderNames.Add("BPMN");
                    folderNames.Add("FlowChart");
                    break;
                case "BPAProduct":
                    folderNames.Add("Product");
                    break;
                case "BPAOU":
                    folderNames.Add("Org");
                    break;
                case "BPAData":
                    folderNames.Add("Data");
                    break;
                case "BPAITSystem":
                    folderNames.Add("ITSystem");
                    break;
                case "BPAControl":
                    folderNames.Add("KPI");
                    folderNames.Add("Risk");
                    folderNames.Add("Regulation");
                    break;
                default:
                    folderNames.Add("BPMN");
                    break;
            }

            return folderNames;
        }

        public virtual object GetTemplateDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path");
            string name = request.GetString("name");
            string templatePath = Path.Combine(context.Server.MapPath("~/YZSoft/BPA/templates/"), path, name);

            JObject jProcess;
            using (StreamReader rd = new StreamReader(templatePath))
            {
                jProcess = JObject.Parse(rd.ReadToEnd());
            }

            return jProcess;
        }
    }
}