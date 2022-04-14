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

namespace YZSoft.Services.REST.BPM
{
    public class DataSourceHandler : YZServiceHandler
    {
        public virtual JObject GetTreeOfTables(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string serverName = request.GetString("ServerName", null);
            bool expand = request.GetBool("expand",true);

            TableIdentityCollection tables = new TableIdentityCollection();
            string strTables = request.GetString("tables", "[]");
            JArray jtables = JArray.Parse(strTables);
            foreach (JArray jtable in jtables)
                tables.Add(new TableIdentity((string)jtable[0], (string)jtable[1]));

            FlowDataSet dataSet;

            using (BPMConnection cn = new BPMConnection())
            {
                this.OpenConnection(cn, serverName);
                dataSet = DataSourceManager.LoadDataSetSchema(cn, tables);
            }

            JObject rv = new JObject();

            JArray jTables = new JArray();
            rv[YZJsonProperty.children] = jTables;

            foreach (FlowDataTable table in dataSet.Tables)
            {
                JObject jTable = new JObject();
                jTables.Add(jTable);

                jTable["leaf"] = false;
                jTable["glyph"] = 0xe800;
                jTable["id"] = table.DataSourceName + ":" + table.TableName;
                jTable["text"] = TableIdentityHelper.GetTableIdentityName(table.DataSourceName,table.TableName);
                jTable["expanded"] = expand;

                JArray children = new JArray();
                jTable[YZJsonProperty.children] = children;

                foreach (FlowDataColumn column in table.Columns)
                {
                    JObject jColumn = new JObject();
                    children.Add(jColumn);

                    jColumn["leaf"] = true;
                    jColumn["glyph"] = 0xeaf8;
                    jColumn["id"] = table.DataSourceName + ":" + table.TableName + "." + column.ColumnName;
                    jColumn["text"] = column.ColumnName;                 

                    jColumn["data"] = JObject.FromObject(new {
                         DataSourceName = table.DataSourceName,
                         TableName = table.TableName,
                         ColumnName = column.ColumnName,
                         FullName = table.TableName + "." + column.ColumnName,
                         Type = column.DataType.Name
                    });
                }
            }

            rv[YZJsonProperty.success] = true;
            return rv;
        }

        public virtual JArray GetTreeOfDataSources(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string datasourceName = request.GetString("datasource", null);
            string tableNameExpand = request.GetString("node", null);
            if (tableNameExpand == "root")
                tableNameExpand = null;

            if (String.IsNullOrEmpty(tableNameExpand))
            {
                bool includeView = request.GetBool("view", true);
                BPMObjectNameCollection tables;
                BPMObjectNameCollection views = new BPMObjectNameCollection();
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();
                    tables = DataSourceManager.GetTables(cn, datasourceName);
                    if (includeView)
                        views = DataSourceManager.GetViews(cn, datasourceName);
                }

                JArray rv = new JArray();

                foreach (string tableName in tables)
                {
                    JObject jitem = new JObject();
                    rv.Add(jitem);

                    jitem["leaf"] = false;
                    jitem["glyph"] = 0xe800;
                    jitem["id"] = tableName;
                    jitem["text"] = tableName;
                    jitem["data"] = JObject.FromObject(new
                    {
                        isTable = true,
                        DataSourceName = datasourceName,
                        TableName = tableName
                    });
                }

                foreach (string viewName in views)
                {
                    JObject jitem = new JObject();
                    rv.Add(jitem);

                    jitem["leaf"] = false;
                    jitem["id"] = viewName;
                    jitem["text"] = viewName;
                    jitem["glyph"] = 0xeaf9;
                    jitem["data"] = JObject.FromObject(new
                    {
                        isView = true,
                        DataSourceName = datasourceName,
                        TableName = viewName
                    });
                }

                return rv;
            }
            else
            {
                FlowDataTable table;
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();
                    table = DataSourceManager.LoadTableSchema(cn, datasourceName, tableNameExpand);
                }

                JArray rv = new JArray();
                foreach (FlowDataColumn column in table.Columns)
                {
                    JObject jColumn = new JObject();
                    rv.Add(jColumn);

                    jColumn["leaf"] = true;
                    jColumn["glyph"] = 0xeaf8;
                    jColumn["id"] = table.TableName + "." + column.ColumnName;
                    jColumn["text"] = column.ColumnName;

                    jColumn["data"] = JObject.FromObject(new
                    {
                        isColumn = true,
                        DataSourceName = table.DataSourceName,
                        TableName = table.TableName,
                        ColumnName = column.ColumnName,
                        FullName = table.TableName + "." + column.ColumnName,
                        Type = column.DataType.Name
                    });
                }

                return rv;
            }
        }

        public virtual TableIdentityCollection GetProcessGlobalTableIdentitys(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string serverName = request.GetString("ServerName", null);
            string processName = request.GetString("ProcessName");

            using (BPMConnection cn = new BPMConnection())
            {
                this.OpenConnection(cn, serverName);
                return BPMProcess.GetProcessGlobalTableIdentitys(cn, processName);
            }
        }

        public virtual JObject GetTableSchemas(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string serverName = request.GetString("ServerName", null);
            TableIdentityCollection tables = request.GetPostData<JArray>().ToObject<TableIdentityCollection>();
            FlowDataSet dataSet;

            using (BPMConnection cn = new BPMConnection())
            {
                this.OpenConnection(cn, serverName);
                dataSet = DataSourceManager.LoadDataSetSchema(cn, tables);
                return YZJsonHelper.SerializeSchema(dataSet);
            }
        }

        public virtual JArray GetDataSourceAndTables(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string datasourceName = request.GetString("node",null);
            if (datasourceName == "root")
                datasourceName = null;
            bool expand = request.GetBool("expand", false);

            if (String.IsNullOrEmpty(datasourceName))
            {
                BPMObjectNameCollection dsNames;
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();
                    dsNames = DataSourceManager.GetDataSourceNames(cn);
                }

                JArray rv = new JArray();
                foreach (string dsName in dsNames)
                {
                    JObject jitem = new JObject();
                    rv.Add(jitem);

                    jitem["leaf"] = false;
                    jitem["glyph"] = 0xeaf1;
                    jitem["id"] = dsName;
                    jitem["text"] = dsName;
                    jitem["expanded"] = expand;
                }

                return rv;
            }
            else
            {
                bool includeView = request.GetBool("view",false);
                BPMObjectNameCollection tables;
                BPMObjectNameCollection views = new BPMObjectNameCollection();
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();
                    tables = DataSourceManager.GetTables(cn, datasourceName);
                    if (includeView)
                        views = DataSourceManager.GetViews(cn, datasourceName);
                }

                JArray rv = new JArray();
                foreach (string tableName in tables)
                {
                    JObject jitem = new JObject();
                    rv.Add(jitem);

                    jitem["leaf"] = true;
                    jitem["glyph"] = 0xe800;
                    jitem["id"] = datasourceName + '.' + tableName;
                    jitem["text"] = tableName;
                    jitem["data"] = JObject.FromObject(new
                    {
                        DataSourceName = datasourceName,
                        TableName = tableName
                    });
                }

                foreach (string viewName in views)
                {
                    JObject jitem = new JObject();
                    rv.Add(jitem);

                    jitem["leaf"] = true;
                    jitem["id"] = datasourceName + '.' + viewName;
                    jitem["text"] = viewName;
                    jitem["glyph"] = 0xeaf9;
                    jitem["data"] = JObject.FromObject(new
                    {
                        DataSourceName = datasourceName,
                        TableName = viewName
                    });
                }

                return rv;
            }
        }

        public virtual BPMObjectNameCollection GetDataSourceNames(HttpContext context)
        {
            YZRequest request = new YZRequest(context);

            if(String.IsNullOrEmpty(request.GetString("captibity",null)))
            {
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();
                    return DataSourceManager.GetDataSourceNames(cn);
                }
            }
            else
            {
                DataSourceCapability captibity = request.GetEnum<DataSourceCapability>("captibity");

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();
                    return DataSourceManager.GetDataSourceNames(cn, captibity);
                }
            }
        }

        public virtual BPMObjectNameCollection GetTables(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("DataSource",null);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return DataSourceManager.GetTables(cn, datasourceName);
            }
        }

        public virtual BPMObjectNameCollection GetViews(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("DataSource",null);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return DataSourceManager.GetViews(cn, datasourceName);
            }
        }

        public virtual BPMObjectNameCollection GetProcedures(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("DataSource", null);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return DataSourceManager.GetProcedures(cn, datasourceName);
            }
        }

        public virtual BPMObjectNameCollection GetESBObjects(HttpContext context)
        {
            YZRequest request = new YZRequest(context);

            BPMObjectNameCollection rv = new BPMObjectNameCollection();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                ESBDSFlowCollection flows = cn.GetAllESBDSFlows();
                foreach(ESBDSFlow flow in flows)
                    rv.Add(string.Format("ESB:{0}", flow.Name));
            }

            SourceInfoCollection list = SourceInfoManager.GetSourceList();
            foreach (var item in list.ToArray())
            {
                rv.Add(string.Format("{0}:{1}",item.sourceType.ToString(),item.sourceName));
            }
            return rv;
        }

        public virtual JObject GetDataSourceSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String tableName = request.GetString("TableName", null);
            String procedureName = request.GetString("ProcedureName", null);
            String esb = request.GetString("ESB", null);
            String query = request.GetString("Query", null);

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

        public virtual JObject GetTableSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("DataSource",null);
            String tableName = request.GetString("tableName");
            FlowDataSet dataset = new FlowDataSet();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                dataset.Tables.Add(DataSourceManager.LoadTableSchema(cn, datasourceName, tableName));
            }

            return YZJsonHelper.SerializeSchema(dataset,"", "DataType");
        }

        public virtual JObject GetQuerySchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("DataSource", null);
            String query = request.GetString("Query");
            QueryParameterCollection queryParams = JArray.Parse(request.GetString("QueryParams")).ToObject<QueryParameterCollection>();
            FlowDataSet dataset = new FlowDataSet();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                dataset.Tables.Add(DataSourceManager.LoadSchemaByQuery(cn, datasourceName, query, queryParams.CreateNullDBParameters()));
            }

            return YZJsonHelper.SerializeSchema(dataset, "", "DataType");
        }

        public virtual JObject GetProcedureSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("DataSource",null);
            String procedureName = request.GetString("ProcedureName");
            FlowDataSet dataset = new FlowDataSet();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                FlowDataTable tableParams;
                dataset.Tables.Add(DataSourceManager.LoadProcedureSchema(cn, datasourceName, procedureName, out tableParams));
            }

            return YZJsonHelper.SerializeSchema(dataset, "", "DataType");
        }

        public virtual JObject GetESBObjectSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String objectName = request.GetString("ESB");

            if (objectName.StartsWith("ESB:", true, null))
                return this.GetESBDSFlowSchema(context);

            FlowDataSet dataset = new FlowDataSet();
            //获取参数
            string[] strs = objectName.Split(':');
            SourceTypeEnum sourceType = (SourceTypeEnum)Enum.Parse(typeof(SourceTypeEnum), strs[0]);
            SourceInfo sourceInfo = SourceInfoManager.GetSourceInfo(sourceType, strs[1]);

            FlowDataTable table = new FlowDataTable();
            dataset.Tables.Add(table);
            SourceVisit visit = new SourceVisit(sourceInfo);
            foreach (var item in visit.GetSchema())
            {
                table.Columns.Add(new FlowDataColumn(item.rename,typeof(string)));
            }

            return YZJsonHelper.SerializeSchema(dataset, "", "DataType");
        }

        public virtual JObject GetESBDSFlowSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String objectName = request.GetString("ESB");

            //获取参数
            string[] strs = objectName.Split(':');
            string flowName = strs[1];

            ESBDSFlow flow;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                flow = ESBDSFlow.OpenByName(cn, flowName);
            }

            FlowDataSet dataset = new FlowDataSet();
            FlowDataTable table = new FlowDataTable();
            dataset.Tables.Add(table);

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

            return YZJsonHelper.SerializeSchema(dataset, "", "DataType");
        }

        public virtual JObject GetDataSourceParams(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String tableName = request.GetString("TableName", null);
            String procedureName = request.GetString("ProcedureName", null);
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

        public virtual JObject GetTableParams(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("DataSource",null);
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

            FlowDataSet dataset = new FlowDataSet();
            dataset.Tables.Add(tableParams);

            JObject rv = YZJsonHelper.SerializeSchema(dataset, "", "DataType");
            rv["supportOp"] = true;
            return rv;
        }

        public virtual JObject GetProcedureParams(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("DataSource",null);
            String procedureName = request.GetString("ProcedureName");
            FlowDataSet dataset = new FlowDataSet();
            FlowDataTable tableParams;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                DataSourceManager.LoadProcedureSchema(cn, datasourceName, procedureName, out tableParams);
                dataset.Tables.Add(tableParams);
            }

            JObject rv = YZJsonHelper.SerializeSchema(dataset, "", "DataType");
            rv["supportOp"] = false;
            return rv;
        }

        public virtual JObject GetESBObjectParams(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String objectName = request.GetString("ESB");

            if (objectName.StartsWith("ESB:", true, null))
                return this.GetESBDSFlowParams(context);

            FlowDataSet dataset = new FlowDataSet();
            //获取参数
            string[] strs = objectName.Split(':');

            SourceTypeEnum sourceType = (SourceTypeEnum)Enum.Parse(typeof(SourceTypeEnum), strs[0]);
            SourceInfo sourceInfo = SourceInfoManager.GetSourceInfo(sourceType, strs[1]);


            FlowDataTable table = new FlowDataTable();
            dataset.Tables.Add(table);
            SourceVisit visit = new SourceVisit(sourceInfo);
            List<ColumnInfo> paramList = visit.GetParameter();
            if (paramList!=null&&paramList.Count>0)
            {
                foreach (var item in visit.GetParameter())
                {
                    table.Columns.Add(new FlowDataColumn(item.rename));
                }
            }
            JObject rv = YZJsonHelper.SerializeSchema(dataset, "", "DataType");
            rv["supportOp"] = false;
            return rv;
        }

        public virtual JObject GetESBDSFlowParams(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String objectName = request.GetString("ESB");

            //获取参数
            string[] strs = objectName.Split(':');
            string flowName = strs[1];

            ESBDSFlow flow;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                flow = ESBDSFlow.OpenByName(cn, flowName);
            }

            FlowDataSet dataset = new FlowDataSet();
            FlowDataTable table = new FlowDataTable();
            dataset.Tables.Add(table);

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

            JObject rv = YZJsonHelper.SerializeSchema(dataset, "", "DataType");
            rv["supportOp"] = false;
            return rv;
        }

        public virtual DataTable GetDataNoPaged(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String tableName = request.GetString("TableName", null);
            String procedureName = request.GetString("ProcedureName", null);
            String esb = request.GetString("ESB", null);
            String query = request.GetString("Query", null);

            if (!String.IsNullOrEmpty(tableName))
            {
                return this.GetTableDataNoPaged(context);
            }
            else if (!String.IsNullOrEmpty(procedureName))
            {
                return this.GetProcedureDataNoPaged(context);
            }
            if (!String.IsNullOrEmpty(esb))
            {
                return this.GetESBDataNoPaged(context);
            }

            throw new Exception(Resources.YZStrings.Aspx_Invalid_Paramaters);
        }

        public virtual DataTable GetTableDataNoPaged(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string dataSourceName = request.GetString("DataSource", null);
            string tableName = request.GetString("TableName");
            string orderBy = request.GetString("OrderBy", null);
            YZDSFilterCollection filters = JObject.Parse(request.GetString("Filter", "{}")).ToObject<YZDSFilterCollection>();

            BPMDBParameterCollection @params = new BPMDBParameterCollection();
            if (filters != null)
            {
                foreach (KeyValuePair<string, YZDSFilter> filter in filters)
                {
                    BPMDBParameter paramater = new BPMDBParameter(filter.Key, typeof(String), filter.Value.value);
                    paramater.ParameterCompareType = BPMDBParameter.ParseOp(filter.Value.op, ParameterCompareType.Equ) | ParameterCompareType.NecessaryCondition;
                    @params.Add(paramater);
                }
            }

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                FlowDataTable table = DataSourceManager.LoadTableData(cn, dataSourceName, tableName, @params, orderBy);
                return table.ToDataTable();
            }
        }

        public virtual DataTable GetProcedureDataNoPaged(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string dataSourceName = request.GetString("DataSource", null);
            string procedureName = request.GetString("ProcedureName");
            YZDSFilterCollection filters = JObject.Parse(request.GetString("Filter", "{}")).ToObject<YZDSFilterCollection>();

            BPMDBParameterCollection @params = new BPMDBParameterCollection();

            if (filters != null)
            {
                foreach (KeyValuePair<string, YZDSFilter> filter in filters)
                {
                    BPMDBParameter paramater = new BPMDBParameter(filter.Key, typeof(String), filter.Value.value);
                    @params.Add(paramater);
                }
            }

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                FlowDataTable table = DataSourceManager.ExecProcedure(cn, dataSourceName, procedureName, @params);
                return table.ToDataTable();
            }
        }

        public virtual DataTable GetESBDataNoPaged(HttpContext context)
        {
            YZRequest request = new YZRequest(context);

            string esbObjectName = request.GetString("ESB");
            if (esbObjectName.StartsWith("ESB:", true, null))
                return this.GetESBDSFlowDataNoPaged(context);

            YZDSFilterCollection filters = JObject.Parse(request.GetString("Filter", "{}")).ToObject<YZDSFilterCollection>();

            //获取参数
            string[] strs = esbObjectName.Split(':');
            SourceTypeEnum sourceType = (SourceTypeEnum)Enum.Parse(typeof(SourceTypeEnum), strs[0]);
            SourceInfo sourceInfo = SourceInfoManager.GetSourceInfo(sourceType, strs[1]);
            SourceVisit visit = new SourceVisit(sourceInfo);
            BPMObjectNameCollection names = new BPMObjectNameCollection();
            List<ColumnInfo> values = new List<ColumnInfo>();
            if (filters != null)
            {
                foreach (KeyValuePair<string, YZDSFilter> filter in filters)
                {
                    names.Add(filter.Key);
                    values.Add(new ColumnInfo()
                    {
                        columnName = filter.Key,
                        defaultValue = filter.Value.value
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
            String objectName = request.GetString("ESB");
            string orderBy = request.GetString("OrderBy", null);
            YZDSFilterCollection filters = JObject.Parse(request.GetString("Filter", "{}")).ToObject<YZDSFilterCollection>();

            //获取参数
            string[] strs = objectName.Split(':');
            string flowName = strs[1];

            BPMDBParameterCollection @params = new BPMDBParameterCollection();
            if (filters != null)
            {
                foreach (KeyValuePair<string, YZDSFilter> filter in filters)
                {
                    BPMDBParameter paramater = new BPMDBParameter(filter.Key, typeof(String), filter.Value.value);
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