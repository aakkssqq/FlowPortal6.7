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
using BPM;
using YZSoft.Web.DAL;
using YZSoft.Web.BPA;

namespace YZSoft.Services.REST.BPA
{
    partial class ProcessReportsHandler
    {
        public virtual AttachmentInfo GenerateSOPReport(HttpContext context)
        {
            return this.GenerateFileReport(context, new GetFileReportDataHandler(this.GetSOPReportData));
        }

        protected virtual DataSet GetSOPReportData(string fileid, int documentFolderID, JObject jProcess, Image chart)
        {
            DataSet rv = new DataSet();
            File file = jProcess.ToObject<File>();

            file.Chart = chart;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    //Global
                    rv.Tables.Add(file.ToSOPTable(provider, cn, "Global"));

                    //关卡
                    rv.Tables.Add(file.Sprites.SortByOrder().GetDetailTable(provider, cn, "ActivityDetail"));

                    //RACI
                    rv.Tables.Add(file.Sprites.SortByOrder().GetRACIDetailTable(provider, cn, "RACI"));

                    //Risk
                    rv.Tables.Add(file.Sprites.SortByOrder().GetActivityReferenceDetailTable(provider, cn, "Risk", "RiskDetail"));

                    //KPI
                    rv.Tables.Add(file.Sprites.SortByOrder().GetActivityReferenceDetailTable(provider, cn, "KPI", "KPIDetail"));

                    //UsedByDocuments
                    rv.Tables.Add(file.GetUsedByFiles(provider, cn).ToDetailTable(provider, cn, "UsedByDocuments"));

                    //RelatedDocuments
                    rv.Tables.Add(file.GetRelatedFiles(provider, cn).ToDetailTable(provider, cn, "RelatedDocuments"));

                    //ChildProcess
                    rv.Tables.Add(file.GetChildProcess(provider, cn).ToDetailTable(provider, cn, "ChildProcess"));

                    //Forms
                    rv.Tables.Add(file.AllFormReferences.ToDetailTable(provider, cn, "Forms"));

                    //附件
                    YZSoft.FileSystem.FileCollection docs = FileSystem.DirectoryManager.GetFiles(provider, cn, documentFolderID, String.Format("{0}<>'Generate'", provider.GenISNULLCond("Flag","''")), "ID DESC", -1);
                    docs = docs.PerformAttachmentInfo(provider, cn, null);
                    rv.Tables.Add(docs.ToDetailTable("Attachments"));
                }
            }

            return rv;
        }
    }
}