using BPM.Json.Converters;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema.Generation;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace YZSoft.Web.JSchema.Generation
{
    [DataContract]
    internal class ExtAttrItem
    {
        [DataMember, JsonProperty(PropertyName = "name")]
        public string name;
        [DataMember, JsonConverter(typeof(DataTypeConverter)), JsonProperty(PropertyName = "type")]
        public Type type;
        [DataMember, JsonProperty(PropertyName = "value")]
        public object value;
    }

    public class ExtAttributesSchemaGenerator
    {
        public JObject Generate(JArray jAttrs)
        {
            if (jAttrs == null)
                jAttrs = new JArray();

            JSchemaGenerator jsonSchemaGenerator = new JSchemaGenerator();
            jsonSchemaGenerator.SchemaReferenceHandling = SchemaReferenceHandling.None;

            List<ExtAttrItem> attrs = jAttrs.ToObject<List<ExtAttrItem>>();
            JObject jSchema = new JObject();

            foreach (ExtAttrItem attr in attrs)
            {
                Newtonsoft.Json.Schema.JSchema schema = jsonSchemaGenerator.Generate(attr.type);
                jSchema[attr.name] = JToken.Parse(schema.ToString());
            }

            return jSchema;
        }
    }
}
