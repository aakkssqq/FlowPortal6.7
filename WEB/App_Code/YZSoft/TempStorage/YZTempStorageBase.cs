using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.IO;

/// <summary>
/// ChartStoreBase 的摘要说明

/// </summary>
public abstract class YZTempStorageBase
{
    public abstract string Save(object data);
    public abstract object Load(string id);
    public abstract void Delete(string id);
}
