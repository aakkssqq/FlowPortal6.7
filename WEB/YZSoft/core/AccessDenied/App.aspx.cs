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

public partial class YZSoft_core_AccessDenied_App : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string startApp = this.Request.Params["startApp"];
        string appName = this.Request.Params["appName"];

        this.Title = String.IsNullOrEmpty(appName) ? startApp : appName;
        this._litMessage.Text = String.Format("<span style=\"font-size:18px\">{0}</span><br/><span style=\"font-size:12px;font-weight:normal;color:#aaa\">{1}<span>",
            Resources.YZStrings.Aspx_AccessDenied_App,
            YZUtility.HtmlEncode(startApp));
    }
}
