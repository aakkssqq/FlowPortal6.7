using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using BPM.Json.Converters;

namespace YZSoft.Group
{
    [DataContract]
    public class Member
    {
        [DataMember]
        public int ItemID { get; set; }
        [DataMember]
        public int GroupID { get; set; }
        [DataMember]
        public string UID { get; set; }
        [DataMember]
        public string Role { get; set; }

        [DataMember]
        public BPM.Client.User User { get; set; }

        public GroupPerm GroupPerm {
            get {
                if(String.IsNullOrEmpty(this.Role))
                    return GroupPerm.None;

                string role = this.Role.ToLower().Trim();
                switch (role)
                {
                    case "owner":
                    case "admin":
                        return GroupPerm.FullControl;
                    case "editor":
                        return GroupPerm.Edit;
                    case "author":
                        return GroupPerm.Auth;
                    case "guest":
                        return GroupPerm.Read;
                    default:
                        return GroupPerm.None;
                }
            }
        }

        public Member()
        {
        }

        public Member(IDataReader reader)
        {
            YZReader dbr = new YZReader(reader);
            this.ItemID = dbr.ReadInt32("ItemID");
            this.GroupID = dbr.ReadInt32("GroupID");
            this.UID = dbr.ReadString("UID");
            this.Role = dbr.ReadString("Role");

            if (String.IsNullOrEmpty(this.Role))
                this.Role = "Guest";
        }
    }
}