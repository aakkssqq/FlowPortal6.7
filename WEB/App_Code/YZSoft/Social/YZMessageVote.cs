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
    public class YZMessageVote : YZObject
    {
        [DataMember]
        public int id{get;set;}
        [DataMember]
        public int messageid { get; set; }
        [DataMember]
        public string uid { get; set; }
        [DataMember]
        public DateTime date { get; set; }

        public YZMessageVote()
        {
        }

        public YZMessageVote(IDataReader reader)
        {
            YZReader dbr = new YZReader(reader);
            this.id = dbr.ReadInt32("id");
            this.messageid = dbr.ReadInt32("messageid");
            this.uid = dbr.ReadString("uid");
            this.date = dbr.ReadDateTime("date");
        }
    }
}