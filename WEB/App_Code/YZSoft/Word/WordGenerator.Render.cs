using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using System.IO;
using System.Drawing;
using System.Reflection;
using System.Data;
using System.Data.SqlClient;
using NPOI;
using NPOI.XWPF.UserModel;
using NPOI.OpenXmlFormats.Wordprocessing;
using Newtonsoft.Json.Linq;

namespace YZSoft.Web.Word
{
    partial class WordGenerator
    {
        protected static void RenderDate(XWPFRun run, object value, DataRow row)
        {
            if (value is DateTime)
            {
                DateTime date = (DateTime)value;
                run.SetText(date.ToString("yyyy-MM-dd"));
            }
        }
    }
}