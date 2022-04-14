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

namespace YZSoft.Services.REST.DataSource
{
    public class TableHandler : DataSourceBaseHandler
    {
        public virtual JArray GetParams(HttpContext context)
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

            return this.SerializeParams(tableParams.Columns, true);
        }

        public virtual JArray GetSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("datasourceName", null);
            String tableName = request.GetString("tableName");
            FlowDataTable table;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                table = DataSourceManager.LoadTableSchema(cn, datasourceName, tableName);
            }

            return this.SerializeSchema(table.Columns);
        }

        public virtual DataTable GetDataNoPaged(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string datasourceName = request.GetString("datasourceName", null);
            string tableName = request.GetString("tableName");
            string orderBy = request.GetString("orderBy", null);
            YZClientParamCollection filters = this.GetFilters(request);
            BPMDBParameterCollection @params = this.GetParameters(filters, null);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                FlowDataTable table = DataSourceManager.LoadTableData(cn, datasourceName, tableName, @params, orderBy);
                return table.ToDataTable();
            }
        }
    }
}