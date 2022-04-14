using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace YZSoft.Web.BPA
{
    [DataContract]
    public class SpriteLink : YZObject
    {
        [DataMember]
        public string FileID { get; set; }
        [DataMember]
        public string SpriteID { get; set; }
        [DataMember,JsonConverter(typeof(StringEnumConverter))]
        public ReferenceType LinkType { get; set; }
        [DataMember]
        public string LinkedFileID { get; set; }
        [DataMember]
        public string LinkedSpriteID { get; set; }
        [DataMember]
        public string LinkedByProperty { get; set; }

        public SpriteLink()
        {
            this.LinkType = ReferenceType.SpriteToSprite;
        }

        public SpriteLink(Sprite sprite, Reference @ref, string propertyName)
        {
            this.LinkedByProperty = propertyName;
            this.FileID = sprite.File.FileID;
            this.SpriteID = sprite.Id;
            this.LinkedFileID = @ref.FileID;
            this.LinkedSpriteID = @ref.SpriteID;
            this.LinkType = String.IsNullOrEmpty(this.LinkedSpriteID) ? ReferenceType.SpriteToProcess : ReferenceType.SpriteToSprite;
        }

        public SpriteLink(File file, Reference @ref, string propertyName)
        {
            this.LinkedByProperty = propertyName;
            this.FileID = file.FileID;
            this.LinkedFileID = @ref.FileID;
            this.LinkedSpriteID = @ref.SpriteID;
            this.LinkType = String.IsNullOrEmpty(this.LinkedSpriteID) ? ReferenceType.ProcessToProcess : ReferenceType.ProcessToSprite;
        }

        public SpriteLink(YZReader reader)
        {
            this.FileID = reader.ReadString("FileID");
            this.SpriteID = reader.ReadString("SpriteID");
            this.LinkType = reader.ReadEnum<ReferenceType>("LinkType", ReferenceType.SpriteToSprite);
            this.LinkedFileID = reader.ReadString("LinkedFileID");
            this.LinkedSpriteID = reader.ReadString("LinkedSpriteID");
            this.LinkedByProperty = reader.ReadString("LinkedByProperty");
        }
    }

    public enum ReferenceType
    {
        SpriteToSprite,
        ProcessToSprite,
        SpriteToProcess,
        ProcessToProcess
    }
}