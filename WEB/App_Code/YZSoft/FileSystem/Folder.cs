using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;

namespace YZSoft.FileSystem
{
    [DataContract]
    public class Folder : YZObject
    {
        [DataMember]
        public bool isFolder { get { return true; } }
        [DataMember]
        public string id { get { return "Folder" + this.FolderID.ToString(); } }
        [DataMember]
        public int FolderID { get; set; }
        [DataMember]
        public int RootID { get; set; }
        [DataMember]
        public int ParentID { get; set; }
        [DataMember]
        public string FolderType { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string Desc { get; set; }
        [DataMember]
        public string Owner { get; set; }
        [DataMember]
        public DateTime CreateAt { get; set; }
        [DataMember]
        public bool Deleted { get; set; }
        [DataMember]
        public string DeleteBy { get; set; }
        [DataMember]
        public DateTime DeleteAt { get; set; }
        [DataMember]
        public int OrderIndex { get; set; }

        private FolderCollection _childFolders;

        public static string GetRSID(int folderid)
        {
            return BPM.SecurityResType.FileSystemFolder.ToString() + "://" + folderid.ToString();
        }

        public string RSID
        {
            get
            {
                return GetRSID(this.FolderID);
            }
        }

        public FolderCollection ChildFolders
        {
            get
            {
                if (this._childFolders == null)
                    this._childFolders = new FolderCollection();

                return this._childFolders;
            }
            set
            {
                this._childFolders = value;
            }
        }

        public Folder()
        {
            this.RootID = -1;
            this.ParentID = -1;
            this.OrderIndex = 0;
        }

        public Folder(YZReader reader)
        {
            this.FolderID = reader.ReadInt32("FolderID");
            this.RootID = reader.ReadInt32("RootID");
            this.ParentID = reader.ReadInt32("ParentID");
            this.FolderType = reader.ReadString("FolderType");
            this.Name = reader.ReadString("Name");
            this.Desc = reader.ReadString("Desc");
            this.Owner = reader.ReadString("Owner");
            this.CreateAt = reader.ReadDateTime("CreateAt");
            this.Deleted = reader.ReadBool("Deleted",false);
            this.DeleteBy = reader.ReadString("DeleteBy");
            this.DeleteAt = reader.ReadDateTime("DeleteAt");
            this.OrderIndex = reader.ReadInt32("OrderIndex");
        }
    }
}