using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPMClient = BPM.Client;
using BPM.Client.Notify;
using YZSoft.Web.DAL;
using YZSoft.Web.Social;
using YZSoft.Web;

namespace YZSoft.Services.REST.core
{
    public class FavoriteHandler : YZServiceHandler
    {
        public virtual object AddFavorite(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            YZResourceType resType = request.GetEnum<YZResourceType>("resType");
            string resId = request.GetString("resId");
            string comments = request.GetString("comments",null);
            string uid = YZAuthHelper.LoginUserAccount;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    if (!FavoriteManager.HasFavorited(provider, cn, uid, resType, resId))
                    {
                        Favorite favorite = new Favorite() {
                            uid = uid,
                            resType = resType,
                            resId = resId,
                            comments = comments,
                            date = DateTime.Now,
                            orderIndex = FavoriteManager.GetNextOrderIndex(provider,cn,uid,resType)
                        };

                        FavoriteManager.Insert(provider, cn, favorite);
                    }

                    return true;
                }
            }
        }

        public virtual object CancelFavorite(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            YZResourceType resType = request.GetEnum<YZResourceType>("resType");
            string resId = request.GetString("resId");
            string comments = request.GetString("comments", null);
            string uid = YZAuthHelper.LoginUserAccount;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    if (FavoriteManager.HasFavorited(provider, cn, uid, resType, resId))
                    {
                        FavoriteManager.DeleteFavorite(provider, cn, uid, resType, resId);
                    }

                    return false;
                }
            }
        }

        public virtual void MoveFavorites(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = YZAuthHelper.LoginUserAccount;
            YZResourceType resType = request.GetEnum<YZResourceType>("resType");
            string target = request.GetString("target");
            MovePosition position = request.GetEnum<MovePosition>("position");
            JArray post = request.GetPostData<JArray>();
            List<string> ids = post.ToObject<List<string>>();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    FavoriteManager.MoveFavorites(provider, cn, uid, resType, ids.ToArray(), target, position);
                }
            }
        }
    }
}