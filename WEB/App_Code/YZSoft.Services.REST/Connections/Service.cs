using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Runtime.Serialization.Json;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System.IO;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.JSchema.Generation;

namespace YZSoft.Services.REST.Connections
{
    public class ServiceHandler : YZServiceHandler
    {
        public virtual object[] GetConnectionsOfType(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string type = request.GetString("type", null);

            ConnectionInfoCollection connections;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                connections = cn.GetAllConnections();
            }

            List<object> rv = new List<object>();
            foreach (ConnectionInfo connectionInfo in connections)
            {
                if (!NameCompare.EquName(connectionInfo.Type, type) && !String.IsNullOrEmpty(type))
                    continue;

                rv.Add(new
                {
                    name = connectionInfo.Name
                });
            }

            return rv.ToArray();
        }

        public virtual JObject GetRestfulConnectionExtAttrsSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");

            ExtAttributesSchemaGenerator generator = new ExtAttributesSchemaGenerator();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                ConnectionInfo cnInfo = cn.GetGlobalObjectDefine<ConnectionInfo>(StoreZoneType.Connections, connectionName);
                JArray jExtAttrs = cnInfo.Cn["extAttrs"] as JArray;

                string authType = Convert.ToString(cnInfo.Cn["authType"]);
                if (authType == "token")
                {
                    jExtAttrs.Add(JObject.FromObject(new
                    {
                        name = "token",
                        type = "String"
                    }));
                }

                return generator.Generate(jExtAttrs);
            }
        }

        public virtual JObject GetWebServiceConnectionExtAttrsSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");

            ExtAttributesSchemaGenerator generator = new ExtAttributesSchemaGenerator();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                ConnectionInfo cnInfo = cn.GetGlobalObjectDefine<ConnectionInfo>(StoreZoneType.Connections, connectionName);
                JArray jExtAttrs = cnInfo.Cn["extAttrs"] as JArray;
                return generator.Generate(jExtAttrs);
            }
        }
    }
}