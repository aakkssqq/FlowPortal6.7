using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

/// <summary>
///PageResult 的摘要说明
/// </summary>
[DataContract]
public class YZPosition
{
    [DataMember]
    public float RawLat { get; set; }
    [DataMember]
    public float RawLon { get; set; }
    [DataMember]
    public float Lat { get; set; }
    [DataMember]
    public float Lon { get; set; }
    [DataMember]
    public string Id { get; set; }
    [DataMember]
    public string Name { get; set; }
    [DataMember]
    public string Address { get; set; }
}