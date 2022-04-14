using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Drawing;
using System.IO;
using System.Data.Common;
using System.Runtime.Serialization;
using BPM;

namespace YZSoft.Web.DAL
{
    public class PageInfo
    {
        public int StartRowIndex { get; set; }
        public int EndRowIndex { get; set; }
    }

    public partial interface IYZDbProvider:IDisposable
    {
        //基础相同
        IDbConnection OpenConnection(string connectionString = null);
        string CombinCond(params string[] conds);
        string CombinCondOR(params string[] conds);
        string EncodeText(string str);
        DataTable Load(IDataReader reader);
        PageResult LoadPageResult(IDataReader reader);

        //基础不同
        string GetParameterName(string columnName);
        IDbDataParameter CreateParameter(string columnName, object value, bool addPerfix);
        string DateToQueryString(DateTime date);
        string GenPeriodCond(string fieldName, DateTime date1, DateTime date2);

        string GenISNULLCond(string str1, string str2);

        int GetNextOrderIndex(IDbConnection cn, string tableName,string columnName, object value);
        int GetNextOrderIndex(IDbConnection cn, string tableName, string columnName1, object value1, string columnName2, object value2);
    }
}
