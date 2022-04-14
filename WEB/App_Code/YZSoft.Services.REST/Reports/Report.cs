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
using YZSoft.Web.Excel;

namespace YZSoft.Services.REST.Reports
{
    public class ReportHandler : YZServiceHandler
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
            BPMObjectNameCollection folderNames = cn.GetFolders(StoreZoneType.Reports, path, BPMPermision.Read);

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
                item["rsid"] = StoreZoneType.Reports.ToString() + "://" + folderPath;

                JArray children = new JArray();
                item[YZJsonProperty.children] = children;
                this.ExpandTree(cn, children, folderPath);
            }
        }

        public virtual JObject GetReportsInFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path", null);
            bool exclueReportX = request.GetBool("exclueReportX", false);
            ReportCollection reports;

            //获得数据
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                reports = cn.GetReportList(path, BPMPermision.Read);

                //将数据转化为Json集合
                JObject rv = new JObject();
                rv[YZJsonProperty.total] = reports.Count;

                JArray children = new JArray();
                rv[YZJsonProperty.children] = children;

                foreach (Object objReport in reports)
                {
                    Report report = objReport as Report;
                    if (report != null)
                    {
                        string fullName;
                        if (String.IsNullOrEmpty(path))
                            fullName = report.Name;
                        else
                            fullName = path + "/" + report.Name;

                        JObject item = new JObject();
                        children.Add(item);

                        item["name"] = report.Name;
                        item["ext"] = ".rpt";
                        item["fullname"] = fullName;
                        item["rsid"] = StoreZoneType.Reports.ToString() + "://" + fullName;
                    }

                    ReportX reportx = objReport as ReportX;
                    if (!exclueReportX && reportx != null)
                    {
                        string fullName;
                        if (String.IsNullOrEmpty(path))
                            fullName = reportx.name;
                        else
                            fullName = path + "/" + reportx.name;

                        JObject item = new JObject();
                        children.Add(item);

                        item["name"] = reportx.name;
                        item["ext"] = ".rptx";
                        item["fullname"] = fullName;
                        item["rsid"] = StoreZoneType.Reports.ToString() + "://" + fullName;
                        item["info"] = reportx.define;
                    }
                }

                return rv;
            }
        }

        public virtual QueryParameterCollection GetQueryParameters(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return Report.GetQueryParameters(cn, path);
            }
        }

        public virtual JObject GetReportDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path");

            Report report;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                report = Report.Open(cn, path);

                foreach (QueryParameter param in report.QueryParameters)
                    param.DefaultValue = YZCodeHelper.GetPCodeValue(cn, param.DefaultValue);
            }

            JObject rv = new JObject();
            rv["success"] = true;
            rv["name"] = report.Name;
            rv["MonthOffset"] = report.FinanceMonth.MonthOffset;
            rv["MonthDay"] = report.FinanceMonth.MonthDay;
            rv["Paging"] = report.Paging;
            rv["PageItems"] = report.PageItems;

            if (!String.IsNullOrEmpty(report.ExportTemplateFile))
                rv["ExportTemplate"] = Path.Combine("YZSoft/report/rpt/Templates", report.ExportTemplateFile);

            //设置views
            JArray views = new JArray();
            rv["views"] = views;

            foreach (ReportView viewDefine in report.Views)
            {
                JObject view = new JObject();
                views.Add(view);

                view["ViewName"] = viewDefine.ViewName;
                view["ViewType"] = viewDefine.ViewType.ToString();
            }

            //设置queryParams
            rv["queryParams"] = JArray.FromObject(report.QueryParameters);

            return rv;
        }

        public virtual object GetGridViewDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path");
            string viewName = request.GetString("viewName");

            Report report;
            ReportGridView reportView;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                report = Report.Open(cn, path);
                reportView = Report.GetView(cn, path, viewName) as ReportGridView;
            }

            return new
            {
                reportName = report.Name,
                columnInfos = report.ReportColumnInfos,
                view = reportView
            };
        }

        public virtual object GetMSChartViewDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path");
            string viewName = request.GetString("viewName");

            Report report;
            ReportMSChartView reportView;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                report = Report.Open(cn, path);
                reportView = Report.GetView(cn, path, viewName) as ReportMSChartView;
            }

            return new
            {
                reportName = report.Name,
                columnInfos = report.ReportColumnInfos,
                view = reportView,
                gridViewName = this.GetFirstGridViewName(report)
            };
        }

        public virtual object GetExcelViewDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path");
            string viewName = request.GetString("viewName");

            Report report;
            ReportExcelView reportView;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                report = Report.Open(cn, path);
                reportView = Report.GetView(cn, path, viewName) as ReportExcelView;
            }

            return new
            {
                reportName = report.Name,
                columnInfos = report.ReportColumnInfos,
                view = reportView,
                gridViewName = this.GetFirstGridViewName(report),
                template = Path.Combine("YZSoft/report/rpt/Templates", reportView.TemplateFile)
            };
        }

        public virtual JObject GetReportData(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path");
            string viewName = request.GetString("viewName",null);
            string outputType = request.GetString("outputType","");
            YZClientParamCollection runtimeParams = JArray.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("params", YZJsonHelper.Base64EmptyJArray)))).ToObject<YZClientParamCollection>();

            //获得数据
            Report report;
            ReportView view;
            DataTable dataTable;
            int rowcount;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                //获得报表定义
                report = Report.Open(cn, path);
                if (String.IsNullOrEmpty(viewName))
                    view = report.DefaultView;
                else
                    view = report.Views.TryGetItem(viewName);

                string srcdata = request.GetString("srcdata",null);
                if (String.IsNullOrEmpty(srcdata))
                {
                    BPMDBParameterCollection selectParameters = report.QueryParameters.CreateNullDBParameters();

                    //应用查询条件
                    foreach (BPMDBParameter selectParam in selectParameters)
                    {
                        YZClientParam clientParam = runtimeParams.TryGetItem(selectParam.Name);
                        if (clientParam != null && clientParam.value != null)
                            selectParam.Value = clientParam.value;
                    }

                    cn.RequestParams["sortstring"] = request.GetSortString("");
                    cn.UpdateRequestParams();

                    //获得数据
                    FlowDataTable ftable = new FlowDataTable();
                    ftable.Load(cn, BPMCommandType.Report, path, selectParameters, report.ClientCursor, request.Start, request.Limit, out rowcount);
                    dataTable = ftable.ToDataTable();
                }
                else
                {
                    dataTable = JArray.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(srcdata))).ToObject<DataTable>();
                    rowcount = request.GetInt32("total");
                }
            }

            //将数据转化为Json集合
            JObject rv = new JObject();
            JObject metaData = new JObject();
            rv[YZJsonProperty.metaData] = metaData;
            rv[YZJsonProperty.total] = rowcount;

            metaData["srcdata"] = Convert.ToBase64String(Encoding.UTF8.GetBytes(JArray.FromObject(dataTable).ToString(Formatting.None,YZJsonHelper.Converters)));

            JArray children = new JArray();
            rv.Add("children", children);

            //不管是什么view都要给数据
            foreach (DataRow row in dataTable.Rows)
            {
                JObject item = new JObject();
                children.Add(item);

                foreach (DataColumn column in dataTable.Columns)
                {
                    object value = row[column.ColumnName];
                    item[column.ColumnName] = JToken.FromObject(value);

                    if (NameCompare.EquName(column.ColumnName, "TaskID") && (value is int))
                        item["Token"] = YZSecurityHelper.GenTaskAccessToken((int)value);

                    //为任务链接生成Token
                    ReportColumnInfo colInfo = report.ReportColumnInfos.TryGetItem(column.ColumnName);
                    if (colInfo != null && colInfo.LinkType == ReportLinkType.Task)
                    {
                        ParameterFill paramFill = colInfo.ParametersFill.TryGetItem("@TaskID");
                        if (paramFill != null)
                        {
                            int linktoTaskID;
                            if (Int32.TryParse(Convert.ToString(row[paramFill.FillWith]), out linktoTaskID))
                                item[column.ColumnName + "Token"] = YZSecurityHelper.GenTaskAccessToken((int)linktoTaskID);
                        }
                    }
                }
            }

            if (String.Compare(outputType, "Export", true) != 0)
            {
                if (view is ReportMSChartView)
                    this.ApplyMSChartData(request, metaData, view as ReportMSChartView, dataTable);

                if (view is ReportExcelView)
                    this.ApplyExcelData(request, metaData, view as ReportExcelView, dataTable, runtimeParams);
            }

            return rv;
        }

        public virtual JObject GenExcelReport(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string excelTemplate = request.GetString("excelFile");
            Dictionary<string, string> reportParams = new Dictionary<string, string>();

            //获得查询参数
            string strUserParamNames = request.GetString("UserParamNames",null);
            if (!String.IsNullOrEmpty(strUserParamNames))
            {
                string[] paramNames = strUserParamNames.Split(',');
                foreach (string paramName in paramNames)
                    reportParams.Add(paramName, request.GetString(paramName,null));
            }

            //传递页信息
            reportParams.Add("RowNumStart", request.RowNumStart.ToString());
            reportParams.Add("RowNumEnd", request.RowNumEnd.ToString());

            //打开文件
            HSSFWorkbook book;
            using (FileStream file = new FileStream(context.Server.MapPath(excelTemplate), FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
            {
                book = new HSSFWorkbook(file);
            }

            //填充数据
            DataSet dataset = ExcelGenerator.Fill(book, reportParams, null);
            ExcelGenerator.PrepareForOutput(book);

            //调试输出
            //using (FileStream fs = new FileStream(@"e:\abc.xls", FileMode.Create))
            //{
            //    book.Write(fs);
            //    fs.Close();
            //}

            string outputType = context.Request.Params["outputType"];
            if (outputType == "Export")  //导出
            {
                //Excel文件保存到流
                byte[] bytes;
                using (MemoryStream ms = new MemoryStream())
                {
                    book.Write(ms);
                    bytes = ms.ToArray();
                }

                //设置Response头
                string fileName = String.Format("{0}-{1}{2}", Path.GetFileNameWithoutExtension(excelTemplate), YZStringHelper.DateToString(DateTime.Now), Path.GetExtension(excelTemplate));
                context.Response.Clear();
                context.Response.ContentType = "application/vnd.ms-excel";
                context.Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(fileName, System.Text.Encoding.UTF8));
                context.Response.AppendHeader("Content-Length", bytes.Length.ToString());

                context.Response.BinaryWrite(bytes);
                context.Response.End();
                return null;
            }
            else
            {
                JObject rv = new JObject();
                JObject metaData = new JObject();
                rv[YZJsonProperty.metaData] = metaData;

                book.GetSheetAt(0).DisplayGridlines = false;

                using (MemoryStream stream = new MemoryStream())
                {
                    book.Write(stream);

                    string htmlFile = FileConvert.Excel2Html(stream, Path.GetExtension(excelTemplate));
                    metaData["htmlFile"] = Path.GetFileName(htmlFile);

                    //模拟输出一个store
                    rv[YZJsonProperty.total] = 0;
                    JArray children = new JArray();
                    rv["children"] = children;

                    foreach (DataTable table in dataset.Tables)
                    {
                        if (table.Columns.Contains("TotalRows"))
                        {
                            int totalRows = 0;

                            if (table.Rows.Count == 0)
                                totalRows = 0;
                            else
                                totalRows = Convert.ToInt32(table.Rows[0]["TotalRows"]);

                            rv[YZJsonProperty.total] = totalRows;

                            children = new JArray();
                            rv["children"] = children;

                            JObject item = new JObject();
                            children.Add(item);
                            for (int i = 0; i < table.Rows.Count; i++)
                                item["id"] = i;

                            break;
                        }
                    }

                    return rv;
                }
            }
        }

        protected virtual void ApplyMSChartData(YZRequest request, JObject metaData, ReportMSChartView view, DataTable dataTable)
        {
            Chart chart = new Chart();
            YZChartHelper.ApplayChartStyle(chart);

            //设置报表大小
            chart.Width = new Unit(view.ReportWidth, UnitType.Pixel);
            chart.Height = new Unit(view.ReportHeight, UnitType.Pixel);

            //添加主副标题
            chart.Titles[0].Text = view.ReportTitle;
            chart.Titles[0].Alignment = ContentAlignment.TopCenter;

            //设置注释
            if (view.Series.Count >= 2)
            {
                chart.Legends.Add(new Legend("Default"));
                chart.Legends[0].Docking = Docking.Bottom;
                chart.Legends[0].BackColor = Color.Transparent;
                chart.Legends[0].Alignment = StringAlignment.Center;
                chart.Legends[0].BorderColor = Color.Black;
            }

            //添加系列
            BPMObjectNameCollection denySeries = JArray.Parse(request.GetString("DenySeries", "[]")).ToObject<BPMObjectNameCollection>();
            foreach (ReportSeries reportSeries in view.Series)
            {
                if (denySeries.Contains(reportSeries.Name))
                    continue;

                Series series = new Series(reportSeries.Name);
                chart.Series.Add(series);

                series.ShadowColor = Color.Transparent;
                series.BorderColor = Color.FromArgb(180, 26, 59, 105);
                series.Color = Color.FromArgb(180, reportSeries.Color);
                series.XValueMember = view.XAxisColumnName;
                series.YValueMembers = reportSeries.DataColumnName;
                series.Tag = reportSeries;
            }

            //应用客户设置
            SeriesChartType chartType = request.GetEnum<SeriesChartType>("ChartType", view.ChartType);
            bool enable3D = request.GetBool("Enable3D", false);
            int rotation = request.GetInt32("Rotation", 0);

            foreach (Series chartSeries in chart.Series)
                chartSeries.ChartType = chartType;

            if (enable3D)
            {
                foreach (ChartArea chartArea in chart.ChartAreas)
                {
                    chartArea.Area3DStyle.Enable3D = true;
                    chartArea.Area3DStyle.Rotation = rotation;
                }
            }

            //执行绑定
            chart.DataSource = dataTable;
            chart.DataBind();

            //应用数据显示
            foreach (Series series in chart.Series)
            {
                foreach (DataPoint point in series.Points)
                    point.Label = point.YValues[0].ToString() + (series.Tag as ReportSeries).Unit;
            }

            //生成报表图片
            string imageId = Guid.NewGuid().ToString();
            using (MemoryStream stream = new MemoryStream())
            {
                chart.SaveImage(stream, ChartImageFormat.Png);
                ChartManager.CurrentStore.Save(imageId, stream.ToArray(), "mschart.png", null);
            }

            metaData["chartid"] = imageId;
            metaData["width"] = chart.Width.Value;
            metaData["height"] = chart.Height.Value;
        }

        protected virtual void ApplyExcelData(YZRequest request, JObject metaData, ReportExcelView view, DataTable dataTable, YZClientParamCollection queryParams)
        {
            string excelTemplate = request.Context.Server.MapPath("~/YZSoft/report/rpt/Templates/" + view.TemplateFile);
            Dictionary<string, string> reportParams = new Dictionary<string, string>();

            reportParams.Add("ReportDate", YZStringHelper.DateToStringL(DateTime.Today));
            foreach (YZClientParam queryParam in queryParams)
                reportParams.Add(queryParam.name, Convert.ToString(queryParam.value));

            dataTable.TableName = "GridStore";

            //打开文件
            HSSFWorkbook book;
            using (FileStream file = new FileStream(excelTemplate, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
            {
                book = new HSSFWorkbook(file);
            }

            //填充数据
            DataSet dataset = new DataSet();
            dataset.Tables.Add(dataTable);
            ExcelGenerator.Fill(book, reportParams, dataset);
            ExcelGenerator.PrepareForOutput(book);

            //调试输出
            //using (FileStream fs = new FileStream(@"e:\abc.xls", FileMode.Create))
            //{
            //    book.Write(fs);
            //    fs.Close();
            //}

            book.GetSheetAt(0).DisplayGridlines = false;

            using (MemoryStream stream = new MemoryStream())
            {
                book.Write(stream);

                string htmlFile = FileConvert.Excel2Html(stream, Path.GetExtension(excelTemplate));
                metaData["htmlFile"] = Path.GetFileName(htmlFile);
            }
        }

        protected virtual string GetFirstGridViewName(Report report)
        {
            foreach (ReportView viewDefine in report.Views)
            {
                if (viewDefine.ViewType == ReportViewType.Grid)
                    return viewDefine.ViewName;
            }

            return null;
        }
    }
}