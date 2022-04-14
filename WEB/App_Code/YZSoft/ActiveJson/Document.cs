using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Linq;
using BPM;
using BPM.Client;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace YZSoft.ActiveJson
{
    public class Document
    {
        private JToken _jToken = null;

        public Document(JToken jToken)
        {
            this._jToken = jToken;
        }

        public JToken Execute(BPMConnection cn)
        {
            if (this._jToken == null)
                return null;

            this.Execute(cn, this._jToken);

            return this._jToken;
        }

        private bool isTinyCode(JToken jToken)
        {
            if (jToken == null || jToken.Type != JTokenType.Object)
                return false;

            JObject jObject = jToken as JObject;
            if (jObject != null)
            {
                JToken jTinyCode = jObject["tinyCode"];
                if (jTinyCode != null && jTinyCode.Type == JTokenType.String)
                {
                    if ((string)jTinyCode == "bpm")
                        return true;
                }
            }
            return false;
        }

        private void Execute(BPMConnection cn, JToken jToken)
        {
            JArray jArr = jToken as JArray;
            if (jArr != null)
            {
                for (int i = 0; i < jArr.Count; i++)
                {
                    JToken jtoken1 = jArr[i];
                    if (this.isTinyCode(jtoken1))
                    {
                        jArr[i] = JToken.FromObject(TintyCodeHelper.Evaluate(cn, jtoken1 as JObject));
                    }

                    this.Execute(cn, jtoken1);
                }
            }

            JObject jObject = jToken as JObject;
            if (jObject != null)
            {
                foreach (JProperty jProp in jObject.Properties())
                {
                    if (this.isTinyCode(jProp.Value))
                    {
                        jProp.Value = JToken.FromObject(TintyCodeHelper.Evaluate(cn, jProp.Value as JObject));
                    }
                    else
                    {
                        this.Execute(cn, jProp.Value);
                    }
                }
            }
        }
    }
}
