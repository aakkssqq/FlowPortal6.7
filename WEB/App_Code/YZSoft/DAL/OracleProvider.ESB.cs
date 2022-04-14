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
using Oracle.ManagedDataAccess.Client;
using BPM;
using YZSoft.ESB.Model;

namespace YZSoft.Web.DAL
{
    partial class OracleProvider
    {
        public IDataReader GetESBSourceList(IDbConnection cn)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = @"SELECT * FROM YZV_ESB_SOURCEVIEW WHERE ISVALID=1 ORDER BY UPDATETIME DESC";
                return cmd.ExecuteReader();
            }
        }
        public IDataReader GetESBSourceList(IDbConnection cn, SourceTypeEnum sourceType)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = @"SELECT * FROM YZV_ESB_SOURCEVIEW WHERE ISVALID=1 AND SOURCETYPE=:SOURCETYPE ORDER BY UPDATETIME DESC";
                cmd.Parameters.Add(":SOURCETYPE", OracleDbType.NVarchar2).Value = sourceType.ToString();
                return cmd.ExecuteReader();
            }
        }
        public IDataReader GetESBSourceInfo(IDbConnection cn, int sourceId)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = @"SELECT * FROM YZV_ESB_SOURCEVIEW WHERE ISVALID=1 AND SOURCEID=:SOURCEID";
                cmd.Parameters.Add(":SOURCEID", OracleDbType.Int32).Value = sourceId;
                return cmd.ExecuteReader();
            }
        }
        public IDataReader GetESBSourceInfo(IDbConnection cn, SourceTypeEnum sourceType, string sourceName)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = @"SELECT * FROM YZV_ESB_SOURCEVIEW WHERE ISVALID=1 AND SOURCETYPE=:SOURCETYPE AND SOURCENAME=:SOURCENAME";
                cmd.Parameters.Add(":SOURCETYPE", OracleDbType.NVarchar2).Value = sourceType.ToString();
                cmd.Parameters.Add(":SOURCENAME", OracleDbType.NVarchar2).Value = sourceName;
                return cmd.ExecuteReader();
            }
        }
        public void ESBAddSource(IDbConnection cn, SourceInfo entity)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "SELECT BPMSEQ_ESB_SOURCEINFO.NEXTVAL FROM DUAL";
                entity.sourceId = System.Convert.ToInt32(cmd.ExecuteScalar());

                cmd.CommandText = @"INSERT INTO ESB_SOURCEINFO(SOURCEID,SOURCENAME,SOURCETYPE,CONNECTID,CAPTION,SOURCESTR,CREATETIME,UPDATETIME,ISVALID) VALUES (:SOURCEID,:SOURCENAME,:SOURCETYPE,:CONNECTID,:CAPTION,:SOURCESTR,:CREATETIME,:UPDATETIME,:ISVALID)";
                cmd.Parameters.Add(":SOURCEID", OracleDbType.Int32).Value = entity.sourceId;
                cmd.Parameters.Add(":SOURCENAME", OracleDbType.NVarchar2).Value = entity.sourceName;
                cmd.Parameters.Add(":SOURCETYPE", OracleDbType.NVarchar2).Value = entity.sourceType.ToString();
                cmd.Parameters.Add(":CONNECTID", OracleDbType.Int32).Value = entity.connectInfo.connectId;
                cmd.Parameters.Add(":CAPTION", OracleDbType.NVarchar2).Value = entity.caption;
                cmd.Parameters.Add(":SOURCESTR", OracleDbType.Clob).Value = entity.sourceStr;
                cmd.Parameters.Add(":CREATETIME", OracleDbType.Date).Value = entity.createTime;
                cmd.Parameters.Add(":UPDATETIME", OracleDbType.Date).Value = entity.updateTime;
                cmd.Parameters.Add(":ISVALID", OracleDbType.Int16).Value = this.ConvertBoolToInt16(entity.isvalid);
                cmd.ExecuteNonQuery();
            }
        }
        public void ESBEditSource(IDbConnection cn, SourceInfo entity)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = @"UPDATE ESB_SOURCEINFO SET SOURCENAME=:SOURCENAME,CONNECTID=:CONNECTID,CAPTION=:CAPTION,SOURCESTR=:SOURCESTR,UPDATETIME=:UPDATETIME WHERE SOURCEID=:SOURCEID";
                cmd.Parameters.Add(":SOURCEID", OracleDbType.Int32).Value = entity.sourceId;
                cmd.Parameters.Add(":SOURCENAME", OracleDbType.NVarchar2).Value = entity.sourceName;
                cmd.Parameters.Add(":CONNECTID", OracleDbType.Int32).Value = entity.connectInfo.connectId;
                cmd.Parameters.Add(":CAPTION", OracleDbType.NVarchar2).Value = entity.caption;
                cmd.Parameters.Add(":SOURCESTR", OracleDbType.NVarchar2).Value = entity.sourceStr;
                cmd.Parameters.Add(":UPDATETIME", OracleDbType.Date).Value = entity.updateTime;
                cmd.ExecuteNonQuery();
            }
        }
        public void ESBDeleteSource(IDbConnection cn, int sourceId)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = @"DELETE ESB_SOURCEINFO WHERE SOURCEID=:SOURCEID";
                cmd.Parameters.Add(":SOURCEID", OracleDbType.Int32).Value = sourceId;
                cmd.ExecuteNonQuery();
            }
        }
        public bool ESBIsSourceRepeat(IDbConnection cn, string sourceName, SourceTypeEnum sourceType)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = @"SELECT * FROM ESB_SOURCEINFO WHERE ISVALID=1 AND SOURCETYPE=:SOURCETYPE AND SOURCENAME=:SOURCENAME";
                cmd.Parameters.Add(":SOURCETYPE", OracleDbType.NVarchar2).Value = sourceType.ToString();
                cmd.Parameters.Add(":SOURCENAME", OracleDbType.NVarchar2).Value = sourceName;
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
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                if (sourceId == 0)
                {
                    cmd.CommandText = @"SELECT * FROM ESB_SOURCEINFO WHERE ISVALID=1 AND SOURCETYPE=:SOURCETYPE AND SOURCENAME=:SOURCENAME";
                    cmd.Parameters.Add(":SOURCETYPE", OracleDbType.NVarchar2).Value = sourceType.ToString();
                    cmd.Parameters.Add(":SOURCENAME", OracleDbType.NVarchar2).Value = sourceName;
                }
                else
                {
                    cmd.CommandText = @"SELECT * FROM ESB_SOURCEINFO WHERE ISVALID=1 AND SOURCETYPE=:SOURCETYPE AND SOURCENAME=:SOURCENAME AND SOURCEID<>:SOURCEID";
                    cmd.Parameters.Add(":SOURCEID", OracleDbType.Int32).Value = sourceId;
                    cmd.Parameters.Add(":SOURCETYPE", OracleDbType.NVarchar2).Value = sourceType.ToString();
                    cmd.Parameters.Add(":SOURCENAME", OracleDbType.NVarchar2).Value = sourceName;
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
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"SELECT * FROM ESB_CONNECTINFO WHERE ISVALID=1";
                return cmd.ExecuteReader();
            }
        }
        public IDataReader GetESBConnectList(IDbConnection cn, SourceTypeEnum connectType)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"SELECT * FROM ESB_CONNECTINFO WHERE ISVALID=1 AND CONNECTTYPE=:CONNECTTYPE";
                cmd.Parameters.Add(":CONNECTTYPE", OracleDbType.NVarchar2).Value = connectType.ToString();
                return cmd.ExecuteReader();
            }
        }
        public IDataReader GetESBConnectInfo(IDbConnection cn, int connectId)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"SELECT * FROM ESB_CONNECTINFO WHERE ISVALID=1 AND CONNECTID=:CONNECTID";
                cmd.Parameters.Add(":CONNECTID", OracleDbType.Int32).Value = connectId;
                return cmd.ExecuteReader();
            }
        }
        public IDataReader GetESBConnectInfo(IDbConnection cn, SourceTypeEnum connectType, string connectName)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"SELECT * FROM ESB_CONNECTINFO WHERE ISVALID=1 AND CONNECTTYPE=:CONNECTTYPE AND CONNECTNAME=:CONNECTNAME";
                cmd.Parameters.Add(":CONNECTTYPE", OracleDbType.NVarchar2).Value = connectType.ToString();
                cmd.Parameters.Add(":CONNECTNAME", OracleDbType.NVarchar2).Value = connectName;
                return cmd.ExecuteReader();
            }
        }
        public void ESBAddConnect(IDbConnection cn, ConnectInfo entity)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "SELECT BPMSEQ_ESB_CONNECTINFO.NEXTVAL FROM DUAL";
                entity.connectId = System.Convert.ToInt32(cmd.ExecuteScalar());

                cmd.CommandText = @"INSERT INTO ESB_CONNECTINFO(CONNECTID,CONNECTNAME,CONNECTTYPE,CAPTION,CONNECTSTR,CREATETIME,UPDATETIME,ISVALID) VALUES (:CONNECTID,:CONNECTNAME,:CONNECTTYPE,:CAPTION,:CONNECTSTR,:CREATETIME,:UPDATETIME,:ISVALID)";
                cmd.Parameters.Add(":CONNECTID", OracleDbType.Int32).Value = (int)entity.connectId;
                cmd.Parameters.Add(":CONNECTNAME", OracleDbType.NVarchar2).Value = entity.connectName;
                cmd.Parameters.Add(":CONNECTTYPE", OracleDbType.NVarchar2).Value = entity.connectType.ToString();
                cmd.Parameters.Add(":CAPTION", OracleDbType.NVarchar2).Value = entity.caption;
                cmd.Parameters.Add(":CONNECTSTR", OracleDbType.NVarchar2).Value = entity.connectStr;
                cmd.Parameters.Add(":CREATETIME", OracleDbType.Date).Value = entity.createTime;
                cmd.Parameters.Add(":UPDATETIME", OracleDbType.Date).Value = entity.updateTime;
                cmd.Parameters.Add(":ISVALID", OracleDbType.Int16).Value = this.ConvertBoolToInt16(entity.isvalid);
                cmd.ExecuteNonQuery();
            }
        }
        public void ESBEditConnect(IDbConnection cn, ConnectInfo entity)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"UPDATE ESB_CONNECTINFO SET CAPTION=:CAPTION,CONNECTSTR=:CONNECTSTR,UPDATETIME=:UPDATETIME WHERE CONNECTID=:CONNECTID";
                cmd.Parameters.Add(":CAPTION", OracleDbType.NVarchar2).Value = entity.caption;
                cmd.Parameters.Add(":CONNECTSTR", OracleDbType.NVarchar2).Value = entity.connectStr;
                cmd.Parameters.Add(":UPDATETIME", OracleDbType.Date).Value = entity.updateTime;
                cmd.Parameters.Add(":CONNECTID", OracleDbType.Int32).Value = entity.connectId;
                cmd.ExecuteNonQuery();
            }
        }
        public void ESBDeleteConnect(IDbConnection cn, int connectId)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"DELETE ESB_CONNECTINFO WHERE CONNECTID=:CONNECTID";
                cmd.Parameters.Add(":CONNECTID", OracleDbType.Int32).Value = connectId;
                cmd.ExecuteNonQuery();
            }
        }
        public bool ESBIsConnectRepeat(IDbConnection cn, string connectName, SourceTypeEnum connectType)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"SELECT * FROM ESB_CONNECTINFO WHERE ISVALID=1 AND CONNECTTYPE=:CONNECTTYPE AND CONNECTNAME=:CONNECTNAME";
                cmd.Parameters.Add(":CONNECTTYPE", OracleDbType.NVarchar2).Value = connectType.ToString();
                cmd.Parameters.Add(":CONNECTNAME", OracleDbType.NVarchar2).Value = connectName;
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
