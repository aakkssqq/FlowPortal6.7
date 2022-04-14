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
    public class Cash/* : YZObject*/ //金额未输入时，保存报错
    {
        [DataMember]
        public int ItemID { get; set; }
        [DataMember]
        public string Account { get; set; }
        [DataMember]
        public string Type { get; set; }
        [DataMember]
        public DateTime Date { get; set; }
        [DataMember, JsonProperty(NullValueHandling=NullValueHandling.Ignore)]
        public decimal Amount { get; set; }
        [DataMember]
        public string Invoice { get; set; }
        [DataMember]
        public string Comments { get; set; }
        [DataMember]
        public DateTime CreateAt { get; set; }

        public Cash()
        {
        }

        public Cash(YZReader reader)
        {
            this.ItemID = reader.ReadInt32("ItemID");
            this.Account = reader.ReadString("Account");
            this.Type = reader.ReadString("Type");
            this.Date = reader.ReadDateTime("Date");
            this.Amount = reader.ReadDecimal("Amount");
            this.Invoice = reader.ReadString("Invoice");
            this.Comments = reader.ReadString("Comments");
            this.CreateAt = reader.ReadDateTime("CreateAt");
        }
    }
}