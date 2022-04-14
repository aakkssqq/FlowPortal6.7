using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

public class YZDateTimeConverter : IsoDateTimeConverter
{
    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        if (objectType == typeof(DateTime))
        {
            if (reader.TokenType == JsonToken.String)
            {
                string dateText = Convert.ToString(reader.Value);
                if (String.IsNullOrEmpty(dateText))
                    return DateTime.MinValue;
            }

            if (reader.TokenType == JsonToken.Null)
            {
                return DateTime.MinValue;
            }
        }
        return base.ReadJson(reader, objectType, existingValue, serializer);
    }
 
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        if (value is DateTime)
        {
            DateTime date = (DateTime)value;
            if (date == DateTime.MinValue)
            {
                writer.WriteValue((string)null);
            }
            else
            {
                string rv = String.Format("new Date({0},{1},{2},{3},{4},{5})",
                    date.Year,
                    date.Month - 1,
                    date.Day,
                    date.Hour,
                    date.Minute,
                    date.Second);

                writer.WriteRawValue(rv);
            }
        }
        else
        {
            base.WriteJson(writer, value, serializer);
        }
    }
}
