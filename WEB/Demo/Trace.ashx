<%@ WebHandler Language="C#" Class="BPMApp.TraceHandler" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json.Linq;
using System.Threading;
using System.IO;

namespace BPMApp
{
    public class TraceHandler : IHttpHandler
    {
        public virtual void ProcessRequest(HttpContext context)
        {
            using (StreamWriter sw = new StreamWriter(@"d:\bbb.xml"))
            {
                foreach(string key in context.Request.Headers.Keys)
                    sw.WriteLine(String.Format("{0}={1}",key,context.Request.Headers[key]));

                sw.WriteLine();
                sw.WriteLine("-------------------------------Bofy--------------------------");
                sw.WriteLine();
                ;
                byte[] bytes = new byte[context.Request.InputStream.Length];
                context.Request.InputStream.Read(bytes, 0, (int)context.Request.InputStream.Length);
                sw.Write(Encoding.UTF8.GetString(bytes));
            }
        }

        public virtual bool IsReusable
        {
            get
            {
                return true;
            }
        }
    }
}
