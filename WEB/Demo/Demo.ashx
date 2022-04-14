<%@ WebHandler Language="C#" Class="BPMApp.DemoHandler" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json.Linq;
using System.Threading;

namespace BPMApp
{
    public class DemoHandler : YZServiceHandler
    {
        protected override void AshxAccessCheck(HttpContext context)
        {
        }

        protected override void AuthCheck(HttpContext context)
        {
        }

        public string Test(HttpContext context)
        {
            Thread.Sleep(100);
            return "aaabbbccc";
        }
    }
}
