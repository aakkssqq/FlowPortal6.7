using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using YZSoft.ESB;
using YZSoft.Web.DAL;
using System.Data;
using YZSoft.ESB.Model;
using BPM;
using Newtonsoft.Json.Linq;

namespace YZSoft.ESB5
{
    /// <summary>
    ///SourceManager 的摘要说明
    /// </summary>
    public class SourceInfoManager
    {
        private static SourceInfoCollection ReaderToEntityList(YZReader reader)
        {
            SourceInfoCollection rv = new SourceInfoCollection();
            while (reader.Read())
            {
                SourceInfo source = new SourceInfo();
                source.sourceId = reader.ReadInt32("sourceId");
                source.sourceName = reader.ReadString("sourceName");
                source.sourceType = reader.ReadEnum<SourceTypeEnum>("sourceType", SourceTypeEnum.NoType);
                source.sourceStr = reader.ReadString("sourceStr");
                source.caption = reader.ReadString("caption");
                source.createTime = reader.ReadDateTime("createTime");
                source.updateTime = reader.ReadDateTime("updateTime");
                source.isvalid = reader.ReadBool("isvalid", false);
                ConnectInfo connect = new ConnectInfo();
                connect.connectId = reader.ReadInt32("connectId");
                connect.connectName = reader.ReadString("connectName");
                connect.connectType = reader.ReadEnum<SourceTypeEnum>("connectType", SourceTypeEnum.NoType);
                connect.caption = reader.ReadString("caption");
                connect.connectStr = reader.ReadString("connectStr");
                connect.createTime = reader.ReadDateTime("createTime");
                connect.updateTime = reader.ReadDateTime("updateTime");
                connect.isvalid = reader.ReadBool("isvalid", false);
                source.connectInfo = connect;
                rv.Add(source);
            }
            return rv;
        }
        private static SourceInfo ReaderToEntity(YZReader reader)
        {
            reader.Read();
            SourceInfo source = new SourceInfo();
            source.sourceId = reader.ReadInt32("sourceId");
            source.sourceName = reader.ReadString("sourceName");
            source.sourceType = reader.ReadEnum<SourceTypeEnum>("connectType", SourceTypeEnum.NoType);
            source.sourceStr = reader.ReadString("sourceStr");
            source.caption = reader.ReadString("caption");
            source.createTime = reader.ReadDateTime("createTime");
            source.updateTime = reader.ReadDateTime("updateTime");
            source.isvalid = reader.ReadBool("isvalid", false);
            ConnectInfo connect = new ConnectInfo();
            connect.connectId = reader.ReadInt32("connectId");
            connect.connectName = reader.ReadString("connectName");
            connect.connectType = reader.ReadEnum<SourceTypeEnum>("connectType", SourceTypeEnum.NoType);
            connect.caption = reader.ReadString("caption");
            connect.connectStr = reader.ReadString("connectStr");
            connect.createTime = reader.ReadDateTime("createTime");
            connect.updateTime = reader.ReadDateTime("updateTime");
            connect.isvalid = reader.ReadBool("isvalid", false);
            source.connectInfo = connect;
            return source;
        }
        /// <summary>
        /// 返回数据源列表
        /// </summary>
        /// <param name="provider"></param>
        /// <param name="cn"></param>
        /// <returns></returns>
        public static SourceInfoCollection GetSourceList()
        {
            try
            {
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {

                        using (YZReader reader = new YZReader(provider.GetESBSourceList(cn)))
                        {
                            return ReaderToEntityList(reader);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZV_ESB_SourceView", ex.Message);
            }
        }
        /// <summary>
        /// 返回筛选过的数据源列表
        /// </summary>
        /// <param name="provider"></param>
        /// <param name="cn"></param>
        /// <returns></returns>
        public static SourceInfoCollection GetSourceList(SourceTypeEnum sourceType)
        {
            try
            {
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {

                        using (YZReader reader = new YZReader(provider.GetESBSourceList(cn, sourceType)))
                        {
                            return ReaderToEntityList(reader);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZV_ESB_SourceView", ex.Message);
            }
        }
        /// <summary>
        /// 根据id获取数据源
        /// </summary>
        /// <param name="provider"></param>
        /// <param name="cn"></param>
        /// <param name="sourceId"></param>
        /// <returns></returns>
        public static SourceInfo GetSourceInfo(int sourceId)
        {
            try
            {
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {

                        using (YZReader reader = new YZReader(provider.GetESBSourceInfo(cn, sourceId)))
                        {
                            return ReaderToEntity(reader);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZV_ESB_SourceView", ex.Message);
            }

        }
        /// <summary>
        /// 根据名称获取数据源
        /// </summary>
        /// <param name="provider"></param>
        /// <param name="cn"></param>
        /// <param name="sourceId"></param>
        /// <returns></returns>
        public static SourceInfo GetSourceInfo(SourceTypeEnum sourceType, string sourceName)
        {
            try
            {
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {

                        using (YZReader reader = new YZReader(provider.GetESBSourceInfo(cn, sourceType, sourceName)))
                        {
                            return ReaderToEntity(reader);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZV_ESB_SourceView", ex.Message);
            }

        }
        /// <summary>
        /// 新增数据源
        /// </summary>
        /// <param name="provider"></param>
        /// <param name="cn"></param>
        /// <param name="entity"></param>
        /// <returns></returns>
        public static void AddSource(SourceInfo entity)
        {
            try
            {
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {

                        provider.ESBAddSource(cn, entity);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "ESB_SourceInfo", ex.Message);
            }
        }
        /// <summary>
        /// 更新数据源
        /// </summary>
        /// <param name="provider"></param>
        /// <param name="cn"></param>
        /// <param name="entity"></param>
        /// <returns></returns>
        public static void EditSource(SourceInfo entity)
        {
            try
            {
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {

                        provider.ESBEditSource(cn, entity);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "ESB_SourceInfo", ex.Message);
            }
        }
        /// <summary>
        /// 删除数据源
        /// </summary>
        /// <param name="provider"></param>
        /// <param name="cn"></param>
        /// <param name="sourceId"></param>
        /// <returns></returns>
        public static void DeleteSource(int sourceId)
        {
            try
            {
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {

                        provider.ESBDeleteSource(cn, sourceId);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "ESB_SourceInfo", ex.Message);
            }
        }
        /// <summary>
        /// 判断是否有重复名称的源（true:有；false:没有）
        /// </summary>
        /// <param name="provider"></param>
        /// <param name="cn"></param>
        /// <param name="sourceName"></param>
        /// <param name="sourceType"></param>
        /// <returns></returns>
        public static bool IsSourceRepeat(string sourceName, SourceTypeEnum sourceType)
        {
            try
            {
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {

                        return provider.ESBIsSourceRepeat(cn, sourceName, sourceType);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "ESB_SourceInfo", ex.Message);
            }

        }
        /// <summary>
        /// 判断是否有同名数据源
        /// </summary>
        /// <param name="provider"></param>
        /// <param name="cn"></param>
        /// <param name="sourceName"></param>
        /// <param name="sourceType"></param>
        /// <param name="sourceId"></param>
        /// <returns></returns>
        public static bool IsSourceNameRepeat(string sourceName, SourceTypeEnum sourceType, int sourceId)
        {
            try
            {
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {

                        return provider.ESBIsSourceNameRepeat(cn, sourceName, sourceType, sourceId);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "ESB_SourceInfo", ex.Message);
            }
        }
    }
}