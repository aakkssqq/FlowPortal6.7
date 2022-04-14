using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.IO;
using System.Drawing;
using System.Threading;
using System.Collections.Generic;
using System.Text;
using System.Data.Common;
using System.Data.SqlClient;
using BPM;
using YZSoft.ESB.Model;

namespace YZSoft.Web.DAL
{
    partial class SqlServerProvider
    {
        public IDataReader GetESBSourceList(IDbConnection cn)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"select * from YZV_ESB_SourceView where isvalid=1 order by updateTime desc";
                return cmd.ExecuteReader();
            }
        }
        public IDataReader GetESBSourceList(IDbConnection cn, SourceTypeEnum sourceType)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"select * from YZV_ESB_SourceView where isvalid=1 and sourceType=@sourceType order by updateTime desc";
                cmd.Parameters.Add("@sourceType", SqlDbType.NVarChar).Value = sourceType.ToString();
                return cmd.ExecuteReader();
            }
        }
        public IDataReader GetESBSourceInfo(IDbConnection cn, int sourceId)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"select * from YZV_ESB_SourceView where isvalid=1 and sourceId=@sourceId";
                cmd.Parameters.Add("@sourceId", SqlDbType.Int).Value = sourceId;
                return cmd.ExecuteReader();
            }
        }
        public IDataReader GetESBSourceInfo(IDbConnection cn, SourceTypeEnum sourceType, string sourceName)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"select * from YZV_ESB_SourceView where isvalid=1 and sourceType=@sourceType and sourceName=@sourceName";
                cmd.Parameters.Add("@sourceType", SqlDbType.NVarChar).Value = sourceType.ToString();
                cmd.Parameters.Add("@sourceName", SqlDbType.NVarChar).Value = sourceName;
                return cmd.ExecuteReader();
            }
        }
        public void ESBAddSource(IDbConnection cn, SourceInfo entity)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SET NOCOUNT ON;INSERT INTO ESB_SourceInfo(sourceName,sourceType,connectId,caption,sourceStr,createTime,updateTime,isvalid) VALUES (@sourceName,@sourceType,@connectId,@caption,@sourceStr,@createTime,@updateTime,@isvalid);SELECT SCOPE_IDENTITY();";
                cmd.Parameters.Add("@sourceName", SqlDbType.NVarChar).Value = entity.sourceName;
                cmd.Parameters.Add("@sourceType", SqlDbType.NVarChar).Value = entity.sourceType.ToString();
                cmd.Parameters.Add("@connectId", SqlDbType.Int).Value = entity.connectInfo.connectId;
                cmd.Parameters.Add("@caption", SqlDbType.NVarChar).Value = entity.caption;
                cmd.Parameters.Add("@sourceStr", SqlDbType.NVarChar).Value = entity.sourceStr;
                cmd.Parameters.Add("@createTime", SqlDbType.DateTime).Value = entity.createTime;
                cmd.Parameters.Add("@updateTime", SqlDbType.DateTime).Value = entity.updateTime;
                cmd.Parameters.Add("@isvalid", SqlDbType.Bit).Value = entity.isvalid;

                entity.sourceId = Decimal.ToInt32((Decimal)cmd.ExecuteScalar());
            }
        }
        public void ESBEditSource(IDbConnection cn, SourceInfo entity)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"UPDATE ESB_SourceInfo SET sourceName=@sourceName,connectId=@connectId,caption=@caption,sourceStr=@sourceStr,updateTime=@updateTime WHERE sourceId=@sourceId";
                cmd.Parameters.Add("@sourceId", SqlDbType.Int).Value = entity.sourceId;
                cmd.Parameters.Add("@sourceName", SqlDbType.NVarChar).Value = entity.sourceName;
                cmd.Parameters.Add("@connectId", SqlDbType.Int).Value = entity.connectInfo.connectId;
                cmd.Parameters.Add("@caption", SqlDbType.NVarChar).Value = entity.caption;
                cmd.Parameters.Add("@sourceStr", SqlDbType.NVarChar).Value = entity.sourceStr;
                cmd.Parameters.Add("@updateTime", SqlDbType.DateTime).Value = entity.updateTime;
                cmd.ExecuteNonQuery();
            }
        }
        public void ESBDeleteSource(IDbConnection cn, int sourceId)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"DELETE ESB_SourceInfo WHERE sourceId=@sourceId";
                cmd.Parameters.Add("@sourceId", SqlDbType.Int).Value = sourceId;
                cmd.ExecuteNonQuery();
            }
        }
        public bool ESBIsSourceRepeat(IDbConnection cn, string sourceName, SourceTypeEnum sourceType)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SELECT * FROM ESB_SourceInfo WHERE isvalid=1 and sourceType=@sourceType and sourceName=@sourceName";
                cmd.Parameters.Add("@sourceType", SqlDbType.NVarChar).Value = sourceType.ToString();
                cmd.Parameters.Add("@sourceName", SqlDbType.NVarChar).Value = sourceName;
                bool flag = true;
                object obj = cmd.ExecuteScalar();
                if (obj == null)
                {
                    flag = false;
                }
                return flag;
            }
        }
        public bool ESBIsSourceNameRepeat(IDbConnection cn, string sourceName, SourceTypeEnum sourceType, int sourceId)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                if (sourceId == 0)
                {
                    cmd.CommandText = @"SELECT * FROM ESB_SourceInfo WHERE isvalid=1 and sourceType=@sourceType and sourceName=@sourceName";
                    cmd.Parameters.Add("@sourceType", SqlDbType.NVarChar).Value = sourceType.ToString();
                    cmd.Parameters.Add("@sourceName", SqlDbType.NVarChar).Value = sourceName;
                }
                else
                {
                    cmd.CommandText = @"SELECT * FROM ESB_SourceInfo WHERE isvalid=1 and sourceType=@sourceType and sourceName=@sourceName and sourceId<>@sourceId";
                    cmd.Parameters.Add("@sourceId", SqlDbType.Int).Value = sourceId;
                    cmd.Parameters.Add("@sourceType", SqlDbType.NVarChar).Value = sourceType.ToString();
                    cmd.Parameters.Add("@sourceName", SqlDbType.NVarChar).Value = sourceName;
                }
                bool flag = true;
                object obj = cmd.ExecuteScalar();
                if (obj == null)
                {
                    flag = false;
                }
                return flag;
            }
        }

        public IDataReader GetESBConnectList(IDbConnection cn)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SELECT * FROM ESB_ConnectInfo where isvalid=1";
                return cmd.ExecuteReader();
            }
        }
        public IDataReader GetESBConnectList(IDbConnection cn, SourceTypeEnum connectType)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SELECT * FROM ESB_ConnectInfo where isvalid=1 and connectType=@connectType";
                cmd.Parameters.Add("@connectType", SqlDbType.NVarChar).Value = connectType.ToString();
                return cmd.ExecuteReader();
            }
        }
        public IDataReader GetESBConnectInfo(IDbConnection cn, int connectId)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"select * FROM ESB_ConnectInfo where isvalid=1 and connectId=@connectId";
                cmd.Parameters.Add("@connectId", SqlDbType.Int).Value = connectId;
                return cmd.ExecuteReader();
            }
        }
        public IDataReader GetESBConnectInfo(IDbConnection cn, SourceTypeEnum connectType, string connectName)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"select * FROM ESB_ConnectInfo where isvalid=1 and connectType=@connectType and connectName=@connectName";
                cmd.Parameters.Add("@connectType", SqlDbType.NVarChar).Value = connectType.ToString();
                cmd.Parameters.Add("@connectName", SqlDbType.NVarChar).Value = connectName;
                return cmd.ExecuteReader();
            }
        }
        public void ESBAddConnect(IDbConnection cn, ConnectInfo entity)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SET NOCOUNT ON;INSERT INTO ESB_ConnectInfo(connectName,connectType,caption,connectStr,createTime,updateTime,isvalid) VALUES (@connectName,@connectType,@caption,@connectStr,@createTime,@updateTime,@isvalid);SELECT SCOPE_IDENTITY();";
                cmd.Parameters.Add("@connectName", SqlDbType.NVarChar).Value = entity.connectName;
                cmd.Parameters.Add("@connectType", SqlDbType.NVarChar).Value = entity.connectType.ToString();
                cmd.Parameters.Add("@caption", SqlDbType.NVarChar).Value = entity.caption;
                cmd.Parameters.Add("@connectStr", SqlDbType.NVarChar).Value = entity.connectStr;
                cmd.Parameters.Add("@createTime", SqlDbType.DateTime).Value = entity.createTime;
                cmd.Parameters.Add("@updateTime", SqlDbType.DateTime).Value = entity.updateTime;
                cmd.Parameters.Add("@isvalid", SqlDbType.Bit).Value = entity.isvalid;

                entity.connectId = Decimal.ToInt32((Decimal)cmd.ExecuteScalar());
            }
        }
        public void ESBEditConnect(IDbConnection cn, ConnectInfo entity)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"UPDATE ESB_ConnectInfo SET caption=@caption,connectStr=@connectStr,updateTime=@updateTime WHERE connectId=@connectId";
                cmd.Parameters.Add("@caption", SqlDbType.NVarChar).Value = entity.caption;
                cmd.Parameters.Add("@connectStr", SqlDbType.NVarChar).Value = entity.connectStr;
                cmd.Parameters.Add("@updateTime", SqlDbType.DateTime).Value = entity.updateTime;
                cmd.Parameters.Add("@connectId", SqlDbType.Int).Value = entity.connectId;
                cmd.ExecuteNonQuery();
            }
        }
        public void ESBDeleteConnect(IDbConnection cn, int connectId)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"DELETE ESB_ConnectInfo WHERE connectId=@connectId";
                cmd.Parameters.Add("@connectId", SqlDbType.Int).Value = connectId;
                cmd.ExecuteNonQuery();
            }
        }
        public bool ESBIsConnectRepeat(IDbConnection cn, string connectName, SourceTypeEnum connectType)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SELECT * FROM ESB_ConnectInfo WHERE isvalid=1 and connectType=@connectType and connectName=@connectName";
                cmd.Parameters.Add("@connectType", SqlDbType.NVarChar).Value = connectType.ToString();
                cmd.Parameters.Add("@connectName", SqlDbType.NVarChar).Value = connectName;
                bool flag = true;
                object obj = cmd.ExecuteScalar();
                if (obj == null)
                {
                    flag = false;
                }
                return flag;
            }
        }
    }
}
