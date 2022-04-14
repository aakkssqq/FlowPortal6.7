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
        public virtual IDataReader GetMobileFormFields(IDbConnection cn)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = String.Format("SELECT XClass,[Desc] FROM BPMSysMobileAppFormFields ORDER BY OrderIndex ASC");

                return cmd.ExecuteReader();
            }
        }

        public virtual IDataReader GetMobileFormRenders(IDbConnection cn)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = String.Format("SELECT Render,Sample,[Desc] FROM BPMSysMobileAppFormRenders ORDER BY OrderIndex ASC");

                return cmd.ExecuteReader();
            }
        }
    }
}
