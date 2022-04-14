using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using BPM.Client;
using BPM;

namespace YZSoft.P2PGroup
{
    [DataContract]
    public class P2PGroup
    {
        [DataMember]
        public int GroupID { get; set; }
        [DataMember]
        public string Account1 { get; set; }
        [DataMember]
        public string Account2 { get; set; }
        [DataMember]
        public string UserName1 { get; set; }
        [DataMember]
        public string UserName2 { get; set; }
        [DataMember]
        public int FolderID { get; set; }
        [DataMember]
        public string CreateBy { get; set; }
        [DataMember]
        public DateTime CreateAt { get; set; }

        public P2PGroup()
        {
        }

        public P2PGroup(YZReader reader)
        {
            this.GroupID = reader.ReadInt32("GroupID");
            this.Account1 = reader.ReadString("Account1");
            this.Account2 = reader.ReadString("Account2");
            this.UserName1 = reader.ReadString("UserName1");
            this.UserName2 = reader.ReadString("UserName2");
            this.FolderID = reader.ReadInt32("FolderID");
            this.CreateBy = reader.ReadString("CreateBy");
            this.CreateAt = reader.ReadDateTime("CreateAt");
        }

        public string GetGroupName(BPMConnection cn, string loginUserAccount)
        {
            string account;
            string name;
            if (NameCompare.EquName(this.Account1, loginUserAccount))
            {
                account = this.Account2;
                name = this.UserName2;
            }
            else
            {
                account = this.Account1;
                name = this.UserName1;
            }

            if(cn != null)
            {
                User user = User.TryGetUser(cn, account);
                if (user != null)
                    name = user.ShortName;
            }

            return name;
        }

        public string GetPeerAccount(string loginUserAccount)
        {
            if (NameCompare.EquName(this.Account1, loginUserAccount))
                return this.Account2;
            else
                return this.Account1;
        }
    }
}