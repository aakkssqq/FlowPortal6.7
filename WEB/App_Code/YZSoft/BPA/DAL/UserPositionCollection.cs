using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using BPM;
using YZSoft.Web.DAL;

namespace YZSoft.Web.BPA
{
    public class UserPositionCollection : BPMList<UserPosition>
    {
        public SpriteCollection GetSprites(IYZDbProvider provider, IDbConnection cn)
        {
            SpriteCollection rv = new SpriteCollection();
            foreach (UserPosition pos in this)
            {
                Sprite sprite = pos.TryGetSprite(provider, cn);
                if (sprite != null && !rv.Contains(sprite.Id,sprite.Name))
                    rv.Add(sprite);
            }

            return rv;
        }
    }
}