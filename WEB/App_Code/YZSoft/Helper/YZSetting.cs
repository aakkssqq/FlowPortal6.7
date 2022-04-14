using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
///YZSetting 的摘要说明
/// </summary>
public static class YZSetting
{
    public static bool JSCache { get; set; }
    public static string JSVersion { get; set; }
    public static bool Debug { get; set; }
    public static string UserDataPath { get; set; }
    public static string emipUrl { get; set; }
    public static string Theme { get; set; }

    public static string WEBDB { get; set; }

    static YZSetting()
    {
        YZSetting.JSCache = String.Compare(System.Web.Configuration.WebConfigurationManager.AppSettings["JSCache"], "false", true) == 0 ? false : true;

        YZSetting.JSVersion = System.Web.Configuration.WebConfigurationManager.AppSettings["JSVersion"];
        if (String.IsNullOrEmpty(YZSetting.JSVersion))
            YZSetting.JSVersion = "5.00.000";

        YZSetting.Debug = String.Compare(System.Web.Configuration.WebConfigurationManager.AppSettings["Debug"], "true", true) == 0;

        YZSetting.UserDataPath = System.Web.Configuration.WebConfigurationManager.AppSettings["UserDataPath"];
        if (String.IsNullOrEmpty(YZSetting.UserDataPath))
            YZSetting.UserDataPath = "~/UserData";

        YZSetting.emipUrl = System.Web.Configuration.WebConfigurationManager.AppSettings["emipUrl"];

        YZSetting.Theme = System.Web.Configuration.WebConfigurationManager.AppSettings["Theme"];
        if (String.IsNullOrEmpty(YZSetting.Theme))
            YZSetting.Theme = "win10";

        if (System.Web.Configuration.WebConfigurationManager.ConnectionStrings["WEBDB"] != null)
            YZSetting.WEBDB = System.Web.Configuration.WebConfigurationManager.ConnectionStrings["WEBDB"].ConnectionString;
    }
}