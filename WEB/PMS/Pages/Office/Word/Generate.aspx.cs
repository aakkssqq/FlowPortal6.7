using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using NPOI;
using NPOI.XWPF.UserModel;
using NPOI.OpenXmlFormats.Wordprocessing;
using Newtonsoft.Json.Linq;
using System.Data;
using YZSoft.Web.Word;

public partial class Demo_Office_Word_Generate : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        DataSet dataset = new DataSet();

        DataTable gTable = new DataTable("Global");
        dataset.Tables.Add(gTable);
        gTable.Columns.Add("ProcessName", typeof(string));
        DataRow gRow = gTable.NewRow();
        gTable.Rows.Add(gRow);
        gRow["ProcessName"] = "采购流程";

        DataTable dTable = new DataTable("Steps");
        dataset.Tables.Add(dTable);
        dTable.Columns.Add("Action", typeof(string));
        dTable.Columns.Add("Role", typeof(string));

        for (int i = 1; i < 5; i++)
        {
            DataRow row = dTable.NewRow();
            dTable.Rows.Add(row);
            row["Action"] = "action" + i.ToString();
            row["Role"] = "role" + i.ToString();
        }

        DataTable rTable = new DataTable("RelatedDocuments");
        dataset.Tables.Add(rTable);
        rTable.Columns.Add("FileName", typeof(string));
        rTable.Columns.Add("Desc", typeof(string));

        for (int i = 1; i < 5; i++)
        {
            DataRow row = rTable.NewRow();
            rTable.Rows.Add(row);
            row["FileName"] = "FileName" + i.ToString();
            row["Desc"] = "Desc" + i.ToString();
        }

        XWPFDocument doc = WordGenerator.Fill(Server.MapPath("SOP.docx"), dataset);

        using (FileStream sw = File.Create(@"d:\abc.docx"))
        {
            doc.Write(sw);
        }
    }
}