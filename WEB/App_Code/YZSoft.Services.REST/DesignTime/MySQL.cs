using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using System.IO;
using MySql.Data.MySqlClient;
using System.Collections.Specialized;
using System.Data;
using Newtonsoft.Json.Schema.Generation;
using Newtonsoft.Json.Schema;
using YZSoft.Web.JSchema.Generation;

namespace YZSoft.Services.REST.DesignTime
{
    public class MySQLHandler : DatabseAbstractHandler
    {
        public override string paramPerfix {
            get {
                return "@";
            }
        }

        #region 查询

        public object GetQueryInputSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");
            string query = request.GetString("Query");
            bool paging = request.GetBool("paging", true);

            return this.GetQueryInputSchema(query, paging);
        }

        public object GetQueryOutputSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");
            string query = request.GetString("Query");
            string connectionString = this.GetConnectionString(connectionName);
            StringCollection @params = this.ParseQueryParams(query);
            DataTable table = new DataTable("Schema");

            using (MySqlConnection cn = new MySqlConnection(connectionString))
            {
                cn.Open();

                using (MySqlCommand cmd = new MySqlCommand())
                {
                    cmd.Connection = cn;
                    cmd.CommandText = query;

                    foreach (string paramName in @params)
                        cmd.Parameters.Add(new MySqlParameter(paramName, DBNull.Value));

                    using (MySqlDataReader reader = cmd.ExecuteReader(CommandBehavior.SchemaOnly))
                    {

                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            DataColumn column = new DataColumn(reader.GetName(i), reader.GetFieldType(i));
                            table.Columns.Add(column);
                        }
                    }
                }
            }

            DataTableSchemaGenerator generator = new DataTableSchemaGenerator();
            return new
            {
                Result = new
                {
                    type = "object",
                    properties = new
                    {
                        total = new
                        {
                            type = "integer",
                        },
                        rows = new
                        {
                            type = "array",
                            items = new
                            {
                                type = "object",
                                properties = generator.Generate(table)
                            }
                        }
                    }
                }
            };
        }

        #endregion

        #region 存储过程

        public List<object> GetProcedures(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");

            string connectionString;
            string dbName;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                ConnectionInfo cnInfo = ConnectionInfo.OpenByName(cn, connectionName);
                dbName = (string)cnInfo.Cn["Database"];
                connectionString = this.GetConnectionString(cnInfo.Cn);
            }

            List<object> rv = new List<object>();
            using (MySqlConnection cn = new MySqlConnection(connectionString))
            {
                cn.Open();

                using (MySqlCommand cmd = new MySqlCommand())
                {
                    cmd.Connection = cn;
                    cmd.CommandText = "SHOW PROCEDURE STATUS WHERE db = @db || ISNULL(@db)";
                    cmd.Parameters.Add("@db", MySqlDbType.String).Value = this.ConvertValue(dbName,true);

                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            string procedureName = reader.GetString("Name");

                            rv.Add(new
                            {
                                name = procedureName
                            });
                        }
                    }
                }
            }

            return rv;
        }

        public object GetProcedureParams(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");
            string procedure = request.GetString("procedure");
            string connectionString = this.GetConnectionString(connectionName);

            List<object> rv = new List<object>();
            JSchemaGenerator jsonSchemaGenerator = new JSchemaGenerator();
            jsonSchemaGenerator.SchemaReferenceHandling = SchemaReferenceHandling.None;

            using (MySqlConnection cn = new MySqlConnection(connectionString))
            {
                cn.Open();

                using (MySqlCommand cmd = new MySqlCommand())
                {
                    cmd.Connection = cn;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = procedure;

                    MySqlCommandBuilder.DeriveParameters(cmd);

                    foreach (MySqlParameter param in cmd.Parameters)
                    {
                        rv.Add(new
                        {
                            ParameterName = param.ParameterName,
                            MySqlDbType = param.MySqlDbType.ToString(),
                            Direction = param.Direction.ToString(),
                            Size = param.Size
                        });
                    }
                }
            }

            return rv;
        }

        public object GetProcedureInputSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");
            string procedure = request.GetString("procedure");
            string connectionString = this.GetConnectionString(connectionName);

            JObject rv = new JObject();
            JSchemaGenerator jsonSchemaGenerator = new JSchemaGenerator();
            jsonSchemaGenerator.SchemaReferenceHandling = SchemaReferenceHandling.None;

            using (MySqlConnection cn = new MySqlConnection(connectionString))
            {
                cn.Open();

                using (MySqlCommand cmd = new MySqlCommand())
                {
                    cmd.Connection = cn;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = procedure;

                    MySqlCommandBuilder.DeriveParameters(cmd);

                    foreach (MySqlParameter param in cmd.Parameters)
                    {
                        if (param.Direction == ParameterDirection.Input || param.Direction == ParameterDirection.InputOutput)
                        {
                            Type dataType = BPMConvert.ConvertType(param.DbType);
                            Newtonsoft.Json.Schema.JSchema schema = jsonSchemaGenerator.Generate(dataType);
                            rv[this.GetFlatParamName(param.ParameterName)] = JToken.Parse(schema.ToString());
                        }
                    }
                }
            }

            return new
            {
                QueryParams = new
                {
                    type = "object",
                    properties = rv
                }
            };
        }

        public object GetProcedureOutputSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");
            string procedure = request.GetString("procedure");
            string connectionString = this.GetConnectionString(connectionName);

            JToken returnType = null;
            JObject outputParams = new JObject();
            DataTable table = new DataTable(procedure);
            JSchemaGenerator jsonSchemaGenerator = new JSchemaGenerator();
            jsonSchemaGenerator.SchemaReferenceHandling = SchemaReferenceHandling.None;

            using (MySqlConnection cn = new MySqlConnection(connectionString))
            {
                cn.Open();

                using (MySqlCommand cmd = new MySqlCommand())
                {
                    cmd.Connection = cn;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = procedure;

                    MySqlCommandBuilder.DeriveParameters(cmd);

                    foreach (MySqlParameter param in cmd.Parameters)
                    {
                        if (param.Direction == ParameterDirection.ReturnValue)
                        {
                            Type dataType = BPMConvert.ConvertType(param.DbType);
                            Newtonsoft.Json.Schema.JSchema schema = jsonSchemaGenerator.Generate(dataType);
                            returnType = JToken.Parse(schema.ToString());
                        }
                        else if (param.Direction == ParameterDirection.Output || param.Direction == ParameterDirection.InputOutput)
                        {
                            Type dataType = BPMConvert.ConvertType(param.DbType);
                            Newtonsoft.Json.Schema.JSchema schema = jsonSchemaGenerator.Generate(dataType);
                            outputParams[this.GetFlatParamName(param.ParameterName)] = JToken.Parse(schema.ToString());
                        }
                    }

                    try
                    {
                        //临时表存储过程用CommandBehavior.SchemaOnly会出错(SQL Server如此 MySQL未验证)
                        using (MySqlDataReader reader = cmd.ExecuteReader(CommandBehavior.SchemaOnly))
                        {
                            table.Load(reader);
                        }
                    }
                    catch (Exception e)
                    {
                        try
                        {
                            foreach (MySqlParameter param in cmd.Parameters)
                            {
                                if (param.Direction == ParameterDirection.Input || param.Direction == ParameterDirection.InputOutput)
                                    param.Value = DBNull.Value;
                            }

                            using (MySqlDataReader reader = cmd.ExecuteReader(CommandBehavior.SingleRow))
                            {
                                table.Load(reader);
                            }
                        }
                        catch (Exception)
                        {
                            throw e;
                        }
                    }
                }
            }

            Dictionary<string, object> rv = new Dictionary<string, object>();
            if (returnType != null)
                rv["ReturnValue"] = returnType;

            if (outputParams.Count != 0)
            {
                rv["OutputParams"] = new
                {
                    type = "object",
                    properties = outputParams
                };
            }

            DataTableSchemaGenerator generator = new DataTableSchemaGenerator();
            rv["Result"] = new
            {
                type = "array",
                yzext = new
                {
                    isResponse = true
                },
                items = new
                {
                    type = "object",
                    properties = generator.Generate(table)
                }
            };

            return JObject.FromObject(rv);
        }

        #endregion

        #region 表

        public List<object> GetTables(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");

            ConnectionInfo cnInfo;
            string connectionString;
            string dbName;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                cnInfo = ConnectionInfo.OpenByName(cn, connectionName);
                connectionString = this.GetConnectionString(cnInfo.Cn);
                dbName = Convert.ToString(cnInfo.Cn["Database"]);
            }

            List<object> rv = new List<object>();
            using (MySqlConnection cn = new MySqlConnection(connectionString))
            {
                cn.Open();

                using (MySqlCommand cmd = new MySqlCommand())
                {
                    cmd.Connection = cn;
                    cmd.CommandText = String.Format("select TABLE_NAME from information_schema.TABLES where TABLE_TYPE='BASE TABLE' AND TABLE_SCHEMA=N'{0}' order by TABLE_NAME",this.EncodeText(dbName));

                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            string tableName = reader.GetString(0);

                            rv.Add(new
                            {
                                name = tableName
                            });
                        }
                    }
                }
            }

            return rv;
        }

        public object GetTableSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");
            string tableName = request.GetString("table");
            string connectionString = this.GetConnectionString(connectionName);

            DataTable table = new DataTable(tableName);
            using (MySqlConnection cn = new MySqlConnection(connectionString))
            {
                cn.Open();

                using (MySqlCommand cmd = new MySqlCommand())
                {
                    cmd.Connection = cn;
                    cmd.CommandText = "SELECT * FROM " + this.EncodeText(tableName);

                    using (MySqlDataReader reader = cmd.ExecuteReader(CommandBehavior.KeyInfo | CommandBehavior.SchemaOnly))
                    {
                        table.Load(reader);
                    }
                }
            }

            Dictionary<string, object> rv = new Dictionary<string, object>();
            DataTableSchemaGenerator generator = new DataTableSchemaGenerator();
            rv[tableName] = new
            {
                type = "array",
                yzext = new
                {
                    isPayload = true
                },
                items = new
                {
                    type = "object",
                    properties = generator.Generate(table)
                }
            };

            return JObject.FromObject(rv);
        }

        #endregion


        #region 内部方法

        protected override string GetConnectionString(JObject jcn)
        {
            JObject jcn1 = new JObject(jcn);
            jcn1.Remove("CommandTimeout");
            MySqlConnectionStringBuilder builder = jcn1.ToObject<MySqlConnectionStringBuilder>();
            return builder.ToString();
        }

        protected string EncodeText(string value)
        {
            string text = value as string;
            if (text == null)
                return value;

            if (String.IsNullOrEmpty(text))
                return text;

            return text.Replace("'", "''");
        }

        #endregion
    }
}