using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using Newtonsoft.Json.Linq;

/// <summary>
///PageResult 的摘要说明
/// </summary>
[DataContract]
public class PageResult
{
    [DataMember(Name = "total", Order = 0)]
    public int TotalRows { get; set; }

    [DataMember(Name = YZJsonProperty.children, Order = 1)]
    public DataTable Table { get; set; }

    public void RegularColumnsName(string[] columnNames)
    {
        RegularColumnsName(this.Table, columnNames);
    }

    public static void RegularColumnsName(DataTable table,string[] columnNames)
    {
        if (columnNames == null)
            return;

        foreach (string columnName in columnNames)
        {
            table.Columns[columnName].ColumnName = columnName;
        }
    }

    public static void TryConvertToJObject(DataTable table, string columnName)
    {
        foreach (DataRow row in table.Rows)
        {
            string strValue = Convert.ToString(row[columnName]);
            object value;

            if (String.IsNullOrEmpty(strValue))
            {
                value = null;
            }
            else
            {
                try
                {
                    value = JObject.Parse(strValue);
                }
                catch (Exception)
                {
                    value = strValue;
                }
            }

            row[columnName] = value;
        }
    }

    public static void TryConvertToJToken(DataTable table, string columnName)
    {
        foreach (DataRow row in table.Rows)
        {
            string strValue = Convert.ToString(row[columnName]);
            object value;

            if (String.IsNullOrEmpty(strValue))
            {
                value = null;
            }
            else
            {
                try
                {
                    value = JToken.Parse(strValue);
                }
                catch (Exception)
                {
                    value = strValue;
                }
            }

            row[columnName] = value;
        }
    }

    public static void ConvertToJArray(DataTable table, string columnName)
    {
        foreach (DataRow row in table.Rows)
        {
            string strValue = Convert.ToString(row[columnName]);
            JArray jArray;

            if (String.IsNullOrEmpty(strValue))
                jArray = null;
            else
                jArray = JArray.Parse(strValue);

            row[columnName] = jArray;
        }
    }
}