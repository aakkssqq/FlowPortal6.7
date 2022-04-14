using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using Newtonsoft.Json.Linq;

namespace YZSoft.Web.BPA
{
    [DataContract]
    public class SpriteIdentity : YZObject
    {
        [DataMember]
        public string FileID { get; set; }
        [DataMember]
        public string SpriteID { get; set; }
        [DataMember]
        public string Name { get; set; }

        public SpriteIdentity()
        {
        }

        public SpriteIdentity(Sprite sprite)
        {
            this.FileID = sprite.File.FileID;
            this.SpriteID = sprite.Id;
            this.Name = ConvertSpriteName(sprite.Name);
            this["FileName"] = sprite.File.FileName;
            this["SpriteName"] = this.Name;
        }

        public SpriteIdentity(YZReader reader)
        {
            this.FileID = reader.ReadString("FileID");
            this.SpriteID = reader.ReadString("SpriteID");
            this.Name = reader.ReadString("Name");
        }

        public static string ConvertSpriteName(string name)
        {
            if (String.IsNullOrEmpty(name))
                return name;

            return name.Replace("\n", "").Replace("\r", "");
        }
    }
}