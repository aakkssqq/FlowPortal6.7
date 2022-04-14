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
    public class ProcedureHandler : DataSourceBaseHandler
    {
        public virtual JArray GetParams(HttpContext context)
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

        public virtual JArray GetSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("datasourceName", null);
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

        public virtual DataTable GetDataNoPaged(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string datasourceName = request.GetString("datasourceName", null);
            string procedureName = request.GetString("procedureName");
            YZClientParamCollection filters = this.GetFilters(request);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                //准备空条件
                FlowDataTable tableParams;
                DataSourceManager.LoadProcedureSchema(cn, datasourceName, procedureName, out tableParams);
                BPMDBParameterCollection @params = this.CreateNullDBParameters(tableParams.Columns);

                //应用查询条件
                this.ApplyFilters(@params, filters);

                //查询
                FlowDataTable table = DataSourceManager.ExecProcedure(cn, datasourceName, procedureName, @params);

                //返回
                return table.ToDataTable();
            }
        }
    }
}