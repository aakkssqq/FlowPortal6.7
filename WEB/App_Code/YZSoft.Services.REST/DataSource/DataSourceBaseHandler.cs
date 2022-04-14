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
using YZSoft.ESB;
using YZSoft.ESB.Visit;
using System.Data;
using YZSoft.ActiveJson;

namespace YZSoft.Services.REST.DataSource
{
    public class DataSourceBaseHandler : YZServiceHandler
    {
        protected YZClientParamCollection GetFilters(YZRequest request)
        {
            string strFilters = request.GetString("filters", "[]");//Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("filters", YZJsonHelper.Base64EmptyJArray)))
            JArray jFilters = JArray.Parse(strFilters);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                Document doc = new Document(jFilters);
                doc.Execute(cn);
            }

            YZClientParamCollection filters = jFilters.ToObject<YZClientParamCollection>();
            return filters;
        }

        protected BPMDBParameterCollection CreateNullDBParameters(FlowDataColumnCollection columns)
        {
            BPMDBParameterCollection pms = new BPMDBParameterCollection();

            foreach (FlowDataColumn column in columns)
            {
                BPMDBParameter pm = new BPMDBParameter(column.ColumnName, column.DataType, null);
                pms.Add(pm);
            }

            return pms;
        }

        protected BPMDBParameterCollection ApplyFilters(BPMDBParameterCollection @params, YZClientParamCollection filters)
        {
            foreach (BPMDBParameter @param in @params)
            {
                YZClientParam filter = filters.TryGetItem(@param.Name);
                if (filter != null)
                    @param.Value = filter.value;
            }

            return @params;
        }

        protected BPMDBParameterCollection GetParameters(YZClientParamCollection filters, BPMObjectNameCollection supportAllSearchParams)
        {
            BPMDBParameterCollection @params = new BPMDBParameterCollection();

            foreach (YZClientParam param in filters)
            {
                if (!param.isAll)
                {
                    BPMDBParameter parameter = new BPMDBParameter(param.name, param.dataType, param.value);
                    parameter.ParameterCompareType = BPMDBParameter.ParseOp(param.op, ParameterCompareType.Equ) | ParameterCompareType.NecessaryCondition;
                    @params.Add(parameter);
                }
                else
                {
                    if (supportAllSearchParams != null)
                    {
                        foreach (string paramName in supportAllSearchParams)
                        {
                            BPMDBParameter parameter = new BPMDBParameter(paramName, typeof(String), param.value);
                            parameter.ParameterCompareType = ParameterCompareType.Like | ParameterCompareType.OptionCondition;
                            @params.Add(parameter);
                        }
                    }
                }
            }

            return @params;
        }

        protected JObject Serialize(Type dataType)
        {
            if (dataType != null)
            {
                JObject rv = new JObject();
                rv["name"] = dataType.Name;
                rv["fullName"] = dataType.FullName;
                return rv;
            }
            else
            {
                return null;
            }
        }

        protected JArray SerializeSchema(FlowDataColumnCollection columns)
        {
            JArray rv = new JArray();
            foreach (FlowDataColumn column in columns)
            {
                JObject jColumn = new JObject();
                rv.Add(jColumn);

                jColumn["ColumnName"] = column.ColumnName;
                jColumn["DataType"] = this.Serialize(column.DataType);
            }

            return rv;
        }

        protected JArray SerializeParams(FlowDataColumnCollection columns, bool supportOp)
        {
            JArray rv = new JArray();
            foreach (FlowDataColumn column in columns)
            {
                JObject jColumn = new JObject();
                rv.Add(jColumn);

                jColumn["name"] = column.ColumnName;
                jColumn["dataType"] = this.Serialize(column.DataType);
                jColumn["supportOp"] = supportOp;
            }

            return rv;
        }
    }
}