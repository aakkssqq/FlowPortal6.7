using System;
using System.Web;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Text;
using System.Web.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using BPM.Client.Data.Common;

namespace YZSoft.Services.REST.Reports
{
    public class ReportXAdminHandler : YZServiceHandler
    {
        public virtual ReportX GetReportDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return ReportX.Open(cn, path);
            }
        }
        public virtual object GetReportProperty(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                ReportX report = ReportX.Open(cn, path);
                JObject jProperty = report.define["property"] as JObject;

                return new
                {
                    name = report.name,
                    property = report.property
                };
            }
        }

        public virtual object SaveReportAs(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string folder = request.GetString("folder", "");
            string name = request.GetString("name");
            JObject post = request.GetPostData<JObject>();
            ReportX report = post["data"].ToObject<ReportX>();
            string path;

            if (String.IsNullOrEmpty(folder))
                path = name;
            else
                path = folder + "/" + name;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                report.Save(cn, path, false);
            }

            return new
            {
                path = path
            };
        }

        public virtual void SaveReport(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path");
            JObject post = request.GetPostData<JObject>();
            ReportX report = post["data"].ToObject<ReportX>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                ReportX reportOrg = ReportX.Open(cn, path);
                reportOrg.lastModifier = report.lastModifier;
                reportOrg.define = report.define;

                reportOrg.Save(cn, path, true);
            }
        }

        public virtual void SaveProperty(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JObject post = request.GetPostData<JObject>();
            ReportX report = post["data"].ToObject<ReportX>();
            ACL acl = post["acl"].ToObject<ACL>();
            string path = request.GetString("path");
            string name = request.GetString("name");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (name != report.name)
                    path = cn.RenameObject(StoreZoneType.Reports, path, report.name);

                ReportX reportOrg = ReportX.Open(cn, path);
                reportOrg.lastModifier = report.lastModifier;
                reportOrg.property = report.property;

                reportOrg.Save(cn, path, true);

                SecurityManager.SaveACL(cn, SecurityResType.Report, path, null, acl);
            }
        }
    }
}