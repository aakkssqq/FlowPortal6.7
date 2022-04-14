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
    public class MergeField
    {
        public string TableName { get; set; }
        public string ColumnName { get; set; }
        public bool isArray { get; set; }
        public string Render { get; set; }
    }
}