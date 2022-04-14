using BPM.Client;
using System;
using System.CodeDom;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Web;
using System.Web.Services.Description;
using System.Web.Services.Protocols;
using System.Xml.Serialization;
using Newtonsoft.Json.Schema.Generation;
using Newtonsoft.Json.Schema;
using Newtonsoft.Json.Linq;
using SAP.Middleware.Connector;
using System.Data;

namespace YZSoft.Services.REST.DesignTime
{
    public class SAPHandler : YZServiceHandler
    {
        public List<object> GetBAPIs(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");
            string filter = request.GetString("filter",null);
            int limit = request.GetInt32("limit", 100);

            filter = String.IsNullOrEmpty(filter) ? "*" : String.Format("*{0}*", filter);

            List<object> rv = new List<object>();
            try
            {
                using (SAPConnection cn = new SAPConnection(connectionName))
                {
                    cn.Open();

                    //清除缓存，不然BAPI改了得到的还是旧的结构
                    //cn.Prd.Repository.ClearAllMetadata(); 这里暂时不加
                    IRfcFunction rfc = cn.Prd.Repository.CreateFunction("RFC_FUNCTION_SEARCH_WITHGROUP");
                    rfc.SetValue("FUNCNAME", filter);
                    rfc.SetValue("GROUPNAME", "");
                    rfc.SetValue("LANGUAGE", "");
                    rfc.Invoke(cn.Prd);

                    IRfcTable rfcTable = rfc.GetTable("FUNCTIONS");

                    foreach (IRfcStructure row in rfcTable)
                    {
                        if (rv.Count >= limit)
                            break;

                        rv.Add(new
                        {
                            name = row.GetString("FUNCNAME")
                        });
                    }
                }
            }
            catch(RfcAbapClassicException e)
            {
                if (e.AbapMessageNumber != "000") //NO_FUNCTION_FOUND
                    throw e;
            }

            return rv;
        }

        public object GetInputSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");
            string bapiName = request.GetString("bapiName");

            JObject rv = new JObject();
            using (SAPConnection cn = new SAPConnection(connectionName))
            {
                cn.Open();
                
                //清除缓存，不然BAPI改了得到的还是旧的结构
                cn.Prd.Repository.ClearAllMetadata();
                IRfcFunction rfc = cn.Prd.Repository.CreateFunction(bapiName);

                for (int i = 0; i < rfc.Metadata.ParameterCount; i++)
                {
                    RfcParameterMetadata param = rfc.GetElementMetadata(i) as RfcParameterMetadata;
                    if (param.Direction == RfcDirection.IMPORT ||
                        param.Direction == RfcDirection.CHANGING ||
                        param.Direction == RfcDirection.TABLES)
                        rv[param.Name] = JToken.FromObject(this.ToJSchema(param));
                }
            }

            return rv;
        }

        public object GetOutputSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");
            string bapiName = request.GetString("bapiName");

            JObject rv = new JObject();
            using (SAPConnection cn = new SAPConnection(connectionName))
            {
                cn.Open();

                //清除缓存，不然BAPI改了得到的还是旧的结构
                cn.Prd.Repository.ClearAllMetadata();
                IRfcFunction rfc = cn.Prd.Repository.CreateFunction(bapiName);

                for (int i = 0; i < rfc.Metadata.ParameterCount; i++)
                {
                    RfcParameterMetadata param = rfc.GetElementMetadata(i) as RfcParameterMetadata;
                    if (param.Direction == RfcDirection.EXPORT ||
                        param.Direction == RfcDirection.CHANGING ||
                        param.Direction == RfcDirection.TABLES)
                        rv[param.Name] = JToken.FromObject(this.ToJSchema(param));
                }
            }

            return rv;
        }

        private object ElementMetadata2MD(RfcElementMetadata rfcEmd)
        {
            if (rfcEmd.DataType == RfcDataType.STRUCTURE)
                return rfcEmd.ValueMetadataAsStructureMetadata;
            if (rfcEmd.DataType == RfcDataType.TABLE)
                return rfcEmd.ValueMetadataAsTableMetadata;
            else
                return rfcEmd;
        }

        private object ToJSchema(RfcElementMetadata rfcEmd)
        {
            var yzext = new
            {
                nativeType = new
                {
                    name = rfcEmd.DataType.ToString()
                }
            };

            //https://blog.csdn.net/zanfeng/article/details/78194231
            switch (rfcEmd.DataType)
            {
                case RfcDataType.INT1:
                    return new
                    {
                        type = "integer",
                        yzext = yzext,
                        title = rfcEmd.Documentation
                    };
                case RfcDataType.INT2:
                    return new
                    {
                        type = "integer",
                        yzext = yzext,
                        title = rfcEmd.Documentation
                    };
                case RfcDataType.INT4:
                    return new
                    {
                        type = "integer",
                        yzext = yzext,
                        title = rfcEmd.Documentation
                    };
                case RfcDataType.INT8:
                    return new
                    {
                        type = "integer",
                        yzext = yzext,
                        title = rfcEmd.Documentation
                    };
                case RfcDataType.FLOAT:
                    return new
                    {
                        type = "number",
                        yzext = yzext,
                        title = rfcEmd.Documentation
                    };
                case RfcDataType.DATE:
                    return new
                    {
                        type = "string",
                        format = "date",
                        yzext = yzext,
                        title = rfcEmd.Documentation
                    };
                case RfcDataType.TIME:
                    return new
                    {
                        type = "string",
                        format = "date-time",
                        yzext = yzext,
                        title = rfcEmd.Documentation
                    };
                case RfcDataType.BCD:
                case RfcDataType.NUM:
                case RfcDataType.DECF16:
                case RfcDataType.DECF34:  //数值型字符串
                    return new
                    {
                        type = "number",
                        yzext = yzext,
                        title = rfcEmd.Documentation
                    };
                case RfcDataType.CDAY:
                case RfcDataType.DTDAY:
                case RfcDataType.DTMONTH:
                case RfcDataType.DTWEEK:
                case RfcDataType.TMINUTE:
                case RfcDataType.TSECOND:
                case RfcDataType.UTCLONG:
                case RfcDataType.UTCMINUTE:
                case RfcDataType.UTCSECOND:
                    return new
                    {
                        type = "string",
                        yzext = yzext,
                        title = rfcEmd.Documentation
                    };
                case RfcDataType.CHAR:
                    return new
                    {
                        type = "string",
                        yzext = yzext,
                        title = rfcEmd.Documentation
                    };
                case RfcDataType.BYTE:
                case RfcDataType.STRING:
                case RfcDataType.XSTRING:
                    return new
                    {
                        type = "string",
                        yzext = yzext,
                        title = rfcEmd.Documentation
                    };
                case RfcDataType.STRUCTURE:
                    {
                        RfcStructureMetadata rfcSmd = rfcEmd.ValueMetadataAsStructureMetadata;
                        Dictionary<string, object> properties = new Dictionary<string, object>();

                        for (int i = 0; i < rfcSmd.FieldCount; i++)
                        {
                            RfcFieldMetadata rfcFmd = rfcSmd[i];
                            properties[rfcFmd.Name] = this.ToJSchema(rfcFmd);
                        }

                        return new
                        {
                            type = "object",
                            yzext = yzext,
                            title = rfcEmd.Documentation,
                            properties = properties
                        };
                    }
                case RfcDataType.TABLE:
                    {
                        RfcTableMetadata rfcTmd = rfcEmd.ValueMetadataAsTableMetadata;
                        Dictionary<string, object> properties = new Dictionary<string, object>();

                        for (int i = 0; i < rfcTmd.LineType.FieldCount; i++)
                        {
                            RfcFieldMetadata rfcFmd = rfcTmd[i];
                            properties[rfcFmd.Name] = this.ToJSchema(rfcFmd);
                        }

                        return new
                        {
                            type = "array",
                            yzext = yzext,
                            title = rfcEmd.Documentation,
                            items = new
                            {
                                type = "object",
                                properties = properties
                            }
                        };
                    }
                //case RfcDataType.CLASS:
                //case RfcDataType.UNKNOWN:
                default:
                    return new
                    {
                        type = "string",
                        yzext = yzext,
                        title = rfcEmd.Documentation
                    };
            }
        }

        private DataTable ToDataTable (IRfcTable rfcTable)
        {
            DataTable dtRet = new DataTable();

            for (int liElement = 0; liElement < rfcTable.ElementCount; liElement++)
            {
                RfcElementMetadata rfcEMD = rfcTable.GetElementMetadata(liElement);
                dtRet.Columns.Add(rfcEMD.Name);
            }

            foreach (IRfcStructure row in rfcTable)
            {
                DataRow dr = dtRet.NewRow();

                for (int liElement = 0; liElement < rfcTable.ElementCount; liElement++)
                {
                    RfcElementMetadata rfcEMD = rfcTable.GetElementMetadata(liElement);

                    dr[rfcEMD.Name] = row.GetString(rfcEMD.Name);
                    // Console.WriteLine("{0} is {1}", rfcEMD.Documentation, dr[rfcEMD.Name]);
                }

                dtRet.Rows.Add(dr);

            }

            return dtRet;
        }
    }

    [DataContract]
    internal class SAPConnectionInfo
    {
        [DataMember]
        public string AppServerHost;
        [DataMember]
        public string SystemNumber;
        [DataMember]
        public string Name;
        [DataMember]
        public string Client;
        [DataMember]
        public string User;
        [DataMember]
        public string Password;
        [DataMember]
        public string Language;
        [DataMember]
        public string SAPRouter;
        [DataMember]
        public int PoolSize;
        [DataMember]
        public int PeakConnectionsLimit;
        [DataMember]
        public int ConnectionIdleTimeout;

        public void AssertValid(string connectionName)
        {
        }
    }

    internal class SAPConnection : IDisposable
    {
        public string connectionName;
        public RfcDestination Prd;
        private SAPConnectionInfo _cnInfo;

        public SAPConnection(string connectionName)
        {
            this.connectionName = connectionName;
        }

        public SAPConnectionInfo CnInfo
        {
            get
            {
                if (this._cnInfo == null)
                {
                    using (BPMConnection cn = new BPMConnection())
                    {
                        cn.WebOpen();

                        ConnectionInfo cnInfo = ConnectionInfo.OpenByName(cn, connectionName);
                        this._cnInfo = cnInfo.Cn.ToObject<SAPConnectionInfo>();
                        this._cnInfo.AssertValid(connectionName);
                    }
                }

                return this._cnInfo;
            }
        }

        public void Open()
        {
            SAPConnectionInfo cnInfo = this.CnInfo;

            RfcConfigParameters parms = new RfcConfigParameters();
            parms.Add(RfcConfigParameters.AppServerHost, cnInfo.AppServerHost);
            parms.Add(RfcConfigParameters.SystemNumber, cnInfo.SystemNumber);
            parms.Add(RfcConfigParameters.Name, cnInfo.Name);
            parms.Add(RfcConfigParameters.Client, cnInfo.Client);
            parms.Add(RfcConfigParameters.User, cnInfo.User);
            parms.Add(RfcConfigParameters.Password, cnInfo.Password);
            parms.Add(RfcConfigParameters.Language, cnInfo.Language);
            parms.Add(RfcConfigParameters.SAPRouter, cnInfo.SAPRouter);
            parms.Add(RfcConfigParameters.PoolSize, "1");
            parms.Add(RfcConfigParameters.PeakConnectionsLimit, "10");
            parms.Add(RfcConfigParameters.ConnectionIdleTimeout, "60");

            this.Prd = RfcDestinationManager.GetDestination(parms);
        }

        public void Dispose()
        {
        }
    }
}