using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Data.SqlClient;
using System.Globalization;
using System.Text;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;
using YZSoft.Web.Notify;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public partial class BPM_Default : System.Web.UI.Page 
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (this.Request.Params["Method"] == "GetLoginUserInfo")
        {
            try
            {
                //获得帐号信息
                string uid = YZAuthHelper.LoginUserAccount;
                User user = new User();
                int total = 0;
                int worklist = 0;
                int sharetask = 0; 
                int userLevel = 10;
                UserCommonInfo userCommonInfo = null;
                DataTable tableNewMessages;

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    //获得当前用户
                    user.Open(cn, uid);
                    total = cn.GetMyTaskCount(out worklist, out sharetask);
                    userCommonInfo = UserCommonInfo.FromAccount(cn, uid);

                    MemberCollection positions = OrgSvr.GetUserPositions(cn, uid);
                    foreach (Member member in positions)
                    {
                        if (member.Level > userLevel)
                            userLevel = (int)member.Level;
                    }
                }

                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {
                        tableNewMessages = YZSoft.Web.Notify.NotifyManager.GetNotifyNewMessageCount(provider, cn, uid, 30);
                    }
                }

                JObject userInfo = new JObject();
                userInfo["LCID"] = YZLangHelper.CurrentCulture.LCID;
                userInfo["CompanyName"] = System.Web.Configuration.WebConfigurationManager.AppSettings["CompanyInfoCompanyName"];
                userInfo["Account"] = uid;
                userInfo["DisplayName"] = user.DisplayName;
                userInfo["ShortName"] = user.ShortName;
                userInfo["TaskCount"] = total;
                userInfo["WorkListCount"] = worklist;
                userInfo["ShareTaskCount"] = sharetask;
                userInfo["NewMessages"] = JArray.FromObject(tableNewMessages);
                userInfo["UserLevel"] = userLevel;
                userInfo["Leave"] = userCommonInfo.OutOfOfficeState == OutOfOfficeState.InOffice ? false : true;

                JObject outOfOfficeSetting = new JObject();
                outOfOfficeSetting["State"] = userCommonInfo.OutOfOfficeState.ToString();
                outOfOfficeSetting["From"] = userCommonInfo.OutOfOfficeFrom;
                outOfOfficeSetting["To"] = userCommonInfo.OutOfOfficeTo;
                userInfo["OutOfOfficeSetting"] = outOfOfficeSetting;

                userInfo["Link1"] = System.Web.Configuration.WebConfigurationManager.AppSettings["CompanyInfoLink1"];
                userInfo["DBType"] = YZDbProviderManager.DBProviderName != "SQL Server" ? YZDbProviderManager.DBProviderName : "";
                userInfo["UnreadMessageCount"] = 0;
                userInfo["ClientRequestState"] = YZAuthHelper.GetCookieStringForClientRequest();
                userInfo["emipUrl"] = YZSetting.emipUrl;

                //没有site参数,或site参数不正确
                int factoryId = 0;
                Int32.TryParse(this.Request.QueryString["site"], out factoryId);
                userInfo["site"] = factoryId;

                //设置Cookie
                HttpCookie cookie;
                cookie = new HttpCookie("UserDisplayName", HttpUtility.UrlEncode(Convert.ToString(userInfo["DisplayName"]), System.Text.Encoding.UTF8));
                this.Response.SetCookie(cookie);
                cookie = new HttpCookie("UserLevel", userLevel.ToString());
                this.Response.SetCookie(cookie);

                JObject rv = new JObject();
                rv["success"] = true;
                rv["userInfo"] = userInfo;

                this.Response.Clear();
                this.Response.Write(rv.ToString(Formatting.Indented,YZJsonHelper.Converters));
            }
            catch (Exception exp)
            {
                JObject rv = new JObject();
                rv["success"] = false;
                rv["errorMessage"] = exp.Message;

                this.Response.Clear();
                this.Response.Write(rv.ToString());
            }
            this.Response.End();
        }

        Response.Charset = "UTF-8";
        Response.AddHeader("P3P", "CP=CAO PSA OUR"); //无此行当在ie的iframe中打开应用(default.aspx.cs)时设置cookie后，ajax request时cookie没了

        this.Response.Cache.SetCacheability(HttpCacheability.NoCache);

        //缓冲加载时注释以下行
        if (!YZAuthHelper.IsAuthenticated)
        {
            FormsAuthentication.RedirectToLoginPage();
            return;
        }

        using (BPMConnection cn = new BPMConnection())
        {
            try
            {
                cn.WebOpen();
            }
            catch (Exception)
            {
                FormsAuthentication.RedirectToLoginPage();
                return;
            }

            try
            {
                cn.LicValidCheck();
            }
            catch (Exception exp)
            {
                YZUrlBuilder url = YZUrlBuilder.FromPath("~/YZSoft/core/LicError/Default.aspx");
                url.QueryString["message"] = exp.Message;
                Server.Transfer(url.ToString(), false);
            }
        }

        //设置页标题
        this.Page.Title = System.Web.Configuration.WebConfigurationManager.AppSettings["CompanyInfoDefaultPageTitle"];
        if (String.IsNullOrEmpty(this.Page.Title))
            this.Page.Title = Resources.YZStrings.Aspx_DefaultPage_Title;
    }

    public string StartApp
    {
        get
        {
            string startApp = this.Request.QueryString["StartApp"];

            if (String.IsNullOrEmpty(startApp))
                startApp = System.Web.Configuration.WebConfigurationManager.AppSettings["StartApp"];
            if (String.IsNullOrEmpty(startApp))
                startApp = "BPM2018/BPM/Portal";

            if (!YZNameChecker.IsValidAppName(startApp))
                throw new Exception("Invalid start app");

            return startApp;
        }
    }

    public string IsAuthenticated
    {
        get
        {
            return YZAuthHelper.IsAuthenticated.ToString().ToLower();
        }
    }
}
