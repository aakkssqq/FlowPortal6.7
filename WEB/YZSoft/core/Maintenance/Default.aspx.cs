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
using System.Web.Configuration;

public partial class YZSoft_Maintenance_Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        this.Page.Title = WebConfigurationManager.AppSettings["CompanyInfoDefaultPageTitle"];
        if (String.IsNullOrEmpty(this.Page.Title))
            this.Page.Title = Resources.YZStrings.Aspx_DefaultPage_Title;

        DateTime releaseDate = DateTime.Parse(WebConfigurationManager.AppSettings["MaintenanceEndDate"]);
        this._litMessage.Text = String.Format(Resources.YZStrings.Aspx_MaintenanceMessage,
            releaseDate.Year,
            releaseDate.Month,
            releaseDate.Day,
            releaseDate.Hour.ToString("00"),
            releaseDate.Minute.ToString("00"),
            releaseDate.Second.ToString("00"));
    }
}
