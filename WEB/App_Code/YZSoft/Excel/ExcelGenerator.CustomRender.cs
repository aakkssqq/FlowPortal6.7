using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using System.IO;
using System.Drawing;
using System.Reflection;
using BPM;
using YZNPOI.HSSF.Util;
using YZNPOI.HSSF.UserModel;
using YZNPOI.HSSF.Model;
using YZNPOI.HSSF.Record;
using YZNPOI.HSSF.Record.Aggregates;
using YZNPOI.HSSF.Record.Chart;
using YZNPOI.POIFS.FileSystem;
using YZNPOI.SS.UserModel;
using YZNPOI.SS.Util;
using YZNPOI.SS.Formula;
using YZNPOI.SS.Formula.PTG;
using System.Data;
using System.Data.SqlClient;
using Newtonsoft.Json.Linq;

/// <summary>
///用户自定义显示函数(Render)
///产品发布、升级时，不会覆盖此文件
/// </summary>
namespace YZSoft.Web.Excel
{
    partial class ExcelGenerator
    {
        protected static void TimeSpanRender1(HSSFCell cell, string varName, DataSet dataset, object value, string emptyText)
        {
            value = YZStringHelper.MinutesToStringDHM(Convert.ToInt32(value));
            DefaultRender(cell, varName, dataset, value, emptyText);
        }
    }
}