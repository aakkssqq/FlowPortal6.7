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

public partial class YZSoft_MobileFormPreviewError : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        this._litMessage.Text = String.Format("<span style=\"font-size:18px\">{0}</span><br/><span style=\"font-size:12px;font-weight:normal;color:#aaa\">{1}<span>", 
            "无法访问iAnywhere网站",
            YZUtility.HtmlEncode(Resources.YZStrings.Aspx_iAnywhereSite_SettingError));
    }
}
