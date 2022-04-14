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
    partial class OracleProvider
    {
        public DataTable Query2Table(string datasourceName, string query, string resultTableName)
        {
            using (OracleConnection cn = new OracleConnection())
            {
                cn.ConnectionString = System.Web.Configuration.WebConfigurationManager.ConnectionStrings[datasourceName].ConnectionString;
                cn.Open();

                using (OracleCommand cmd = new OracleCommand())
                {
                    cmd.Connection = cn;
                    cmd.CommandText = query;

                    using (OracleDataReader reader = cmd.ExecuteReader())
                    {
                        DataTable table = new DataTable(resultTableName);
                        table.Load(reader);
                        return table;
                    }
                }
            }
        }
    }
}
