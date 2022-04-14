using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.IO;
using System.Data;
using System.Drawing;
using System.Web.UI.WebControls;
using System.Web.UI.DataVisualization.Charting;
using YZNPOI.HSSF.Util;
using YZNPOI.HSSF.UserModel;
using YZNPOI.POIFS.FileSystem;
using YZNPOI.SS.UserModel;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using BPM.Client.Data.Common;
using BPM.Data.Common;
using YZSoft.Web.DAL;
using YZSoft.Web.File;
using YZSoft.ActiveJson;

namespace YZSoft.Services.REST.Reports
{
    public class ReportXHandler : YZServiceHandler
    {
        public virtual ReportX GetReportDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path");

            ReportX report;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                report = ReportX.Open(cn, path);

                Document doc = new Document(report.define);
                doc.Execute(cn);
            }

            return report;
        }

        public virtual ReportX ExecuteTestingReport(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JObject post = request.GetPostData<JObject>();
            ReportX report = post["data"].ToObject<ReportX>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                Document doc = new Document(report.define);
                doc.Execute(cn);
            }

            return report;
        }
    }
}