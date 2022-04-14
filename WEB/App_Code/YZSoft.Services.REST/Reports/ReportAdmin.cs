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
    public class ReportAdminHandler : YZServiceHandler
    {
        public virtual Report GetReportDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return Report.Open(cn, path);
            }
        }

        public virtual StringCollection ParseCommandText(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string query = request.GetString("Query");
            string datasourceName = request.GetString("DataSourceName");

            string perfix;
            using(BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                perfix = DataSourceManager.GetParamPerfix(cn, datasourceName);           
            }

            return YZSqlClientParameterParser.ParseCommandText(query, perfix);
        }

        public virtual void SaveReport(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JObject post = request.GetPostData<JObject>();
            Report app = post["data"].ToObject<Report>();
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
                        path = cn.RenameObject(StoreZoneType.Reports, path, app.Name);

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

                SecurityManager.SaveACL(cn, SecurityResType.Report, path, null, acl);
            }
        }
    }
}