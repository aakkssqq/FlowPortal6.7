using System;
using System.Web;
using System.Resources;
using System.Globalization;
using System.Collections.Specialized;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using Resources;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;

namespace YZSoft.Services.REST.core
{
    public class GlobalizationHandler : YZServiceHandler
    {
        protected override void AuthCheck(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string method = request.GetString("method");

            if (NameCompare.EquName(method, "GetString"))
                return;

            YZAuthHelper.AshxAuthCheck();
        }

        public virtual JObject GetString(HttpContext context)
        {
            JObject rv = new JObject();
            YZRequest request = new YZRequest(context);

            CultureInfo cultureInfo = YZLangHelper.CurrentCulture;
            string strlcid = context.Request.Params["lcid"];
            int lcid;
            if (!String.IsNullOrEmpty(strlcid) && Int32.TryParse(strlcid, out lcid))
                cultureInfo = new CultureInfo(lcid);

            string assemblyName = request.GetString("assembly",null);
            string nameSpace = request.GetString("namespace",null) + "_";

            string typeName = "Resources." + assemblyName;
            Type type = typeof(Resources.YZStrings);
            ResourceManager mgr = new ResourceManager(typeName, type.Assembly);
            ResourceSet rsset = mgr.GetResourceSet(cultureInfo, true, true);

            JObject jsonStrings = new JObject();
            rv["strings"]  = jsonStrings;

            IDictionaryEnumerator enumerator = rsset.GetEnumerator();
            while (enumerator.MoveNext())
            {
                string key = enumerator.Key as string;
                string value = enumerator.Value as string;

                if (key.StartsWith(nameSpace, true, null))
                {
                    value = value.Replace("\\n", "\n");
                    jsonStrings[key] = value;
                }
            }

            rv["success"] = true;
            return rv;
        }
    }
}