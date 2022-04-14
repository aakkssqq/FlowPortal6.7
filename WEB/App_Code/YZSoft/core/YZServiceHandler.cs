using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using System.Web.Security;
using GleamTech.Reflection;
using System.Dynamic;

/// <summary>
///YZServiceHandler 的摘要说明
/// </summary>
public class YZServiceHandler : IHttpHandler
{
    public bool Simulate { get; set; }
    public string SimulateAccount { get; set; }

    public virtual void ProcessRequest(HttpContext context)
    {
        this.AshxAccessCheck(context);
        this.AuthCheck(context);

        YZRequest request = new YZRequest(context);

        //模拟仿真信息
        string simulateAuthcookie = request.GetString("stk", null);
        if (!String.IsNullOrEmpty(simulateAuthcookie))
        {
            try
            {
                FormsAuthenticationTicket ticket = FormsAuthentication.Decrypt(simulateAuthcookie);
                this.SimulateAccount = ticket.Name;
                this.Simulate = true;
            }
            catch
            {
            }
        }

        try
        {
            string method = request.GetString("Method");

            if (!YZNameChecker.IsValidMethodName(method))
                throw new Exception("Invalid method name");

            Type type = this.GetType();
            System.Reflection.MethodInfo methodcall = type.GetMethod(method,System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Public,null,new Type[] {typeof(HttpContext)},null);
            if (methodcall == null)
                throw new Exception(String.Format(Resources.YZStrings.Aspx_UnknowCommand, method));

            object rv;
            try
            {
                rv = methodcall.Invoke(this, new object[] { context });
            }
            catch(Exception exp)
            {
                throw exp.InnerException;
            }

            if (rv is JsonItem || rv is JsonItemCollection)
                throw new Exception("JsonItem/JsonItemCollection is Obsoleted, please replace with JObject/JArray");

            YZWebMethodMethodAttribute attr = methodcall.GetCustomAttribute<YZWebMethodMethodAttribute>();
            bool autoResponse = true;
            if (attr != null)
                autoResponse = attr.AutoResponse;

            if (autoResponse)
            {
                JToken jToken;
                if (rv == null)
                {
                    jToken = new JObject();
                    jToken["success"] = true;
                }
                else if (rv is JToken)
                {
                    jToken = rv as JToken;
                }
                else
                {
                    if (rv is string)
                        jToken = JValue.FromObject(rv);
                    else if (rv is ExpandoObject)
                        jToken = JValue.FromObject(rv);
                    else if (rv is IEnumerable)
                        jToken = JArray.FromObject(rv);
                    else
                        jToken = JValue.FromObject(rv);
                }

                if (context.Request.Params["DateFormat"] == "text")
                    context.Response.Write(jToken.ToString(Formatting.Indented));
                else
                    context.Response.Write(jToken.ToString(Formatting.Indented, request.Converters));
            }
        }
        catch (Exception e)
        {
            JObject rv = new JObject();
            rv["success"] = false;
            rv["errorMessage"] = HttpUtility.HtmlEncode(YZSetting.Debug ? String.Format("{0}.{1}\n{2}", this.GetType().FullName, context.Request.Params["method"], e.Message) : e.Message);
            context.Response.Write(rv.ToString(Formatting.Indented, request.Converters));
        }
    }

    protected virtual void AshxAccessCheck(HttpContext context)
    {
        YZAuthHelper.AshxAccessCheck(context);
    }

    protected virtual void AuthCheck(HttpContext context)
    {
        YZAuthHelper.AshxAuthCheck();
    }

    public virtual bool IsReusable
    {
        get
        {
            return true;
        }
    }

    public string ResolveUrl(HttpContext context,string relativeUrl)
    {
        string uri = context.Request.Url.AbsolutePath;
        int index = uri.LastIndexOf('/');
        string path = uri.Substring(0, index + 1) + relativeUrl;
        return path;
    }

    public void OpenConnection(BPMConnection cn,string bpmServer)
    {
        if (String.IsNullOrEmpty(bpmServer))
            cn.WebOpen();
        else
        {
            using (BPMConnection cn1 = new BPMConnection())
            {
                cn1.WebOpen();
                BPMServer server = BPMServer.OpenByName(cn1, bpmServer);
                cn.Open(server.CnnData);
            }
        }
    }

    public void ApproveCheck(HttpContext context)
    {
        if (!this.Simulate)
        {
            YZRequest request = new YZRequest(context);
            string openuid = request.GetString("uid", null);

            if (!String.IsNullOrEmpty(openuid) && !NameCompare.EquName(openuid, YZAuthHelper.LoginUserAccount))
                throw new Exception(Resources.YZStrings.Aspx_LoginUser_Changed);
        }
    }
}

public sealed class YZWebMethodMethodAttribute : Attribute
{
    public bool AutoResponse { get; set; }
}