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
        public virtual IDataReader GetMobileFormFields(IDbConnection cn)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = String.Format("SELECT XCLASS,\"DESC\" FROM BPMSYSMOBILEAPPFORMFIELDS ORDER BY ORDERINDEX ASC");

                return cmd.ExecuteReader();
            }
        }

        public virtual IDataReader GetMobileFormRenders(IDbConnection cn)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = String.Format("SELECT RENDER,SAMPLE,\"DESC\" FROM BPMSYSMOBILEAPPFORMRENDERS ORDER BY ORDERINDEX ASC");

                return cmd.ExecuteReader();
            }
        }
    }
}
