using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Drawing;
using System.Data.Common;
using BPM;
using BPM.Client;

namespace YZSoft.Web.DAL
{
    public abstract partial class YZDbProviderBase
    {
        string _connectionString = null;
        protected IDbConnection _connection;

        //常规
        public string ConnectionString
        {
            get
            {
                if (String.IsNullOrEmpty(this._connectionString))
                    this._connectionString = System.Web.Configuration.WebConfigurationManager.ConnectionStrings["BPMDB"].ConnectionString;

                return this._connectionString;
            }
        }
        protected virtual string CombinCond(bool and, params string[] conds)
        {
            string rv = String.Empty;

            if (conds.Length == 0)
                return rv;

            foreach (string cond in conds)
            {
                if (String.IsNullOrEmpty(cond))
                    continue;

                if (String.IsNullOrEmpty(rv))
                    rv = cond;
                else
                    rv = "(" + rv + (and ? ") AND (" : ") OR (") + cond + ")";
            }

            return rv;
        }
        public virtual string CombinCond(params string[] conds)
        {
            return CombinCond(true, conds);
        }
        public virtual string CombinCondOR(params string[] conds)
        {
            return CombinCond(false, conds);
        }
        public virtual object Convert(string value, bool allowNull)
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

        public virtual object Convert(DateTime value, bool allowNull)
        {
            if (allowNull && value == DateTime.MinValue)
                return DBNull.Value;
            else
                return value;
        }
        public virtual object Convert(object value, Type type, bool allowNull)
        {
            if (value is string)
                return Convert((string)value, allowNull);

            if (value is DateTime)
                return Convert((DateTime)value, allowNull);

            if (allowNull && value == null)
                return DBNull.Value;

            return value;
        }
        public virtual object Convert(int value, bool allowNull)
        {
            if (allowNull && value == -1)
                return DBNull.Value;
            else
                return value;
        }

        public virtual string EmptyString
        {
            get
            {
                return string.Empty;
            }
        }

        //辅助函数
        public virtual string EncodeText(string str)
        {
            if (String.IsNullOrEmpty(str))
                return str;

            return str.Replace("'", "''");
        }

        public virtual string GetDbInList(BPMObjectNameCollection names)
        {
            List<string> ins = new List<string>();
            foreach (string value in names)
            {
                ins.Add("N'" + this.EncodeText(value) + "'");
            }

            return String.Join(",", ins.ToArray());
        }

        public virtual string GetDbInList(BPMObjectNameCollection sids, string uid)
        {
            if (sids == null)
                return null;

            BPMObjectNameCollection lsids = new BPMObjectNameCollection();
            sids.CopyTo(lsids);
            lsids.Add(uid);

            return this.GetDbInList(lsids);
        }

        public virtual string GetDbInList(int[] ids,int emptyValue)
        {
            List<string> ins = new List<string>();
            foreach (int id in ids)
            {
                ins.Add(id.ToString());
            }

            if (ins.Count == 0)
                ins.Add(emptyValue.ToString());

            return String.Join(",",ins.ToArray());
        }

        protected virtual string GetFilter(IDbCommand cmd, string columnName, BPMObjectNameCollection include, BPMObjectNameCollection exclude)
        {
            string filter = null;
            string paramName = this.GetParameterName(columnName);

            if (include != null && include.Count != 0)
            {
                if (include.Count == 1)
                {

                    filter = this.CombinCond(filter, String.Format("{0}={1}", columnName, paramName));
                    cmd.Parameters.Add(this.CreateParameter(paramName, this.Convert(include[0], true), false));
                }
                else
                {
                    filter = this.CombinCond(filter, String.Format("{0} IN({1})", columnName, this.GetDbInList(include)));
                }
            }

            if (exclude != null && exclude.Count != 0)
                filter = this.CombinCond(filter, String.Format("{0} NOT IN({1})", columnName, this.GetDbInList(exclude)));

            return filter;
        }

        public virtual string GenPeriodCond(string fieldName, DateTime date1, DateTime date2)
        {
            return String.Format("({0}>={1} AND {0}<{2})",
                fieldName,
                this.DateToQueryString(date1),
                this.DateToQueryString(date2));
        }

        public virtual DataTable Load(IDataReader reader)
        {
            DataTable table = new DataTable();
            table.Load(reader);

            foreach (DataColumn column in table.Columns)
                column.ReadOnly = false;

            return table;
        }

        //分页
        protected virtual PageInfo AjaxPageToDbPage(int startRowIndex, int rows)
        {
            PageInfo pageInfo = new PageInfo();
            pageInfo.StartRowIndex = startRowIndex + 1;
            pageInfo.EndRowIndex = startRowIndex + rows;
            return pageInfo;
        }

        public PageResult LoadPageResult(IDataReader reader)
        {
            PageResult rv = new PageResult();

            rv.Table = this.Load(reader);

            if (rv.Table.Rows.Count == 0)
            {
                rv.TotalRows = 0;
            }
            else
            {
                rv.TotalRows = System.Convert.ToInt32(rv.Table.Rows[0]["TotalRows"]);
                rv.Table.Columns.Remove("TotalRows");

                foreach (DataColumn column in rv.Table.Columns)
                    column.ReadOnly = false;
            }

            return rv;
        }

        //非通用函数
        public abstract string DateToQueryString(DateTime date);

        public abstract string GetParameterName(string columnName);

        public abstract IDbDataParameter CreateParameter(string columnName, object value, bool addPerfix);

        public void Dispose()
        {
            if (this._connection != null)
                this._connection.Dispose();

            this._connection = null;
        }
    }
}
