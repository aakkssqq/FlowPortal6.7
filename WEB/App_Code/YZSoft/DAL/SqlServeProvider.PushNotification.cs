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
using YZSoft.Web.Social;

namespace YZSoft.Web.DAL
{
    partial class SqlServerProvider
    {
        public IDataReader GetUidsFromPushNotificationRegisterId(IDbConnection cn, string registerId)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                cmd.CommandText = "SELECT Account FROM BPMSysUserCommonInfo WHERE PushNotificationDeviceToken=@PushNotificationDeviceToken";
                cmd.Parameters.Add("@PushNotificationDeviceToken", SqlDbType.NVarChar).Value = registerId;

                return cmd.ExecuteReader();
            }
        }
    }
}
