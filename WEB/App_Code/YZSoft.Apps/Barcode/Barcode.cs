using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;

namespace YZSoft.Apps
{
    [DataContract]
    public class Barcode : YZObject
    {
        [DataMember]
        public int ItemID { get; set; }
        [DataMember]
        public string Account { get; set; }
        [DataMember]
        public string BarcodeValue { get; set; }
        [DataMember]
        public string Format { get; set; }
        [DataMember]
        public string ProductName { get; set; }
        [DataMember]
        public string Comments { get; set; }
        [DataMember]
        public DateTime CreateAt { get; set; }

        public Barcode()
        {
        }

        public Barcode(YZReader reader)
        {
            this.ItemID = reader.ReadInt32("ItemID");
            this.Account = reader.ReadString("Account");
            this.BarcodeValue = reader.ReadString("Barcode");
            this.Format = reader.ReadString("Format");
            this.ProductName = reader.ReadString("ProductName");
            this.Comments = reader.ReadString("Comments");
            this.CreateAt = reader.ReadDateTime("CreateAt");
        }
    }
}