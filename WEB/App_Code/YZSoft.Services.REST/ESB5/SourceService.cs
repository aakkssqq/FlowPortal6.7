using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;
using YZSoft.ESB5;
using YZSoft.ESB.Model;
using System.IO;
using Newtonsoft.Json;
using System.Data;
using YZSoft.ESB.Analysis;
using YZSoft.Web.DAL;

namespace YZSoft.Services.REST.ESB5
{
    /// <summary>
    ///SourceHandler 的摘要说明
    /// </summary>
    public class SourceHandler : YZServiceHandler
    {
        /// <summary>
        /// 返回数据源列表
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JArray GetSourceList(HttpContext context)
        {
            JArray array = new JArray();
            SourceInfoCollection rv = SourceInfoManager.GetSourceList();
            return JArray.FromObject(rv);
        }
        /// <summary>
        /// 返回源详细信息
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject GetSourceInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int sourceId = request.GetInt32("sourceId");
            SourceInfo entity = SourceInfoManager.GetSourceInfo(sourceId);
            JObject obj = JObject.FromObject(entity);
            QueryDepictInfo info = JObject.Parse(entity.sourceStr).ToObject<QueryDepictInfo>();
            obj["sourceStr"] = BizCommon.GetQueryDepictInfoJson(info);
            obj[YZJsonProperty.success] = true;
            return obj;

        }
        /// <summary>
        /// 返回数据连接列表
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JArray GetConnectList(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            SourceTypeEnum sourceType = request.GetEnum<SourceTypeEnum>("sourceType");
            JArray array = new JArray();
            ConnectInfoCollection rv = ConnectInfoManager.GetConnectList(sourceType);
            return JArray.FromObject(rv);
        }
        /// <summary>
        /// 判断数据源名称是否唯一
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject IsSourceNameOnly(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string sourceName = request.GetString("sourceName");
            SourceTypeEnum sourceType = request.GetEnum<SourceTypeEnum>("sourceType");
            JObject obj = new JObject();
            bool falg = SourceInfoManager.IsSourceRepeat(sourceName, sourceType);
            if (falg)
            {
                obj[YZJsonProperty.success] = false;
                obj[YZJsonProperty.errorMessage] = "已存在同名的数据源，请重命名数据源名称！";
            }
            else
            {
                obj[YZJsonProperty.success] = true;
            }
            return obj;
        }
        /// <summary>
        /// 测试数据源
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject TestSource(HttpContext context)
        {
            JObject obj = new JObject();
            YZRequest request = new YZRequest(context);
            int sourceId = request.GetInt32("sourceId");
            SourceInfo sourceInfo = SourceInfoManager.GetSourceInfo(sourceId);
            QueryDepictInfo info = JObject.Parse(sourceInfo.sourceStr).ToObject<QueryDepictInfo>();
            StreamReader reader = new StreamReader(context.Request.InputStream);
            using (JsonTextReader streamReader = new JsonTextReader(reader))
            {
                //获取参数配置
                JsonSerializer serializer = new JsonSerializer();
                JArray array = serializer.Deserialize(streamReader) as JArray;
                if (array != null && array.Count > 0)
                {
                    foreach (var item in array)
                    {
                        ColumnInfo column = info.parameter.First(n => n.columnName == item["columnName"].ToString());
                        column.defaultValue = item["defaultValue"].ToString();
                    }
                }
            }
            DataTable dt = GetResult(info, sourceInfo.connectInfo);
            JArray results = new JArray();
            if (dt.Rows.Count > 0)
            {

                foreach (DataRow row in dt.Rows)
                {
                    JObject item = new JObject();
                    foreach (DataColumn column in dt.Columns)
                    {
                        item[column.ColumnName] = row[column.ColumnName].ToString();
                    }
                    results.Add(item);
                }
                obj["children"] = results;
            }
            else
            {
                JObject item = new JObject();
                foreach (DataColumn column in dt.Columns)
                {
                    item[column.ColumnName] = "";
                }
                results.Add(item);
                obj["children"] = results;
            }
            obj["children"] = results;
            //执行数据
            obj[YZJsonProperty.success] = true;
            return obj;
        }

        public JObject DeleteSource(HttpContext context)
        {
            JObject obj = new JObject();
            YZRequest request = new YZRequest(context);
            int sourceId = request.GetInt32("sourceId");

            SourceInfoManager.DeleteSource(sourceId);
            obj[YZJsonProperty.success] = true;
            obj[YZJsonProperty.errorMessage] = "删除成功！";
            return obj;
        }
        /// <summary>
        /// 返回访问结果
        /// </summary>
        /// <param name="info"></param>
        /// <param name="connect"></param>
        /// <returns></returns>
        private DataTable GetResult(QueryDepictInfo info, ConnectInfo connect)
        {
            ISourceHandle handle = null;
            switch (connect.connectType)
            {
                case SourceTypeEnum.Excel:
                    handle = new ExcelHandle(JObject.Parse(connect.connectStr).ToObject<ExcelLogin>());
                    break;
                case SourceTypeEnum.Oracle:
                     handle = new OracleHandle(JObject.Parse(connect.connectStr).ToObject<OracleLogin>());
                    break;
                case SourceTypeEnum.SAP:
                     handle = new SapHandle(JObject.Parse(connect.connectStr).ToObject<SapLogin>());
                    break;
                case SourceTypeEnum.SqlServer:
                     handle = new SqlServerHandle(JObject.Parse(connect.connectStr).ToObject<SqlServerLogin>());
                    break;
                case SourceTypeEnum.WebService:
                    handle = new WebServiceHandle(JObject.Parse(connect.connectStr).ToObject<WebServiceLogin>());
                    break;
                default:
                    break;
            }
            DataTable dt = new DataTable();
            if (handle != null)
            {
                dt = handle.GetResult(info);
            }
            return dt;
        }
       
      
    }
}