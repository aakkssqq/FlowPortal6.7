using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;
using System.IO;
using Newtonsoft.Json;
using System.Data;
using YZSoft.ESB5;
using YZSoft.ESB.Model;
using YZSoft.ESB.Analysis;

namespace YZSoft.Services.REST.ESB5
{
    /// <summary>
    ///WebServiceHandler 的摘要说明
    /// </summary>
    public class WebServiceHandler : YZServiceHandler
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
                WebServiceLogin login;
                ISourceHandle handle;

                YZRequest request = new YZRequest(context);
                string joinType = request.GetString("jointype");

                if (joinType.ToUpper().Equals("THEADD"))
                {
                    //新增模式 
                    int connectId = request.GetInt32("connectId");
                    ConnectInfo connectInfo = ConnectInfoManager.GetConnectInfo(connectId);
                    //生成连接对象
                    login = JObject.Parse(connectInfo.connectStr).ToObject<WebServiceLogin>();
                    //实例化连接对象
                    handle = new WebServiceHandle(login);
                    //获取接口集合
                    structList = handle.GetElementList();
                    
                }
                else
                {
                    //编辑模式
                    int sourceId = request.GetInt32("sourceId");
                    string functionName = request.GetString("functionName", "");

                    SourceInfo sourceInfo = SourceInfoManager.GetSourceInfo(sourceId);
                    //生成连接对象
                    login = JObject.Parse(sourceInfo.connectInfo.connectStr).ToObject<WebServiceLogin>();
                    //实例化连接对象
                    handle = new WebServiceHandle(login);
                    //获取接口集合
                    structList = handle.GetElementList(functionName);
                }

                if (structList != null && structList.Count > 0)
                {
                    JArray funcArray = new JArray();
                    foreach (var item in structList)
                    {
                        JObject jo = new JObject();
                        jo["name"] = item.elementName;
                        funcArray.Add(jo);
                    }

                    obj["funcarray"] = funcArray;
                    obj[YZJsonProperty.success] = true;
                }
                else
                {
                    obj[YZJsonProperty.success] = false;
                    obj[YZJsonProperty.errorMessage] = "没有可供调用的接口！";
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
        /// 获取参数
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject GetParameter(HttpContext context)
        {
            JObject obj = new JObject();
            try
            {
                YZRequest request = new YZRequest(context);
                //获取数据连接信息
                int connectId = request.GetInt32("connectId");
                ConnectInfo con = ConnectInfoManager.GetConnectInfo(connectId);
                WebServiceLogin login = JObject.Parse(con.connectStr).ToObject<WebServiceLogin>();
                ISourceHandle handle = new WebServiceHandle(login);
                //获取接口信息
                string functionName = request.GetString("functionName");
                QueryDepictInfo info = handle.GetQueryInfo(functionName);
                //序列化
                JArray parameterArray = new JArray();
                obj["parameter"] = parameterArray;
                if (info.parameter != null && info.parameter.Count > 0)
                {
                    if (CommonHandle.IsParameterNoType(info.parameter))
                    {
                        obj[YZJsonProperty.success] = false;
                        obj[YZJsonProperty.errorMessage] = "输入参数中有不符合规定的类型，无法进行配置！";
                        return obj;
                    }
                    foreach (ColumnInfo item in info.parameter)
                    {
                        parameterArray.Add(BizCommon.GetColumnJson(item));
                    }
                }
                if (info.schema == null)
                {
                    obj[YZJsonProperty.success] = false;
                    obj[YZJsonProperty.errorMessage] = "该接口没有返回值，不可调用！";
                    return obj;
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
        /// 返回输出参数
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject GetSchema(HttpContext context)
        {
            JObject obj = new JObject();
            try
            {
                YZRequest request = new YZRequest(context);
                //获取数据连接信息
                int connectId = request.GetInt32("connectId");
                ConnectInfo con = ConnectInfoManager.GetConnectInfo(connectId);
                WebServiceLogin login = JObject.Parse(con.connectStr).ToObject<WebServiceLogin>();
                ISourceHandle handle = new WebServiceHandle(login);
                //获取接口信息
                string functionName = request.GetString("functionName");
                QueryDepictInfo info = handle.GetQueryInfo(functionName);

                //获取输入值
                StreamReader reader = new StreamReader(context.Request.InputStream);
                using (JsonTextReader streamReader = new JsonTextReader(reader))
                {
                    //获取参数配置
                    JsonSerializer serializer = new JsonSerializer();
                    JArray array = serializer.Deserialize(streamReader) as JArray;
                    //清空输入参数原始值
                    CommonHandle.ClearParameter(info.parameter);
                    //更新输入参数
                    foreach (JObject item in array)
                    {
                        ColumnInfo column = info.parameter.First(n => n.columnName == item["columnName"].ToString());
                        SetParameterValue(column, item);
                    }
                }
                //如果输入参数无法识别
                if (CommonHandle.IsSchemaNoType(info.schema))
                {
                    //当输出参数无法识别通过访问再次进行解析
                    info = handle.GetQueryInfo(info);
                }
                //返回输出参数结构
                JArray schemaArray = new JArray();
                obj["schema"] = schemaArray;
                if (info.schema != null && info.schema.Count > 0)
                {
                    foreach (var item in info.schema)
                    {
                        schemaArray.Add(BizCommon.GetColumnJson(item));
                    }
                    obj[YZJsonProperty.success] = true;
                }
                else
                {
                    obj[YZJsonProperty.success] = false;
                    obj[YZJsonProperty.errorMessage] = "该接口没有返回值，不可调用！";
                    
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
        /// 返回结果集
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject GetResult(HttpContext context)
        {
            JObject obj = new JObject();
            try
            {
                YZRequest request = new YZRequest(context);
                //获取数据连接信息
                int connectId = request.GetInt32("connectId");
                ConnectInfo con = ConnectInfoManager.GetConnectInfo(connectId);
                WebServiceLogin login = JObject.Parse(con.connectStr).ToObject<WebServiceLogin>();
                ISourceHandle handle = new WebServiceHandle(login);
                //获取接口信息
                string functionName = request.GetString("functionName");
                QueryDepictInfo info = handle.GetQueryInfo(functionName);

                //获取输入输出参数配置
                StreamReader reader = new StreamReader(context.Request.InputStream);
                using (JsonTextReader streamReader = new JsonTextReader(reader))
                {
                    //获取参数配置
                    JsonSerializer serializer = new JsonSerializer();
                    JArray array = serializer.Deserialize(streamReader) as JArray;
                    JObject jo = array[0] as JObject;
                    JArray parameterArray = jo["parameter"] as JArray;
                    //清空输入参数原始值
                    CommonHandle.ClearParameter(info.parameter);
                    //配置输入参数值
                    foreach (JObject item in parameterArray)
                    {
                        ColumnInfo column = info.parameter.First(n => n.columnName == item["columnName"].ToString());
                        SetParameterValue(column, item);
                    }
                    //判断输出参数是否为无法识别类型
                    if (CommonHandle.IsSchemaNoType(info.schema))
                    {
                        info = handle.GetQueryInfo(info);
                    }
                    JArray schemaArray = jo["schema"] as JArray;
                    //清空输出参数原始值
                    CommonHandle.ClearParameter(info.schema);
                    //配置输出参数值
                    foreach (JObject item in schemaArray)
                    {
                        ColumnInfo columnInfo = info.schema.First(n => n.columnName == item["columnName"].ToString());
                        SetOutputInfo(columnInfo, item);
                    }
                }

                //获取运行结果
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
                obj[YZJsonProperty.errorMessage] = ex.Message;
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

                //判断是否重名
                bool isNameOnly = SourceInfoManager.IsSourceNameRepeat(sourceName, SourceTypeEnum.WebService, sourceId);
                if (isNameOnly)
                {
                    obj[YZJsonProperty.success] = false;
                    obj[YZJsonProperty.errorMessage] = "已存在同名的数据源，请重命名数据源名称！";
                    return obj;
                }
                ConnectInfo con = ConnectInfoManager.GetConnectInfo(connectId);
                WebServiceLogin login = JObject.Parse(con.connectStr).ToObject<WebServiceLogin>();
                ISourceHandle handle = new WebServiceHandle(login);
                //获取接口信息
                string functionName = request.GetString("functionName");
                QueryDepictInfo info = handle.GetQueryInfo(functionName);
                //获取输入输出参数配置
                StreamReader reader = new StreamReader(context.Request.InputStream);
                using (JsonTextReader streamReader = new JsonTextReader(reader))
                {
                    //获取参数配置
                    JsonSerializer serializer = new JsonSerializer();
                    JArray array = serializer.Deserialize(streamReader) as JArray;
                    JObject jo = array[0] as JObject;
                    JArray parameterArray = jo["parameter"] as JArray;
                    //清空输入参数原始值
                    CommonHandle.ClearParameter(info.parameter);
                    //配置输入参数值
                    foreach (JObject item in parameterArray)
                    {
                        ColumnInfo column = info.parameter.First(n => n.columnName == item["columnName"].ToString());
                        SetParameterValue(column, item);
                    }
                    //判断输出参数是否为无法识别类型
                    if (CommonHandle.IsSchemaNoType(info.schema))
                    {
                        info = handle.GetQueryInfo(info);
                    }
                    JArray schemaArray = jo["schema"] as JArray;
                    //清空输出参数原始值
                    CommonHandle.ClearParameter(info.schema);
                    //配置输出参数值
                    foreach (JObject item in schemaArray)
                    {
                        ColumnInfo columnInfo = info.schema.First(n => n.columnName == item["columnName"].ToString());
                        SetOutputInfo(columnInfo, item);
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
                    sourceInfo.sourceType = SourceTypeEnum.WebService;
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
                obj[YZJsonProperty.errorMessage] = ex.ToString();
                return obj;
            }
        }
        /// <summary>
        /// 设置输出参数配置
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="obj"></param>
        private void SetOutputInfo(ColumnInfo entity, JObject obj)
        {
            entity.rename = obj["rename"].ToString();
            entity.isShow = obj["isShow"].ToString().ToUpper().Equals("TRUE") ? 1 : 0;
            JArray array = obj["children"] as JArray;
            if (array != null)
            {
                foreach (JObject item in array)
                {
                    ColumnInfo ce = entity.seedList.First(n => n.columnName == item["columnName"].ToString());
                    SetOutputInfo(ce, item);
                }
            }
        }
        /// <summary>
        /// 输入参数赋值
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        private void SetParameterValue(ColumnInfo column, JObject obj)
        {
            column.rename = obj["rename"].ToString();
            column.isShow = obj["isShow"].ToString().ToUpper().Equals("TRUE") ? 1 : 0;
            if (column.seedList != null && column.seedList.Count > 0)
            {
                JArray list = obj["children"] as JArray;
                foreach (JObject jo in list)
                {
                    ColumnInfo info = column.seedList.First(n => n.columnName == jo["columnName"].ToString());
                    SetParameterValue(info, jo);
                }
            }
            else
            {
                column.defaultValue = obj["value"].ToString();
            }

        }
    }

}