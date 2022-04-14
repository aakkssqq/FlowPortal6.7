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
    public class Footmark : YZObject
    {
        [DataMember]
        public int ItemID { get; set; }
        [DataMember]
        public string Account { get; set; }
        [DataMember]
        public DateTime Time { get; set; }
        [DataMember]
        public YZPosition Position { get; set; }
        [DataMember]
        public string Contact { get; set; }
        [DataMember]
        public string Comments { get; set; }
        [DataMember]
        public string Attachments { get; set; }

        public Footmark()
        {
            this.Position = new YZPosition();
        }

        public Footmark(YZReader reader): this()
        {
            this.ItemID = reader.ReadInt32("ItemID");
            this.Account = reader.ReadString("Account");
            this.Time = reader.ReadDateTime("Time");
            this.Position.RawLat = reader.ReadFloat("RawLat");
            this.Position.RawLon = reader.ReadFloat("RawLon");
            this.Position.Lat = reader.ReadFloat("Lat");
            this.Position.Lon = reader.ReadFloat("Lon");
            this.Position.Id = reader.ReadString("LocId");
            this.Position.Name = reader.ReadString("LocName");
            this.Position.Address = reader.ReadString("LocAddress");
            this.Contact = reader.ReadString("Contact");
            this.Comments = reader.ReadString("Comments");
            this.Attachments = reader.ReadString("Attachments");
        }
    }
}