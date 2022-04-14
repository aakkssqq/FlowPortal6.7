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
using YZSoft.Web.Social;

namespace YZSoft.Web.DAL
{
    partial class OracleProvider
    {
        public IDataReader GetUidsFromPushNotificationRegisterId(IDbConnection cn, string registerId)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "SELECT Account FROM BPMSysUserCommonInfo WHERE PushNotificationDeviceToken=:PushNotificationDeviceToken";
                cmd.Parameters.Add(":PushNotificationDeviceToken", OracleDbType.NVarchar2).Value = registerId;

                return cmd.ExecuteReader();
            }
        }
    }
}
