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
/// GridPageInfo 的摘要说明

/// </summary>
public class GridPageInfo
{
    private int _start = -1;
    private int _limit = -1;
    private HttpContext _context = null;

    public GridPageInfo(HttpContext context)
	{
        this._context = context;
	}

    public int Start
    {
        get
        {
            if (this._start == -1)
            {
                if (String.IsNullOrEmpty(this._context.Request.Params["start"]))
                    this._start = 0;
                else
                    this._start = Int32.Parse(this._context.Request.Params["start"]);
            }

            return this._start;
        }
    }

    public int Limit
    {
        get
        {
            if (this._limit == -1)
            {
                if (String.IsNullOrEmpty(this._context.Request.Params["limit"]))
                    this._limit = 25;
                else
                    this._limit = Int32.Parse(this._context.Request.Params["limit"]);
            }

            return this._limit;
        }
    }

    public int RowNumStart
    {
        get
        {
            return this.Start + 1;
        }
    }

    public int RowNumEnd
    {
        get
        {
            return this.Start + this.Limit;
        }
    }
}
