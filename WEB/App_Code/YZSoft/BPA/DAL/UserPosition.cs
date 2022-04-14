using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using Newtonsoft.Json.Linq;
using YZSoft.Web.DAL;
using BPM;

namespace YZSoft.Web.BPA
{
    [DataContract]
    public class UserPosition : YZObject
    {
        [DataMember]
        public string UID { get; set; }
        [DataMember]
        public string FileID { get; set; }
        [DataMember]
        public string SpriteID { get; set; }

        public UserPosition()
        {
        }

        public UserPosition(YZReader reader)
        {
            this.UID = reader.ReadString("UID");
            this.FileID = reader.ReadString("FileID");
            this.SpriteID = reader.ReadString("SpriteID");
        }

        public Sprite TryGetSprite(IYZDbProvider provider, IDbConnection cn)
        {
            File file = File.TryLoad(provider,cn,this.FileID);
            if (file != null)
                return file.Sprites.TryGetItem(this.SpriteID);

            return null;
        }
    }
}