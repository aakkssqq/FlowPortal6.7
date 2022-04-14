<%@ Application Language="C#" ClassName="BPMApplication"%>
<%@ Import namespace="BPM" %>
<%@ Import namespace="BPM.Client" %>
<%@ Import namespace="System.Web.Configuration" %>
<%@ Import namespace="System.IO" %>
<%@ Import namespace="System.Collections.Generic" %>
<%@ Import namespace="System.Globalization" %>
<%@ Import namespace="YZSoft" %>

<script runat="server">

    void Application_Start(object sender, EventArgs e)
    {
        YZSoft.WebApplication.Init();
        Newtonsoft.Json.Schema.License.RegisterLicense("4070-TpTGGsDrqM/Gni7jAeGhZ6j9ZC0X2vd590NaGl5dcSyqkovfldDJk2g1wAlmpYxiKl8BA6ev2QNrZHtSuvvCCNY/z0A/3Qt7YDRVSnvoj0CTpPbYaLXXExErwZwKwHJLzErxYu2r3SKE9sIyYmO0TlOuQ28AN26F9h57AyMkE0t7IklkIjo0MDcwLCJFeHBpcnlEYXRlIjoiMjAyMC0xMC0zMVQxMToxNzozMy4yMDQyNzI4WiIsIlR5cGUiOiJKc29uU2NoZW1hQnVzaW5lc3MifQ==");
        YZSoft.Web.Push.MessageBus.Init();
    }

    void Application_End(object sender, EventArgs e)
    {
    }

    void Application_Error(object sender, EventArgs e)
    {
        // 获得BPMException 或顶层Exception(最原始的Exception)
        Exception exp = Server.GetLastError();

        while (exp != null)
        {
            if (exp is BPMException)
                break;

            if (exp.InnerException == null)
                break;

            exp = exp.InnerException;
        }

        HttpException httpException = exp as HttpException;
        if (httpException != null)
        {
            switch (httpException.GetHttpCode())
            {
                case 404:
                case 403:
                    return;
            }
        }

        if (Request.Url.LocalPath.EndsWith(".aspx", true, null) && Request.Params["json"] != "true")
        {
            if (exp != null)
                WriteAspxException(exp.Message, exp.StackTrace);
            else
                WriteAspxException(Resources.YZStrings.Aspx_Global_UnknowException, null);
        }
        else
        {

            if (exp != null)
                WriteJsonException(exp.Message, null);
            else
                WriteJsonException(Resources.YZStrings.Aspx_Global_UnknowException, null);
        }

        Server.ClearError();
        Response.End();
    }

    private void WriteJsonException(string errmsg, string stacktrace)
    {
        //Response.StatusCode = 200;

        JsonItem rv = new JsonItem();
        rv.Attributes.Add("success", false);
        rv.Attributes.Add("errorMessage", errmsg);

        if (YZSetting.Debug)
            rv.Attributes.Add("stackTrace",stacktrace);

        Response.Clear();
        Response.Write(rv.ToString());
        Response.End();
    }

    private void WriteAspxException(string errmsg, string stacktrace)
    {
        StringBuilder sb = new StringBuilder();

        errmsg = this.Server.HtmlEncode(errmsg);
        sb.AppendLine("<body style=\"overflow-y:hidden\">");
        sb.AppendLine("<table style=\"height:100%;width:100%;text-align:center;vertical-align:middle;\"><tr><td>");
        sb.AppendLine("<table cellspacing=\"0px\" style=\"border:solid 1px #ded0c8;vertical-align:middle;background-color:#f8f8ff;margin:auto;\">");
        sb.AppendLine(String.Format("<tr><td colspan=2 style=\"border-bottom:solid 1px #ded0c8;background-color:#eee8aa;color:#9900ff;padding-left:6px;padding-top:2px;padding-bottom:2px;font-family:Tahoma;font-size:12px;letter-spacing:2px\">{0}</td></tr>", Resources.YZStrings.Aspx_Global_ErrorTitle));
        sb.AppendLine("<tr>");
        sb.AppendLine(String.Format("<td style=\"padding:12px;\"><img src=\"{0}\" /></td>", VirtualPathUtility.ToAbsolute("~/YZSoft/theme/core/ui/com_stop.gif")));
        sb.AppendLine("<td style=\"padding-top:8px;padding-bottom:8px;padding-left:0px;padding-right:8px;color:#660000;font-family:Tahoma;font-size:12px;letter-spacing:0px\">" +  errmsg.Replace("\n", "<br>") + "</td>");
        sb.AppendLine("</tr>");
        sb.AppendLine("</table>");
        sb.AppendLine("</td></tr></table>");

        if (YZSetting.Debug)
            sb.AppendLine(String.Format("<span style='display:none'>{0}</span>", HttpUtility.HtmlEncode(stacktrace)));

        sb.AppendLine("</body>");

        Response.Clear();
        Response.Write(sb.ToString());
        Response.End();
    }

    void Session_Start(object sender, EventArgs e)
    {
    }

    void Session_End(object sender, EventArgs e)
    {
    }

    void Application_PreRequestHandlerExecute(object sender, EventArgs e)
    {
        HttpCookie cookie = Request.Cookies["yz-lcid"];
        int lcid;
        bool cultureSetted = false;
        if (cookie != null && !string.IsNullOrEmpty(cookie.Value) && Int32.TryParse(cookie.Value, out lcid))
        {
            try
            {
                System.Threading.Thread.CurrentThread.CurrentUICulture = new CultureInfo(lcid);
                cultureSetted = true;
            }
            catch (Exception)
            {
            }
        }

        if (!cultureSetted)
        {
            if (Request.UserLanguages != null)
            {
                System.Threading.Thread.CurrentThread.CurrentUICulture = YZCultureInfoParse.Parse(Request.UserLanguages, YZCultureInfoParse.DefauleCultureInfo);
            }
        }

        System.Threading.Thread.CurrentThread.CurrentCulture = new CultureInfo(1033);
    }

</script>