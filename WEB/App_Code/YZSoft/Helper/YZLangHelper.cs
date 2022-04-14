using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Globalization;

/// <summary>
/// LangHelper 的摘要说明

/// </summary>
public class YZLangHelper
{
    public static CultureInfo CurrentCulture
    {
        get
        {
            CultureInfo cultureInfo = System.Threading.Thread.CurrentThread.CurrentUICulture;

            try //非特定语言，例如LCID=4，访问NumberFormat属性会引发异常
            {
                if (cultureInfo.NumberFormat.NumberDecimalSeparator != ".")
                    cultureInfo = new CultureInfo(1033);//en-us
            }
            catch (Exception)
            {
            }

            return cultureInfo;
        }
    }
}
