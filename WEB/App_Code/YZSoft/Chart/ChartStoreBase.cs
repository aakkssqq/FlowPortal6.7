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
public abstract class ChartStoreBase
{
    public abstract void Save(string id, byte[] data, string fileName, string blackImageFile);
    public abstract byte[] Load(string id, out string fileName, out string blackImageFile);
    public abstract void Delete(string id);
}
