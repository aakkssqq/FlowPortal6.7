using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using BPM;
using BPM.Client;
using Newtonsoft.Json.Linq;

namespace YZSoft.ActiveJson
{
    public class TintyCodeHelper
    {
        public static object Evaluate(BPMConnection cn, JObject jTinyCode)
        {
            string type = (string)jTinyCode["tinyCode"];
            string code = (string)jTinyCode["code"];

            if (type == "bpm")
                return TintyCodeHelper.EvaluateBPMCode(cn, (string)jTinyCode["code"], typeof(object), true, null);

            return null;
        }

        public static object EvaluateBPMCode(BPMConnection cn, string code)
        {
            return EvaluateBPMCode(cn, code, typeof(object), true, null);
        }

        public static object EvaluateBPMCode(BPMConnection cn, string code, Type returnType, bool allowEmptyCode, object defaultValue)
        {
            if (String.IsNullOrEmpty(code))
                return code;

            return CodeManager.GetCodeResult(cn, code, returnType, allowEmptyCode, defaultValue);
        }
    }
}
