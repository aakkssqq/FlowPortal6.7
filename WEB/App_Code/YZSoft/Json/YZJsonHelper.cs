using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Runtime.Serialization.Json;
using System.IO;
using System.Text;
using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Json.Converters;
using System.Collections.Generic;

/// <summary>
/// SOAPHelper 的摘要说明

/// </summary>
/// 
public delegate bool JsonFindCompare(JObject jObject);

public class YZJsonHelper
{
    public static IFormatProvider JavaScriptFormat = new CultureInfo(1033);

    public static JsonSerializer Serializer
    {
        get
        {
            JsonSerializer serializer = new JsonSerializer();
            serializer.Converters.Add(new YZDateTimeConverter());
            serializer.Converters.Add(new YZStringConverter());
            return serializer;
        }
    }

    public static JsonConverter[] Converters
    {
        get
        {
            JsonConverter[] converters = new JsonConverter[2];
            converters[0] = new YZDateTimeConverter();
            converters[1] = new YZStringConverter();
            return converters;
        }
    }

    public static string Base64EmptyJArray
    {
        get
        {
            return "W10=";
        }
    }

    public static string Base64EmptyJObject
    {
        get
        {
            return "e30=";
        }
    }

    public static JObject GetTaskStateJObject(BPMConnection cn, TaskState state, int taskid)
    {
        JObject rv = new JObject();
        rv["State"] = state.ToString().ToLower();

        if (state == TaskState.Running)
        {
            JArray children = new JArray();
            rv.Add(YZJsonProperty.children, children);

            BPMStepCollection steps = BPMTask.GetUnFinishedHumanSteps(cn, taskid);
            foreach (BPMProcStep step in steps)
            {
                JObject item = new JObject();
                item["StepName"] = step.StepDisplayName;
                item["Share"] = step.Share;
                item["RecipientAccount"] = step.RecipientAccount;
                item["RecipientDisplayName"] = step.RecipientFullName;
                item["TimeoutDeadline"] = step.TimeoutDeadline;
                item["TimeoutFirstNotifyDate"] = step.TimeoutFirstNotifyDate;
                children.Add(item);
            }
        }

        return rv;
    }

    public static JArray SerializeExtAttrSchema(DataColumnCollection columns)
    {
        JArray rv = new JArray();
        
        foreach(DataColumn column in columns){
            rv.Add(YZJsonHelper.SerializeExtAttrSchema(column));
        }

        return rv;
    }

    public static JArray Serialize2StoreData(BPMObjectNameCollection names)
    {
        JArray rv = new JArray();

        foreach (string name in names)
        {
            JObject jitem = new JObject();
            rv.Add(jitem);
            jitem["name"] = name;
            jitem["value"] = name;
        }

        return rv;
    }

    public static JArray Serialize2Array(OUCollection ous)
    {
        JArray rv = new JArray();
        foreach (OU ou in ous)
            rv.Add(new JValue(ou.Name));

        return rv;
    }

    public static JArray SerializeSimpleOU(OUCollection ous)
    {
        JArray rv = new JArray();
        foreach (OU ou in ous)
        {
            JObject jou = new JObject();
            rv.Add(jou);

            jou["FullName"] = ou.FullName;
            jou["Name"] = ou.Name;
        }

        return rv;
    }

    public static JObject SerializeExtAttrSchema(DataColumn column)
    {
        JObject rv = new JObject();
        rv["ColumnName"] = column.ColumnName;
        rv["DataType"] = column.DataType.Name;
        return rv;
    }

    public static JObject SerializeSchema(FlowDataSet dataset)
    {
        return SerializeSchema(dataset, "IsRepeatableTable", "DataType");
    }

    public static JObject SerializeSchema(FlowDataSet dataset, string tableProperties, string columnProperties)
    {
        JsonSerializer serial = new JsonSerializer();
        serial.Converters.Add(new FlowDataSetConverter(tableProperties,columnProperties));
        return JObject.FromObject(dataset, serial);
    }

    public static JObject GetColumnCaptionInfo(DataSet dataset)
    {
        JObject rv = new JObject();
        foreach (DataTable table in dataset.Tables)
        {
            JObject jtable = new JObject();
            rv[table.TableName] = jtable;
            foreach (DataColumn column in table.Columns)
                jtable[column.ColumnName] = column.Caption;
        }

        return rv;
    }

    public static string EncodeAttribute(string s)
    {
        if (String.IsNullOrEmpty(s))
            return String.Empty;

        StringBuilder sb = new StringBuilder();
        foreach (char c in s)
        {
            switch (c)
            {
                case '\"':
                    sb.Append("\\\"");
                    break;
                case '\'':
                    sb.Append("\\\'");
                    break;
                case '\\':
                    sb.Append("\\\\");
                    break;
                case '\b':
                    sb.Append("\\b");
                    break;
                case '\f':
                    sb.Append("\\f");
                    break;
                case '\n':
                    sb.Append("\\n");
                    break;
                case '\r':
                    sb.Append("\\r");
                    break;
                case '\t':
                    sb.Append("\\t");
                    break;
                default:
                    int i = (int)c;
                    if (i < 32 || i > 127)
                    {
                        sb.AppendFormat("\\u{0:X04}", i);
                    }
                    else
                    {
                        sb.Append(c);
                    }
                    break;
            }
        }

        return sb.ToString();
    }


    public static string ConvertToJsonValue(object value)
    {
        if (value == null || Convert.IsDBNull(value) || value is YZModulePermision)
            return "\"\"";

        if (value is Guid)
            return "\"" + Convert.ToString(value) + "\"";

        if (value is string)
            return "\"" + YZJsonHelper.EncodeAttribute(Convert.ToString(value)) + "\"";

        if (value is DateTime)
        {
            DateTime date = (DateTime)value;
            if (date == DateTime.MinValue)
                return "null";

            return String.Format("new Date({0},{1},{2},{3},{4},{5})",
                date.Year,
                date.Month - 1,
                date.Day,
                date.Hour,
                date.Minute,
                date.Second);
        }

        if (value is byte[])
            return "\"\"";
        //return "\"" + Convert.ToBase64String((byte[])value) + "\"";目前还不支持绑定2进制数据

        //欧洲、印度等国家，小数点会转换为","，这在JavaScript中不会识别，JS识别的是"."
        string rv = Convert.ToString(value, YZJsonHelper.JavaScriptFormat);

        if (value is bool)
            rv = rv.ToLower();

        return rv;
    }

    public static string ConvertToXmlValue(object value)
    {
        string strValue;
        if (value == null)
        {
            strValue = String.Empty;
        }
        else
        {
            if (value is DateTime)
                strValue = ((DateTime)value).ToString("yyyy-MM-dd HH:mm:ss");
            else if (value is byte[])
                strValue = Convert.ToBase64String((byte[])value);
            else if (value is JsonItemCollection)
            {
                StringBuilder sb = new StringBuilder();
                sb.AppendLine();
                foreach (JsonItem item in (value as JsonItemCollection))
                {
                    item.AppendToXmlString(sb);
                }
                strValue = sb.ToString();
            }
            else if (value is JsonItem)
            {
                StringBuilder sb = new StringBuilder();
                (value as JsonItem).AppendToXmlString(sb);
                strValue = sb.ToString();
            }
            else
            {
                strValue = Convert.ToString(value);
                strValue = YZUtility.EncodeXMLInnerText(strValue);
            }
        }

        return strValue;
    }

    public static string JsonSerializer<T>(T t)
    {
        DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(T));
        MemoryStream ms = new MemoryStream();
        ser.WriteObject(ms, t);
        string jsonString = Encoding.UTF8.GetString(ms.ToArray());
        ms.Close();
        return jsonString;
    }

    public static T JsonDeserialize<T>(string jsonString)
    {
        DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(T));
        MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(jsonString));
        T obj = (T)ser.ReadObject(ms);
        return obj;
    }

    public static void FindBy(JToken jToken,List<JObject> result,JsonFindCompare compare)
    {
        JObject jObject = jToken as JObject;
        JArray jArray = jToken as JArray;

        if (jObject != null)
        {
            if( compare.Invoke(jObject) == true)
            {
                result.Add(jObject);
            }
            else
            {
                foreach (KeyValuePair<string, JToken> kv in jObject)
                {
                    FindBy(kv.Value, result, compare);
                }
            }
        }
        else if (jArray != null)
        {
            foreach (JToken jTokenTemp in jArray)
            {
                FindBy(jTokenTemp, result, compare);
            }
        }
    }
}
