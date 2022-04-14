using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;

namespace YZSoft.Group
{
    [DataContract]
    public class Group
    {
        [DataMember]
        public int GroupID { get; set; }
        [DataMember]
        public string GroupType { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string Desc { get; set; }
        [DataMember]
        public int DocumentFolderID { get; set; }
        [DataMember]
        public int FolderID { get; set; }
        [DataMember]
        public string Owner { get; set; }
        [DataMember]
        public DateTime CreateAt { get; set; }
        [DataMember]
        public string ImageFileID { get; set; }
        [DataMember]
        public bool Deleted { get; set; }
        [DataMember]
        public string DeleteBy { get; set; }
        [DataMember]
        public DateTime DeleteAt { get; set; }
        [DataMember]
        public int MemberCount { get; set; }

        public Group()
        {
        }

        public Group(YZReader reader)
        {
            this.GroupID = reader.ReadInt32("GroupID");
            this.GroupType = reader.ReadString("GroupType");
            this.Name = reader.ReadString("Name");
            this.Desc = reader.ReadString("Desc");
            this.DocumentFolderID = reader.ReadInt32("DocumentFolderID");
            this.FolderID = reader.ReadInt32("FolderID");
            this.Owner = reader.ReadString("Owner");
            this.CreateAt = reader.ReadDateTime("CreateAt");
            this.ImageFileID = reader.ReadString("ImageFileID");
            this.Deleted = reader.ReadBool("Deleted", false);
            this.DeleteBy = reader.ReadString("DeleteBy");
            this.DeleteAt = reader.ReadDateTime("DeleteAt");
        }
    }
}