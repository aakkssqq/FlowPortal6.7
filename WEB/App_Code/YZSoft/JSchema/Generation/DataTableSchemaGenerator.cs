using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema.Generation;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace YZSoft.Web.JSchema.Generation
{
    public class DataTableSchemaGenerator
    {
        public JObject Generate(DataTable table)
        {
            JSchemaGenerator jsonSchemaGenerator = new JSchemaGenerator();
            jsonSchemaGenerator.SchemaReferenceHandling = SchemaReferenceHandling.None;

            JObject jSchema = new JObject();
            foreach (DataColumn column in table.Columns)
            {
                Newtonsoft.Json.Schema.JSchema schema = jsonSchemaGenerator.Generate(column.DataType);
                jSchema[column.ColumnName] = JToken.Parse(schema.ToString());
            }

            return jSchema;
        }
    }
}
