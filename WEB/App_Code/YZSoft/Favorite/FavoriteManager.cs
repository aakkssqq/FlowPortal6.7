using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using YZSoft.Web.DAL;
using BPM;
using BPM.Client;
using System.IO;

namespace YZSoft.Web
{
    public class FavoriteManager
    {
        private static FavoriteManager _instance = null;

        static FavoriteManager()
        {
            FavoriteManager._instance = new FavoriteManager();
        }

        #region 公共属性

        internal static FavoriteManager Instance
        {
            get
            {
                return FavoriteManager._instance;
            }
        }

        #endregion

        #region 服务

        public static FavoriteCollection GetFavorites(IYZDbProvider provider, IDbConnection cn, string uid, YZResourceType resType)
        {
            try
            {
                using (YZReader reader = new YZReader(provider.GetFavorites(cn, uid, resType)))
                {
                    return new FavoriteCollection(reader);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZSysFavorites", e.Message);
            }
        }

        public static bool HasFavorited(IYZDbProvider provider, IDbConnection cn, string uid, YZResourceType resType, string resId)
        {
            try
            {
                using (YZReader reader = new YZReader(provider.HasFavorited(cn, uid, resType, resId)))
                {
                    reader.Read();
                    return reader.ReadInt32(0) == 0 ? false : true;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZSysFavorites", e.Message);
            }
        }

        public static void DeleteFavorite(IYZDbProvider provider, IDbConnection cn, string uid, YZResourceType resType, string resId)
        {
            try
            {
                provider.DeleteFavorite(cn, uid, resType, resId);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZSysFavorites", e.Message);
            }
        }

        public static void Insert(IYZDbProvider provider, IDbConnection cn, Favorite favorite)
        {
            try
            {
                provider.Insert(cn, favorite);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBInsertDataErr, "YZSysFavorites", e.Message);
            }
        }

        public static int GetNextOrderIndex(IYZDbProvider provider, IDbConnection cn, string uid, YZResourceType resType)
        {
            try
            {
                return provider.GetNextOrderIndex(cn, "YZSysFavorites", "uid", uid, "resType", resType.ToString());
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZSysFavorites", e.Message);
            }
        }

        public static void UpdateOrderIndex(IYZDbProvider provider, IDbConnection cn, Favorite favorite)
        {
            try
            {
                provider.UpdateOrderIndex(cn, favorite);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZSysFavorites", e.Message);
            }
        }

        public static void MoveFavorites(IYZDbProvider provider, IDbConnection cn, string uid, YZResourceType resType, string[] resIds, string targetResId, MovePosition position)
        {
            FavoriteCollection favorites = GetFavorites(provider, cn, uid, resType);

            favorites.Move<string>("resId", resIds, targetResId, position);

            for (int i = 0; i < favorites.Count; i++)
            {
                Favorite favorite = favorites[i];
                favorite.orderIndex = i;
                FavoriteManager.UpdateOrderIndex(provider, cn, favorite);
            }
        }

        #endregion
    }
}