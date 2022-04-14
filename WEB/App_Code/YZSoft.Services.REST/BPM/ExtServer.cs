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

namespace YZSoft.Services.REST.BPM
{
    public class ExtServerHandler : YZServiceHandler
    {
        public virtual object[] GetServersInFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path", null);
            string rsid = String.IsNullOrEmpty(path) ? WellKnownRSID.ExtServerRoot : StoreZoneType.ExtServer.ToString() + "://" + path;
            BPMPermision perm = request.GetEnum<BPMPermision>("perm");

            ExtServerCollection extServers = new ExtServerCollection();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (SecurityManager.CheckPermision(cn, rsid, perm))
                    extServers = cn.GetExtServerList(path,perm);
            }

            List<object> rv = new List<object>();
            foreach (ExtServer extServer in extServers)
            {
                if (extServer.ServerType == ServerType.Local)
                    continue;

                rv.Add(new
                {
                    ServerType = extServer.ServerType.ToString(),
                    Name = extServer.Name,
                    Host = extServer.Host
                });
            }

            return rv.ToArray();
        }

        public virtual object[] GetExtServerOfType(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string[] strServerTypes = request.GetString("serverTypes").Split(';');
            List<ServerType> serverTypes = new List<ServerType>();
            foreach (string strServerType in strServerTypes)
            {
                ServerType serverType;
                if (!String.IsNullOrEmpty(strServerType) && Enum.TryParse<ServerType>(strServerType, true, out serverType))
                    serverTypes.Add(serverType);
            }

            ExtServerCollection extServers;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                extServers = cn.GetExtServers();
            }

            List<object> rv = new List<object>();

            foreach (ServerType serverType in serverTypes)
            {
                switch (serverType)
                {
                    case ServerType.DataSourceServer:
                        rv.Add(new
                        {
                            Name = "Default"
                        });
                        break;
                }

                foreach (ExtServer extServer in extServers)
                {
                    if (extServer.ServerType != serverType)
                        continue;

                    rv.Add(new
                    {
                        Name = extServer.Name
                    });
                }
            }

            return rv.ToArray();
        }

        public virtual DataSourceProviderInfoCollection GetDataSourceProviders(HttpContext context)
        {
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                return DataSourceManager.GetProviders(cn);
            }
        }

        public virtual object ConnectionTest(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string serverType = request.GetString("serverType");

            JsonSerializer serializer = new JsonSerializer();
            StreamReader reader = new StreamReader(context.Request.InputStream);
            using (JsonTextReader streamReader = new JsonTextReader(reader))
            {
                JArray @params = serializer.Deserialize(streamReader) as JArray;

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    string message;
                    bool result;
                    switch (serverType)
                    {
                        case "BPMServer":
                        {
                            BPMServer server = @params[0].ToObject<BPMServer>(serializer);
                            result = server.ConnectTest(cn, out message);
                            break;
                        }
                        case "DataSourceServer":
                        {
                            DataSourceServer server = @params[0].ToObject<DataSourceServer>(serializer);
                            result = server.ConnectTest(cn, out message);
                            break;
                        }
                        case "FTPServer":
                        {
                            FTPServer server = @params[0].ToObject<FTPServer>(serializer);
                            result = server.ConnectTest(cn, out message);
                            break;
                        }
                        default:
                            result = false;
                            message = null;
                            break;
                    }

                    return new
                    {
                        success = true,
                        result = result,
                        message = result ? "" : message
                    };
                }
            }
        }

        public virtual BPMServer GetBPMServerDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path", null);
            string serverName = request.GetString("serverName");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                BPMServer server = BPMServer.Open(cn, path, serverName);
                return server;
            }
        }

        public virtual void SaveBPMServer(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string mode = request.GetString("mode");
            string path = request.GetString("path", null);
            string serverName = request.GetString("serverName", mode == "new", null);

            JsonSerializer serializer = new JsonSerializer();
            StreamReader reader = new StreamReader(context.Request.InputStream);
            using (JsonTextReader streamReader = new JsonTextReader(reader))
            {
                JArray @params = serializer.Deserialize(streamReader) as JArray;

                BPMServer server = @params[0].ToObject<BPMServer>(serializer);

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    if (mode == "edit")
                    {
                        if (serverName != server.Name)
                            ExtServer.Rename(cn, path, serverName, server.Name);

                        server.Save(cn, path, true);
                    }
                    else
                    {
                        server.Save(cn, path, false);
                    }
                }
            }
        }

        public virtual DataSourceServer GetDataSourceServerDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path", null);
            string serverName = request.GetString("serverName");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                DataSourceServer server = DataSourceServer.Open(cn, path, serverName);
                return server;
            }
        }

        public virtual void SaveDataSourceServer(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string mode = request.GetString("mode");
            string path = request.GetString("path",null);
            string serverName = request.GetString("serverName", mode=="new",null);

            JsonSerializer serializer = new JsonSerializer();
            StreamReader reader = new StreamReader(context.Request.InputStream);
            using (JsonTextReader streamReader = new JsonTextReader(reader))
            {
                JArray @params = serializer.Deserialize(streamReader) as JArray;

                DataSourceServer server = @params[0].ToObject<DataSourceServer>(serializer);

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    if (mode == "edit")
                    {
                        if (serverName != server.Name)
                            ExtServer.Rename(cn, path, serverName, server.Name);

                        server.Save(cn, path, true);
                    }
                    else
                    {
                        server.Save(cn, path, false);
                    }
                }
            }
        }

        public virtual FTPServer GetFTPServerDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path", null);
            string serverName = request.GetString("serverName");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                FTPServer server = FTPServer.Open(cn, path, serverName);
                return server;
            }
        }

        public virtual void SaveFTPServer(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string mode = request.GetString("mode");
            string path = request.GetString("path", null);
            string serverName = request.GetString("serverName", mode == "new", null);

            JsonSerializer serializer = new JsonSerializer();
            StreamReader reader = new StreamReader(context.Request.InputStream);
            using (JsonTextReader streamReader = new JsonTextReader(reader))
            {
                JArray @params = serializer.Deserialize(streamReader) as JArray;

                FTPServer server = @params[0].ToObject<FTPServer>(serializer);

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    if (mode == "edit")
                    {
                        if (serverName != server.Name)
                            ExtServer.Rename(cn, path, serverName, server.Name);

                        server.Save(cn, path, true);
                    }
                    else
                    {
                        server.Save(cn, path, false);
                    }
                }
            }
        }
    }
}