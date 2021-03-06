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
using Newtonsoft.Json.Linq;

namespace YZSoft.Web.DAL
{
    partial class SqlServerProvider
    {
        public JArray GetFactorys(IDbConnection cn)
        {
            JArray factorys = new JArray();

            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "SELECT * FROM iSYSFactory";

                using (YZReader reader = new YZReader(cmd.ExecuteReader()))
                {
                    while (reader.Read())
                    {
                        JObject factory = new JObject();
                        factorys.Add(factory);

                        factory["ID"] = reader.ReadInt32("ID");
                        factory["Name"] = reader.ReadString("Name");
                        factory["MapX"] = reader.ReadInt32("MapX");
                        factory["MapY"] = reader.ReadInt32("MapY");
                    }
                }
            }
            return factorys;
        }
    }
}
