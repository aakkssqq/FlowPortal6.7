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
using NPOI;
using NPOI.XWPF.UserModel;
using NPOI.OpenXmlFormats.Wordprocessing;
using YZNPOI.HSSF.UserModel;
using BPM;
using YZSoft.Web.DAL;
using YZSoft.Web.BPA;

namespace YZSoft.Services.REST.BPA
{
    partial class ProcessReportsHandler
    {
        public virtual AttachmentInfo GenerateActivityManualReport(HttpContext context)
        {
            return this.GenerateObjectReport(context, new GetObjectReportDataHandler(this.GetActivityManualReportData));
        }

        protected virtual DataSet GetActivityManualReportData(string fileid, string spriteid, JObject jProcess, Image chart)
        {
            DataSet rv = new DataSet();
            File file = jProcess.ToObject<File>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    Sprite sprite = file.Sprites[spriteid];

                    //Global
                    rv.Tables.Add(sprite.ToActivityTable(provider, cn,"Global"));

                    //风险点
                    rv.Tables.Add(sprite.Property.Risk.ToDetailTable(provider, cn, "RiskDetail"));
                }
            }

            return rv;
        }
    }
}