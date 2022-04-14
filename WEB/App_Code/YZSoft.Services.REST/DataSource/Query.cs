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
using BPM.Client.DataSource;

namespace YZSoft.Services.REST.DataSource
{
    public class QueryHandler : DataSourceBaseHandler
    {
        public virtual JArray GetSchema(HttpContext context)
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

        public virtual object GetDataPaged(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("datasourceName", null);
            String query = Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("query")));
            DSParamCollection queryParams = JArray.Parse(request.GetString("queryParams")).ToObject<DSParamCollection>();
            YZClientParamCollection filters = this.GetFilters(request);
            YZPagingType paging = request.GetEnum<YZPagingType>("paging", YZPagingType.Enable);

            //准备空条件
            BPMDBParameterCollection @params = queryParams.CreateNullDBParameters();

            //应用查询条件
            this.ApplyFilters(@params, filters);

            //查询
            FlowDataTable table = new FlowDataTable();
            int rowcount;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                //发送排序字符串
                cn.RequestParams["sortstring"] = request.GetSortString("");
                cn.UpdateRequestParams();

                switch (paging)
                {
                    case YZPagingType.Disable:
                        table = DataSourceManager.Load(cn, datasourceName, BPMCommandType.Query, query, @params, true, 0, 1000, out rowcount);
                        break;
                    case YZPagingType.Client:
                        table = DataSourceManager.Load(cn, datasourceName, BPMCommandType.Query, query, @params, true, request.Start, request.Limit, out rowcount);
                        break;
                    default:
                        table = DataSourceManager.Load(cn, datasourceName, BPMCommandType.Query, query, @params, false, request.Start, request.Limit, out rowcount);
                        break;
                }
            }

            //返回
            return new
            {
                total = rowcount,
                children = table.ToDataTable()
            };
        }
    }
}