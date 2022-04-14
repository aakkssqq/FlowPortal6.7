using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;

namespace YZSoft.Web.Mobile
{
    [DataContract]
    public class Device
    {
        [DataMember]
        public string Account { get; set; }
        [DataMember]
        public string UUID { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string Model { get; set; }
        [DataMember]
        public string Description { get; set; }
        [DataMember]
        public DateTime RegisterAt { get; set; }

        [DataMember]
        public bool Disabled { get; set; }
        [DataMember]
        public DateTime LastLogin { get; set; }

        public Device()
        {
        }

        public Device(YZReader reader)
        {
            this.Account = reader.ReadString("Account");
            this.UUID = reader.ReadString("UUID");
            this.Name = reader.ReadString("Name");
            this.Model = reader.ReadString("Model");
            this.Description = reader.ReadString("Description");
            this.Disabled = reader.ReadBool("Disabled",false);
            this.RegisterAt = reader.ReadDateTime("RegisterAt");
            this.LastLogin = reader.ReadDateTime("LastLogin");
        }
    }
}