using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Data;
using System.Collections.Specialized;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;

namespace YZSoft.Services.REST.BPM
{
    public partial class SystemReportHandler : YZServiceHandler
    {
        public virtual DataTable GetProcessAnalysisTrend(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string strInclude = request.GetString("include", null);
            string strExclude = request.GetString("exclude", null);
            string type = request.GetString("Type", "year");
            int year = request.GetInt32("year", DateTime.Today.Year);
            int month = request.GetInt32("month", DateTime.Today.Month);

            BPMObjectNameCollection include = null;
            BPMObjectNameCollection exclude = null;
            if (!String.IsNullOrEmpty(strInclude))
                include = JArray.Parse(strInclude).ToObject<BPMObjectNameCollection>();
            if (!String.IsNullOrEmpty(strExclude))
                exclude = JArray.Parse(strExclude).ToObject<BPMObjectNameCollection>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    if (String.Compare(type, "year", true) == 0)
                    {
                        using (YZReader reader = new YZReader(provider.GetProcessAnalysisTrend(cn, year, include, exclude)))
                        {
                            DataTable table = reader.LoadTable();
                            PageResult.RegularColumnsName(table, new string[] {
                                "Month",
                                "Approved",
                                "Rejected",
                                "Running",
                                "Aborted",
                                "Deleted",
                                "Total",
                                "AvgMinutes"
                            });
                            return table;
                        }
                    }
                    else
                    {
                        using (YZReader reader = new YZReader(provider.GetProcessAnalysisTrend(cn, year, month, include, exclude)))
                        {
                            DataTable table = reader.LoadTable();
                            PageResult.RegularColumnsName(table, new string[] {
                                "DAY",
                                "Approved",
                                "Rejected",
                                "Running",
                                "Aborted",
                                "Deleted",
                                "Total",
                                "AvgMinutes"
                            });
                            return table;
                        }
                    }
                }
            }
        }

        public virtual DataTable GetProcessUsage(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string type = request.GetString("Type", "year");
            int year = request.GetInt32("year", DateTime.Today.Year);
            int month = request.GetInt32("month", -1);

            if (String.Compare(type, "year", true) == 0)
                month = -1;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    using (YZReader reader = new YZReader(provider.GetProcessUsage(cn, year, month)))
                    {
                        DataTable table = reader.LoadTable();
                        PageResult.RegularColumnsName(table, new string[] {
                            "ProcessName",
                            "Counts",
                            "Total",
                            "Per"
                        });
                        return table;
                    }
                }
            }
        }

        public virtual DataTable GetProcessUsageKPI(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string strInclude = request.GetString("include", null);
            string strExclude = request.GetString("exclude", null);
            string type = request.GetString("Type", "year");
            int year = request.GetInt32("year", DateTime.Today.Year);
            int month = request.GetInt32("month", -1);
            bool byYear = String.Compare(type, "year", true) == 0;

            if (byYear)
                month = -1;

            BPMObjectNameCollection include = null;
            BPMObjectNameCollection exclude = null;
            if (!String.IsNullOrEmpty(strInclude))
                include = JArray.Parse(strInclude).ToObject<BPMObjectNameCollection>();
            if (!String.IsNullOrEmpty(strExclude))
                exclude = JArray.Parse(strExclude).ToObject<BPMObjectNameCollection>();

            //获得数据
            DataTable srcTable;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    using (YZReader reader = new YZReader(provider.GetProcessUsageKPI(cn, year, month, include, exclude)))
                    {
                        srcTable = reader.LoadTable();
                    }
                }
            }

            int Approved = 0;
            int Rejected = 0;
            int Running = 0;
            int Aborted = 0;
            int Deleted = 0;
            int Total = 0;
            int runingProcessCount = 0;

            if(srcTable.Rows.Count > 0){
                Approved = Convert.ToInt32(srcTable.Rows[0]["Approved"]);
                Rejected = Convert.ToInt32(srcTable.Rows[0]["Rejected"]);
                Running = Convert.ToInt32(srcTable.Rows[0]["Running"]);
                Aborted = Convert.ToInt32(srcTable.Rows[0]["Aborted"]);
                Deleted = Convert.ToInt32(srcTable.Rows[0]["Deleted"]);
                Total = Convert.ToInt32(srcTable.Rows[0]["Total"]);
                runingProcessCount = Convert.ToInt32(srcTable.Rows[0]["ProcessCount"]);
            }

            float avgDay = (float)Total / (float)(year == DateTime.Today.Year ? DateTime.Today.DayOfYear : 365);
            float avgMonth = (avgDay * 365) / 12;
            float avgWeek = avgDay * 7;

            int allProcessCounts;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                allProcessCounts = ProcessNameManager.GetProcessNames(cn).Count;
            }

            //输出KPI
            DataRow row;
            DataTable table = new DataTable();
            table.Columns.Add("title");
            table.Columns.Add("value");

            //流程数
            row = table.NewRow();
            table.Rows.Add(row);
            row["title"] = Resources.YZStrings.Aspx_ProcessCount;
            row["value"] = String.Format("{0:#,##0}/{1:#,##0}", runingProcessCount, allProcessCounts);

            //总发起数
            row = table.NewRow();
            table.Rows.Add(row);
            row["title"] = Resources.YZStrings.Aspx_PostCount;
            row["value"] = Total.ToString("#,##0");

            row = table.NewRow();
            table.Rows.Add(row);
            row["title"] = Resources.YZStrings.Aspx_ReportDaily;
            row["value"] = Convert.ToInt32(avgDay).ToString("#,##0");

            row = table.NewRow();
            table.Rows.Add(row);
            row["title"] = Resources.YZStrings.Aspx_ReportWeekly;
            row["value"] = Convert.ToInt32(avgWeek).ToString("#,##0");

            if (byYear)
            {
                row = table.NewRow();
                table.Rows.Add(row);
                row["title"] = Resources.YZStrings.Aspx_ReportMonthly;
                row["value"] = Convert.ToInt32(avgMonth).ToString("#,##0");
            }

            row = table.NewRow();
            table.Rows.Add(row);
            row["title"] = Resources.YZStrings.Aspx_ApprovePer;
            row["value"] = Total == 0 ? "100%":(Approved * 100 / Total).ToString() + '%';

            return table;
        }

        public virtual DataTable GetProcessPerformanceByProcess(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string type = request.GetString("Type", "year");
            int year = request.GetInt32("year", DateTime.Today.Year);
            int month = request.GetInt32("month", -1);
            string orderby = request.GetString("OrderBy");

            if (String.Compare(type, "year", true) == 0)
                month = -1;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    using (YZReader reader = new YZReader(provider.GetProcessPerformanceByProcess(cn, year, month, orderby)))
                    {
                        DataTable table = reader.LoadTable();
                        PageResult.RegularColumnsName(table, new string[] {
                                "ProcessName",
                                "Counts",
                                "SumMinutes",
                                "AvgMinutes",
                                "MaxMinutes",
                                "TotalMinutes",
                                "Per"
                            });
                        return table;
                    }
                }
            }
        }

        public virtual DataTable GetProcessPerformanceKPI(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string strInclude = request.GetString("include", null);
            string strExclude = request.GetString("exclude", null);
            string type = request.GetString("Type", "year");
            int year = request.GetInt32("year", DateTime.Today.Year);
            int month = request.GetInt32("month", -1);
            bool byYear = String.Compare(type, "year", true) == 0;

            if (byYear)
                month = -1;

            BPMObjectNameCollection include = null;
            BPMObjectNameCollection exclude = null;
            if (!String.IsNullOrEmpty(strInclude))
                include = JArray.Parse(strInclude).ToObject<BPMObjectNameCollection>();
            if (!String.IsNullOrEmpty(strExclude))
                exclude = JArray.Parse(strExclude).ToObject<BPMObjectNameCollection>();

            //获得数据
            DataTable srcTable;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    using (YZReader reader = new YZReader(provider.GetProcessPerformanceKPI(cn, year, month, include, exclude)))
                    {
                        srcTable = reader.LoadTable();
                    }
                }
            }

            int runingProcessCount = 0;
            int TaskCounts = 0;
            int AvgMinutes = 0;
            int MaxMinutes = 0;

            runingProcessCount = Convert.ToInt32(srcTable.Rows[0]["ProcessCounts"]);
            TaskCounts = Convert.ToInt32(srcTable.Rows[0]["TaskCounts"]);
            AvgMinutes = Convert.ToInt32(srcTable.Rows[0]["AvgMinutes"]);
            MaxMinutes = Convert.ToInt32(srcTable.Rows[0]["MaxMinutes"]);

            float avgDay = (float)TaskCounts / (float)(year == DateTime.Today.Year ? DateTime.Today.DayOfYear : 365);
            float avgMonth = (avgDay * 365) / 12;
            float avgWeek = avgDay * 7;

            int allProcessCounts;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                allProcessCounts = ProcessNameManager.GetProcessNames(cn).Count;
            }

            //输出KPI
            DataRow row;
            DataTable table = new DataTable();
            table.Columns.Add("title");
            table.Columns.Add("value");

            //流程数
            row = table.NewRow();
            table.Rows.Add(row);
            row["title"] = Resources.YZStrings.Aspx_ProcessCount;
            row["value"] = String.Format("{0:#,##0}/{1:#,##0}", runingProcessCount, allProcessCounts);

            //总发起数
            row = table.NewRow();
            table.Rows.Add(row);
            row["title"] = Resources.YZStrings.Aspx_ReportApprovedCount;
            row["value"] = TaskCounts.ToString("#,##0");


            if (byYear)
            {
                row = table.NewRow();
                table.Rows.Add(row);
                row["title"] = Resources.YZStrings.Aspx_ReportMonthlyApprovedCount;
                row["value"] = Convert.ToInt32(avgMonth).ToString("#,##0");
            }
            else
            {
                row = table.NewRow();
                table.Rows.Add(row);
                row["title"] = Resources.YZStrings.Aspx_ReportDaily;
                row["value"] = Convert.ToInt32(avgDay).ToString("#,##0");
            }

            row = table.NewRow();
            table.Rows.Add(row);
            row["title"] = Resources.YZStrings.Aspx_ReportAvgTimeCost;
            row["value"] = YZStringHelper.MinutesToStringDHM(AvgMinutes);

            row = table.NewRow();
            table.Rows.Add(row);
            row["title"] = Resources.YZStrings.Aspx_ReportMaxTimeCost;
            row["value"] = YZStringHelper.MinutesToStringDHM(MaxMinutes);

            return table;
        }

        public virtual DataTable GetProcessAnalysisByNode(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string type = request.GetString("Type", "year");
            int year = request.GetInt32("year", DateTime.Today.Year);
            int month = request.GetInt32("month", -1);
            string processName = request.GetString("ProcessName");
            string orderby = request.GetString("OrderBy");

            if (String.Compare(type, "year", true) == 0)
                month = -1;

            DataTable table;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    using (YZReader reader = new YZReader(provider.GetProcessAnalysisByNode(cn, year, month, processName, orderby)))
                    {
                        table = reader.LoadTable();
                        PageResult.RegularColumnsName(table, new string[] {
                            "NodeName",
                            "Counts",
                            "SumMinutes",
                            "AvgMinutes",
                            "MaxMinutes",
                            "TotalMinutes",
                            "Per"
                        });
                    }
                }
            }

            //补齐信息
            table.Columns.Add("NodeDisplayName", typeof(string));
            foreach (DataRow row in table.Rows)
            {
                string nodeName = Convert.ToString(row["NodeName"]);
                row["NodeDisplayName"] = BPMProcStep.GetStepDisplayName(nodeName);
            }

            return table;
        }

        public virtual DataTable GetProcessAnalysisByHandlerAccount(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string type = request.GetString("Type", "year");
            string strInclude = request.GetString("include", null);
            string strExclude = request.GetString("exclude", null);
            int year = request.GetInt32("year", DateTime.Today.Year);
            int month = request.GetInt32("month", -1);
            string processName = request.GetString("ProcessName");
            string orderby = request.GetString("OrderBy");

            if (String.Compare(type, "year", true) == 0)
                month = -1;

            BPMObjectNameCollection include = null;
            BPMObjectNameCollection exclude = null;
            if (!String.IsNullOrEmpty(strInclude))
                include = JArray.Parse(strInclude).ToObject<BPMObjectNameCollection>();
            if (!String.IsNullOrEmpty(strExclude))
                exclude = JArray.Parse(strExclude).ToObject<BPMObjectNameCollection>();

            DataTable table;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    using (YZReader reader = new YZReader(provider.GetProcessAnalysisByHandlerAccount(cn, year, month, processName, orderby, include, exclude)))
                    {
                        table = reader.LoadTable();
                        PageResult.RegularColumnsName(table, new string[] {
                            "HandlerAccount",
                            "Counts",
                            "SumMinutes",
                            "AvgMinutes",
                            "MaxMinutes",
                            "TotalMinutes",
                            "Per"
                        });
                    }
                }
            }

            //补齐信息（账号的显示名）
            table.Columns.Add("HandlerUserShortName", typeof(string));
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                foreach (DataRow row in table.Rows)
                {
                    string account = Convert.ToString(row["HandlerAccount"]);
                    User user = User.TryGetUser(cn, account);
                    row["HandlerUserShortName"] = YZStringHelper.GetUserShortName(account, user != null ? user.DisplayName : "");
                }
            }

            return table;
        }
    }
}