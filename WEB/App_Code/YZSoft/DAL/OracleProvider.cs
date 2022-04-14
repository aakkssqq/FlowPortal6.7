using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.IO;
using System.Drawing;
using System.Threading;
using System.Collections.Generic;
using System.Text;
using System.Data.Common;
using Oracle.ManagedDataAccess.Client;
using BPM;

namespace YZSoft.Web.DAL
{
    public partial class OracleProvider : YZDbProviderBase, IYZDbProvider
    {
        public OracleProvider()
        {
        }

        public IDbConnection OpenConnection(string connectionString = null)
        {
            if (connectionString == null)
                connectionString = System.Web.Configuration.WebConfigurationManager.ConnectionStrings["BPMDB"].ConnectionString;

            OracleConnection cn = new OracleConnection();
            cn.ConnectionString = connectionString;
            cn.Open();
            return cn;
        }

        //日期
        public override string DateToQueryString(DateTime date)
        {
            return String.Format("TO_DATE('{0}','YYYY-MM-DD HH24:MI:SS')",YZStringHelper.DateToStringL(date));
        }

        public string GenISNULLCond(string str1, string str2)
        {
            return String.Format("NVL({0},{1})", str1, str2);
        }

        //参数
        public override string GetParameterName(string columnName)
        {
            return ":" + columnName;
        }

        public override IDbDataParameter CreateParameter(string columnName, object value, bool addPerfix)
        {
            string parameterName = addPerfix ? this.GetParameterName(columnName) : columnName;
            return new OracleParameter(parameterName, value);
        }

        public int GetNextOrderIndex(IDbConnection cn, string tableName, string columnName, object value)
        {
            string paramName = this.GetParameterName("PM_" + columnName);
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = String.Format("SELECT NVL(max(OrderIndex)+1,0) FROM {0} WHERE \"{1}\"={2}", this.EncodeText(tableName), this.EncodeText(columnName.ToUpper()), paramName);
                cmd.Parameters.Add(new OracleParameter(paramName, value));

                return System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public int GetNextOrderIndex(IDbConnection cn, string tableName, string columnName1, object value1, string columnName2, object value2)
        {
            string paramName1 = this.GetParameterName("PM_" + columnName1);
            string paramName2 = this.GetParameterName("PM_" + columnName2);
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = String.Format("SELECT NVL(max(OrderIndex)+1,0) FROM {0} WHERE \"{1}\"={2} AND \"{3}\"={4}", this.EncodeText(tableName), this.EncodeText(columnName1.ToUpper()), paramName1, this.EncodeText(columnName2.ToUpper()), paramName2);
                cmd.Parameters.Add(new OracleParameter(paramName1, value1));
                cmd.Parameters.Add(new OracleParameter(paramName2, value2));

                return System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public void GeneratePageCommand(OracleCommand cmd, string query, string sort, int start, int limit)
        {
            string pagingQuery;
            if (String.IsNullOrEmpty(sort))
            {
                pagingQuery = @"
WITH YZSOFT_TEMP_B AS({0}),
YZSOFT_TEMP_C AS(SELECT count(*) AS TotalRows FROM YZSOFT_TEMP_B),
YZSOFT_TEMP_D AS(SELECT YZSOFT_TEMP_B.*, ROWNUM RN__ FROM YZSOFT_TEMP_B WHERE ROWNUM <= :EndRowIndex),
YZSOFT_TEMP_E AS(SELECT * FROM YZSOFT_TEMP_D WHERE RN__ >= :StartRowIndex)
SELECT YZSOFT_TEMP_E.*,YZSOFT_TEMP_C.* FROM YZSOFT_TEMP_E,YZSOFT_TEMP_C ORDER BY RN__";
            }
            else
            {
                pagingQuery = @"
WITH YZSOFT_TEMP_A AS({0}),
YZSOFT_TEMP_B AS(SELECT * from YZSOFT_TEMP_A ORDER BY {1}),
YZSOFT_TEMP_C AS(SELECT count(*) AS TotalRows FROM YZSOFT_TEMP_B),
YZSOFT_TEMP_D AS(SELECT YZSOFT_TEMP_B.*, ROWNUM RN__ FROM YZSOFT_TEMP_B WHERE ROWNUM <= :EndRowIndex),
YZSOFT_TEMP_E AS(SELECT * FROM YZSOFT_TEMP_D WHERE RN__ >= :StartRowIndex)
SELECT YZSOFT_TEMP_E.*,YZSOFT_TEMP_C.* FROM YZSOFT_TEMP_E,YZSOFT_TEMP_C ORDER BY RN__";
            }

            cmd.CommandText = String.Format(pagingQuery, query, sort);
            cmd.Parameters.Add(":StartRowIndex", OracleDbType.Int32).Value = start + 1;
            cmd.Parameters.Add(":EndRowIndex", OracleDbType.Int32).Value = start + limit;
        }

        #region 私有方法

        protected int ConvertBoolToInt16(bool value)
        {
            if (value)
                return 1;
            else
                return 0;
        }

        protected string SBToString(StringBuilder sb)
        {
            return sb.ToString().Replace("\r\n", "\n");
        }

        #endregion

        public override string EmptyString
        {
            get
            {
                return String.Empty;
            }
        }
    }
}
