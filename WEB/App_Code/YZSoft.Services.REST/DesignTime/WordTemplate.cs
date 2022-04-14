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
using Aliyun.Acs.Core;
using Aliyun.Acs.Core.Profile;
using Aliyun.Acs.Core.Exceptions;
using Aliyun.Acs.Core.Http;
using System.Text.RegularExpressions;
using System.Data;

namespace YZSoft.Services.REST.DesignTime
{
    public class WordTemplateHandler : YZServiceHandler
    {
        public object GetInputSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string root = request.GetString("root");
            string path = request.GetString("path");
            string templateFileName = request.GetString("templateFileName");

            string rootPath = YZSoft.FileSystem.OSDirectoryManager.GetRootPath(context, root);
            string filePath = Path.Combine(rootPath, path, templateFileName);

            DataSet dataset = YZSoft.Web.Word.TemplateParser.Parse(filePath);
            JObject jSchema = this.DataSet2JSchema(dataset);
            return jSchema;
        }

        protected JObject DataSet2JSchema(DataSet dataset)
        {
            JObject jSchema = new JObject();
            foreach (DataTable table in dataset.Tables)
            {
                JObject jTableSchema = new JObject();
                foreach (DataColumn column in table.Columns)
                {
                    jTableSchema[column.ColumnName] = JObject.FromObject(new
                    {
                        type = "string"
                    });
                }

                if ((bool)table.ExtendedProperties["isArray"])
                {
                    jSchema[table.TableName] = JObject.FromObject(new
                    {
                        type = "array",
                        items = new
                        {
                            type = "object",
                            properties = jTableSchema
                        }
                    });
                }
                else
                {
                    jSchema[table.TableName] = JObject.FromObject(new
                    {
                        type = "object",
                        properties = jTableSchema
                    });
                }
            }

            return jSchema;
        }
    }
}