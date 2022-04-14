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
    partial class SqlServerProvider
    {
        public virtual IDataReader GetAllServiceContacts(IDbConnection cn, string product)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = String.Format("SELECT * FROM YZAppServiceContacts WHERE Product=@Product ORDER BY OrderIndex ASC");

                cmd.Parameters.Add("@Product", SqlDbType.NVarChar).Value = product;
                return cmd.ExecuteReader();
            }
        }
    }
}
