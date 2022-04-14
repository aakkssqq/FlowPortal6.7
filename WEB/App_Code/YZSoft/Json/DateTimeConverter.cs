using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

public class DateTimeConverter : IsoDateTimeConverter
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
}
