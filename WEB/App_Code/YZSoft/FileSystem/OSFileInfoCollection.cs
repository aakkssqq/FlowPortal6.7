using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using BPM;

namespace YZSoft.FileSystem
{
    public class OSFileInfoCollection: BPMList<OSFileInfo>
    {
        protected override string GetKey(OSFileInfo value)
        {
            return Convert.ToString(value.Name);
        }
    }
}