using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class YZSoft_BPM_Form_Error : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        throw new Exception(HttpUtility.HtmlDecode(this.Request.Params["error"]));
    }
}