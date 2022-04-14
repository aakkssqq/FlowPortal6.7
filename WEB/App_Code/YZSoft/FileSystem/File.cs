using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using YZSoft.Web.DAL;
using BPM;
using BPM.Client;
using BPM.Client.Security;

namespace YZSoft.FileSystem
{
    [DataContract]
    public class File : YZObject
    {
        [DataMember]
        public bool isFile { get { return true; } }
        [DataMember]
        public string id { get { return "File" + this.ID.ToString(); } }
        [DataMember]
        public int ID { get; set; }
        [DataMember]
        public int FolderID { get; set; }
        [DataMember]
        public string FileID { get; set; }
        [DataMember]
        public string AddBy { get; set; }
        [DataMember]
        public DateTime AddAt { get; set; }
        [DataMember]
        public string Comments { get; set; }
        [DataMember]
        public bool Deleted { get; set; }
        [DataMember]
        public string DeleteBy { get; set; }
        [DataMember]
        public DateTime DeleteAt { get; set; }
        [DataMember]
        public bool Recyclebin { get; set; }
        [DataMember]
        public string Flag { get; set; }
        [DataMember]
        public int OrderIndex { get; set; }

        public File()
        {
            this.FolderID = -1;
            this.OrderIndex = 0;
        }

        public File(YZReader reader)
        {
            this.ID = reader.ReadInt32("ID");
            this.FolderID = reader.ReadInt32("FolderID");
            this.FileID = reader.ReadString("FileID");
            this.AddBy = reader.ReadString("AddBy");
            this.AddAt = reader.ReadDateTime("AddAt");
            this.Comments = reader.ReadString("Comments");
            this.Deleted = reader.ReadBool("Deleted", false);
            this.DeleteBy = reader.ReadString("DeleteBy");
            this.DeleteAt = reader.ReadDateTime("DeleteAt");
            this.Recyclebin = reader.ReadBool("Recyclebin", false);
            this.Flag = reader.ReadString("Flag");
            this.OrderIndex = reader.ReadInt32("OrderIndex");
        }

        public bool PerformAttachmentInfo(IYZDbProvider provider, IDbConnection cn, BPMConnection bpmcn)
        {
            AttachmentInfo attachmentInfo = AttachmentManager.TryGetAttachmentInfo(provider, cn, this.FileID);
            if (attachmentInfo == null)
                return false;

            this["Name"] = attachmentInfo.Name;
            this["Size"] = attachmentInfo.Size;
            this["Ext"] = attachmentInfo.Ext;
            this["LastUpdate"] = attachmentInfo.LastUpdate;
            this["OwnerAccount"] = attachmentInfo.OwnerAccount;

            if (bpmcn != null)
            {
                User user = User.TryGetUser(bpmcn, attachmentInfo.OwnerAccount);
                this["OwnerDisplayName"] = user != null ? user.ShortName : attachmentInfo.OwnerAccount;
            }

            return true;
        }

        public bool ISBPAFileWritable(IYZDbProvider provider, IDbConnection cn, BPMConnection bpmcn)
        {
            Folder parentFolder = DirectoryManager.GetFolderByID(provider, cn, this.FolderID);
            Folder rootFolder = DirectoryManager.GetFolderByID(provider, cn, parentFolder.RootID);

            if (NameCompare.EquName(rootFolder.FolderType, "BPALibrary"))
            {
                if (SecurityManager.CheckPermision(bpmcn, parentFolder.RSID, BPMPermision.Write))
                    return true;
            }

            if (NameCompare.EquName(rootFolder.FolderType, "BPAGroup"))
            {
                if (bpmcn.Token.ContainsSID(WellKnownSID.Administrators))
                    return true;

                YZSoft.Group.Group group = YZSoft.Group.GroupManager.GetGroupFromFolderID(provider, cn, rootFolder.FolderID);
                YZSoft.Group.Member member = YZSoft.Group.GroupManager.TryGetGroupMember(provider, cn, group.GroupID, YZAuthHelper.LoginUserAccount);
                if (member != null)
                {
                    if ((member.GroupPerm & Group.GroupPerm.Edit) == Group.GroupPerm.Edit || (member.GroupPerm & Group.GroupPerm.Auth) == Group.GroupPerm.Auth)
                        return true;
                }
            }

            return false;
        }
    }
}