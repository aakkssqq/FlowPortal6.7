using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

/// <summary>
/// ChartManager 的摘要说明

/// </summary>
public class ChartManager
{
    private static ChartStoreBase _chartStore = new MemoryChartStore(30);
    public static object abc = null;

    public static ChartStoreBase CurrentStore
    {
        get
        {
            return ChartManager._chartStore;
        }
    }
}
