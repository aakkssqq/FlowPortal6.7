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
using System.Net;
using System.Text;
using HtmlAgilityPack;

namespace YZSoft.Services.REST.DesignTime
{
    public class KingdeeEASHandler : WebServiceAbstractHandler
    {
        private SoapProtocolVersion soapVersion = SoapProtocolVersion.Default;

        public List<object> GetServices(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");

            KingdeeEASConnectionInfo cnnInfo = this.GetConnectionInfo(connectionName);
            using (System.Net.WebClient wc = new System.Net.WebClient())
            {
                using (Stream stream = wc.OpenRead(cnnInfo.baseUrl))
                {
                    HtmlDocument doc = new HtmlDocument();
                    doc.Load(stream);

                    var ul = doc.DocumentNode.SelectSingleNode("ul");
                    var lis = ul.SelectNodes("li");

                    List<object> rv = new List<object>();
                    foreach (var li in lis)
                    {
                        string offsetUrl = li.FirstChild.InnerText;
                        if (offsetUrl != null)
                            offsetUrl = offsetUrl.Trim();

                        rv.Add(new {
                            name = offsetUrl
                        });
                    }

                    return rv;
                }
            }
        }

        public List<object> GetServiceDescption(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string wsdl = request.GetString("wsdl");

            using(Stream stream = this.GetWSDL(wsdl))
            {
                return this.GetServiceDescption(stream, false);
            }
        }

        public List<object> GetOperations(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");
            string offsetUrl = request.GetString("offsetUrl");

            KingdeeEASConnectionInfo cnnInfo = this.GetConnectionInfo(connectionName);
            string url = UrlUtil.CombineUrl(cnnInfo.baseUrl, offsetUrl);
            using (Stream stream = this.GetWSDL(url))
            {
                return this.GetOperations(stream, this.soapVersion);
            }
        }

        public string GetHashCode(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");
            string offsetUrl = request.GetString("offsetUrl");

            KingdeeEASConnectionInfo cnnInfo = this.GetConnectionInfo(connectionName);
            string url = UrlUtil.CombineUrl(cnnInfo.baseUrl, offsetUrl);
            using (Stream stream = this.GetWSDL(url))
            {
                return this.GetHashCode(stream);
            }
        }

        public object GetInputSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");
            string offsetUrl = request.GetString("offsetUrl");
            string operationName = request.GetString("operationName");
            string messageName = request.GetString("messageName", null);

            KingdeeEASConnectionInfo cnnInfo = this.GetConnectionInfo(connectionName);
            string url = UrlUtil.CombineUrl(cnnInfo.baseUrl, offsetUrl);
            using (Stream stream = this.GetWSDL(url))
            {
                return this.GetInputSchema(stream, this.soapVersion, operationName, messageName);
            }
        }

        public object GetOutputSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");
            string offsetUrl = request.GetString("offsetUrl");
            string operationName = request.GetString("operationName");
            string messageName = request.GetString("messageName", null);

            KingdeeEASConnectionInfo cnnInfo = this.GetConnectionInfo(connectionName);
            string url = UrlUtil.CombineUrl(cnnInfo.baseUrl, offsetUrl);
            using (Stream stream = this.GetWSDL(url))
            {
                return this.GetOutputSchema(stream, this.soapVersion, operationName, messageName);
            }
        }

        private KingdeeEASConnectionInfo GetConnectionInfo(string connectionName)
        {
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                ConnectionInfo cnInfo = ConnectionInfo.OpenByName(cn, connectionName);
                KingdeeEASConnectionInfo cnnInfo = cnInfo.Cn.ToObject<KingdeeEASConnectionInfo>();
                cnnInfo.AssertValid(connectionName);
                return cnnInfo;
            }
        }
    }

    [DataContract]
    internal class KingdeeEASConnectionInfo
    {
        [DataMember]
        public string baseUrl;

        public void AssertValid(string connectionName)
        {
            if (String.IsNullOrEmpty(this.baseUrl))
                throw new Exception(String.Format(Resources.YZStrings.Aspx_InvalidEASConnection_MissBaseUrl, connectionName));
        }
    }
}