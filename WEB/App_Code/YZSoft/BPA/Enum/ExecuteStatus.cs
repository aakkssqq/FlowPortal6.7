using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using YZSoft.Web.DAL;
using BPM;

namespace YZSoft.Web.BPA
{
    public enum ExecuteStatus
    {
        NoExecute,
        Regulation,
        PartialOnlineExecute,
        CompleteOnlineExecute
    }
}