using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using BPM.Client.Data.Common;
using BPM.Data.Common;
using YZSoft.ESB.Model;
using YZSoft.ESB5;
using YZSoft.ESB.Visit;
using System.Data;
using BPM.Client.ESB;

namespace YZSoft.Services.REST.DataSource
{
    public class ESBHandler : DataSourceBaseHandler
    {
        public virtual JArray GetParams(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String esbObjectName = request.GetString("esbObjectName");

            if (esbObjectName.StartsWith("ESB:", true, null))
                return this.GetESBDSFlowParams(context);

            //获取参数
            string[] strs = esbObjectName.Split(':');
            SourceTypeEnum sourceType = (SourceTypeEnum)Enum.Parse(typeof(SourceTypeEnum), strs[0]);
            SourceInfo sourceInfo = SourceInfoManager.GetSourceInfo(sourceType, strs[1]);

            FlowDataTable table = new FlowDataTable();
            SourceVisit visit = new SourceVisit(sourceInfo);
            List<ColumnInfo> paramList = visit.GetParameter();
            if (paramList != null && paramList.Count > 0)
            {
                foreach (var item in visit.GetParameter())
                {
                    table.Columns.Add(new FlowDataColumn(item.rename));
                }
            }

            return this.SerializeParams(table.Columns, false);
        }

        public virtual JArray GetESBDSFlowParams(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String objectName = request.GetString("esbObjectName");

            //获取参数
            string[] strs = objectName.Split(':');
            string flowName = strs[1];

            ESBDSFlow flow;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                flow = ESBDSFlow.OpenByName(cn, flowName);
            }

            FlowDataTable table = new FlowDataTable();
            if (flow.InputSchame != null)
            {
                JObject jProperty = flow.InputSchame.SelectToken("Parameters.properties") as JObject;
                if (jProperty != null)
                {
                    foreach (KeyValuePair<string, JToken> prop in jProperty)
                    {
                        JObject jValue = prop.Value as JObject;
                        table.Columns.Add(new FlowDataColumn(prop.Key, JSchameDataColumnConvert.JSchemaType2DataColumnType(jValue)));
                    }
                }
            }

            return this.SerializeParams(table.Columns, false);
        }


        public virtual JArray GetSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String esbObjectName = request.GetString("esbObjectName");

            if (esbObjectName.StartsWith("ESB:", true, null))
                return this.GetESBDSFlowSchema(context);

            FlowDataSet dataset = new FlowDataSet();
            //获取参数
            string[] strs = esbObjectName.Split(':');
            SourceTypeEnum sourceType = (SourceTypeEnum)Enum.Parse(typeof(SourceTypeEnum), strs[0]);
            SourceInfo sourceInfo = SourceInfoManager.GetSourceInfo(sourceType, strs[1]);

            FlowDataTable table = new FlowDataTable();
            SourceVisit visit = new SourceVisit(sourceInfo);
            foreach (var item in visit.GetSchema())
            {
                table.Columns.Add(new FlowDataColumn(item.rename, typeof(string)));
            }

            return this.SerializeSchema(table.Columns);
        }

        public virtual JArray GetESBDSFlowSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String objectName = request.GetString("esbObjectName");

            //获取参数
            string[] strs = objectName.Split(':');
            string flowName = strs[1];

            ESBDSFlow flow;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                flow = ESBDSFlow.OpenByName(cn, flowName);
            }

            FlowDataTable table = new FlowDataTable();
            if (flow.OutputSchame != null)
            {
                JObject jProperty = flow.OutputSchame.SelectToken("Response.properties.rows.items.properties") as JObject;
                if (jProperty != null)
                {
                    foreach (KeyValuePair<string, JToken> prop in jProperty)
                    {
                        JObject jValue = prop.Value as JObject;
                        table.Columns.Add(new FlowDataColumn(prop.Key, JSchameDataColumnConvert.JSchemaType2DataColumnType(jValue)));
                    }
                }
            }

            return this.SerializeSchema(table.Columns);
        }


        public virtual DataTable GetDataNoPaged(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string esbObjectName = request.GetString("esbObjectName");

            if (esbObjectName.StartsWith("ESB:", true, null))
                return this.GetESBDSFlowDataNoPaged(context);

            YZClientParamCollection filters = this.GetFilters(request);

            //获取参数
            string[] strs = esbObjectName.Split(':');
            SourceTypeEnum sourceType = (SourceTypeEnum)Enum.Parse(typeof(SourceTypeEnum), strs[0]);
            SourceInfo sourceInfo = SourceInfoManager.GetSourceInfo(sourceType, strs[1]);
            SourceVisit visit = new SourceVisit(sourceInfo);
            BPMObjectNameCollection names = new BPMObjectNameCollection();
            List<ColumnInfo> values = new List<ColumnInfo>();
            if (filters != null)
            {
                foreach (YZClientParam filter in filters)
                {
                    names.Add(filter.name);
                    values.Add(new ColumnInfo()
                    {
                        columnName = filter.name,
                        defaultValue = filter.value
                    });
                }

                foreach (ColumnInfo column in visit.GetParameter())
                {
                    if (!names.Contains(column.rename))
                    {
                        names.Add(column.rename);
                        values.Add(new ColumnInfo()
                        {
                            columnName = column.rename,
                            defaultValue = column.defaultValue
                        });
                    }
                }
            }

            return visit.GetResult(values);
        }

        public virtual DataTable GetESBDSFlowDataNoPaged(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String objectName = request.GetString("esbObjectName");
            string orderBy = request.GetString("orderBy", null);
            YZClientParamCollection filters = this.GetFilters(request);

            //获取参数
            string[] strs = objectName.Split(':');
            string flowName = strs[1];

            BPMDBParameterCollection @params = new BPMDBParameterCollection();
            if (filters != null)
            {
                foreach (YZClientParam filter in filters)
                {
                    BPMDBParameter paramater = new BPMDBParameter(filter.name, typeof(String), filter.value);
                    @params.Add(paramater);

                }
            }

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                FlowDataTable table = ESBDSFlow.LoadDataNoPaged(cn, flowName, @params, orderBy);
                return table.ToDataTable();
            }
        }

    }
}