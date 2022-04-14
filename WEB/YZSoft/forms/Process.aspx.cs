using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;

public partial class Forms_Process : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!YZAuthHelper.IsAuthenticated)
        {
            string token = this.Request.QueryString["Token"];
            if (!String.IsNullOrEmpty(token))
            {
                using (SqlConnection cn = new SqlConnection())
                {
                    cn.ConnectionString = System.Web.Configuration.WebConfigurationManager.ConnectionStrings["BPMDB"].ConnectionString;
                    cn.Open();

                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = cn;
                        cmd.CommandText = "SELECT StepID,Account,hash FROM BPMInstProcessToken WHERE Token=@Token";
                        cmd.Parameters.Add("@Token", SqlDbType.NVarChar).Value = token;

                        using (DBReader reader = new DBReader(cmd.ExecuteReader()))
                        {
                            if (reader.Read())
                            {
                                int stepid = Int32.Parse(this.Request.QueryString["pid"]);
                                int stepidSaved = reader.ReadInt32(0);
                                string account = reader.ReadString(1);
                                string hash = reader.ReadString(2);

                                if (stepid == stepidSaved)
                                {
                                    List<string> values = new List<string>();
                                    values.Add(token);
                                    values.Add(stepid.ToString());
                                    values.Add(account);

                                    if (YZSecurityHelper.CheckHash(values, hash, YZSecurityHelper.SecurityKey))
                                        YZAuthHelper.SetAuthCookie(account);
                                }
                            }
                        }
                    }
                }
            }
        }

        if (!YZAuthHelper.IsAuthenticated)
        {
            FormsAuthentication.RedirectToLoginPage();
            return;
        }

        string js =
            "<script type=\"text/javascript\">" +
                "var params={0};" +
            "</script>";

        JObject rv = new JObject();
        foreach (string key in this.Request.QueryString.Keys)
            rv[key] = this.Request.QueryString[key];

        this._litJS.Text = String.Format(js, rv.ToString());
    }
}
