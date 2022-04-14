using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using Newtonsoft.Json;

namespace YZSoft.Apps
{
    [DataContract]
    public class Speak : YZObject
    {
        [DataMember]
        public int ItemID { get; set; }
        [DataMember]
        public string Account { get; set; }
        [DataMember]
        public string FileID { get; set; }
        [DataMember]
        public int Duration { get; set; }
        [DataMember]
        public string Comments { get; set; }
        [DataMember]
        public DateTime CreateAt { get; set; }

        public Speak()
        {
        }

        public Speak(YZReader reader)
        {
            this.ItemID = reader.ReadInt32("ItemID");
            this.Account = reader.ReadString("Account");
            this.FileID = reader.ReadString("FileID");
            this.Duration = reader.ReadInt32("Duration");
            this.Comments = reader.ReadString("Comments");
            this.CreateAt = reader.ReadDateTime("CreateAt");
        }
    }
}