using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using BPM;
using BPM.Client;

/// <summary>
/// JsonItemCollection 的摘要说明

/// </summary>
public class JsonItemCollection : List<JsonItem>
{
    public void Applay(string compareAttr, JsonItem newitem)
    {
        string key = Convert.ToString(newitem.Attributes[compareAttr]);
        foreach (JsonItem item in this)
        {
            string itmkey = Convert.ToString(item.Attributes[compareAttr]);
            if (NameCompare.EquName(key, itmkey))
            {
                item.Applay(newitem, compareAttr);
            }
        }
    }

    public void SumColumn(string columnName, JsonItem resultItem, Type resultType)
    {
        decimal rv = 0;
        
        foreach (JsonItem item in this)
        {
            if (Object.ReferenceEquals(item, resultItem))
                continue;
         
            rv += Convert.ToDecimal(item.Attributes[columnName]);
        }

        resultItem.Attributes[columnName] = Convert.ChangeType(rv, resultType);
    }

    public void AppendToJsonString(StringBuilder sb)
    {
        sb.Append("[");

        bool firstChild = true;
        foreach (JsonItem item in this)
        {
            if (firstChild)
                firstChild = false;
            else
                sb.Append(",");

            item.AppendToJsonString(sb);
        }

        sb.Append("]");
    }

    public override string ToString()
    {
        StringBuilder sb = new StringBuilder();
        this.AppendToJsonString(sb);
        return sb.ToString();
    }
}
