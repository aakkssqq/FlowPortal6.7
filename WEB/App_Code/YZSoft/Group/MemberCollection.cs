using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using BPM;

namespace YZSoft.Group
{
    public class MemberCollection: BPMList<Member>
    {
        protected override string GetKey(Member value)
        {
            return value == null ? null : value.UID;
        }
    }
}