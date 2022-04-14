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
using System.Xml;

/// <summary>
/// YZPostDataHelper 的摘要说明
/// </summary>
public class YZPostDataHelper
{
    public static DataSet LoadPostData(Stream stream)
    {
        XmlDocument xmldoc = new XmlDocument { XmlResolver = null };
        xmldoc.Load(stream);

        XmlNode formNode = xmldoc.SelectSingleNode("XForm/FormData");
        return LoadPostData(formNode);
    }

    private static DataSet LoadPostData(XmlNode formNode)
    {
        DataSet ds = new DataSet();

        XmlNodeList tableList = formNode.ChildNodes;
        if (tableList == null)
            return ds;

        foreach (XmlNode tableNode in tableList)
        {
            string tableName = tableNode.Name;
            DataTable table = ds.Tables[tableName];
            if (table == null)
            {
                table = new DataTable(tableName);
                ds.Tables.Add(table);
            }

            XmlNodeList columnList = tableNode.ChildNodes;
            if (columnList == null)
                continue;

            DataRow row = table.NewRow();
            foreach (XmlNode columnNode in columnList)
            {
                string columnName = columnNode.Name;
                DataColumn column = table.Columns[columnName];
                if (column == null)
                {
                    column = new DataColumn(columnName);
                    column.DataType = typeof(string);
                    table.Columns.Add(column);
                }

                row[columnName] = columnNode.InnerText;
            }

            if (table.Columns.Count != 0)
                table.Rows.Add(row);
        }
        return ds;
    }
}
