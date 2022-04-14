using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Xml;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;
using BPM;
using BPM.Client;
using BPM.Client.Data.Common;
using BPM.Data.Common;
using System.Globalization;
using YZSoft.ESB.Visit;
using YZSoft.ESB.Model;
using YZSoft.ESB5;
using BPM.Client.ESB;

namespace YZSoft.Services.REST.BPM
{
    public class FormDataProviderHandler : IHttpHandler
    {
        public virtual void ProcessRequest(HttpContext context)
        {
            YZAuthHelper.AshxAccessCheck(context);
            YZAuthHelper.AshxAuthCheck();

            //如果是自己管理语言，需要放出以下2行
            //System.Threading.Thread.CurrentThread.CurrentCulture = new CultureInfo(1033);
            //System.Threading.Thread.CurrentThread.CurrentUICulture = new CultureInfo(1033);

            //if (String.Compare(YZAuthHelper.LoginUserAccount, "usera06", true) == 0)
            //{
            //using (FileStream fs = new FileStream("e:\\abc.xml", FileMode.Create, FileAccess.Write))
            //{
            //    byte[] bytes = new byte[context.Request.InputStream.Length];
            //    context.Request.InputStream.Read(bytes, 0, (int)context.Request.InputStream.Length);
            //    fs.Write(bytes, 0, bytes.Length);
            //}
            //context.Request.InputStream.Seek(0, SeekOrigin.Begin);
            //}

            try
            {
                JArray tables = new JArray();
                JsonSerializer serializer = new JsonSerializer();
                StreamReader reader = new StreamReader(context.Request.InputStream);
                using (JsonTextReader streamReader = new JsonTextReader(reader))
                {
                    JArray requests = serializer.Deserialize(streamReader) as JArray;
                    using (BPMConnection cn = new BPMConnection())
                    {
                        cn.WebOpen();

                        for (int requestIndex = 0; requestIndex < requests.Count; requestIndex++)
                        {
                            JObject request = (JObject)requests[requestIndex];

                            string method = (string)request["Method"];

                            if (!YZNameChecker.IsValidMethodName(method))
                                throw new Exception("Invalid method name");

                            Type type = this.GetType();
                            System.Reflection.MethodInfo methodcall = type.GetMethod(method, System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Public);
                            if (methodcall == null)
                                throw new Exception(String.Format(Resources.YZStrings.Aspx_UnknowCommand, method));

                            try
                            {
                                object mrv = methodcall.Invoke(this, new object[] { cn, request });
                                if (mrv is JObject)
                                {
                                    (mrv as JObject)["Index"] = requestIndex;
                                    tables.Add(mrv);
                                }
                                else
                                {
                                    JArray rvs = mrv as JArray;
                                    foreach (JObject jTable in rvs)
                                    {
                                        jTable["Index"] = requestIndex;
                                        tables.Add(jTable);
                                    }
                                }
                            }
                            catch (Exception exp)
                            {
                                throw exp.InnerException;
                            }
                        }
                    }
                }

                JObject rv = new JObject();
                rv[YZJsonProperty.success] = true;
                rv["Tables"] = tables;
                context.Response.Write(rv.ToString());                
            }
            catch (Exception e)
            {
                JObject rv = new JObject();
                rv[YZJsonProperty.success] = false;
                rv[YZJsonProperty.errorMessage] = HttpUtility.HtmlEncode(e.Message);
                context.Response.Write(rv.ToString(Newtonsoft.Json.Formatting.Indented, YZJsonHelper.Converters));
            }
        }

        public virtual JObject GetUserDataTable(BPMConnection cn, JObject request)
        {
            string dataSourceName = (string)request["DataSource"];
            string tableName = (string)request["TableName"];
            string orderBy = (string)request["OrderBy"];
            YZDSFilterCollection filters = request["Filter"] != null ? request["Filter"].ToObject<YZDSFilterCollection>() : null;

            BPMDBParameterCollection @params = new BPMDBParameterCollection();
            if (filters != null)
            {
                foreach (KeyValuePair<string,YZDSFilter> filter in filters)
                {
                    BPMDBParameter paramater = new BPMDBParameter(filter.Key, typeof(String), filter.Value.value);
                    paramater.ParameterCompareType = BPMDBParameter.ParseOp(filter.Value.op, ParameterCompareType.Equ) | ParameterCompareType.NecessaryCondition;
                    @params.Add(paramater);
                }
            }

            FlowDataTable table = DataSourceManager.LoadTableData(cn, dataSourceName, tableName, @params, orderBy);
            return this.ToResult(table, false);
        }

        public virtual JObject GetUserDataProcedure(BPMConnection cn, JObject request)
        {
            string dataSourceName = (string)request["DataSource"];
            string procedureName = (string)request["ProcedureName"];
            YZDSFilterCollection filters = request["Filter"] != null ? request["Filter"].ToObject<YZDSFilterCollection>() : null;

            BPMDBParameterCollection @params = new BPMDBParameterCollection();

            if (filters != null)
            {
                foreach (KeyValuePair<string, YZDSFilter> filter in filters)
                {
                    BPMDBParameter paramater = new BPMDBParameter(filter.Key, typeof(String), filter.Value.value);
                    @params.Add(paramater);
                }
            }

            FlowDataTable table = DataSourceManager.ExecProcedure(cn, dataSourceName, procedureName, @params);
            return this.ToResult(table, false);
        }

        public virtual JObject GetUserDataESB(BPMConnection cn, JObject request)
        {
            string esbObjectName = (string)request["ESB"];
            if (esbObjectName.StartsWith("ESB:", true, null))
                return this.GetESBDSFlowDataNoPaged(cn, request);

            YZDSFilterCollection filters = request["Filter"] != null ? request["Filter"].ToObject<YZDSFilterCollection>() : null;
            //获取参数
            string[] strs = esbObjectName.Split(':');
            SourceTypeEnum sourceType = (SourceTypeEnum)Enum.Parse(typeof(SourceTypeEnum), strs[0]);
            SourceInfo sourceInfo = SourceInfoManager.GetSourceInfo(sourceType, strs[1]);
            SourceVisit visit = new SourceVisit(sourceInfo);
            BPMObjectNameCollection names = new BPMObjectNameCollection();
            List<ColumnInfo> values = new List<ColumnInfo>();
            if (filters != null)
            {
                foreach (KeyValuePair<string, YZDSFilter> filter in filters)
                {
                    names.Add(filter.Key);
                    values.Add(new ColumnInfo() { 
                        columnName = filter.Key,
                        defaultValue = filter.Value.value
                    });
                }

                foreach (ColumnInfo column in visit.GetParameter())
                {
                    if (!names.Contains(column.rename))
                    {
                        names.Add(column.rename);
                        values.Add(new ColumnInfo()
                        {
                            columnName = column.rename,
                            defaultValue = column.defaultValue
                        });
                    }
                }
            }
            DataTable dt = visit.GetResult(values);
            FlowDataTable table = new FlowDataTable(dt);
            return this.ToResult(table, false);
        }

        public virtual JObject GetESBDSFlowDataNoPaged(BPMConnection cn, JObject request)
        {
            string objectName = (string)request["ESB"];
            string orderBy = (string)request["OrderBy"];
            YZDSFilterCollection filters = request["Filter"] != null ? request["Filter"].ToObject<YZDSFilterCollection>() : null;

            //获取参数
            string[] strs = objectName.Split(':');
            string flowName = strs[1];

            BPMDBParameterCollection @params = new BPMDBParameterCollection();
            if (filters != null)
            {
                foreach (KeyValuePair<string, YZDSFilter> filter in filters)
                {
                    BPMDBParameter paramater = new BPMDBParameter(filter.Key, typeof(String), filter.Value.value);
                    @params.Add(paramater);
                }
            }

            FlowDataTable table = ESBDSFlow.LoadDataNoPaged(cn, flowName, @params, orderBy);
            return this.ToResult(table, false);
        }

        public virtual JArray GetFormPostData(BPMConnection cn, JObject request)
        {
            string processName = (string)request["ProcessName"];
            Version processVersion = new Version((string)request["ProcessVersion"]);
            string owner = (string)request["Owner"];
            int restartTaskID = request.Property("restartTaskID") != null  ? (int)request["restartTaskID"]:-1;

            FlowDataSet dataset = BPMProcess.GetFormData(cn, processName, processVersion, owner, restartTaskID);
            return this.ToResult(dataset, true);
        }

        public virtual JArray GetFormProcessData(BPMConnection cn, JObject request)
        {
            int pid = Int32.Parse((string)request["PID"]);

            FlowDataSet dataset = BPMProcess.GetFormData(cn, pid);
            return this.ToResult(dataset, true);
        }

        public virtual JArray GetFormReadData(BPMConnection cn, JObject request)
        {
            int tid = Int32.Parse((string)request["TID"]);
            string strPid = (string)request["PID"];
            int pid = String.IsNullOrEmpty(strPid) ? -1 : Int32.Parse(strPid);

            FlowDataSet dataset;
            if (pid != -1)
            {
                dataset = BPMProcess.GetFormData(cn, pid);
                foreach (FlowDataTable table in dataset.Tables)
                {
                    foreach (FlowDataColumn col in table.Columns)
                        col.AllowWrite = false;
                }
            }
            else
            {
                dataset = BPMProcess.GetFormDataForRead(cn, tid);
            }

            return this.ToResult(dataset, true);
        }

        public virtual JArray GetSnapshotData(BPMConnection cn, JObject request)
        {
            string strPid = (string)request["PID"];
            if (String.IsNullOrEmpty(strPid))
                strPid = "-1";

            int tid = Int32.Parse((string)request["TID"]);
            int pid = Int32.Parse(strPid);
            int ver = Int32.Parse((string)request["Version"]);

            FlowDataSet dataset = cn.GetSnapshotData(tid, ver, pid);
            return this.ToResult(dataset, true);
        }

        public virtual JArray GetDraftData(BPMConnection cn, JObject request)
        {
            Guid draftGuid = new Guid((string)request["DraftID"]);

            FlowDataSet dataset = cn.GetDraftData(draftGuid);
            return this.ToResult(dataset, true);
        }

        public virtual JArray GetFormApplicationData(BPMConnection cn, JObject request)
        {
            string appName = (string)request["ApplicationName"];
            string formState = (string)request["FormState"];
            string keyValue = (string)request["PrimaryKey"];

            FlowDataSet dataset = FormService.GetFormApplicationData(cn, appName, formState, keyValue);
            return this.ToResult(dataset, true);
        }

        protected virtual JArray ToResult(FlowDataSet dataset, bool formTable)
        {
            JArray rv = new JArray();
            foreach (FlowDataTable table in dataset.Tables)
                rv.Add(this.ToResult(table, formTable));
            return rv;
        }

        protected virtual JObject ToResult(FlowDataTable table, bool formTable)
        {
            JObject jTable = new JObject();

            jTable["DataSource"] = TableIdentityHelper.IsDefaultDataSource(table.DataSourceName) ? "" : table.DataSourceName;
            jTable["TableName"] = table.TableName;
            jTable["FormTable"] = formTable;

            if (formTable)
            {
                jTable["IsRepeatable"] = table.IsRepeatableTable;
                jTable["AllowAddRecord"] = table.AllowAddRecord;

                if (!table.IsRepeatableTable)
                {
                    jTable["CKeyName"] = table.CKeyName;
                    jTable["CKeyValue"] = table.CKeyValue;
                }
            }

            JArray jColumns = new JArray();
            jTable["Columns"] = jColumns;
            foreach (FlowDataColumn column in table.Columns)
            {
                JObject jColumn = new JObject();
                jColumns.Add(jColumn);

                jColumn["ColumnName"] = column.ColumnName;
                jColumn["Type"] = (column.DataType == null ? typeof(String):column.DataType).Name;
                if (formTable)
                {
                    jColumn["Length"] = column.MaxLength;
                    jColumn["Readable"] = column.AllowRead;
                    jColumn["Writeable"] = column.AllowWrite;
                    jColumn["AutoIncrement"] = column.AutoIncrement;
                    jColumn["PrimaryKey"] = column.PrimaryKey;
                    jColumn["DefaultValue"] = new JValue(this.FormatValue(column.DefaultValue));
                    jColumn["ShowSpoor"] = column.ShowSpoor;
                }
            }

            JArray jRows = new JArray();
            jTable["Rows"] = jRows;
            foreach (FlowDataRow row in table.Rows)
            {
                JObject jRow = new JObject();
                jRows.Add(jRow);

                foreach (string colName in row.Keys)
                    jRow[colName] = new JValue(this.FormatValue(row[colName]));
            }

            return jTable;
        }

        protected virtual object FormatValue(object value)
        {
            object rv;

            if (value == null)
            {
                rv = String.Empty;
            }
            else
            {
                if (value is DateTime)
                    rv = YZStringHelper.DateToStringL((DateTime)value);
                else if (value is byte[])
                    rv = Convert.ToBase64String((byte[])value);
                else
                    //strValue = value.ToString();
                    rv = value;
            }

            return rv;
        }

        public bool IsReusable
        {
            get
            {
                return true;
            }
        }
    }
}