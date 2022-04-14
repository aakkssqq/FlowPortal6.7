using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web;

namespace YZSoft.Web.DingTalk
{
    public class AccessTokenCollection : KeyedCollection<string, AccessToken>
    {
        protected override string GetKeyForItem(AccessToken accessToken)
        {
            return accessToken.appSecret;
        }
    }
}