using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Configuration;
using System.Data;
using System.Web.UI.HtmlControls;
using System.Text;
using System.Reflection;
using System.Resources;
using System.Web.Security;
using System.Security.Cryptography;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM.Client;
using YZSoft.Web.DAL;

public partial class YZSoft_Login_2020_Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        HttpContext context = this.Context;
        YZRequest request = new YZRequest(context);
        string method = request.GetString("method",request.GetString("action", "Default"));

        Type type = this.GetType();
        System.Reflection.MethodInfo methodcall = type.GetMethod(method, System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Public, null, new Type[] {}, null);
        if (methodcall == null)
        {
            this.Default();
        }
        else
        {
            methodcall.Invoke(this, new object[] { });
        }
    }

    public void Default()
    {
        bool webLogin = String.Compare(WebConfigurationManager.AppSettings["WebLoginEnable"], "false", true) == 0 ? false : true;
        bool ntLogin = String.Compare(WebConfigurationManager.AppSettings["NTLoginEnable"], "false", true) == 0 ? false : true;

        this._btnLogin.InnerHtml = Resources.YZStrings.Aspx_Login_BtnLogin;
        this._btnLoginNT.InnerHtml = Resources.YZStrings.Aspx_Login_BtnNTLogin;

        //copyright行的多语言
        //this._copyright.InnerHtml = Resources.YZStrings.Aspx_login_Copyright;

        //跳转到单点登录
        string ssoUrl = this.ssoUrl;
        string ssoReturnUrlParamName = this.ssoReturnUrlParamName;
        if (!String.IsNullOrEmpty(ssoUrl))
        {
            YZUrlBuilder url = YZUrlBuilder.FromPath(ssoUrl);
            url.QueryString[ssoReturnUrlParamName] = this.ReturnUrl;

            Response.Redirect(url.ToString(), true);
        }

        //页标题
        this.Page.Title = System.Web.Configuration.WebConfigurationManager.AppSettings["CompanyInfoLoginPageTitle"];
        if (String.IsNullOrEmpty(this.Page.Title))
            this.Page.Title = Resources.YZStrings.Aspx_Login_Title;

        //根据启动程序应用Css
        string startApp = System.Web.Configuration.WebConfigurationManager.AppSettings["StartApp"];
        if (String.IsNullOrEmpty(startApp))
            startApp = "2020/BPM";

        string[] paths = startApp.Split(new char[] { '/', '\\' });
        string cssfile = String.Format("../../../{0}/login.css", paths[0]);
        if (paths.Length >= 1 && System.IO.File.Exists(Server.MapPath(cssfile)))
            this._litLoginCss.Text = String.Format("<link href=\"{0}\" rel=\"stylesheet\" type=\"text/css\" />", cssfile);

        //初始化画面
        List<string> pnlCls = new List<string>();
        pnlCls.Add(this._pnlLogin.Attributes["class"]);

        this._txtUid.Attributes["placeholder"] = Resources.YZStrings.Aspx_Login_Placeholder_Account;
        this._txtPwd.Attributes["placeholder"] = Resources.YZStrings.Aspx_Login_Placeholder_Password;

        if (!webLogin)
        {
            this._txtUid.Disabled = true;
            this._txtPwd.Disabled = true;
            this._btnLogin.Disabled = true;
            pnlCls.Add("web-login-denied");
        }

        if (!ntLogin)
        {
            this._btnLoginNT.Disabled = true;
            pnlCls.Add("nt-login-denied");
        }

        this._pnlLogin.Attributes["class"] = String.Join(" ", pnlCls.ToArray());
    }

    public void Login()
    {
        YZRequest request = new YZRequest(this.Context);
        string uid = request.GetString("uid",null);
        string pwd = request.GetString("uep",null);
        string keystore = request.GetString("keystore", null);

        JObject rv = new JObject();

        if (String.IsNullOrEmpty(uid) /*|| String.IsNullOrEmpty(pwd)*/)
        {
            rv[YZJsonProperty.success] = false;
            rv["errorMessage"] = Resources.YZStrings.Aspx_Login_EnterAccountTip;
        }
        else
        {
            try
            {
                string realAccount;
                string token;

                //用私钥解密
                if (!String.IsNullOrEmpty(keystore))
                {
                    string privateKey = (string)YZTempStorageManager.CurrentStore.Load(keystore);

                    RSACryptoServiceProvider rsaProvider = new RSACryptoServiceProvider(1024);
                    rsaProvider.FromXmlString(privateKey);

                    uid = System.Text.Encoding.UTF8.GetString(rsaProvider.Decrypt(Convert.FromBase64String(uid), false));
                    pwd = System.Text.Encoding.UTF8.GetString(rsaProvider.Decrypt(Convert.FromBase64String(pwd), false));
                }

                if (BPMConnection.Authenticate(YZAuthHelper.BPMServerName, YZAuthHelper.BPMServerPort, uid, pwd, out realAccount, out token))
                {
                    YZAuthHelper.SetAuthCookie(realAccount, token);
                    YZAuthHelper.ClearLogoutFlag();

                    rv[YZJsonProperty.success] = true;
                    rv["errorMessage"] = Resources.YZStrings.Aspx_Login_Success;
                }
                else
                {
                    rv[YZJsonProperty.success] = false;
                    rv["errorMessage"] = Resources.YZStrings.Aspx_Login_Fail;
                }
            }
            catch (Exception exp)
            {
                YZEventLog log = new YZEventLog();
                log.WriteEntry(exp);

                rv[YZJsonProperty.success] = false;
                rv["errorMessage"] = exp.Message;
            }
        }

        this.Response.Clear();
        this.Response.Write(rv.ToString(Formatting.Indented, YZJsonHelper.Converters));
        this.Response.End();
    }

    public void LoginNT()
    {
        YZRequest request = new YZRequest(this.Context);
        JObject rv = new JObject();

        try
        {
            if (this.NTLoginInternal())
            {
                rv[YZJsonProperty.success] = true;
                rv["text"] = Resources.YZStrings.Aspx_Login_Success;
            }
        }
        catch (Exception exp)
        {
            rv[YZJsonProperty.success] = false;
            rv["text"] = exp.Message;
        }

        if (rv["success"] != null)
        {
            this.Response.Clear();
            this.Response.Write(rv.ToString(Formatting.Indented,YZJsonHelper.Converters));
            this.Response.End();
        }
        else
        {
            this.Response.Clear();
            this.Response.Status = "401 Unauthorized";
            this.Response.AppendHeader("WWW-Authenticate", "NTLM");//Basic, Digest, NTLM, and Negotiate
            this.Response.End();
        }
    }

    public void logout()
    {
        try
        {
            YZAuthHelper.SignOut();
        }
        catch (Exception)
        {
            //捕获 FormsAuthentication.SignOut()中的重定向
        }
        finally
        {
            YZAuthHelper.SetLogoutFlag("logout", String.Empty);

            YZUrlBuilder url = YZUrlBuilder.FromPath(FormsAuthentication.LoginUrl);
            url.QueryString["ReturnUrl"] = this.ReturnUrl;
            this.Response.Redirect(url.ToString(), true);
        }
    }

    public virtual void SetLanguage()
    {
        YZRequest request = new YZRequest(this.Context);
        int lcid = request.GetInt32("lcid");
        YZAuthHelper.SetLangPersistent(lcid);

        this.Response.Clear();
        JObject rv = new JObject();
        rv["success"] = true;
        this.Response.Write(rv.ToString(Formatting.Indented, YZJsonHelper.Converters));
        this.Response.End();
    }

    public virtual void GetPublicKey()
    {
        RSACryptoServiceProvider rsaProvider = new RSACryptoServiceProvider(1024);
        string publicKey = rsaProvider.ToXmlString(false);
        string privateKey = rsaProvider.ToXmlString(true);

        string keystore = YZTempStorageManager.CurrentStore.Save(privateKey);
        string publicKeyPKCS = YZSecurityHelper.RSAPublicKeyDotNet2PCKS(publicKey);

        JObject rv = new JObject();
        rv["success"] = true;
        rv["publicKey"] = publicKeyPKCS;
        rv["keystore"] = keystore;
        this.Response.Write(rv.ToString(Formatting.Indented, YZJsonHelper.Converters));
        this.Response.End();
    }

    public bool NtOnly
    {
        get
        {
            bool webLogin = String.Compare(WebConfigurationManager.AppSettings["WebLoginEnable"], "false", true) == 0 ? false : true;
            bool ntLogin = String.Compare(WebConfigurationManager.AppSettings["NTLoginEnable"], "false", true) == 0 ? false : true;

            return (ntLogin && !webLogin); //仅NT登录
        }

    }
    public string ReturnUrl
    {
        get
        {
            string returnUrl = String.Empty;
            if (!String.IsNullOrEmpty(Request.QueryString["ReturnURL"]))
                returnUrl = this.ResolveClientUrl(Request.QueryString["ReturnURL"]);
            else
                returnUrl = this.ResolveClientUrl("~/");

            return returnUrl;
        }
    }

    public string ssoReturnUrlParamName
    {
        get
        {
            string ssoReturnUrlParamName = WebConfigurationManager.AppSettings["ssoReturnUrlParamName"];
            if (String.IsNullOrEmpty(ssoReturnUrlParamName))
                ssoReturnUrlParamName = "ReturnUrl";

            return ssoReturnUrlParamName;
        }
    }

    public string ssoUrl
    {
        get
        {
            return WebConfigurationManager.AppSettings["ssoUrl"];
        }
    }

    public string LanguageSwitchHtml
    {
        get
        {
            string[] strLcids = Resources.YZStrings.All_Languages.Split(new char[] { ',', ';' });
            Type resType = typeof(Resources.YZStrings);
            ResourceManager mgr = new ResourceManager(resType.FullName, resType.Assembly);
            List<String> langs = new List<string>();
            foreach (string strLcid in strLcids)
            {
                string resName = "All_Languages_" + strLcid;
                string langName = mgr.GetString(resName);
                bool current = String.Compare(langName, Resources.YZStrings.All_Languages_Cur, 0) == 0;

                langs.Add(String.Format("<span class=\"lang-item {0}\" lcid=\"{1}\">{2}</span>", current ? "selected" : "", strLcid, langName));
            }

            return String.Join("<span class=\"lang-sp\">|</span>", langs.ToArray());
        }
    }

    private bool NTLoginInternal()
    {
        string account = this.Request.ServerVariables["LOGON_USER"];
        bool isAuthenticated = YZAuthHelper.IsAuthenticated;
        string loginUserAccount = YZAuthHelper.LoginUserAccount;

        if (!String.IsNullOrEmpty(account))
        {
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpenAnonymous();
                string regularAccount = null;
                if (BPM.Client.User.IsAccountExist(cn, account, ref regularAccount) &&
                    String.Compare(YZAuthHelper.BPMLogoutLastAccount, regularAccount, true) != 0)
                {
                    YZAuthHelper.SetAuthCookie(regularAccount);
                    YZAuthHelper.ClearLogoutFlag();

                    return true;
                }
                else
                {
                    YZAuthHelper.ClearLogoutFlag();
                }
            }
        }

        return false;
    }
}