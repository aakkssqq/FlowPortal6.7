using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using BPM;

namespace YZSoft.Web.BPA
{
    public class FileIdentityCollection : BPMList<FileIdentity>
    {
        protected override string GetKey(FileIdentity value)
        {
            return value.FileID;
        }
    }
}