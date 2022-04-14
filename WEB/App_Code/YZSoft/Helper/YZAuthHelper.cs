using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Web.Configuration;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;

public class YZAuthHelper
{
    #region 验证检测、集成

    public static bool IsAuthenticated
    {
        get
        {
            //网站维护模式
            if (String.Compare(System.Web.Configuration.WebConfigurationManager.AppSettings["ShowMaintenancePage"], "true", true) == 0)
                return false;
            
            HttpContext context = HttpContext.Current;

            //1.与第三方系统集成验证检测（应在检测通过后，设置认证Cookie）
            //string token = context.Request.Params["token"];
            //if (!String.IsNullOrEmpty(token))       //检测验证信息
            //{
            //    string uid = token;               //解密token或使用token到认证中心认证获得uid
            //    YZAuthHelper.SetAuthCookie(uid);  //设置Cookie
            //}

            //2.检查Windows认证
            if (context.User.Identity.IsAuthenticated)
                return true;

            //3.检查FormsAuthCookie
            HttpCookie authCookie = context.Request.Cookies[FormsAuthentication.FormsCookieName];
            if (authCookie != null)
            {
                try
                {
                    FormsAuthenticationTicket ticket = FormsAuthentication.Decrypt(authCookie.Value);
                    FormsIdentity identity = new FormsIdentity(ticket);
                    if (identity.IsAuthenticated)
                        return true;
                }
                catch
                {
                    return false;
                }
            }

            return false;
        }
    }

    public static string LoginUserAccount
    {
        get
        {
            HttpContext context = HttpContext.Current;

            //1.从FormsAuthCookie获得登录用户
            HttpCookie authCookie = null;

            //提取Cookie
            //a.获得Response中的验证Cookie
            foreach (string key in context.Response.Cookies.AllKeys)
            {
                if (String.Compare(key, FormsAuthentication.FormsCookieName, true) == 0)
                {
                    authCookie = context.Response.Cookies[key];
                    break;
                }
            }

            //b.获得Request中的验证Cookie
            if (authCookie == null)
                authCookie = context.Request.Cookies[FormsAuthentication.FormsCookieName];

            //从Cookie中提取用号信息
            if (authCookie != null && !String.IsNullOrEmpty(authCookie.Value))
            {
                try
                {
                    FormsAuthenticationTicket ticket = FormsAuthentication.Decrypt(authCookie.Value);
                    return ticket.Name;
                }
                catch
                {
                    return String.Empty;
                }
            }

            //2.从Windows认证获得登录用户
            if (context.User.Identity.IsAuthenticated)
                return context.User.Identity.Name;

            return String.Empty;
        }
    }

    #endregion

    #region 设置、清除验证信息

    //请确保Web.Config中的 SecurityKey和服务器端一致，否则验证通不过。
    public static void SetAuthCookie(string account)
    {
        DateTime cookieIssuedDate = DateTime.Now;
        var ticket = new FormsAuthenticationTicket(100,
            account,
            cookieIssuedDate,
            cookieIssuedDate.AddMinutes(FormsAuthentication.Timeout.TotalMinutes),
            false,
            "",
            FormsAuthentication.FormsCookiePath);

        string cookieValue = FormsAuthentication.Encrypt(ticket);

        HttpContext.Current.Response.Cookies.Remove(FormsAuthentication.FormsCookieName);
        SetCookie(HttpContext.Current.Response, FormsAuthentication.FormsCookieName, cookieValue);
    }

    public static void SetAuthCookie(string account, string token)
    {
        DateTime cookieIssuedDate = DateTime.Now;
        var ticket = new FormsAuthenticationTicket(100,
            account,
            cookieIssuedDate,
            cookieIssuedDate.AddMinutes(FormsAuthentication.Timeout.TotalMinutes),
            false,
            token,
            FormsAuthentication.FormsCookiePath);

        string cookieValue = FormsAuthentication.Encrypt(ticket);

        HttpContext.Current.Response.Cookies.Remove(FormsAuthentication.FormsCookieName);
        SetCookie(HttpContext.Current.Response, FormsAuthentication.FormsCookieName, cookieValue);
    }

    public static string GetCookieStringForClientRequest()
    {
        return String.Format("{0}={1};",
            FormsAuthentication.FormsCookieName,
            Acctout2FormAuthCookie(YZAuthHelper.LoginUserAccount));
    }

    public static void ClearAuthCookie()
    {
        FormsAuthentication.SignOut();
    }

    public static void SignOut()
    {
        LoginManager.OnSignOut();
        FormsAuthentication.SignOut();
    }

    public static void ClearLogoutFlag()
    {
        HttpContext context = HttpContext.Current;
        ClearCookie(context.Response, "_bpm_logout_type");
        ClearCookie(context.Response, "_bpm_logout_lastaccount");
    }

    public static void SetLogoutFlag(string type, string lastaccount)
    {
        HttpContext context = HttpContext.Current;
        SetCookie(context.Response, "_bpm_logout_type", type);
        SetCookie(context.Response, "_bpm_logout_lastaccount", lastaccount);
    }

    public static void SetLangSession(int lcid)
    {
        HttpContext context = HttpContext.Current;
        SetCookie(context.Response, "yz-lcid", lcid.ToString());
    }

    public static void SetLangPersistent(int lcid)
    {
        HttpContext context = HttpContext.Current;
        HttpCookie cookie = new HttpCookie("yz-lcid", lcid.ToString());
        cookie.Expires = DateTime.Now + TimeSpan.FromDays(365);
        cookie.HttpOnly = true;
        context.Response.SetCookie(cookie);
    }

    public static string BPMLogoutType
    {
        get
        {
            return GetCookie(HttpContext.Current.Request, "_bpm_logout_type", "");
        }
    }

    public static string BPMLogoutLastAccount
    {
        get
        {
            return GetCookie(HttpContext.Current.Request, "_bpm_logout_lastaccount", "");
        }
    }

    #endregion

    #region ashx页面验证检测、抛错

    public static void AshxAccessCheck(HttpContext context)
    {
        //if (!String.IsNullOrEmpty(context.Request.UserAgent))  //从网站访问，而非从服务访问
        //{
        //    string referHost = context.Request.UrlReferrer != null ? context.Request.UrlReferrer.Host : null;
        //    if (referHost != null)
        //        referHost = referHost.Trim();

        //    if (String.IsNullOrEmpty(referHost))
        //    {
        //        string path = context.Server.MapPath("~/YZSoft/core/bpm-touch-all.js");
        //        if (System.IO.File.Exists(path)) //EMIP网站
        //            return;
        //        else  //BPM网站
        //            throw new Exception("access denied!");
        //    }

        //    if (String.Compare(context.Request.Url.Host, referHost, true) != 0)
        //        throw new Exception("access denied!");
        //}
    }

    public static void AshxAuthCheck()
    {
        AshxAuthCheck(true);
    }

    public static void AshxAuthCheck(bool checkLogin)
    {
        if (String.Compare(System.Web.Configuration.WebConfigurationManager.AppSettings["ShowMaintenancePage"], "true", true) == 0)
        {
            HttpContext.Current.Response.StatusCode = 500;

            JObject rv = new JObject();
            rv["success"] = false;
            rv["errorCode"] = 100;

            HttpContext.Current.Response.Clear();
            HttpContext.Current.Response.Write(rv.ToString());
            HttpContext.Current.Response.End();
        }
        else if (checkLogin && !YZAuthHelper.IsAuthenticated)
        {
            HttpContext.Current.Response.StatusCode = 200;

            JObject rv = new JObject();
            rv["success"] = false;
            rv["errorCode"] = 101;
            rv["errorMessage"] = Resources.YZStrings.Aspx_LoginTimeout;

            HttpContext.Current.Response.Clear();
            HttpContext.Current.Response.Write(rv.ToString());
            HttpContext.Current.Response.End();
        }
    }

    #endregion

    #region 内部方法

    private static void SetCookie(HttpResponse response, string key, string value)
    {
        HttpCookie cookie = new HttpCookie(key, value);
        cookie.HttpOnly = true;
        response.SetCookie(cookie);
    }

    private static void ClearCookie(HttpResponse response, string key)
    {
        HttpCookie cookie = new HttpCookie(key, "");
        cookie.HttpOnly = true;
        cookie.Expires = new DateTime(0x7cf, 10, 12);
        response.Cookies.Remove(key);
        response.Cookies.Add(cookie);
    }

    private static string GetCookie(HttpRequest request, string key, string defaultValue)
    {
        HttpCookie cookie = request.Cookies[key];

        string value;
        if (cookie != null && cookie.Value != null)
            value = cookie.Value;
        else
            value = defaultValue;

        if (value == null)
            value = String.Empty;

        return value;
    }

    #endregion

    #region 加解密

    public static string Acctout2FormAuthCookie(string account)
    {
        HttpCookie authCookie = FormsAuthentication.GetAuthCookie(account, false);
        return authCookie.Value;
    }

    #endregion

    #region 配置信息

    public static string BPMServerName
    {
        get
        {
            return WebConfigurationManager.AppSettings["BPMServerName"];
        }
    }

    public static int BPMServerPort
    {
        get
        {
            int port = BPMConnection.DefaultPort;
            string strPort = WebConfigurationManager.AppSettings["BPMServerPort"];
            if (!String.IsNullOrEmpty(strPort))
            {
                try
                {
                    port = Int32.Parse(strPort);
                }
                catch (Exception)
                {
                    throw new Exception(String.Format("Incorrent prot:{0},Please check \"BPMServerPort\" value in web.config file", strPort));
                }
            }

            return port;
        }
    }

    #endregion
}