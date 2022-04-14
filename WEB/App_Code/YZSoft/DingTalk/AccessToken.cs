using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using YZSoft.Web.Async;
using System.Timers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;

namespace YZSoft.Web.DingTalk
{
    public class AccessToken
    {
        public string appSecret { get; set; }
        public string accessToken { get; set; }
        public DateTime expireDate { get; set; }

        public AccessToken()
        {
        }
    }
}