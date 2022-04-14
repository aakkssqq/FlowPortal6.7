using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using BPM;
using BPM.Client;

namespace YZSoft.Services.REST.BPM
{
    public class XFormControlDesigntimeServiceHandler : YZServiceHandler
    {
        public virtual BPMObjectNameCollection GetFormApplicationNames(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string folder = request.GetString("folder", null);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                FormApplicationCollection formApplications = cn.GetFormApplicationList(folder, BPMPermision.None);

                BPMObjectNameCollection names = new BPMObjectNameCollection();
                foreach(FormApplication formApplication in formApplications)
                    names.Add(formApplication.Name);

                return names;
            }
        }

        public virtual BPMObjectNameCollection GetStoreFolders(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            StoreZoneType zone = request.GetEnum<StoreZoneType>("zone");
            string folder = request.GetString("folder", null);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return cn.GetFolders(zone, folder);
            }
        }

        public virtual BPMObjectNameCollection GetUserExtAttrNames(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String @namespace = request.GetString("namespace", Namespace.BPMOU);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                DataColumnCollection columns = User.GetExtColumns(cn, @namespace);

                BPMObjectNameCollection attrNames = new BPMObjectNameCollection();
                foreach (DataColumn column in columns)
                    attrNames.Add(column.ColumnName);

                return attrNames;
            }
        }

        public virtual BPMObjectNameCollection GetOUExtAttrNames(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String @namespace = request.GetString("namespace", Namespace.BPMOU);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                DataColumnCollection columns = OU.GetExtColumns(cn, @namespace);

                BPMObjectNameCollection attrNames = new BPMObjectNameCollection();
                foreach (DataColumn column in columns)
                    attrNames.Add(column.ColumnName);

                return attrNames;
            }
        }

        public virtual JObject GetXClassSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String xclass = request.GetString("xclass", null);
            FlowDataSet dataset = new FlowDataSet();
            FlowDataTable table = new FlowDataTable();
            FlowDataTable tableFilter = new FlowDataTable();
            dataset.Tables.Add(table);

            if (!String.IsNullOrEmpty(xclass))
            {
                string url = YZUtility.GetUrlFromXClass(xclass);
                string phyPath = context.Server.MapPath(url);
                using (StreamReader rd = new StreamReader(phyPath))
                {
                    string jsText = rd.ReadToEnd();
                    string dataColumns = this.GetProperty(jsText, "datasourceColumns", '[', ']');
                    if (!String.IsNullOrEmpty(dataColumns))
                    {
                        JArray jDataColumns = JArray.Parse(dataColumns);
                        foreach (JToken token in jDataColumns)
                        {
                            if (token.Type == JTokenType.String)
                            {
                                FlowDataColumn column = new FlowDataColumn((string)token, typeof(string));
                                table.Columns.Add(column);
                            }
                        }
                    }
                }
            }

            return YZJsonHelper.SerializeSchema(dataset, "", "DataType");
        }

        public virtual JObject GetXClassParams(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String xclass = request.GetString("xclass", null);
            FlowDataSet dataset = new FlowDataSet();
            FlowDataTable table = new FlowDataTable();
            dataset.Tables.Add(table);

            if (!String.IsNullOrEmpty(xclass))
            {
                string url = YZUtility.GetUrlFromXClass(xclass);
                string phyPath = context.Server.MapPath(url);
                using (StreamReader rd = new StreamReader(phyPath))
                {
                    string jsText = rd.ReadToEnd();
                    string dataColumns = this.GetProperty(jsText, "datasourceParams", '[', ']');
                    if (String.IsNullOrEmpty(dataColumns))
                        dataColumns = this.GetProperty(jsText, "datasourceColumns", '[', ']');

                    if (!String.IsNullOrEmpty(dataColumns))
                    {
                        JArray jDataColumns = JArray.Parse(dataColumns);
                        foreach (JToken token in jDataColumns)
                        {
                            if (token.Type == JTokenType.String)
                            {
                                FlowDataColumn column = new FlowDataColumn((string)token, typeof(string));
                                table.Columns.Add(column);
                            }
                        }
                    }
                }
            }

            JObject rv = YZJsonHelper.SerializeSchema(dataset, "", "DataType");
            //rv["supportOp"] = true;
            return rv;
        }

        protected virtual string GetProperty(string jsText, string property, char start, char end)
        {
            int index = jsText.IndexOf(property);
            if (index == -1)
                return null;

            int indexst = jsText.IndexOf(start, index + property.Length);
            if (indexst == -1)
                return null;

            int indexend = jsText.IndexOf(end, indexst + 1);
            if (indexst == -1)
                return null;

            return jsText.Substring(indexst, indexend - indexst + 1);
        }
    }
}