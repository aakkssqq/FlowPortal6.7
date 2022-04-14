using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using BPM;
using BPM.Client;

namespace YZSoft.Apps
{
    public class FootmarkCollection : BPMList<Footmark>
    {
        public UserCollection GetUsers(BPMConnection cn)
        {
            UserCollection users = new UserCollection();

            foreach (Footmark footmark in this)
            {
                if (users.Contains(footmark.Account))
                    continue;

                User user = User.TryGetUser(cn, footmark.Account);
                if (user != null)
                    users.Add(user);
            }

            return users;
        }

        public FootmarkCollection SubSet(string account)
        {
            FootmarkCollection rv = new FootmarkCollection();
            foreach (Footmark footmark in this)
            {
                if (NameCompare.EquName(footmark.Account, account))
                    rv.Add(footmark);
            }

            return rv;
        }

        public UserCollection GetUnSignedUsers(BPMConnection cn, BPMObjectNameCollection accounts)
        {
            BPMObjectNameCollection accountsUnSigned = new BPMObjectNameCollection();
            accountsUnSigned.AddRange(accounts);

            foreach (Footmark footmark in this)
            {
                if (accountsUnSigned.Contains(footmark.Account))
                    accountsUnSigned.Remove(footmark.Account);
            }

            UserCollection users = new UserCollection();
            foreach (string account in accountsUnSigned)
            {
                if (users.Contains(account))
                    continue;

                User user = User.TryGetUser(cn, account);
                if (user != null)
                    users.Add(user);
            }

            return users;
        }
    }
}