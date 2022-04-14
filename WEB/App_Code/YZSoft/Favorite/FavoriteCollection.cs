using System;
using System.Collections.Generic;
using System.Web;
using System.Data;
using BPM;
using BPM.Client;

/// <summary>
///YZComunity 的摘要说明
/// </summary>
namespace YZSoft.Web
{
    public class FavoriteCollection : BPMList<Favorite>
    {
        public FavoriteCollection()
        {
        }

        public FavoriteCollection(YZReader reader)
        {
            while (reader.Read())
            {
                Favorite favorite = new Favorite(reader);
                this.Add(favorite);
            }
        }

        public BPMObjectNameCollection ResIDs
        {
            get
            {
                BPMObjectNameCollection rv = new BPMObjectNameCollection();
                foreach(Favorite favorite in this)
                {
                    rv.Add(favorite.resId);
                }

                return rv;
            }
        }
    }
}