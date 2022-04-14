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

namespace YZSoft.Services.REST.DesignTime
{
    public class WebServiceHandler : WebServiceAbstractHandler
    {
        public List<object> GetServiceDescption(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");
            string wsdlOffsetUrl = request.GetString("wsdlOffsetUrl", null);
            bool operations = request.GetBool("operations", false);

            WebServiceConnectionInfo cnnInfo = this.GetConnectionInfo(connectionName);
            using (Stream stream = this.GetWSDL(UrlUtil.CombineUrl(cnnInfo.wsdlBaseUrl, wsdlOffsetUrl)))
            {
                return this.GetServiceDescption(stream, operations);
            }
        }

        public List<object> GetServiceDescptionWSDL(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string wsdl = request.GetString("wsdl");
            bool operations = request.GetBool("operations",false);

            using (Stream stream = this.GetWSDL(wsdl))
            {
                return this.GetServiceDescption(stream, operations);
            }
        }

        public List<object> GetOperations(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");
            string wsdlOffsetUrl = request.GetString("wsdlOffsetUrl", null);
            SoapProtocolVersion soapVersion = request.GetEnum<SoapProtocolVersion>("soapVersion");

            WebServiceConnectionInfo cnnInfo = this.GetConnectionInfo(connectionName);
            using (Stream stream = this.GetWSDL(UrlUtil.CombineUrl(cnnInfo.wsdlBaseUrl, wsdlOffsetUrl)))
            {
                return this.GetOperations(stream, soapVersion);
            }
        }

        public string GetHashCode(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");
            string wsdlOffsetUrl = request.GetString("wsdlOffsetUrl", null);

            WebServiceConnectionInfo cnnInfo = this.GetConnectionInfo(connectionName);
            using (Stream stream = this.GetWSDL(UrlUtil.CombineUrl(cnnInfo.wsdlBaseUrl, wsdlOffsetUrl)))
            {
                return this.GetHashCode(stream);
            }
        }

        public string GetHashCodeWSDL(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string wsdl = request.GetString("wsdl");

            using (Stream stream = this.GetWSDL(wsdl))
            {
                return this.GetHashCode(stream);
            }
        }

        public object GetInputSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");
            string wsdlOffsetUrl = request.GetString("wsdlOffsetUrl", null);
            SoapProtocolVersion soapVersion = request.GetEnum<SoapProtocolVersion>("soapVersion");
            string operationName = request.GetString("operationName");
            string messageName = request.GetString("messageName", null);

            WebServiceConnectionInfo cnnInfo = this.GetConnectionInfo(connectionName);
            using (Stream stream = this.GetWSDL(UrlUtil.CombineUrl(cnnInfo.wsdlBaseUrl, wsdlOffsetUrl)))
            {
                return this.GetInputSchema(stream, soapVersion, operationName, messageName);
            }
        }

        public object GetInputSchemaWSDL(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string wsdl = request.GetString("wsdl");
            SoapProtocolVersion soapVersion = request.GetEnum<SoapProtocolVersion>("soapVersion");
            string operationName = request.GetString("operationName");
            string messageName = request.GetString("messageName", null);

            using (Stream stream = this.GetWSDL(wsdl))
            {
                return this.GetInputSchema(stream, soapVersion, operationName, messageName);
            }
        }

        public object GetOutputSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");
            string wsdlOffsetUrl = request.GetString("wsdlOffsetUrl", null);
            SoapProtocolVersion soapVersion = request.GetEnum<SoapProtocolVersion>("soapVersion");
            string operationName = request.GetString("operationName");
            string messageName = request.GetString("messageName", null);

            WebServiceConnectionInfo cnnInfo = this.GetConnectionInfo(connectionName);
            using (Stream stream = this.GetWSDL(UrlUtil.CombineUrl(cnnInfo.wsdlBaseUrl, wsdlOffsetUrl)))
            {
                return this.GetOutputSchema(stream, soapVersion, operationName, messageName);
            }
        }

        public object GetOutputSchemaWSDL(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string wsdl = request.GetString("wsdl");
            SoapProtocolVersion soapVersion = request.GetEnum<SoapProtocolVersion>("soapVersion");
            string operationName = request.GetString("operationName");
            string messageName = request.GetString("messageName", null);

            using (Stream stream = this.GetWSDL(wsdl))
            {
                return this.GetOutputSchema(stream, soapVersion, operationName, messageName);
            }
        }

        private WebServiceConnectionInfo GetConnectionInfo(string connectionName)
        {
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                ConnectionInfo cnInfo = ConnectionInfo.OpenByName(cn, connectionName);
                WebServiceConnectionInfo cnnInfo = cnInfo.Cn.ToObject<WebServiceConnectionInfo>();
                cnnInfo.AssertValid(connectionName);
                return cnnInfo;
            }
        }
    }

    [DataContract]
    internal class WebServiceConnectionInfo
    {
        [DataMember]
        public string wsdlBaseUrl { get; set; }

        public void AssertValid(string connectionName)
        {
        }
    }
}