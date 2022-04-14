using System;
using System.Collections.Generic;
using System.Web;
using System.Data;
using System.Text;

/// <summary>
///YZReader 的摘要说明


/// </summary>
public class YZConvert
{
    public static string ToString(object value)
    {
        if (System.Convert.IsDBNull(value))
            return null;

        if (value is string)
            return (string)value;

        return Convert.ToString(value);
    }

    public static bool ToBoolen(object value, bool defaultValue)
    {
        if (System.Convert.IsDBNull(value))
            return defaultValue;

        if (value is bool)
            return (bool)value;

        int intvalue = System.Convert.ToInt32(value);
        if (intvalue == 0)
            return false;
        else
            return true;
    }

    public static int ToInt32(object value)
    {
        return YZConvert.ToInt32(value, false, -1);
    }

    public static int ToInt32(object value, bool allowNull, int defaultValue)
    {
        if (System.Convert.IsDBNull(value))
            return defaultValue;

        return Convert.ToInt32(value);
    }

    public static DateTime ToDateTime(object value)
    {
        string strValue = YZConvert.ToString(value);

        if (String.IsNullOrEmpty(strValue))
            return DateTime.MinValue;

        DateTime rv;
        if (!DateTime.TryParse(strValue, out rv))
            rv = DateTime.MinValue;

        return rv;
    }

    public static T ToEnum<T>(object value) where T : struct
    {
        return ToEnum(value, false, default(T));
    }

    public static T ToEnum<T>(object value, bool allowDefault, T defaultValue) where T : struct
    {
        string strValue = YZConvert.ToString(value);
        T rv;
        if (!Enum.TryParse<T>(strValue, true, out rv))
        {
            if (allowDefault)
                return defaultValue;

            throw new Exception(String.Format(Resources.YZStrings.Aspx_YZConvert_Invalid_Type, value, typeof(T).Name));
        }
        else
            return rv;
    }
}
