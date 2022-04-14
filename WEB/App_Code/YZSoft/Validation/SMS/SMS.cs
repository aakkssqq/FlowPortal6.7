using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;

namespace YZSoft.Web.Validation
{
    [DataContract]
    public class SMS
    {
        [DataMember]
        public string ItemGUID { get; set; }
        [DataMember]
        public string IDDCode { get; set; }
        [DataMember]
        public string PhoneNumber { get; set; }
        [DataMember]
        public string ValidationCode { get; set; }
        [DataMember]
        public DateTime ExpireDate { get; set; }
        [DataMember]
        public DateTime CreateDate { get; set; }
        [DataMember]
        public string CreateBy { get; set; }

        public SMS()
        {
        }

        public SMS(YZReader reader)
        {
            this.ItemGUID = reader.ReadString("ItemGUID");
            this.IDDCode = reader.ReadString("IDDCode");
            this.PhoneNumber = reader.ReadString("PhoneNumber");
            this.ValidationCode = reader.ReadString("ValidationCode");
            this.ExpireDate = reader.ReadDateTime("ExpireDate");
            this.CreateDate = reader.ReadDateTime("CreateDate");
            this.CreateBy = reader.ReadString("CreateBy");
        }

        public static string GenValidationCode(int length)
        {
            string result = "";
            System.Random random = new Random();
            for (int i = 0; i < length; i++)
            {
                result += random.Next(10).ToString();
            }
            return result;
        }
    }
}