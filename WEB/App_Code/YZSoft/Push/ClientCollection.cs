using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web;

namespace YZSoft.Web.Push
{
    public class ClientCollection : KeyedCollection<string, Client>
    {
        protected override string GetKeyForItem(Client client)
        {
            return client.ID;
        }
    }
}