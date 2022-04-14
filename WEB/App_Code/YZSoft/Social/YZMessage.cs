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
namespace YZSoft.Web.Social
{
    [DataContract]
    public class YZMessage : YZObject
    {
        [DataMember]
        public int id { get; set; }
        [DataMember]
        public string uid { get; set; }
        [DataMember]
        public DateTime date { get; set; }
        [DataMember, JsonConverter(typeof(StringEnumConverter))]
        public YZResourceType resType { get; set; }
        [DataMember]
        public string resId { get; set; }
        [DataMember]
        public string message { get; set; }
        [DataMember]
        public int replyto { get; set; }
        [DataMember]
        public int duration { get; set; }

        public YZMessage()
        {
            this.duration = -1;
        }

        public string Channel
        {
            get
            {
                return String.Format("{0}/{1}", this.resType.ToString(), this.resId);
            }
        }

        public YZMessage(string uid, DateTime date, YZResourceType resType, string resId, string message):this()
        {
            this.uid = uid;
            this.date = date;
            this.resType = resType;
            this.resId = resId;
            this.message = message;
        }

        public YZMessage(IDataReader reader)
        {
            YZReader dbr = new YZReader(reader);
            this.id = dbr.ReadInt32("id");
            this.replyto = dbr.ReadInt32("replyto");
            this.uid = dbr.ReadString("uid");
            this.date = dbr.ReadDateTime("date");
            this.resType = (YZResourceType)dbr.ReadEnum("resType", typeof(YZResourceType), YZResourceType.Task);
            this.resId = dbr.ReadString("resId");
            this.message = dbr.ReadString("message");
            this.duration = dbr.ReadInt32("duration");
        }
    }
}