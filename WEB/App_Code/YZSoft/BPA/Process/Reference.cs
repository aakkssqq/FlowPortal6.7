using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using YZSoft.Web.DAL;
using BPM;

namespace YZSoft.Web.BPA
{
    [DataContract]
    public class Reference : YZObject
    {
        [DataMember]
        public bool isBPAReference { get; set; }
        [DataMember, JsonConverter(typeof(StringEnumConverter))]
        public ReferenceType LinkType { get; set; }
        [DataMember]
        public string FileID { get; set; }
        [DataMember]
        public string SpriteID { get; set; }

        public string FileName { get; set; }
        public string SpriteName { get; set; }

        public Reference()
        {
        }

        public Reference(ReferenceType referenceType,string fileid)
        {
            this.isBPAReference = true;
            this.LinkType = referenceType;
            this.FileID = fileid;
        }

        public void RefreshName(IYZDbProvider provider, IDbConnection cn)
        {
            AttachmentInfo attachment = AttachmentManager.TryGetAttachmentInfo(provider, cn, this.FileID);
            if (attachment != null)
                this.FileName = attachment.Name;
            else
                this.FileName = "";

            switch (this.LinkType)
            {
                case ReferenceType.SpriteToSprite:
                case ReferenceType.ProcessToSprite:
                    SpriteIdentity identity = BPAManager.TryGetSpriteIdentity(provider, cn, this.FileID, this.SpriteID);
                    this.SpriteName = identity != null ? identity.Name : "";
                    break;
                default:
                    this.SpriteName = "";
                    break;
            }
        }

        public string ToString(IYZDbProvider provider, IDbConnection cn)
        {
            this.RefreshName(provider, cn);

            switch (this.LinkType)
            {
                case ReferenceType.SpriteToSprite:
                case ReferenceType.ProcessToSprite:
                    return this.SpriteName;
                default:
                    return this.FileName;
            }
        }
    }
}