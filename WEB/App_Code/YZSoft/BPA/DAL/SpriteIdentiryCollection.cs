using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using BPM;

namespace YZSoft.Web.BPA
{
    public class SpriteIdentityCollection : BPMList<SpriteIdentity>
    {
        public bool Contains(string fileid,string spriteid)
        {
            foreach (SpriteIdentity identify in this)
            {
                if (identify.FileID == fileid &&
                    identify.SpriteID == spriteid)
                    return true;
            }

            return false;
        }
    }
}