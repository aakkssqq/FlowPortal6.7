using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;
using System.IO;
using Newtonsoft.Json;
using System.Data;
using YZSoft.ESB.Model;
using YZSoft.ESB5;
using YZSoft.ESB.Analysis;

namespace YZSoft.Services.REST.ESB5
{
    /// <summary>
    ///ExcelHandler 的摘要说明
    /// </summary>
    public class ExcelHandler : YZServiceHandler
    {
        /// <summary>
        /// 连接服务
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject JoinService(HttpContext context)
        {
            JObject obj = new JObject();
            try
            {
                List<ElementInfo> structList;
                ExcelLogin login;
                ISourceHandle handle;
                QueryDepictInfo info;

                YZRequest request = new YZRequest(context);
                string joinType = request.GetString("jointype");

                if (joinType.ToUpper().Equals("THEADD"))
                {
                    //新增模式 
                    int connectId = request.GetInt32("connectId");
                    ConnectInfo connectInfo = ConnectInfoManager.GetConnectInfo(connectId);
                    //生成连接对象
                    login = JObject.Parse(connectInfo.connectStr).ToObject<ExcelLogin>();
                    //实例化连接对象
                    handle = new ExcelHandle(login);
                    //获取接口集合
                    structList = handle.GetElementList();
                    info = new QueryDepictInfo();
                }
                else
                {
                    //编辑模式
                    int sourceId = request.GetInt32("sourceId");
                    //模糊查询表或视图的名称
                    string sheetName = request.GetString("sheetName", "");

                    SourceInfo sourceInfo = SourceInfoManager.GetSourceInfo(sourceId);
                    //生成连接对象
                    login = JObject.Parse(sourceInfo.connectInfo.connectStr).ToObject<ExcelLogin>();
                    //实例化连接对象
                    handle = new ExcelHandle(login);
                    //获取接口集合
                    structList = handle.GetElementList(sheetName);
                    info = JObject.Parse(sourceInfo.sourceStr).ToObject<QueryDepictInfo>();
                }
                //获取接口集合
                if (structList != null && structList.Count > 0)
                {
                    JArray sheetArray = new JArray();
                    foreach (var item in structList)
                    {
                        JObject jo = new JObject();
                        jo["name"] = item.elementName;
                        sheetArray.Add(jo);
                    }

                    obj["sheetArray"] = sheetArray;
                    obj["schema"] = GetColumnJson(info);
                    obj[YZJsonProperty.success] = true;
                }
                else
                {
                    obj[YZJsonProperty.success] = false;
                    obj[YZJsonProperty.errorMessage] = "没有可供查询的sheet表！";
                    return obj;
                }
                return obj;
            }
            catch (Exception ex)
            {
                obj[YZJsonProperty.success] = false;
                obj[YZJsonProperty.errorMessage] = ex.ToString();
                return obj;
            }
        }
        /// <summary>
        /// 获取结构
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject GetSchema(HttpContext context)
        {
            JObject obj = new JObject();
            try
            {
                YZRequest request = new YZRequest(context);
                int connectId = request.GetInt32("connectId");
                string sheetName = request.GetString("sheetName");
                string titleIndex = request.GetString("titleIndex");
                string query = string.Format("{0}|{1}", sheetName, titleIndex);

                ConnectInfo connectInfo = ConnectInfoManager.GetConnectInfo(connectId);
                ExcelLogin login = JObject.Parse(connectInfo.connectStr).ToObject<ExcelLogin>();
                ISourceHandle handle = new ExcelHandle(login);
                QueryDepictInfo info = handle.GetQueryInfo(sheetName);
                info.query = query;
                info = handle.GetQueryInfo(info);
                obj["schema"] = GetColumnJson(info);
                obj[YZJsonProperty.success] = true;
                return obj;
            }
            catch (Exception)
            {
                obj[YZJsonProperty.success] = false;
                obj[YZJsonProperty.errorMessage] = "没有可供查询的表或视图！";
                return obj;
            }
            
        }
        /// <summary>
        /// 返回结果
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject GetResult(HttpContext context)
        {
            JObject obj = new JObject();
            try
            {
                YZRequest request = new YZRequest(context);
                int connectId = request.GetInt32("connectId");
                string sheetName = request.GetString("sheetName");
                string titleIndex = request.GetString("titleIndex");
                string query = string.Format("{0}|{1}", sheetName, titleIndex);
                ConnectInfo connectInfo = ConnectInfoManager.GetConnectInfo(connectId);
                ExcelLogin login = JObject.Parse(connectInfo.connectStr).ToObject<ExcelLogin>();
                ISourceHandle handle = new ExcelHandle(login);
                QueryDepictInfo info = handle.GetQueryInfo(sheetName);
                info.query = query;
                info = handle.GetQueryInfo(info);

                StreamReader reader = new StreamReader(context.Request.InputStream);
                using (JsonTextReader streamReader = new JsonTextReader(reader))
                {
                    //获取参数配置
                    JsonSerializer serializer = new JsonSerializer();
                    JArray array = serializer.Deserialize(streamReader) as JArray;
                    List<ColumnInfo> param = new List<ColumnInfo>();
                    foreach (var item in array)
                    {
                        if (item["inputIsShow"].ToString().ToUpper().Equals("TRUE"))
                        {
                            ColumnInfo column = new ColumnInfo();
                            column.columnName = item["columnName"].ToString();
                            column.columnType = item["columnType"].ToString();
                            column.defaultValue = item["defaultValue"].ToString();
                            column.isShow = 1;
                            column.rename = item["inputRename"].ToString();
                            param.Add(column);
                        }

                        ColumnInfo schemaColumn = info.schema.First(n => n.columnName == item["columnName"].ToString());

                        if (item["outputIsShow"].ToString().ToUpper().Equals("TRUE"))
                        {

                            schemaColumn.rename = item["outputRename"].ToString();
                            schemaColumn.isShow = 1;
                        }
                        else
                        {
                            schemaColumn.isShow = 0;
                        }
                    }
                    info.parameter = param;
                }
                //访问
                DataTable dt = handle.GetResult(info);
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
                }
                else
                {
                    JObject item = new JObject();
                    foreach (DataColumn column in dt.Columns)
                    {
                        item[column.ColumnName] = "";
                    }
                    results.Add(item);
                }
                obj["children"] = results;
                //执行数据
                obj[YZJsonProperty.success] = true;
                return obj;
            }
            catch (Exception ex)
            {
                obj[YZJsonProperty.success] = false;
                obj[YZJsonProperty.errorMessage] = ex.ToString();
                return obj;
            }
        }
        /// <summary>
        /// 保存数据源
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject SaveSource(HttpContext context)
        {
            JObject obj = new JObject();
            try
            {
                YZRequest request = new YZRequest(context);
                string joinType = request.GetString("joinType");
                string sourceName = request.GetString("sourceName");
                string caption = request.GetString("caption", "");
                int connectId = request.GetInt32("connectId");
                int sourceId = request.GetInt32("sourceId", 0);
                string sheetName = request.GetString("sheetName");
                string titleIndex = request.GetString("titleIndex");
                string query = string.Format("{0}|{1}", sheetName, titleIndex);
                //判断是否重名
                bool isNameOnly = SourceInfoManager.IsSourceNameRepeat(sourceName, SourceTypeEnum.Excel, sourceId);
                if (isNameOnly)
                {
                    obj[YZJsonProperty.success] = false;
                    obj[YZJsonProperty.errorMessage] = "已存在同名的数据源，请重命名数据源名称！";
                    return obj;
                }

                ConnectInfo connectInfo = ConnectInfoManager.GetConnectInfo(connectId);
                ExcelLogin login = JObject.Parse(connectInfo.connectStr).ToObject<ExcelLogin>();
                ISourceHandle handle = new ExcelHandle(login);
                QueryDepictInfo info = handle.GetQueryInfo(sheetName);
                info.query = query;
                info = handle.GetQueryInfo(info);
                StreamReader reader = new StreamReader(context.Request.InputStream);
                using (JsonTextReader streamReader = new JsonTextReader(reader))
                {
                    //获取参数配置
                    JsonSerializer serializer = new JsonSerializer();
                    JArray array = serializer.Deserialize(streamReader) as JArray;
                    List<ColumnInfo> param = new List<ColumnInfo>();
                    foreach (var item in array)
                    {
                        if (item["inputIsShow"].ToString().ToUpper().Equals("TRUE"))
                        {
                            ColumnInfo column = new ColumnInfo();
                            column.columnName = item["columnName"].ToString();
                            column.columnType = item["columnType"].ToString();
                            column.defaultValue = item["defaultValue"].ToString();
                            column.isShow = 1;
                            column.rename = item["inputRename"].ToString();
                            param.Add(column);
                        }

                        ColumnInfo schemaColumn = info.schema.First(n => n.columnName == item["columnName"].ToString());

                        if (item["outputIsShow"].ToString().ToUpper().Equals("TRUE"))
                        {

                            schemaColumn.rename = item["outputRename"].ToString();
                            schemaColumn.isShow = 1;
                        }
                        else
                        {
                            schemaColumn.isShow = 0;
                        }
                    }

                    info.parameter = param;
                }

                if (joinType.ToUpper().Equals("THEEDIT"))
                {
                    SourceInfo sourceInfo = SourceInfoManager.GetSourceInfo(sourceId);
                    sourceInfo.sourceName = sourceName;
                    sourceInfo.caption = caption;
                    sourceInfo.updateTime = DateTime.Now;
                    sourceInfo.sourceStr = JObject.FromObject(info).ToString();
                    SourceInfoManager.EditSource(sourceInfo);
                }
                else
                {
                    SourceInfo sourceInfo = new SourceInfo();
                    sourceInfo.sourceName = sourceName;
                    sourceInfo.sourceType = SourceTypeEnum.Excel;
                    sourceInfo.connectInfo = ConnectInfoManager.GetConnectInfo(connectId);
                    sourceInfo.caption = caption;
                    sourceInfo.isvalid = true;
                    sourceInfo.createTime = DateTime.Now;
                    sourceInfo.updateTime = DateTime.Now;
                    sourceInfo.sourceStr = JObject.FromObject(info).ToString();
                    SourceInfoManager.AddSource(sourceInfo);
                }
                obj[YZJsonProperty.success] = true;
                obj[YZJsonProperty.errorMessage] = "保存成功";
                return obj;
            }
            catch (Exception ex)
            {
                obj[YZJsonProperty.success] = false;
                obj[YZJsonProperty.errorMessage] = ex.Message.ToString();
                return obj;
            }
        }
        /// <summary>
        /// 序列化结构数据
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        private JArray GetColumnJson(QueryDepictInfo info)
        {
            JArray array = new JArray();
            if (info.schema != null)
            {
                foreach (var item in info.schema)
                {
                    JObject obj = new JObject();
                    obj["expanded"] = true;
                    obj["columnIndex"] = item.columnIndex;
                    obj["columnName"] = item.columnName;
                    obj["columnType"] = item.columnType;
                    obj["outputRename"] = item.rename;
                    obj["outputIsShow"] = item.isShow == 1 ? true : false;
                    if (info.parameter != null)
                    {
                        ColumnInfo param = info.parameter.FirstOrDefault(n => n.columnName == item.columnName);
                        if (param != null)
                        {

                            obj["inputRename"] = param.rename;
                            obj["defaultValue"] = (string)param.defaultValue ?? "";
                            obj["inputIsShow"] = param.isShow == 1 ? true : false;

                        }
                        else
                        {
                            obj["inputRename"] = item.columnName;
                            obj["defaultValue"] = "";
                            obj["inputIsShow"] = false;
                        }
                    }
                    else
                    {
                        obj["inputRename"] = item.columnName;
                        obj["defaultValue"] = "";
                        obj["inputIsShow"] = false;
                    }
                    array.Add(obj);
                }
            }
            return array;
        }
    }
}