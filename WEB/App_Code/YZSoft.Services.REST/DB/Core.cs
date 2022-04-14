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

namespace YZSoft.Services.REST.DB
{
    public class CoreHandler : YZServiceHandler
    {
        public virtual BPMObjectNameCollection GetDataSourceNames(HttpContext context)
        {
            YZRequest request = new YZRequest(context);

            if (String.IsNullOrEmpty(request.GetString("captibity", null)))
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
            bool view = request.GetBool("view", false);
            String datasourceName = request.GetString("DataSource", null);

            BPMObjectNameCollection rv = new BPMObjectNameCollection();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                rv = DataSourceManager.GetTables(cn, datasourceName);
                if (view)
                    rv.Add(DataSourceManager.GetViews(cn, datasourceName));

                return rv;
            }
        }

        public virtual BPMObjectNameCollection GetViews(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("DataSource", null);

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
    }
}