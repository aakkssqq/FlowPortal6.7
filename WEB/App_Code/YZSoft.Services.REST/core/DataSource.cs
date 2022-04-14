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
using BPM.Client.DataSource;

namespace YZSoft.Services.REST.core
{
    public class DataSourceHandler : YZServiceHandler
    {
        #region schema

        public virtual JArray GetSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String tableName = request.GetString("tableName", null);
            String procedureName = request.GetString("procedureName", null);
            String esb = request.GetString("ESB", null);
            String query = request.GetString("query", null);

            if (!String.IsNullOrEmpty(tableName))
            {
                return this.GetTableSchema(context);
            }
            else if (!String.IsNullOrEmpty(query))
            {
                return this.GetQuerySchema(context);
            }
            else if (!String.IsNullOrEmpty(procedureName))
            {
                return this.GetProcedureSchema(context);
            }
            if (!String.IsNullOrEmpty(esb))
            {
                return this.GetESBObjectSchema(context);
            }

            throw new Exception(Resources.YZStrings.Aspx_Invalid_Paramaters);
        }

        public virtual JArray GetTableSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("datasourceName",null);
            String tableName = request.GetString("tableName");
            FlowDataTable table;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                table = DataSourceManager.LoadTableSchema(cn, datasourceName, tableName);
            }

            return this.SerializeSchema(table.Columns);
        }

        public virtual JArray GetProcedureSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("datasourceName",null);
            String procedureName = request.GetString("procedureName");
            FlowDataTable table;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                FlowDataTable tableParams;
                table = DataSourceManager.LoadProcedureSchema(cn, datasourceName, procedureName, out tableParams);
            }

            return this.SerializeSchema(table.Columns);
        }

        public virtual JArray GetESBObjectSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String objectName = request.GetString("ESB");
            //获取参数
            string[] strs = objectName.Split(':');
            SourceTypeEnum sourceType = (SourceTypeEnum)Enum.Parse(typeof(SourceTypeEnum), strs[0]);
            SourceInfo sourceInfo = SourceInfoManager.GetSourceInfo(sourceType, strs[1]);

            FlowDataTable table = new FlowDataTable();
            SourceVisit visit = new SourceVisit(sourceInfo);
            foreach (var item in visit.GetSchema())
            {
                table.Columns.Add(new FlowDataColumn(item.rename,typeof(string)));
            }

            return this.SerializeSchema(table.Columns);
        }

        public virtual JArray GetQuerySchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("datasourceName", null);
            String query = Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("query")));
            DSParamCollection queryParams = JArray.Parse(request.GetString("queryParams")).ToObject<DSParamCollection>();
            FlowDataTable table;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                table = DataSourceManager.LoadSchemaByQuery(cn, datasourceName, query, queryParams.CreateNullDBParameters());
            }

            return this.SerializeSchema(table.Columns);
        }

        #endregion

        #region params

        public virtual JArray GetParams(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String tableName = request.GetString("tableName", null);
            String procedureName = request.GetString("procedureName", null);
            String esb = request.GetString("ESB", null);

            if (!String.IsNullOrEmpty(tableName))
            {
                return this.GetTableParams(context);
            }
            else if (!String.IsNullOrEmpty(procedureName))
            {
                return this.GetProcedureParams(context);
            }
            if (!String.IsNullOrEmpty(esb))
            {
                return this.GetESBObjectParams(context);
            }

            return null;
        }

        public virtual JArray GetTableParams(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("datasourceName", null);
            String tableName = request.GetString("tableName");

            FlowDataTable tableSchema;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                tableSchema = DataSourceManager.LoadTableSchema(cn, datasourceName, tableName);
            }

            FlowDataTable tableParams = new FlowDataTable("Params");
            foreach (FlowDataColumn column in tableSchema.Columns)
            {
                if (column.AllowSearch)
                    tableParams.Columns.Add(column);
            }

            return this.SerializeParams(tableParams.Columns,true);
        }

        public virtual JArray GetProcedureParams(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("datasourceName", null);
            String procedureName = request.GetString("procedureName");
            FlowDataTable tableParams;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                DataSourceManager.LoadProcedureSchema(cn, datasourceName, procedureName, out tableParams);
            }

            return this.SerializeParams(tableParams.Columns, false);
        }

        public virtual JArray GetESBObjectParams(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String objectName = request.GetString("ESB");
            //获取参数
            string[] strs = objectName.Split(':');
            SourceTypeEnum sourceType = (SourceTypeEnum)Enum.Parse(typeof(SourceTypeEnum), strs[0]);
            SourceInfo sourceInfo = SourceInfoManager.GetSourceInfo(sourceType, strs[1]);

            FlowDataTable tableParams = new FlowDataTable();
            SourceVisit visit = new SourceVisit(sourceInfo);
            List<ColumnInfo> paramList = visit.GetParameter();
            if (paramList != null && paramList.Count > 0)
            {
                foreach (var item in visit.GetParameter())
                {
                    tableParams.Columns.Add(new FlowDataColumn(item.rename));
                }
            }

            return this.SerializeParams(tableParams.Columns, false);
        }

        #endregion

        public virtual object GetStoreData(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String tableName = request.GetString("tableName", null);
            String procedureName = request.GetString("procedureName", null);
            String esb = request.GetString("ESB", null);
            String query = request.GetString("query", null);

            if (!String.IsNullOrEmpty(tableName))
            {
                return this.GetTableDataStore(context);
            }
            else if (!String.IsNullOrEmpty(query))
            {
                return this.GetQueryDataStore(context);
            }
            else if (!String.IsNullOrEmpty(procedureName))
            {
                //return this.GetProcedureSchema(context);
                throw new NotImplementedException();
            }
            if (!String.IsNullOrEmpty(esb))
            {
                //return this.GetESBObjectSchema(context);
                throw new NotImplementedException();
            }

            throw new Exception(Resources.YZStrings.Aspx_Invalid_Paramaters);
        }

        public virtual object GetTableDataStore(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("datasourceName", null);
            String tableName = request.GetString("tableName");
            BPMObjectNameCollection outColumns = JArray.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("outColumns", YZJsonHelper.Base64EmptyJArray)))).ToObject<BPMObjectNameCollection>();
            String orderBy = request.GetString("orderBy",null);
            YZClientParamCollection clientParams = JArray.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("params", YZJsonHelper.Base64EmptyJArray)))).ToObject<YZClientParamCollection>();

            BPMDBParameterCollection @params = new BPMDBParameterCollection();
            foreach (YZClientParam param in clientParams)
            {
                if (!param.isAll)
                {
                    BPMDBParameter parameter = new BPMDBParameter(param.name, param.dataType, param.value);
                    parameter.ParameterCompareType = BPMDBParameter.ParseOp(param.op, ParameterCompareType.Equ) | ParameterCompareType.NecessaryCondition;
                    @params.Add(parameter);
                }
                else
                {
                    //foreach (string paramName in supportAllSearchParams)
                    //{
                    //    BPMDBParameter parameter = new BPMDBParameter(paramName, typeof(String), param.value);
                    //    parameter.ParameterCompareType = ParameterCompareType.Like | ParameterCompareType.OptionCondition;
                    //    @params.Add(parameter);
                    //}
                }
            }

            FlowDataTable table;
            int rowcount;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                table = DataSourceManager.LoadTableDataPaged(cn, datasourceName, tableName, outColumns, @params, request.GetSortString(orderBy), request.Start, request.Limit, out rowcount);
            }

            return new
            {
                total = rowcount,
                children = table.ToDataTable()
            };
        }

        public virtual object GetQueryDataStore(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("datasourceName", null);
            String query = Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("query")));
            DSParamCollection queryParams = JArray.Parse(request.GetString("queryParams")).ToObject<DSParamCollection>();
            YZClientParamCollection @params = JArray.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("params", YZJsonHelper.Base64EmptyJArray)))).ToObject<YZClientParamCollection>();
            bool clientCursor = request.GetBool("clientCursor", false);

            //应用查询条件
            BPMDBParameterCollection finallyParams = queryParams.CreateNullDBParameters();
            foreach (BPMDBParameter @param in finallyParams)
            {
                YZClientParam clientParam = @params.TryGetItem(@param.Name);
                if (clientParam != null && clientParam.value != null)
                    @param.Value = clientParam.value;
            }

            FlowDataTable table = new FlowDataTable();
            int rowcount;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                table.Load(cn, BPMCommandType.Query, query, finallyParams, clientCursor, request.Start, request.Limit, out rowcount);
            }

            return new
            {
                total = rowcount,
                children = table.ToDataTable()
            };
        }

        private JObject Serialize(Type dataType)
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

        private JArray SerializeSchema(FlowDataColumnCollection columns)
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

        private JArray SerializeParams(FlowDataColumnCollection columns, bool supportOp)
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