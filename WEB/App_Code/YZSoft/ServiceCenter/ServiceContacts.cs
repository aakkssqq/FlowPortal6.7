using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;

namespace YZSoft.Web.ServiceCenter
{
    [DataContract]
    public class ServiceContacts
    {
        [DataMember]
        public string Product { get; set; }
        [DataMember]
        public string ServiceCenter { get; set; }
        [DataMember]
        public string Description { get; set; }
        [DataMember]
        public string Tel { get; set; }
        [DataMember]
        public int OrderIndex { get; set; }

        public ServiceContacts()
        {
        }

        public ServiceContacts(YZReader reader)
        {
            this.Product = reader.ReadString("Product");
            this.ServiceCenter = reader.ReadString("ServiceCenter");
            this.Description = reader.ReadString("Description");
            this.Tel = reader.ReadString("Tel");
            this.OrderIndex = reader.ReadInt32("OrderIndex");
        }
    }
}