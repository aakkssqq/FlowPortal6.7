using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using BPM;

namespace YZSoft.Web.BPA
{
    public class LinkCollection : BPMList<Link>
    {
        public File File { get; set; }

        public LinkCollection(File file)
        {
            this.File = file;
        }

        protected override void OnInsert(int index, Link value)
        {
            value.File = this.File;
            base.OnInsert(index, value);
        }
    }
}