<%@ WebHandler Language="C#" Class="BPMApp.AppReportsModuleTree" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;

namespace BPMApp
{
    public class AppReportsModuleTree : YZServiceHandler
    {
        public object GetModuleTree(HttpContext context)
        {
            JArray rootItems = new JArray();
            JObject item;

            YZSecurityManager.ApplayPermision(rootItems);

            item = new JObject();
            item["text"] = Resources.YZStrings.Module_OtherReports;
            item["glyph"] = 0xeb12;
            item["id"] = "PRT_Other";

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                Expand(cn, item, rootItems, null);
            }

            JToken jToken;
            if (item.TryGetValue("tabs", out jToken))
            {
                rootItems.Add(item);
            }

            return rootItems;
        }

        protected void Expand(BPMConnection cn, JObject parentItem, JArray items, string path)
        {
            BPMObjectNameCollection folderNames = cn.GetFolders(StoreZoneType.Reports, path, BPMPermision.Execute);

            foreach (String folderName in folderNames)
            {
                string folderPath = String.IsNullOrEmpty(path) ? folderName : path + @"\" + folderName;

                JObject item = new JObject();
                item["text"] = folderName;
                item["glyph"] = 0xeb12;
                item["id"] = folderPath;
                items.Add(item);

                JArray children = new JArray();
                item.Add(YZJsonProperty.children, children);
                Expand(cn, item, children, folderPath);
            }

            ReportCollection reports = cn.GetReportList(path, BPMPermision.Execute);
            if (reports.Count != 0)
            {
                JArray tabs = new JArray();
                parentItem.Add("tabs", tabs);

                foreach (object obj in reports)
                {
                    Report report = obj as Report;
                    ReportX reportx = obj as ReportX;
                    if (report != null)
                    {
                        if (report.Hidden)
                            continue;

                        string reportPath = String.IsNullOrEmpty(path) ? report.Name : path + @"\" + report.Name;

                        JObject item = new JObject();
                        item["text"] = report.Name;
                        //item["id"] = "RPT" + reportPath;
                        item["xclass"] = "YZSoft.report.rpt.Panel";
                        JObject itemConfig = new JObject();
                        itemConfig["path"] = reportPath;
                        item["config"] = itemConfig;
                        tabs.Add(item);
                    }
                    if (reportx != null)
                    {
                        //if (reportx.Hidden)
                        //    continue;

                        string reportPath = String.IsNullOrEmpty(path) ? reportx.name : path + @"\" + reportx.name;

                        JObject item = new JObject();
                        item["text"] = reportx.name;
                        //item["id"] = "RPT" + reportPath;
                        item["xclass"] = "YZSoft.report.Panel";
                        JObject itemConfig = new JObject();
                        itemConfig["path"] = reportPath;
                        item["config"] = itemConfig;
                        tabs.Add(item);
                    }
                }
            }
        }
    }
}
