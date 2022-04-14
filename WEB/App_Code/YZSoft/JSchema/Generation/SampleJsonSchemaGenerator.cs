using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace YZSoft.Web.JSchema.Generation
{
    public class SampleJsonSchemaGenerator
    {
        public JToken Generate(string sample)
        {
            if (String.IsNullOrEmpty(sample))
                throw new ArgumentNullException("sample");

            JToken jSample = JToken.Parse(sample);
            return this.Generate(jSample);
        }

        public JToken Generate(JToken jToken)
        {
            if (jToken == null)
                throw new ArgumentNullException("jToken");

            switch (jToken.Type)
            {
                case JTokenType.None:
                    return JObject.FromObject(new
                    {
                        type = "string"
                    });
                case JTokenType.Object:
                    JObject jObject = (JObject)jToken;
                    JObject jProperties = new JObject();
                    foreach (KeyValuePair<string, JToken> kv in jObject)
                    {
                        string propertyName = kv.Key;
                        JToken value = kv.Value;
                        jProperties[propertyName] = this.Generate(value);
                    }

                    return JObject.FromObject(new
                    {
                        type = "object",
                        properties = jProperties
                    });
                case JTokenType.Array:
                    JArray jArray = (JArray)jToken;
                    if (jArray.Count >= 1)
                    {
                        return JObject.FromObject(new
                        {
                            type = "array",
                            items = this.Generate(jArray[0])
                        });
                    }
                    else
                    {
                        return JObject.FromObject(new
                        {
                            type = "array",
                            items = new
                            {
                            }
                        });
                    }
                case JTokenType.Integer:
                    return JObject.FromObject(new
                    {
                        type = "integer"
                    });
                case JTokenType.Float:
                    return JObject.FromObject(new
                    {
                        type = "number"
                    });
                case JTokenType.String:
                    string format = null;
                    if (Regex.IsMatch(jToken.Value<string>(), "^[0-2][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]$"))
                    {
                        format = "date";
                    }
                    else if (Regex.IsMatch(jToken.Value<string>(), "^[0-2][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] [0-9][0-9]:[0-9][0-9](:[0-9][0-9])?$"))
                    {
                        format = "date-time";
                    }
                    else if (Regex.IsMatch(jToken.Value<string>(), "^[0-9][0-9]:[0-9][0-9](:[0-9][0-9])?$"))
                    {
                        format = "time-span";
                    }

                    if (String.IsNullOrEmpty(format))
                    {
                        return JObject.FromObject(new
                        {
                            type = "string"
                        });
                    }
                    else
                    {
                        return JObject.FromObject(new
                        {
                            type = "string",
                            format = format
                        });
                    }
                case JTokenType.Boolean:
                    return JObject.FromObject(new
                    {
                        type = "boolean"
                    });
                case JTokenType.Null:
                case JTokenType.Undefined:
                    return JObject.FromObject(new
                    {
                        type = "string"
                    });
                case JTokenType.Date:
                    return JObject.FromObject(new
                    {
                        type = "string",
                        format = (jToken.Value<DateTime>() == jToken.Value<DateTime>().Date) ? "date" : "date-time"
                    });
                case JTokenType.Bytes:
                    return JObject.FromObject(new
                    {
                        type = "string",
                        format = "byte"
                    });
                case JTokenType.Guid:
                    return JObject.FromObject(new
                    {
                        type = "string",
                        format = "guid"
                    });
                case JTokenType.Uri:
                    return JObject.FromObject(new
                    {
                        type = "string",
                        format = "uri"
                    });
                case JTokenType.TimeSpan:
                    return JObject.FromObject(new
                    {
                        type = "string",
                        format = "time-span"
                    });
                default:
                    return JObject.FromObject(new
                    {
                        type = "string"
                    });
            }
        }
    }
}
