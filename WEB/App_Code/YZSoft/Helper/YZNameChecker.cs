using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Collections.Generic;
using System.Text;
using BPM;
using BPM.Client;
using BPM.Client.Data.Common;
using System.Globalization;
using System.Text.RegularExpressions;

/// <summary>
/// StringHelper 的摘要说明

/// </summary>
public class YZNameChecker
{
    static Regex appName = new Regex(@"^[a-zA-Z0-9|\|/]+$");
    static Regex methodName = new Regex(@"^[a-zA-Z0-9]+$");

    public static bool IsValidAppName(string name)
    {
        if (String.IsNullOrEmpty(name))
            return false;

        return YZNameChecker.appName.IsMatch(name);
    }

    public static bool IsValidMethodName(string name)
    {
        if (String.IsNullOrEmpty(name))
            return false;

        return YZNameChecker.methodName.IsMatch(name);
    }
}
