using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;

public partial class YZSoft_Forms_ReadForm : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        YZRequest request = new YZRequest(this.Context);
        string account = request.GetString("Account", null);
        int tid = request.GetInt32("tid");
        string readFormToken = request.GetString("readFormToken", null);

        if (!String.IsNullOrEmpty(account) && !String.IsNullOrEmpty(readFormToken))
        {
            if (YZSecurityHelper.CheckReadFormToken(account, tid, readFormToken))
                YZAuthHelper.SetAuthCookie(account);
        }

        if (!YZAuthHelper.IsAuthenticated)
        {
            FormsAuthentication.RedirectToLoginPage();
            return;
        }

        string formFile;
        BPMTask task;
        using (BPMConnection cn = new BPMConnection())
        {
            cn.WebOpen();
            formFile = BPMProcess.GetTaskReadForm(cn, tid);
            task = BPMTask.Load(cn, tid);
        }

        if (String.IsNullOrEmpty(formFile))
        {
            throw new Exception(Resources.YZStrings.Aspx_Read_MissForm);
        }
        else
        {
            YZUrlBuilder urlBuilder = YZUtility.GetFormRedirectUrl(formFile);
            foreach (string key in this.Request.QueryString.Keys)
                urlBuilder.QueryString[key] = this.Request.QueryString[key];

            if (!String.IsNullOrEmpty(task.UrlParams))
            {
                JObject urlParams = JObject.Parse(task.UrlParams);
                foreach (KeyValuePair<string, JToken> jProperty in urlParams)
                {
                    if (jProperty.Value is JObject)
                        urlBuilder.QueryString[jProperty.Key] = Convert.ToString(jProperty.Value);
                }
            }

            this.Response.Redirect(urlBuilder.ToString(), true);
        }
    }
}