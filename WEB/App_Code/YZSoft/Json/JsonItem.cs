using System;
using System.Data;
using System.Text;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Reflection;
using BPM;
using BPM.Client;

/// <summary>
/// JsonItem 的摘要说明



/// </summary>
public class JsonItem
{
    public string tagName = "Item";
    Dictionary<string, object> _attributes;

    public JsonItem()
    {
    }

    public JsonItem(object obj)
    {
        Type type = obj.GetType();
        PropertyInfo[] properties = type.GetProperties();
        foreach (PropertyInfo property in properties)
        {
            this[property.Name] = property.GetValue(obj, null);
        }
    }

    public JsonItem(string tagName)
    {
        this.tagName = tagName;
    }

    public JsonItem(BPMTask task)
    {
        this.Attributes["TaskID"] = task.TaskID;
        this.Attributes["SerialNum"] = task.SerialNum;
        this.Attributes["ProcessName"] = task.ProcessName;
    }

    public JsonItem(AttachmentInfo attachment)
    {
        this.Attributes["FileID"] = attachment.FileID;
        this.Attributes["Name"] = attachment.Name;
        this.Attributes["Ext"] = attachment.Ext;
        this.Attributes["Size"] = attachment.Size;
        this.Attributes["LastUpdate"] = YZStringHelper.DateToStringL(attachment.LastUpdate);
        this.Attributes["OwnerAccount"] = attachment.OwnerAccount;
    }

    public object this[string key]
    {
        get
        {
            return this.Attributes[key];
        }
        set
        {
            this.Attributes[key] = value;
        }
    }

    public void Applay(JsonItem itm, string ignoreAttr)
    {
        foreach (string attr in itm.Attributes.Keys)
        {
            if (NameCompare.EquName(attr, ignoreAttr))
                continue;

            this.Attributes[attr] = itm.Attributes[attr];
        }
    }

    public Dictionary<string, object> Attributes
    {
        get
        {
            if (this._attributes == null)
            {
                this._attributes = new Dictionary<string, object>(StringComparer.InvariantCultureIgnoreCase);
            }

            return this._attributes;
        }
    }

    public void AppendToJsonString(StringBuilder sb)
    {
        sb.Append("{");

        bool firstAttr = true;
        foreach (KeyValuePair<string, object> kv in this.Attributes)
        {
            if (firstAttr)
                firstAttr = false;
            else
                sb.Append(",");

            sb.Append("\"" + kv.Key + "\"");
            sb.Append(":");
            sb.Append(YZJsonHelper.ConvertToJsonValue(kv.Value));
        }

        sb.Append("}");
    }

    public void AppendToXmlString(StringBuilder sb)
    {
        sb.AppendLine("<" + this.tagName + ">");
        foreach (KeyValuePair<string, object> kv in this.Attributes)
        {
            sb.AppendLine(String.Format("<{0}>{1}</{0}>", kv.Key, YZJsonHelper.ConvertToXmlValue(kv.Value)));
        }
        sb.AppendLine("</" + this.tagName + ">");
    }

    public override string ToString()
    {
        StringBuilder sb = new StringBuilder();
        AppendToJsonString(sb);
        return sb.ToString();
    }

    public string ToXml(string tagName)
    {
        StringBuilder sb = new StringBuilder();
        sb.AppendLine("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
        this.tagName = tagName;
        AppendToXmlString(sb);
        return sb.ToString();
    }
}
