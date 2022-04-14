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
using System.Xml;
using Newtonsoft.Json;
using YZSoft.Web.JSchema.Generation;

namespace YZSoft.Services.REST.DesignTime
{
    public class JSchemaHandler : YZServiceHandler
    {
        public JObject XMLSample2JSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string xmlSample = request.GetPostData();

            XmlDocument doc = new XmlDocument();
            doc.LoadXml(xmlSample);

            string json = JsonConvert.SerializeXmlNode(doc.DocumentElement);
            SampleJsonSchemaGenerator generate = new SampleJsonSchemaGenerator();
            JToken schemaJson = generate.Generate(json);
            JSchema schema = JSchema.Parse(schemaJson.ToString());
            schema.ExtensionData.Remove("definitions");
            return JObject.Parse(schema.ToString());
        }

        public JObject JSONSample2JSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string json = request.GetPostData();

            SampleJsonSchemaGenerator generate = new SampleJsonSchemaGenerator();
            JToken schemaJson = generate.Generate(json);
            JSchema schema = JSchema.Parse(schemaJson.ToString());
            schema.ExtensionData.Remove("definitions");
            return JObject.Parse(schema.ToString());
        }

        public JObject XMLSchema2JSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string xsd = request.GetPostData();

            XSDSchemaGenerator generator = new XSDSchemaGenerator();
            return generator.Generate(xsd);
        }

        public JObject JSONSchema2JSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string json = request.GetPostData();

            return JObject.Parse(json);
        }
    }
}