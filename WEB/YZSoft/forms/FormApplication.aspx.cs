using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Newtonsoft.Json.Linq;
using BPM.Client;

public partial class Forms_FormApplication : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
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
