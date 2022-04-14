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
    public class FileIdentity : YZObject
    {
        [DataMember]
        public string FileID { get; set; }
        [DataMember]
        public string FileName { get; set; }

        public FileIdentity()
        {
        }

        public FileIdentity(File file)
        {
            this.FileID = file.FileID;
            this.FileName = file.FileName;
        }
    }
}