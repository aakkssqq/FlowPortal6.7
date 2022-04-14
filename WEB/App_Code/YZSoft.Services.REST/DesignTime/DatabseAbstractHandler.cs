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
using System.Dynamic;

namespace YZSoft.Services.REST.DesignTime
{
    public abstract class DatabseAbstractHandler : YZServiceHandler
    {
        public abstract string paramPerfix { get; }
        protected abstract string GetConnectionString(JObject jcn);

        public virtual string EmptyString
        {
            get
            {
                return string.Empty;
            }
        }

        protected string GetConnectionString(BPMConnection cn, string connectionName)
        {
            ConnectionInfo cnInfo = ConnectionInfo.OpenByName(cn, connectionName);
            return this.GetConnectionString(cnInfo.Cn);
        }

        protected string GetConnectionString(string connectionName)
        {
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return this.GetConnectionString(cn, connectionName);
            }
        }

        public StringCollection ParseQueryParams(string query)
        {
            return YZSqlClientParameterParser.ParseCommandText(query, this.paramPerfix);
        }

        public virtual string GetFlatParamName(string paramName)
        {
            if (paramName.StartsWith(this.paramPerfix))
                paramName = paramName.Remove(0, this.paramPerfix.Length);

            return paramName;
        }

        public object ParamNamesToJSchema(StringCollection paramNames)
        {
            Dictionary<string, object> properties = new Dictionary<string, object>();

            foreach (string paramName in paramNames)
            {
                string flatParamName = this.GetFlatParamName(paramName);
                properties[flatParamName] = new
                {
                    type = "string"
                };
            }

            return new
            {
                type = "object",
                properties = properties
            };
        }

        public object GetQueryInputSchema(string query, bool paging)
        {
            dynamic rv = new ExpandoObject();

            if (paging)
            {
                rv.Paging = new
                {
                    type = "object",
                    properties = new
                    {
                        start = new
                        {
                            type = "integer"
                        },
                        limit = new
                        {
                            type = "integer"
                        },
                        sort = new
                        {
                            type = "string"
                        }
                    }
                };
            }

            rv.QueryParams = this.ParamNamesToJSchema(this.ParseQueryParams(query));
            return rv;
        }

        public virtual object ConvertValue(string value, bool allowNull)
        {
            if (allowNull)
            {
                if (String.IsNullOrEmpty(value))
                    return DBNull.Value;
                else
                    return value;
            }
            else
            {
                if (value == null)
                    return this.EmptyString;
                else
                    return value;
            }
        }
    }
}