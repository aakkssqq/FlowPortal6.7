<%@ WebHandler Language="C#" Class="YZDemoServices" %>

using System;
using System.Web;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Collections;
using System.Collections.Generic;

public class YZDemoServices : YZServiceHandler
{
    public decimal Calc(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        decimal price = request.GetDecimal("price", 0);
        decimal qty = request.GetDecimal("qty", 0);

        return price * qty;
    }
}