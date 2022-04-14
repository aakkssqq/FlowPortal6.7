using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using BPM.Json.Converters;

[DataContract]
public class YZClientParam
{
    [DataMember]
    public bool isAll { get; set; }
    [DataMember]
    public string name { get; set; }
    [DataMember, JsonConverter(typeof(DataTypeConverter))]
    public Type dataType { get; set; }
    [DataMember]
    public string op { get; set; }
    [DataMember]
    public object value { get; set; }
}
