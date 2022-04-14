using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using BPM.Json.Converters;

namespace YZSoft.Group
{
    [DataContract, JsonConverter(typeof(EnumObjectConverter), typeof(GroupPerm))]
    public enum GroupPerm
    {
        None        = 0x0000,
        Admin       = 0x0001,
        Edit        = 0x0002,
        Auth        = 0x0004,
        Read        = 0x0008,
        FullControl = 0xffff
    }
}