using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using YZSoft.Web.DAL;
using System.Data;
using YZSoft.ESB.Model;
using BPM;
using Newtonsoft.Json.Linq;

namespace YZSoft.ESB5
{
    /// <summary>
    ///ConnectInfoManager 的摘要说明
    /// </summary>
    public class ConnectInfoManager
    {
        private static ConnectInfoCollection ReaderToEntityList(YZReader reader)
        {
            ConnectInfoCollection rv = new ConnectInfoCollection();
            while (reader.Read())
            {
                ConnectInfo connect = new ConnectInfo();
                connect.connectId = reader.ReadInt32("connectId");
                connect.connectName = reader.ReadString("connectName");
                connect.connectType = reader.ReadEnum<SourceTypeEnum>("connectType", SourceTypeEnum.NoType);
                connect.caption = reader.ReadString("caption");
                connect.connectStr = reader.ReadString("connectStr");
                connect.createTime = reader.ReadDateTime("createTime");
                connect.updateTime = reader.ReadDateTime("updateTime");
                connect.isvalid = reader.ReadBool("isvalid", false);
                rv.Add(connect);
            }
            return rv;
        }
        private static ConnectInfo ReaderToEntity(YZReader reader)
        {
            reader.Read();
            ConnectInfo connect = new ConnectInfo();
            connect.connectId = reader.ReadInt32("connectId");
            connect.connectName = reader.ReadString("connectName");
            connect.connectType = reader.ReadEnum<SourceTypeEnum>("connectType", SourceTypeEnum.NoType);
            connect.caption = reader.ReadString("caption");
            connect.connectStr = reader.ReadString("connectStr");
            connect.createTime = reader.ReadDateTime("createTime");
            connect.updateTime = reader.ReadDateTime("updateTime");
            connect.isvalid = reader.ReadBool("isvalid", false);
            return connect;
        }
        /// <summary>
        /// 返回一个数据连接
        /// </summary>
        /// <param name="provider"></param>
        /// <param name="cn"></param>
        /// <returns></returns>
        public static ConnectInfoCollection GetConnectList()
        {
            try
            {
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {
                        using (YZReader reader = new YZReader(provider.GetESBConnectList(cn)))
                        {
                            return ReaderToEntityList(reader);
                        }
                    }
                }
               
            }
            catch (Exception ex)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "ESB_ConnectInfo", ex.Message);
            }
        }
        /// <summary>
        /// 返回一个数据连接
        /// </summary>
        /// <param name="provider"></param>
        /// <param name="cn"></param>
        /// <returns></returns>
        public static ConnectInfoCollection GetConnectList(SourceTypeEnum connectType)
        {
            try
            {
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {

                        using (YZReader reader = new YZReader(provider.GetESBConnectList(cn, connectType)))
                        {
                            return ReaderToEntityList(reader);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "ESB_ConnectInfo", ex.Message);
            }
        }
        /// <summary>
        /// 根据id获取数据源
        /// </summary>
        /// <param name="provider"></param>
        /// <param name="cn"></param>
        /// <param name="sourceId"></param>
        /// <returns></returns>
        public static ConnectInfo GetConnectInfo(int connectId)
        {
            try
            {
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {

                        using (YZReader reader = new YZReader(provider.GetESBConnectInfo(cn, connectId)))
                        {
                            return ReaderToEntity(reader);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "ESB_ConnectInfo", ex.Message);
            }

        }
        /// <summary>
        /// 根据名称获取数据源
        /// </summary>
        /// <param name="provider"></param>
        /// <param name="cn"></param>
        /// <param name="sourceId"></param>
        /// <returns></returns>
        public static ConnectInfo GetConnectInfo(SourceTypeEnum connectType, string connectName)
        {
            try
            {
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {

                        using (YZReader reader = new YZReader(provider.GetESBConnectInfo(cn, connectType, connectName)))
                        {
                            return ReaderToEntity(reader);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "ESB_ConnectInfo", ex.Message);
            }

        }

        /// <summary>
        /// 新增连接信息
        /// </summary>
        /// <param name="cn"></param>
        /// <param name="entity"></param>
        /// <returns></returns>
        public static void AddConnect(ConnectInfo entity)
        {
            try
            {
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {

                        provider.ESBAddConnect(cn, entity);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "ESB_ConnectInfo", ex.Message);
            }
        }
        /// <summary>
        /// 更新连接信息
        /// </summary>
        /// <param name="cn"></param>
        /// <param name="entity"></param>
        /// <returns></returns>
        public static void EditConnect(ConnectInfo entity)
        {
            try
            {
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {

                        provider.ESBEditConnect(cn, entity);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "ESB_ConnectInfo", ex.Message);
            }
        }
        /// <summary>
        /// 删除连接信息
        /// </summary>
        /// <param name="cn"></param>
        /// <param name="connectId"></param>
        /// <returns></returns>
        public static void DeleteConnect(int connectId)
        {
            try
            {
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {

                        provider.ESBDeleteConnect(cn, connectId);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "ESB_ConnectInfo", ex.Message);
            }
        }
        /// <summary>
        /// 查询同类型中是否存在相同的名称
        /// </summary>
        /// <param name="connectName">名称</param>
        /// <param name="connectType">类型DelConnect</param>
        /// <returns></returns>
        public static bool IsConnectRepeat(string connectName, SourceTypeEnum connectType)
        {
            try
            {
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {

                        return provider.ESBIsConnectRepeat(cn, connectName, connectType);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "ESB_ConnectInfo", ex.Message);
            }
        }
        /// <summary>
        /// 返回sql数据库列表
        /// </summary>
        /// <param name="provider"></param>
        /// <param name="cn"></param>
        /// <param name="dataSource"></param>
        /// <param name="user"></param>
        /// <param name="pwd"></param>
        /// <returns></returns>
        public static JArray GetSqlServerDBList(string dataSource, string user, string pwd)
        {
            try
            {
                string conStr = string.Format("Data Source={0};Initial Catalog={1};User ID={2};Password={3}", dataSource, "master", user, pwd);
                using (System.Data.SqlClient.SqlConnection con = new System.Data.SqlClient.SqlConnection(conStr))
                {
                    con.Open();
                    using (System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand())
                    {
                        cmd.Connection = con;
                        cmd.CommandText = @"select name from master..sysdatabases";
                        using (YZReader reader = new YZReader(cmd.ExecuteReader()))
                        {
                            JArray array = new JArray();
                            while (reader.Read())
                            {
                                JObject obj = new JObject();
                                obj["text"] = reader.ReadString("name");
                                obj["value"] = reader.ReadString("name");
                                array.Add(obj);
                            }
                            return array;
                        }

                    }
                }
                
            }
            catch (Exception ex)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "sysdatabases", ex.Message);
            }
        }
    }
}