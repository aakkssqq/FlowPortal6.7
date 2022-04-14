using System;
using System.Collections.Generic;
using System.Web;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using BPM.Json.Converters;

public class YZDSFilter
{
    public object value { get; set; }
    public bool afterBind { get; set; }
    public string op { get; set; }
}
