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
    public class LoopDefine
    {
        public string Identify { get; set; }
        public XWPFParagraph StartParagraph { get; set; }
        public XWPFParagraph EndParagraph { get; set; }
        public string TableName { get; set; }
        private List<XWPFParagraph> _templates;

        public List<XWPFParagraph> Templates
        {
            get
            {
                if (this._templates == null)
                    this._templates = new List<XWPFParagraph>();

                return this._templates;
            }
            set
            {
                this._templates = value;
            }
        }
    }
}