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
using System.Collections.Specialized;
using System.Data;
using Newtonsoft.Json.Schema.Generation;
using Newtonsoft.Json.Schema;
using Oracle.ManagedDataAccess.Client;
using YZSoft.Web.JSchema.Generation;

namespace YZSoft.Services.REST.DesignTime
{
    public class OracleHandler : DatabseAbstractHandler
    {
        public override string paramPerfix {
            get {
                return ":";
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

            using (OracleConnection cn = new OracleConnection(connectionString))
            {
                cn.Open();

                using (OracleCommand cmd = new OracleCommand())
                {
                    cmd.Connection = cn;
                    cmd.BindByName = true;

                    cmd.CommandText = query;

                    foreach (string paramName in @params)
                        cmd.Parameters.Add(new OracleParameter(paramName, DBNull.Value));

                    using (OracleDataReader reader = cmd.ExecuteReader(CommandBehavior.SchemaOnly))
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
            string connectionString = this.GetConnectionString(connectionName);

            List<object> rv = new List<object>();
            using (OracleConnection cn = new OracleConnection(connectionString))
            {
                cn.Open();

                using (OracleCommand cmd = new OracleCommand())
                {
                    cmd.Connection = cn;
                    cmd.BindByName = true;

                    cmd.CommandText = "SELECT OBJECT_NAME AS NAME FROM USER_PROCEDURES WHERE OBJECT_TYPE='PROCEDURE' ORDER BY NAME";

                    using (OracleDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            string procedureName = reader.GetString(0);

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

            using (OracleConnection cn = new OracleConnection(connectionString))
            {
                cn.Open();

                using (OracleCommand cmd = new OracleCommand())
                {
                    cmd.Connection = cn;
                    cmd.BindByName = true;

                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = procedure;

                    OracleCommandBuilder.DeriveParameters(cmd);

                    foreach (OracleParameter param in cmd.Parameters)
                    {
                        rv.Add(new {
                            ParameterName = param.ParameterName,
                            OracleDbType = param.OracleDbType.ToString(),
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

            using (OracleConnection cn = new OracleConnection(connectionString))
            {
                cn.Open();

                using (OracleCommand cmd = new OracleCommand())
                {
                    cmd.Connection = cn;
                    cmd.BindByName = true;

                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = procedure;

                    OracleCommandBuilder.DeriveParameters(cmd);

                    foreach (OracleParameter param in cmd.Parameters)
                    {
                        if (param.Direction == ParameterDirection.Input || param.Direction == ParameterDirection.InputOutput)
                        {
                            Type dataType = BPMConvert.ConvertType(param.DbType);
                            Newtonsoft.Json.Schema.JSchema schema = jsonSchemaGenerator.Generate(dataType);
                            rv[param.ParameterName] = JToken.Parse(schema.ToString()); //Oracle 存储过程参数不带前缀
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

            using (OracleConnection cn = new OracleConnection(connectionString))
            {
                cn.Open();

                using (OracleCommand cmd = new OracleCommand())
                {
                    cmd.Connection = cn;
                    cmd.BindByName = true;

                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = procedure;

                    OracleCommandBuilder.DeriveParameters(cmd);

                    foreach (OracleParameter param in cmd.Parameters)
                    {
                        if (param.OracleDbType == OracleDbType.RefCursor)
                            continue;

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
                            outputParams[param.ParameterName] = JToken.Parse(schema.ToString()); //Oracle 存储过程参数不带前缀
                        }
                    }

                    using (OracleDataReader reader = cmd.ExecuteReader(CommandBehavior.SchemaOnly))
                    {
                        table.Load(reader);
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
            string connectionString = this.GetConnectionString(connectionName);

            List<object> rv = new List<object>();
            using (OracleConnection cn = new OracleConnection(connectionString))
            {
                cn.Open();

                using (OracleCommand cmd = new OracleCommand())
                {
                    cmd.Connection = cn;
                    cmd.CommandText = "SELECT TABLE_NAME FROM USER_TABLES ORDER BY TABLE_NAME";

                    using (OracleDataReader reader = cmd.ExecuteReader())
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
            using (OracleConnection cn = new OracleConnection(connectionString))
            {
                cn.Open();

                using (OracleCommand cmd = new OracleCommand())
                {
                    cmd.Connection = cn;
                    cmd.BindByName = true;

                    cmd.CommandText = "SELECT * FROM " + this.EncodeText(tableName);

                    using (OracleDataReader reader = cmd.ExecuteReader(CommandBehavior.KeyInfo | CommandBehavior.SchemaOnly))
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

        #region 其他

        public List<object> GetSequence(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");
            string connectionString = this.GetConnectionString(connectionName);

            List<object> rv = new List<object>();
            using (OracleConnection cn = new OracleConnection(connectionString))
            {
                cn.Open();

                using (OracleCommand cmd = new OracleCommand())
                {
                    cmd.Connection = cn;
                    cmd.BindByName = true;

                    cmd.CommandText = "select SEQUENCE_NAME from USER_SEQUENCES order by SEQUENCE_NAME";

                    using (OracleDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            string sequenceName = reader.GetString(0);

                            rv.Add(new
                            {
                                name = sequenceName
                            });
                        }
                    }
                }
            }

            return rv;
        }

        #endregion

        #region 内部方法

        protected override string GetConnectionString(JObject jcn)
        {
            OracleConnectionStringBuilder builder = new OracleConnectionStringBuilder();
            builder.DataSource = String.Format("(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST={0})(PORT={1}))(CONNECT_DATA=(SERVICE_NAME={2})))",
                Convert.ToString(jcn["Host"]),
                Convert.ToInt32(jcn["Port"]),
                Convert.ToString(jcn["SID"]));

            builder.UserID = Convert.ToString(jcn["UserID"]);
            builder.Password = Convert.ToString(jcn["Password"]);

            return builder.ConnectionString.Replace(String.Format("\"{0}\"", builder.DataSource), builder.DataSource);
        }

        public string EncodeText(string value)
        {
            string text = value as string;
            if (text == null)
                return value;

            if (String.IsNullOrEmpty(text))
                return text;

            return text.Replace("'", "''");
        }

        //private DataTable LoadTableSchemaInternal(OracleCommand cmd, string tableName, out DataTable columnDefineTable)
        //{
        //    //使用all_tab_columns时出现所有用户下的相同表名中的列都列出来了，导致重复 -时培根 2018.12.28
        //    cmd.CommandText = String.Format("select COLUMN_NAME FROM user_tab_columns WHERE UPPER(TABLE_NAME)=N'{0}' Order By COLUMN_ID", this.EncodeText(tableName.ToUpper()));
        //    StringCollection columnNames = new StringCollection();
        //    using (OracleDataReader reader = cmd.ExecuteReader())
        //    {
        //        while (reader.Read())
        //        {
        //            columnNames.Add(reader.GetString(0));
        //        }
        //    }

        //    cmd.CommandText = this.GetQuery(tableName, columnNames, null, null);
        //    DataTable table = new DataTable(tableName);
        //    using (OracleDataReader reader = ExecuteReader(cmd, CommandBehavior.KeyInfo | CommandBehavior.SchemaOnly))
        //    {
        //        columnDefineTable = new DataTable("ColumnDefine");
        //        columnDefineTable.Columns.Add("COLUMN_NAME", typeof(string));
        //        columnDefineTable.Columns.Add("DATA_TYPE", typeof(string));
        //        for (int i = 0; i < reader.FieldCount; i++)
        //        {
        //            DataRow row = columnDefineTable.NewRow();
        //            columnDefineTable.Rows.Add(row);
        //            row[0] = reader.GetName(i);
        //            row[1] = reader.GetDataTypeName(i);
        //        }

        //        table.Load(reader);
        //    }

        //    return table;
        //}

        #endregion
    }
}