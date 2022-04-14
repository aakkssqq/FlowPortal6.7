using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;

namespace YZSoft.Library
{
    [DataContract]
    public class Library
    {
        [DataMember]
        public int LibID { get; set; }
        [DataMember]
        public string LibType { get; set; }
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
        public int OrderIndex { get; set; }

        public Library()
        {
            this.DocumentFolderID = -1;
            this.FolderID = -1;
            this.OrderIndex = 0;
        }

        public Library(YZReader reader)
        {
            this.LibID = reader.ReadInt32("LibID");
            this.LibType = reader.ReadString("LibType");
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
            this.OrderIndex = reader.ReadInt32("OrderIndex");
        }
    }
}