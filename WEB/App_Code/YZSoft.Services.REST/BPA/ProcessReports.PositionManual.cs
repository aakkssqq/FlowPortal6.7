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
        public virtual AttachmentInfo GeneratePositionManualReport(HttpContext context)
        {
            return this.GenerateObjectReport(context, new GetObjectReportDataHandler(this.GetPositionManualReportData));
        }

        protected virtual DataSet GetPositionManualReportData(string fileid, string spriteid, JObject jProcess, Image chart)
        {
            DataSet rv = new DataSet();
            File file = jProcess.ToObject<File>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    Sprite sprite = file.Sprites[spriteid];

                    //Global
                    rv.Tables.Add(sprite.ToPositionTable(provider, cn, "Global"));

                    //Responsible
                    rv.Tables.Add(sprite.GetUsedBySprites(provider, cn, "Responsible").GetDetailTable(provider, cn, "RDetail"));

                    //Accountable
                    rv.Tables.Add(sprite.GetUsedBySprites(provider, cn, "Accountable").GetDetailTable(provider, cn, "ADetail"));

                    //Consulted
                    rv.Tables.Add(sprite.GetUsedBySprites(provider, cn, "Consulted").GetDetailTable(provider, cn, "CDetail"));

                    //Informed
                    rv.Tables.Add(sprite.GetUsedBySprites(provider, cn, "Informed").GetDetailTable(provider, cn, "IDetail"));

                    //风险点
                    rv.Tables.Add(sprite.GetUsedBySprites(provider,cn).GetActivityReferenceDetailTable(provider,cn,"Risk","RiskDetail"));

                    //KPI
                    rv.Tables.Add(sprite.GetUsedBySprites(provider, cn).GetActivityReferenceDetailTable(provider, cn, "KPI", "KPIDetail"));
                }
            }

            return rv;
        }
    }
}