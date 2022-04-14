using System;
using System.Collections.Generic;
using System.Web;
using System.Data;
using BPM;
using BPM.Client;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

/// <summary>
///YZComunity 的摘要说明
/// </summary>
namespace YZSoft.Web
{
    [DataContract]
    public class Favorite : YZObject
    {
        [DataMember]
        public string uid { get; set; }
        [DataMember, JsonConverter(typeof(StringEnumConverter))]
        public YZResourceType resType { get; set; }
        [DataMember]
        public string resId { get; set; }
        [DataMember]
        public DateTime date { get; set; }
        [DataMember]
        public string comments { get; set; }
        [DataMember]
        public int orderIndex { get; set; }

        public Favorite()
        {
            this.orderIndex = 0;
        }

        public Favorite(YZReader reader)
        {
            this.uid = reader.ReadString("uid");
            this.resType = (YZResourceType)reader.ReadEnum("resType", typeof(YZResourceType), YZResourceType.Process);
            this.resId = reader.ReadString("resId");
            this.date = reader.ReadDateTime("date");
            this.comments = reader.ReadString("comments");
            this.orderIndex = reader.ReadInt32("orderIndex");
        }
    }
}