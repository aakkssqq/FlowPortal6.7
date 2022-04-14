using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Runtime.Serialization.Json;
using System.IO;
using System.Text;
using System.Globalization;

public class YZJsonProperty
{
    public const string total = "total";
    public const string children = "children";
    public const string success = "success";
    public const string errorMessage = "errorMessage";
    public const string processedItems = "processedItems";
    public const string metaData = "metaData";
}
