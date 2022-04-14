using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;
using System.IO;
using Newtonsoft.Json;
using System.Data;
using YZSoft.ESB5;
using YZSoft.ESB.Analysis;
using YZSoft.ESB.Model;

namespace YZSoft.Services.REST.ESB5
{
    /// <summary>
    ///SqlServerHandler 的摘要说明
    /// </summary>
    public class SqlServerHandler : YZServiceHandler
    {
        /// <summary>
        /// 连接到服务器
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject JoinService(HttpContext context)
        {
            JObject obj = new JObject();
            try
            {
                List<ElementInfo> structList;
                SqlServerLogin login;
                ISourceHandle handle;

                YZRequest request = new YZRequest(context);
                string joinType = request.GetString("jointype");

                if (joinType.ToUpper().Equals("THEADD"))
                {
                    //新增模式 
                    int connectId = request.GetInt32("connectId");
                    ConnectInfo connectInfo = ConnectInfoManager.GetConnectInfo(connectId);
                    //生成连接对象
                    login = JObject.Parse(connectInfo.connectStr).ToObject<SqlServerLogin>();
                    //实例化连接对象
                    handle = new SqlServerHandle(login);
                    //获取接口集合
                    structList = handle.GetElementList();

                }
                else
                {
                    //编辑模式
                    int sourceId = request.GetInt32("sourceId");
                    //模糊查询表或视图的名称
                    string name = request.GetString("name", "");

                    SourceInfo sourceInfo = SourceInfoManager.GetSourceInfo(sourceId);
                    //生成连接对象
                    login = JObject.Parse(sourceInfo.connectInfo.connectStr).ToObject<SqlServerLogin>();
                    //实例化连接对象
                    handle = new SqlServerHandle(login);
                    //获取接口集合
                    structList = handle.GetElementList(name);
                }

                if (structList != null && structList.Count > 0)
                {
                    List<ElementInfo> tableList = structList.Where(n => n.elementType.Trim().ToUpper().Equals("U")).ToList();
                    JArray tableArray = new JArray();
                    foreach (ElementInfo item in tableList)
                    {
                        JObject jo = new JObject();
                        jo["name"] = item.elementName;
                        tableArray.Add(jo);
                    }

                    List<ElementInfo> viewList = structList.Where(n => n.elementType.Trim().ToUpper().Equals("V")).ToList();
                    JArray viewArray = new JArray();
                    foreach (ElementInfo item in viewList)
                    {
                        JObject jo = new JObject();
                        jo["name"] = item.elementName;

                        viewArray.Add(jo);
                    }
                    obj["table"] = tableArray;
                    obj["view"] = viewArray;
                    obj[YZJsonProperty.success] = true;
                    return obj;
                }
                else
                {
                    obj[YZJsonProperty.success] = false;
                    obj[YZJsonProperty.errorMessage] = "没有可供查询的表或视图！";
                    return obj;
                } 
            }
            catch (Exception ex)
            {
                obj[YZJsonProperty.success] = false;
                obj[YZJsonProperty.errorMessage] = ex.ToString();
                return obj;
            }
        }
        /// <summary>
        /// 返回输入参数
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject GetParameter(HttpContext context)
        {
            JObject obj = new JObject();
            try
            {
                YZRequest request = new YZRequest(context);
                //操作类型
                string joinType = request.GetString("jointype");
                string queryStr = request.GetString("queryStr");
                //查询语句发生改变，重新分析语句
                string[] paramArray = queryStr.Split(' ');
                List<ColumnInfo> paramList = new List<ColumnInfo>();
                foreach (var item in paramArray)
                {
                    int index = item.IndexOf('@');
                    if (index != -1)
                    {
                        string str = item.Substring(index, item.Length - index).Trim();
                        paramList.Add(new ColumnInfo()
                        {
                            columnName = str,
                            rename = str,
                            isShow = 0
                        });
                    }
                }
                JArray array = new JArray();
                obj["children"] = array;
                if (paramList != null && paramList.Count > 0)
                {
                    foreach (ColumnInfo item in paramList)
                    {
                        JObject jo = new JObject();
                        jo["name"] = item.columnName;
                        jo["rename"] = item.rename;
                        jo["isShow"] = item.isShow == 1 ? true : false;
                        jo["value"] = item.defaultValue == null ? "" : item.defaultValue.ToString();
                        array.Add(jo);
                    }
                }
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
        /// 执行sql语句返回值
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject RunSql(HttpContext context)
        {
            JObject obj = new JObject();
            try
            {
                YZRequest request = new YZRequest(context);
                string queryStr = request.GetString("queryStr");
                QueryDepictInfo info = new QueryDepictInfo();
                info.query = queryStr;

                StreamReader reader = new StreamReader(context.Request.InputStream);
                using (JsonTextReader streamReader = new JsonTextReader(reader))
                {
                    //获取参数配置
                    JsonSerializer serializer = new JsonSerializer();
                    JArray array = serializer.Deserialize(streamReader) as JArray;
                    if (array != null && array.Count > 0)
                    {
                        List<ColumnInfo> paramList = new List<ColumnInfo>();
                        foreach (var item in array)
                        {
                            ColumnInfo column = new ColumnInfo();
                            column.columnName = item["columnName"].ToString();
                            column.rename = item["rename"].ToString();
                            column.isShow = item["isShow"].ToString().ToUpper().Equals("TRUE") ? 1 : 0;
                            column.defaultValue = item["defaultValue"].ToString();
                            paramList.Add(column);
                        }
                        info.parameter = paramList;
                    }
                    //执行
                    int connectId = request.GetInt32("connectId");
                    ConnectInfo con = ConnectInfoManager.GetConnectInfo(connectId);
                    SqlServerLogin login = JObject.Parse(con.connectStr).ToObject<SqlServerLogin>();
                    ISourceHandle handle = new SqlServerHandle(login);
                    
                    DataTable dt = handle.GetResult(info);
                    if (dt == null)
                    {
                        obj[YZJsonProperty.success] = false;
                        obj[YZJsonProperty.errorMessage] = "没有可供查询的结果！";
                        return obj;
                    }
                    //保存输出参数
                    List<ColumnInfo> schemaList = new List<ColumnInfo>();
                    foreach (DataColumn item in dt.Columns)
                    {
                        schemaList.Add(new ColumnInfo()
                        {
                            columnName = item.ColumnName,
                            rename = item.ColumnName,
                            columnType = item.DataType.Name,
                            isShow = 1
                        });
                    }
                    info.schema = schemaList;

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
            }
            catch (Exception ex)
            {
                obj[YZJsonProperty.success] = false;
                obj[YZJsonProperty.errorMessage] = ex.Message.ToString();
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
                //操作类型
                string joinType = request.GetString("joinType");
                string sourceName = request.GetString("sourceName");
                string caption = request.GetString("caption", "");
                int connectId = request.GetInt32("connectId");
                int sourceId = request.GetInt32("sourceId", 0);
                string queryStr = request.GetString("queryStr");

                //判断是否重名
                bool isNameOnly = SourceInfoManager.IsSourceNameRepeat(sourceName, SourceTypeEnum.SqlServer, sourceId);
                if (isNameOnly)
                {
                    obj[YZJsonProperty.success] = false;
                    obj[YZJsonProperty.errorMessage] = "已存在同名的数据源，请重命名数据源名称！";
                    return obj;
                }

                ConnectInfo con = ConnectInfoManager.GetConnectInfo(connectId);
                SqlServerLogin login = JObject.Parse(con.connectStr).ToObject<SqlServerLogin>();
                ISourceHandle handle = new SqlServerHandle(login);
                QueryDepictInfo info = new QueryDepictInfo();
                info.query = queryStr;

                StreamReader reader = new StreamReader(context.Request.InputStream);
                using (JsonTextReader streamReader = new JsonTextReader(reader))
                {
                    //获取参数配置
                    JsonSerializer serializer = new JsonSerializer();
                    JArray array = serializer.Deserialize(streamReader) as JArray;
                    JObject jo = array[0] as JObject;
                    JArray parameterArray = jo["parameter"] as JArray;
                    if (parameterArray != null && parameterArray.Count > 0)
                    {
                        List<ColumnInfo> paramList = new List<ColumnInfo>();
                        foreach (var item in parameterArray)
                        {
                            ColumnInfo column = new ColumnInfo();
                            column.columnName = item["columnName"].ToString();
                            column.rename = item["rename"].ToString();
                            column.isShow = item["isShow"].ToString().ToUpper().Equals("TRUE") ? 1 : 0;
                            column.defaultValue = item["defaultValue"].ToString();
                            paramList.Add(column);
                        }
                        info.parameter = paramList;
                    }

                    JArray schemaArray = jo["schema"] as JArray;
                    if (schemaArray != null && schemaArray.Count > 0)
                    {
                        List<ColumnInfo> schemaList = new List<ColumnInfo>();
                        foreach (var item in schemaArray)
                        {
                            ColumnInfo column = new ColumnInfo();
                            column.columnName = item["columnName"].ToString();
                            column.rename = item["rename"].ToString();
                            column.isShow = item["isShow"].ToString().ToUpper().Equals("TRUE") ? 1 : 0;
                            column.defaultValue = item["defaultValue"].ToString();
                            schemaList.Add(column);
                        }
                        info.schema = schemaList;
                    }
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
                    sourceInfo.sourceType = SourceTypeEnum.SqlServer;
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
      
    }
}