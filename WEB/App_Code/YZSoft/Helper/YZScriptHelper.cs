using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Text;
using BPM;
using BPM.Client;

/// <summary>
/// YZScriptHelper 的摘要说明

/// </summary>
public class YZScriptHelper
{
    public static void RegistVar(string varName, object value)
    {
        Page page = HttpContext.Current.Handler as Page;
        if(page == null)
            return;

        if (!page.ClientScript.IsStartupScriptRegistered(typeof(object), varName))
        {
            string cmd = String.Format("var {0}={1};\r\n",varName,YZJsonHelper.ConvertToJsonValue(value));
            page.ClientScript.RegisterStartupScript(typeof(object), varName, cmd, true);
        }
    }
}
