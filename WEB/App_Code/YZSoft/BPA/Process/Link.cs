using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace YZSoft.Web.BPA
{
    [DataContract]
    public class Link : YZObject
    {
        [DataMember]
        public string FromNodeId { get; set; }
        [DataMember]
        public string ToNodeId { get; set; }

        public File File { get; set; }
    }
}