using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BPM.Client;
using System.Data;
using Newtonsoft.Json.Linq;
using YZSoft.ESB5;
using YZSoft.ESB.Model;
using YZSoft.ESB.Analysis;

namespace YZSoft.Services.REST.ESB5
{
    /// <summary>
    ///ConnectHandler 的摘要说明
    /// </summary>
    public class ConnectHandler : YZServiceHandler
    {
        #region 数据连接列表操作
        /// <summary>
        /// 返回数据连接集合
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JArray GetConnectList(HttpContext context)
        {
            JArray array = new JArray();
            YZRequest request = new YZRequest(context);
            ConnectInfoCollection list =ConnectInfoManager.GetConnectList();
            array = JArray.FromObject(list);
            return array;
        }
        /// <summary>
        /// 删除数据连接
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject DelConnect(HttpContext context)
        {
            JObject obj = new JObject();
            YZRequest request = new YZRequest(context);
            ConnectInfoManager.DeleteConnect(request.GetInt32("connectId", -1));
            obj[YZJsonProperty.success] = true;
            obj[YZJsonProperty.errorMessage] = "删除成功！";
            return obj;
        }
        /// <summary>
        /// 测试数据连接
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject TestConnect(HttpContext context)
        {
            JObject obj = new JObject();
            YZRequest request = new YZRequest(context);
            bool flag = false;
            string message = null;
            ConnectInfo entity = ConnectInfoManager.GetConnectInfo(request.GetInt32("connectId", -1));
            switch (entity.connectType)
            {
                case SourceTypeEnum.Excel:
                    flag = CommonHandle.IsExcelJoin(JObject.Parse(entity.connectStr).ToObject<ExcelLogin>(), out message);
                    break;
                case SourceTypeEnum.Oracle:
                    flag = CommonHandle.IsOracleJoin(JObject.Parse(entity.connectStr).ToObject<OracleLogin>(), out message);
                    break;
                case SourceTypeEnum.SAP:
                    flag = CommonHandle.IsSapJoin(JObject.Parse(entity.connectStr).ToObject<SapLogin>(), out message);
                    break;
                case SourceTypeEnum.SqlServer:
                    flag = CommonHandle.IsSqlServerJoin(JObject.Parse(entity.connectStr).ToObject<SqlServerLogin>(), out message);
                    break;
                case SourceTypeEnum.WebService:
                    flag = CommonHandle.IsWebServiceJoin(JObject.Parse(entity.connectStr).ToObject<WebServiceLogin>(), out message);
                    break;
                default:
                    break;
            }
            obj[YZJsonProperty.success] = flag;
            obj[YZJsonProperty.errorMessage] = flag ? "连接成功！" : String.Format("连接失败！原因：<br/>{0}",message);
            return obj;
        }
        /// <summary>
        /// 返回数据连接信息
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject EditConnect(HttpContext context)
        {
            JObject obj = new JObject();
            YZRequest request = new YZRequest(context);
            ConnectInfo info = ConnectInfoManager.GetConnectInfo(request.GetInt32("connectId",-1));
            obj = JObject.FromObject(info);
            obj["connectStr"] = JObject.Parse(obj["connectStr"].ToString());
            return obj;
        }
        #endregion

        #region webservice连接操作
        /// <summary>
        /// 测试webservice数据库连接
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject JoinWebService(HttpContext context)
        {
            JObject obj = new JObject();
            YZRequest request = new YZRequest(context);
            WebServiceLogin login = new WebServiceLogin();
            login.webPath = request.GetString("webPath");
            string message = null;
            bool flag = CommonHandle.IsWebServiceJoin(login, out message);

            obj[YZJsonProperty.success] = true;
            obj[YZJsonProperty.errorMessage] = flag ? "连接成功！" : String.Format("连接失败！原因：<br/>{0}", message);
            return obj;
        }
        /// <summary>
        /// 保存webservice数据连接
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject SaveWebConnect(HttpContext context)
        {
            JObject obj = new JObject();
            YZRequest request = new YZRequest(context);
            try
            {
                //获取操作模式
                string joinType = request.GetString("joinType");
                //获取连接数据
                WebServiceLogin login = new WebServiceLogin();
                login.webPath = request.GetString("webPath");
                string message = null;
                if (!CommonHandle.IsWebServiceJoin(login, out message))
                {
                    obj[YZJsonProperty.success] = false;
                    obj[YZJsonProperty.errorMessage] = "服务无法连接！";
                    return obj;
                }
                if (joinType.ToUpper().Equals("THEEDIT"))
                {
                    //编辑模式
                    ConnectInfo info = ConnectInfoManager.GetConnectInfo(request.GetInt32("connectId", -1));
                    info.caption = request.GetString("caption","");
                    info.connectStr = JObject.FromObject(login).ToString();
                    info.updateTime = DateTime.Now;
                    info.isvalid = true;
                    //更新
                    ConnectInfoManager.EditConnect(info);
                    obj["connectId"] = info.connectId;
                }
                else
                {
                    //新增模式
                    if (ConnectInfoManager.IsConnectRepeat(request.GetString("connectName", ""), SourceTypeEnum.WebService))
                    {
                        obj[YZJsonProperty.success] = false;
                        obj[YZJsonProperty.errorMessage] = "已存在同名的数据源";
                        return obj;
                    }
                    ConnectInfo info = new ConnectInfo();
                    info.connectName = request.GetString("connectName", "");
                    info.connectType = SourceTypeEnum.WebService;
                    info.caption = request.GetString("caption","");
                    info.connectStr = JObject.FromObject(login).ToString();
                    info.createTime = DateTime.Now;
                    info.updateTime = DateTime.Now;
                    info.isvalid = true;
                    //新增
                    ConnectInfoManager.AddConnect(info);
                    obj["connectId"] = ConnectInfoManager.GetConnectInfo(SourceTypeEnum.WebService, info.connectName).connectId;
                }
                obj[YZJsonProperty.success] = true;
                obj[YZJsonProperty.errorMessage] = "数据连接保存成功";
                return obj;
            }
            catch (Exception ex)
            {
                string msg = string.Format("保存失败:{0}", ex.ToString());
                obj[YZJsonProperty.success] = false;
                obj[YZJsonProperty.errorMessage] = msg;
                return obj;
            }
        }
        #endregion

        #region sap连接操作
        /// <summary>
        /// 连接sap服务
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject JoinSap(HttpContext context)
        {
            JObject obj = new JObject();
            YZRequest request = new YZRequest(context);
            SapLogin login = new SapLogin();
            login.systemName = request.GetString("systemName");
            login.SAPRouter = request.GetString("saprouter", "");
            login.serverHost = request.GetString("serverHost");
            login.systemNumber = request.GetString("systemNumber");
            login.client = request.GetString("client");
            login.user = request.GetString("user");
            login.pwd = request.GetString("pwd");
            login.language = request.GetString("language");
            string message = null;
            bool flag = CommonHandle.IsSapJoin(login,out message);
            obj[YZJsonProperty.success] = true;
            obj[YZJsonProperty.errorMessage] = flag ? "连接成功！" : String.Format("连接失败！原因：<br/>{0}", message);
            return obj;
        }
        /// <summary>
        /// 保存sap数据连接
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject SaveSapConnect(HttpContext context)
        {
            JObject obj = new JObject();
            YZRequest request = new YZRequest(context);
            try
            {
                //获取操作模式
                string joinType = request.GetString("joinType");
                //获取连接数据
                SapLogin login = new SapLogin();
                login.systemName = request.GetString("systemName");
                login.serverHost = request.GetString("serverHost");
                login.SAPRouter = request.GetString("saprouter", "");
                login.systemNumber = request.GetString("systemNumber");
                login.client = request.GetString("client");
                login.user = request.GetString("user");
                login.pwd = request.GetString("pwd");
                login.language = request.GetString("language");
                string message = null;
                if (!CommonHandle.IsSapJoin(login,out message))
                {
                    obj[YZJsonProperty.success] = false;
                    obj[YZJsonProperty.errorMessage] = "服务无法连接！";
                    return obj;
                }
                if (joinType.ToUpper().Equals("THEEDIT"))
                {
                    //编辑模式
                    ConnectInfo info = ConnectInfoManager.GetConnectInfo(request.GetInt32("connectId",-1));
                    info.caption = request.GetString("caption","");
                    info.connectStr = JObject.FromObject(login).ToString();
                    info.updateTime = DateTime.Now;
                    info.isvalid = true;
                    //更新
                    ConnectInfoManager.EditConnect(info);
                    obj["connectId"] = info.connectId;
                }
                else
                {
                    //新增模式
                    if (ConnectInfoManager.IsConnectRepeat(request.GetString("connectName", ""), SourceTypeEnum.SAP))
                    {
                        obj[YZJsonProperty.success] = false;
                        obj[YZJsonProperty.errorMessage] = "已存在同名的数据源";
                        return obj;
                    }
                    ConnectInfo info = new ConnectInfo();
                    info.connectName = request.GetString("connectName", "");
                    info.connectType = SourceTypeEnum.SAP;
                    info.caption = request.GetString("caption","");
                    info.connectStr = JObject.FromObject(login).ToString();
                    info.createTime = DateTime.Now;
                    info.updateTime = DateTime.Now;
                    info.isvalid = true;
                    //新增
                    ConnectInfoManager.AddConnect(info);
                    obj["connectId"] = ConnectInfoManager.GetConnectInfo(SourceTypeEnum.SAP, info.connectName).connectId;
                }
                obj[YZJsonProperty.success] = true;
                obj[YZJsonProperty.errorMessage] = "数据连接保存成功";
                return obj;
            }
            catch (Exception ex)
            {
                string msg = string.Format("保存失败:{0}", ex.ToString());
                obj[YZJsonProperty.success] = false;
                obj[YZJsonProperty.errorMessage] = msg;
                return obj;
            }
        }
        #endregion

        #region sqlserver连接操作
        /// <summary>
        /// 返回数据库名称集合
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject GetSqlServerDBList(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string dataSource = request.GetString("dataSource");
            string user = request.GetString("user");
            string pwd = request.GetString("pwd");
            JObject obj = new JObject();
            obj["dbName"] = ConnectInfoManager.GetSqlServerDBList(dataSource, user, pwd);
            return obj;
        }
        /// <summary>
        /// 测试sql数据库连接
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject JoinSqlServer(HttpContext context)
        {
            JObject obj = new JObject();
            YZRequest request = new YZRequest(context);
            SqlServerLogin login = new SqlServerLogin();
            login.dataSource = request.GetString("dataSource");
            login.dataBase = request.GetString("dataBase");
            login.user = request.GetString("user");
            login.pwd = request.GetString("pwd");
            string message = null;
            bool flag = CommonHandle.IsSqlServerJoin(login, out message);
            obj[YZJsonProperty.success] = true;
            obj[YZJsonProperty.errorMessage] = flag ? "连接成功！" : String.Format("连接失败！原因：<br/>{0}", message);
            return obj;
        }
        /// <summary>
        /// 保存sql数据连接
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject SaveSQLConnect(HttpContext context)
        {
            JObject obj = new JObject();
            YZRequest request = new YZRequest(context);
            try
            {
                //获取操作模式
                string joinType = request.GetString("joinType");
                //获取连接数据
                SqlServerLogin login = new SqlServerLogin();
                login.dataSource = request.GetString("dataSource");
                login.dataBase = request.GetString("dataBase");
                login.user = request.GetString("user");
                login.pwd = request.GetString("pwd");
                string message = null;
                if (!CommonHandle.IsSqlServerJoin(login, out message))
                {
                    obj[YZJsonProperty.success] = false;
                    obj[YZJsonProperty.errorMessage] = "服务无法连接！";
                    return obj;
                }
                if (joinType.ToUpper().Equals("THEEDIT"))
                {
                    //编辑模式
                    ConnectInfo info = ConnectInfoManager.GetConnectInfo(request.GetInt32("connectId",-1));
                    info.caption = request.GetString("caption","");
                    info.connectStr = JObject.FromObject(login).ToString();
                    info.updateTime = DateTime.Now;
                    info.isvalid = true;
                    //更新
                    ConnectInfoManager.EditConnect(info);
                    obj["connectId"] = info.connectId;
                }
                else
                {
                    //新增模式
                    if (ConnectInfoManager.IsConnectRepeat(request.GetString("connectName", ""), SourceTypeEnum.SqlServer))
                    {
                        obj[YZJsonProperty.success] = false;
                        obj[YZJsonProperty.errorMessage] = "已存在同名的数据源";
                        return obj;
                    }
                    ConnectInfo info = new ConnectInfo();
                    info.connectName = request.GetString("connectName", "");
                    info.connectType = SourceTypeEnum.SqlServer;
                    info.caption = request.GetString("caption","");
                    info.connectStr = JObject.FromObject(login).ToString();
                    info.createTime = DateTime.Now;
                    info.updateTime = DateTime.Now;
                    info.isvalid = true;
                    //新增
                    ConnectInfoManager.AddConnect(info);
                    obj["connectId"] = ConnectInfoManager.GetConnectInfo(SourceTypeEnum.SqlServer, info.connectName).connectId;
                }
                obj[YZJsonProperty.success] = true;
                obj[YZJsonProperty.errorMessage] = "数据连接保存成功";
                return obj;
            }
            catch (Exception ex)
            {
                string msg = string.Format("保存失败:{0}", ex.ToString());
                obj[YZJsonProperty.success] = false;
                obj[YZJsonProperty.errorMessage] = msg;
                return obj;
            }
        }
        #endregion

        #region oracle连接操作
        /// <summary>
        /// 测试oracle数据库连接
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject JoinOracle(HttpContext context)
        {
            JObject obj = new JObject();
            YZRequest request = new YZRequest(context);
            OracleLogin login = new OracleLogin();
            login.systemName = request.GetString("systemName");
            login.host = request.GetString("host");
            login.port = request.GetString("port");
            login.user = request.GetString("user");
            login.pwd = request.GetString("pwd");
            string message = null;
            bool flag = CommonHandle.IsOracleJoin(login, out message);
            obj[YZJsonProperty.success] = true;
            obj[YZJsonProperty.errorMessage] = flag ? "连接成功！" : String.Format("连接失败！原因：<br/>{0}", message);
            return obj;
        }
        /// <summary>
        /// 保存oracle数据连接
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject SaveOracleConnect(HttpContext context)
        {
            JObject obj = new JObject();
            YZRequest request = new YZRequest(context);
            try
            {
                //获取操作模式
                string joinType = request.GetString("joinType");
                //获取连接数据
                OracleLogin login = new OracleLogin();
                login.systemName = request.GetString("systemName");
                login.host = request.GetString("host");
                login.port = request.GetString("port");
                login.user = request.GetString("user");
                login.pwd = request.GetString("pwd");
                string message = null;
                if (!CommonHandle.IsOracleJoin(login, out message))
                {
                    obj[YZJsonProperty.success] = false;
                    obj[YZJsonProperty.errorMessage] = "服务无法连接！";
                    return obj;
                }
                if (joinType.ToUpper().Equals("THEEDIT"))
                {
                    //编辑模式
                    ConnectInfo info = ConnectInfoManager.GetConnectInfo(request.GetInt32("connectId",-1));
                    info.caption = request.GetString("caption","");
                    info.connectStr = JObject.FromObject(login).ToString();
                    info.updateTime = DateTime.Now;
                    info.isvalid = true;
                    //更新
                    ConnectInfoManager.EditConnect(info);
                    obj["connectId"] = info.connectId;
                }
                else
                {
                    //新增模式
                    if (ConnectInfoManager.IsConnectRepeat(request.GetString("connectName", ""), SourceTypeEnum.Oracle))
                    {
                        obj[YZJsonProperty.success] = false;
                        obj[YZJsonProperty.errorMessage] = "已存在同名的数据源";
                        return obj;
                    }
                    ConnectInfo info = new ConnectInfo();
                    info.connectName = request.GetString("connectName", "");
                    info.connectType = SourceTypeEnum.Oracle;
                    info.caption = request.GetString("caption","");
                    info.connectStr = JObject.FromObject(login).ToString();
                    info.createTime = DateTime.Now;
                    info.updateTime = DateTime.Now;
                    info.isvalid = true;
                    //新增
                    ConnectInfoManager.AddConnect(info);
                    obj["connectId"] = ConnectInfoManager.GetConnectInfo(SourceTypeEnum.Oracle, info.connectName).connectId;
                }
                obj[YZJsonProperty.success] = true;
                obj[YZJsonProperty.errorMessage] = "数据连接保存成功";
                return obj;
            }
            catch (Exception ex)
            {
                string msg = string.Format("保存失败:{0}", ex.ToString());
                obj[YZJsonProperty.success] = false;
                obj[YZJsonProperty.errorMessage] = msg;
                return obj;
            }
        }
        #endregion

        #region excel连接操作
        /// <summary>
        /// 测试excel数据库连接
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject JoinExcel(HttpContext context)
        {
            JObject obj = new JObject();
            YZRequest request = new YZRequest(context);
            ExcelLogin login = new ExcelLogin();
            login.excelPath = request.GetString("excelPath");
            string message = null;
            bool flag = CommonHandle.IsExcelJoin(login, out message);
            obj[YZJsonProperty.success] = true;
            obj[YZJsonProperty.errorMessage] = flag ? "连接成功！" : String.Format("连接失败！原因：<br/>{0}", message);
            return obj;
        }
        /// <summary>
        /// 保存excel数据连接
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public JObject SaveExcelConnect(HttpContext context)
        {
            JObject obj = new JObject();
            YZRequest request = new YZRequest(context);
            try
            {
                //获取操作模式
                string joinType = request.GetString("joinType");
                //获取连接数据
                ExcelLogin login = new ExcelLogin();
                login.excelPath = request.GetString("excelPath");
                string message = null;
                if (!CommonHandle.IsExcelJoin(login, out message))
                {
                    obj[YZJsonProperty.success] = false;
                    obj[YZJsonProperty.errorMessage] = "服务无法连接！";
                    return obj;
                }
                if (joinType.ToUpper().Equals("THEEDIT"))
                {
                    //编辑模式
                    ConnectInfo info = ConnectInfoManager.GetConnectInfo(request.GetInt32("connectId",-1));
                    info.caption = request.GetString("caption","");
                    info.connectStr = JObject.FromObject(login).ToString();
                    info.updateTime = DateTime.Now;
                    info.isvalid = true;
                    //更新
                    ConnectInfoManager.EditConnect(info);
                    obj["connectId"] = info.connectId;
                }
                else
                {
                    //新增模式
                    if (ConnectInfoManager.IsConnectRepeat(request.GetString("connectName",""), SourceTypeEnum.Excel))
                    {
                        obj[YZJsonProperty.success] = false;
                        obj[YZJsonProperty.errorMessage] = "已存在同名的数据源";
                        return obj;
                    }
                    ConnectInfo info = new ConnectInfo();
                    info.connectName = request.GetString("connectName", "");
                    info.connectType = SourceTypeEnum.Excel;
                    info.caption = request.GetString("caption","");
                    info.connectStr = JObject.FromObject(login).ToString();
                    info.createTime = DateTime.Now;
                    info.updateTime = DateTime.Now;
                    info.isvalid = true;
                    //新增
                    ConnectInfoManager.AddConnect(info);
                    obj["connectId"] = ConnectInfoManager.GetConnectInfo(SourceTypeEnum.Excel, info.connectName).connectId;
                }
                obj[YZJsonProperty.success] = true;
                obj[YZJsonProperty.errorMessage] = "数据连接保存成功";
                return obj;
            }
            catch (Exception ex)
            {
                string msg = string.Format("保存失败:{0}", ex.ToString());
                obj[YZJsonProperty.success] = false;
                obj[YZJsonProperty.errorMessage] = msg;
                return obj;
            }
        }
        #endregion
    }
}