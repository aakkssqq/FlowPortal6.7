using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

/// <summary>
/// YZDebugHelper 的摘要说明

/// </summary>
public class YZDebugHelper
{
    public static void Init()
    {
        if (!YZAuthHelper.IsAuthenticated)
            FormsAuthentication.RedirectToLoginPage();

        //YZAuthHelper.SetAuthCookie("UserA06'A\"B&C<<br>D&#32;");
        //YZAuthHelper.SetAuthCookie("sasasa");
        //YZAuthHelper.SetAuthCookie("UserA06");
        //YZAuthHelper.SetAuthCookie("sa");
    }
}
