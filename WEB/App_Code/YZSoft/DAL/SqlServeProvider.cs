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
using System.Data.SqlClient;
using BPM;

namespace YZSoft.Web.DAL
{
    public partial class SqlServerProvider : YZDbProviderBase, IYZDbProvider
    {
        public SqlServerProvider()
        {
        }

        public IDbConnection OpenConnection(string connectionString = null)
        {
            if (connectionString == null)
                connectionString = this.ConnectionString;

            SqlConnection cn = new SqlConnection();
            cn.ConnectionString = connectionString;
            cn.Open();
            return cn;
        }

        //日期
        public override string DateToQueryString(DateTime date)
        {
            return "'" + YZStringHelper.DateToStringL(date) + "'";
        }

        public string GenISNULLCond(string str1, string str2)
        {   
            return String.Format("ISNULL({0},{1})",str1,str2);
        }

        //参数
        public override string GetParameterName(string columnName)
        {
            return "@" + columnName;
        }

        public override IDbDataParameter CreateParameter(string columnName, object value, bool addPerfix)
        {
            string parameterName = addPerfix ? this.GetParameterName(columnName) : columnName;
            return new SqlParameter(parameterName, value);
        }

        public int GetNextOrderIndex(IDbConnection cn, string tableName, string columnName, object value)
        {
            string paramName = this.GetParameterName(columnName);
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = String.Format("SELECT ISNULL(max(OrderIndex)+1,0) FROM {0} WHERE [{1}]={2}", this.EncodeText(tableName), this.EncodeText(columnName), paramName);
                cmd.Parameters.Add(new SqlParameter(paramName, value));

                return System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public int GetNextOrderIndex(IDbConnection cn, string tableName, string columnName1, object value1, string columnName2, object value2)
        {
            string paramName1 = this.GetParameterName(columnName1);
            string paramName2 = this.GetParameterName(columnName2);
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = String.Format("SELECT ISNULL(max(OrderIndex)+1,0) FROM {0} WHERE [{1}]={2} AND [{3}]={4}", this.EncodeText(tableName), this.EncodeText(columnName1), paramName1, this.EncodeText(columnName2), paramName2);
                cmd.Parameters.Add(new SqlParameter(paramName1, value1));
                cmd.Parameters.Add(new SqlParameter(paramName2, value2));

                return System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public void GeneratePageCommand(SqlCommand cmd, string query, string sort, int start, int limit)
        {
            if (String.IsNullOrEmpty(sort))
                sort = "(SELECT NULL)";

            string pagingQuery = @"
WITH YZSOFT_TEMP_A AS({0}),
YZSOFT_TEMP_B AS(SELECT *,ROW_NUMBER() OVER(ORDER BY {1}) AS RowNum FROM YZSOFT_TEMP_A),
YZSOFT_TEMP_C AS(SELECT count(*) AS TotalRows FROM YZSOFT_TEMP_B),
YZSOFT_TEMP_D AS(SELECT * FROM YZSOFT_TEMP_B WHERE RowNum = 1 OR RowNum BETWEEN @StartRowIndex AND @EndRowIndex)
SELECT YZSOFT_TEMP_D.*,YZSOFT_TEMP_C.TotalRows FROM YZSOFT_TEMP_D,YZSOFT_TEMP_C ORDER BY RowNum";

            cmd.CommandText = String.Format(pagingQuery, query, sort);
            cmd.Parameters.Add("@StartRowIndex", SqlDbType.Int).Value = start + 1;
            cmd.Parameters.Add("@EndRowIndex", SqlDbType.Int).Value = start + limit;
        }
    }
}
