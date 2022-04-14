<%@ WebHandler Language="C#" Class="YZSoft.Forms.Services.DataBrowserServices" %>

using System;
using System.Web;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Runtime.Serialization;
using System.Text;
using System.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Data.Common;
using BPM.Data.Common;
using BPM.Json.Converters;
using YZSoft.ESB.Model;
using YZSoft.ESB5;
using YZSoft.ESB.Visit;
using BPM.Client.ESB;

namespace YZSoft.Forms.Services
{
    public enum DSType
    {
        UnKnow = 0,
        Table = 1,
        Procedure = 2,
        ESB = 3
    }

    [DataContract]
    public class DataSourceIdentity
    {
        public DSType DSType {
            get
            {
                if (!String.IsNullOrEmpty(this.TableName))
                    return DSType.Table;
                if (!String.IsNullOrEmpty(this.ProcedureName))
                    return DSType.Procedure;
                if (!String.IsNullOrEmpty(this.ESB))
                    return DSType.ESB;

                return DSType.UnKnow;
            }
        }

        [DataMember]
        public string DataSource { get; set; }
        [DataMember]
        public string TableName { get; set; }
        [DataMember]
        public string ProcedureName { get; set; }
        [DataMember]
        public string ESB { get; set; }
        [DataMember]
        public string OrderBy { get; set; }
    }

    public class DataBrowserServices : YZServiceHandler
    {
        private JObject GetData(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            GridPageInfo gridPageInfo = new GridPageInfo(context);

            DataSourceIdentity ds = JObject.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("ds", YZJsonHelper.Base64EmptyJObject)))).ToObject<DataSourceIdentity>();
            YZDSFilterCollection filters = JObject.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("filters", YZJsonHelper.Base64EmptyJObject)))).ToObject<YZDSFilterCollection>();
            BPMObjectNameCollection supportAllSearchParams = JArray.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("supportAllSearchParams", YZJsonHelper.Base64EmptyJArray)))).ToObject<BPMObjectNameCollection>();
            BPMObjectNameCollection allOutputColumns = JArray.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("allOutputColumns", YZJsonHelper.Base64EmptyJArray)))).ToObject<BPMObjectNameCollection>();
            YZClientParamCollection runtimeParams = JArray.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("params", YZJsonHelper.Base64EmptyJArray)))).ToObject<YZClientParamCollection>();

            this.PerformAfterBindFilter(filters, gridPageInfo);
            BPMDBParameterCollection @params = this.GetParameters(filters, supportAllSearchParams, runtimeParams);

            FlowDataTable table = null;
            int rowcount;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                switch (ds.DSType)
                {
                    case DSType.Table:
                        table = DataSourceManager.LoadTableDataPaged(cn, ds.DataSource, ds.TableName, allOutputColumns, @params, request.GetSortString(ds.OrderBy), gridPageInfo.Start, gridPageInfo.Limit, out rowcount);
                        break;
                    case DSType.Procedure:
                        table = DataSourceManager.ExecProcedure(cn, ds.DataSource, ds.ProcedureName, @params);
                        rowcount = table.Rows.Count;
                        break;
                    case DSType.ESB:
                        if (ds.ESB.StartsWith("ESB:", true, null))
                        {
                            string[] strs = ds.ESB.Split(':');
                            string flowName = strs[1];
                            table = ESBDSFlow.LoadDataPaged(cn, flowName, @params,request.GetSortString(ds.OrderBy),gridPageInfo.Start, gridPageInfo.Limit, out rowcount);
                        }
                        else
                        {
                            //获取参数
                            string[] strs = ds.ESB.Split(':');
                            SourceTypeEnum sourceType = (SourceTypeEnum)Enum.Parse(typeof(SourceTypeEnum), strs[0]);
                            SourceInfo sourceInfo = SourceInfoManager.GetSourceInfo(sourceType, strs[1]);
                            SourceVisit visit = new SourceVisit(sourceInfo);
                            List<ColumnInfo> values = new List<ColumnInfo>();
                            if (@params != null)
                            {
                                foreach (BPMDBParameter para in @params)
                                {
                                    values.Add(new ColumnInfo()
                                    {
                                        columnName = para.Name,
                                        defaultValue = para.Value
                                    });
                                }
                            }
                            DataTable dt = visit.GetResult(values);
                            table = new FlowDataTable(dt);
                            rowcount = table.Rows.Count;
                        }
                        break;
                    default:
                        rowcount = 0;
                        break;
                }
            }

            //将数据转化为Json集合
            JObject rv = new JObject();

            rv[YZJsonProperty.total] = rowcount;
            JArray children = new JArray();
            rv[YZJsonProperty.children] = children;

            foreach (FlowDataRow dataRow in table.Rows)
            {
                JObject item = new JObject();
                children.Add(item);

                foreach (FlowDataColumn column in table.Columns)
                {
                    object value = dataRow[column.ColumnName];

                    if (value is DateTime)
                        value = YZStringHelper.DateToStringL((DateTime)value);

                    if (value != null)
                        item[column.ColumnName] = JToken.FromObject(value);
                }
            }

            return rv;
        }

        private void PerformAfterBindFilter(YZDSFilterCollection fixFilters, GridPageInfo gridPageInfo)
        {
            foreach (KeyValuePair<string, YZDSFilter> fixFilter in fixFilters)
            {
                if (!fixFilter.Value.afterBind)
                    continue;

                string strValue = Convert.ToString(fixFilter.Value.value);

                if (String.Compare(strValue, "@@Start", true) == 0)
                    fixFilter.Value.value = gridPageInfo.Start;
                else if (String.Compare(strValue, "@@Limit", true) == 0)
                    fixFilter.Value.value = gridPageInfo.Limit;
                else if (String.Compare(strValue, "@@RowNumStart", true) == 0)
                    fixFilter.Value.value = gridPageInfo.RowNumStart;
                else if (String.Compare(strValue, "@@RowNumEnd", true) == 0)
                    fixFilter.Value.value = gridPageInfo.RowNumEnd;
            }
        }

        private BPMDBParameterCollection GetParameters(YZDSFilterCollection fixFilters, BPMObjectNameCollection supportAllSearchParams, YZClientParamCollection runtimeParams)
        {
            BPMDBParameterCollection @params = new BPMDBParameterCollection();

            //添加过滤条件
            foreach (KeyValuePair<string,YZDSFilter> fixFilter in fixFilters)
            {
                BPMDBParameter paramater = new BPMDBParameter(fixFilter.Key, typeof(String), fixFilter.Value.value);
                paramater.ParameterCompareType = BPMDBParameter.ParseOp(fixFilter.Value.op, ParameterCompareType.Equ) | ParameterCompareType.NecessaryCondition;
                @params.Add(paramater);
            }

            foreach (YZClientParam param in runtimeParams)
            {
                if (!param.isAll)
                {
                    BPMDBParameter parameter = new BPMDBParameter(param.name, param.dataType, param.value);
                    parameter.ParameterCompareType = BPMDBParameter.ParseOp(param.op, ParameterCompareType.Equ) | ParameterCompareType.NecessaryCondition;
                    @params.Add(parameter);
                }
                else
                {
                    foreach (string paramName in supportAllSearchParams)
                    {
                        BPMDBParameter parameter = new BPMDBParameter(paramName, typeof(String), param.value);
                        parameter.ParameterCompareType = ParameterCompareType.Like | ParameterCompareType.OptionCondition;
                        @params.Add(parameter);
                    }
                }
            }

            return @params;
        }
    }
}
