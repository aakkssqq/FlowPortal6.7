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
    public class DailyReport : YZObject
    {
        [DataMember]
        public int ItemID { get; set; }
        [DataMember]
        public int TaskID { get; set; }
        [DataMember]
        public string Account { get; set; }
        [DataMember]
        public DateTime Date { get; set; }
        [DataMember]
        public string Done { get; set; }
        [DataMember]
        public string Undone { get; set; }
        [DataMember]
        public string Coordinate { get; set; }
        [DataMember]
        public string Comments { get; set; }
        [DataMember]
        public string Pics { get; set; }
        [DataMember]
        public string Attachments { get; set; }
        [DataMember]
        public DateTime CreateAt { get; set; }
        [DataMember]
        public bool IsEmpty { get; set; }

        public DailyReport()
        {
            this.IsEmpty = true;
        }

        public DailyReport(YZReader reader)
        {
            this.IsEmpty = false;
            this.ItemID = reader.ReadInt32("ItemID");
            this.TaskID = reader.ReadInt32("TaskID");
            this.Account = reader.ReadString("Account");
            this.Date = reader.ReadDateTime("Date");
            this.Done = reader.ReadString("Done");
            this.Undone = reader.ReadString("Undone");
            this.Coordinate = reader.ReadString("Coordinate");
            this.Done = reader.ReadString("Done");
            this.Pics = reader.ReadString("Pics");
            this.Attachments = reader.ReadString("Attachments");
            this.CreateAt = reader.ReadDateTime("CreateAt");
        }
    }
}