<%@ WebHandler Language="C#" Class="BPMApp.SamplesModuleTree" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Xml;
using System.IO;

namespace BPMApp
{
    public class SamplesModuleTree : YZServiceHandler
    {
        protected override void AshxAccessCheck(HttpContext context)
        {
        }

        protected override void AuthCheck(HttpContext context)
        {
        }

        public object ABC(HttpContext context)
        {
            context.Response.Headers.Add("ttt", "12345");
            return new
            {
                OrderNum = "PR-2019-" + (new Random()).Next(1000, 9999).ToString(),
                QueryParams = new
                {
                    str = 1,
                    date = DateTime.Now
                }
            };
        }

        public object Order(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JObject jrv = request.GetPostData<JObject>();
            string str = request.GetString("str", null);
            DateTime date = request.GetDateTime("date", DateTime.MinValue);

            return new
            {
                OrderNum = "PR-2019-" + (new Random()).Next(1000, 9999).ToString(),
                QueryParams = new
                {
                    str = str,
                    date = date
                },
                Payload = jrv
            };
        }

        [YZWebMethodMethodAttribute(AutoResponse = false)]
        public void Order1(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string str = request.GetString("str", null);
            DateTime date = request.GetDateTime("date", DateTime.MinValue);

            XmlDocument xmldoc = new XmlDocument { XmlResolver = null };
            xmldoc.Load(context.Request.InputStream);
            JObject jRequest = new JObject();
            foreach (XmlNode node in xmldoc.DocumentElement.ChildNodes)
            {
                jRequest.Merge(JObject.FromObject(node));
            }

            var a = new
            {
                OrderNum = "PR-2019-" + (new Random()).Next(1000, 9999).ToString(),
                QueryParams = new
                {
                    str = str,
                    date = date
                },
                Payload = jRequest
            };

            JObject jObj = JObject.FromObject(a);
            string strJson = jObj.ToString();
            XmlDocument doc = (XmlDocument)JsonConvert.DeserializeXmlNode(strJson, "result");
            string xml;
            using (MemoryStream stream = new MemoryStream())
            {
                XmlWriter writer = new XmlTextWriter(stream, Encoding.UTF8);
                writer.WriteStartDocument();
                doc.WriteTo(writer);
                writer.Flush();

                using (StreamReader rd = new StreamReader(stream))
                {
                    stream.Seek(0, SeekOrigin.Begin);
                    xml = rd.ReadToEnd();
                }
            }

            context.Response.Write(xml);
        }
    }
}
