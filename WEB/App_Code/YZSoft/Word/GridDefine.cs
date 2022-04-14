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
    public class GridDefine
    {
        public string TableName { get; set; }
        public int StartRowIndex { get; set; }
        public int EndRowIndex { get; set; }
        private List<XWPFTableRow> _templates;

        public List<XWPFTableRow> Templates
        {
            get
            {
                if (this._templates == null)
                    this._templates = new List<XWPFTableRow>();

                return this._templates;
            }
            set
            {
                this._templates = value;
            }
        }
    }
}