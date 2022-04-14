using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using YZSoft.Web.DAL;
using BPM;
using BPM.Client;
using BPM.Client.Security;

namespace YZSoft.Web.BPA
{
    public class BPAManager
    {
        private static BPAManager _instance = null;

        static BPAManager()
        {
            BPAManager._instance = new BPAManager();
        }

        #region 公共属性

        internal static BPAManager Instance
        {
            get
            {
                return BPAManager._instance;
            }
        }

        #endregion

        #region 服务

        public static bool ISBPAFileWritable(IYZDbProvider provider, IDbConnection cn, BPMConnection bpmcn, string fileid)
        {
            FileSystem.FileCollection files = FileSystem.DirectoryManager.GetFiles(provider,cn,fileid);
            foreach (FileSystem.File file in files)
            {
                if (file.ISBPAFileWritable(provider, cn, bpmcn))
                    return true;
            }

            return false;
        }

        public static SpriteLinkCollection GetSpriteUsedByLinks(IYZDbProvider provider, IDbConnection cn, string fileid, string spriteid, string property)
        {
            try
            {
                SpriteLinkCollection links = new SpriteLinkCollection();
                using (YZReader reader = new YZReader(provider.GetSpriteUsedByLinks(cn, fileid, spriteid, property)))
                {
                    while (reader.Read())
                    {
                        SpriteLink link = new SpriteLink(reader);
                        links.Add(link);
                    }

                }
                return links;
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "BPASpriteLink", e.Message);
            }
        }

        public static SpriteLinkCollection GetFileUsedByLinks(IYZDbProvider provider, IDbConnection cn, string fileid, string property)
        {
            try
            {
                SpriteLinkCollection links = new SpriteLinkCollection();
                using (YZReader reader = new YZReader(provider.GetFileUsedByLinks(cn, fileid, property)))
                {
                    while (reader.Read())
                    {
                        SpriteLink link = new SpriteLink(reader);
                        links.Add(link);
                    }

                }
                return links;
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "BPASpriteLink", e.Message);
            }
        }

        public static UserPositionCollection GetUserPositions(IYZDbProvider provider, IDbConnection cn, string uid)
        {
            try
            {
                UserPositionCollection poses = new UserPositionCollection();
                using (YZReader reader = new YZReader(provider.GetUserPositions(cn, uid)))
                {
                    while (reader.Read())
                    {
                        UserPosition pos = new UserPosition(reader);
                        poses.Add(pos);
                    }

                }
                return poses;
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "BPAUserPosition", e.Message);
            }
        }

        public static SpriteIdentity TryGetSpriteIdentity(IYZDbProvider provider, IDbConnection cn, string fileid, string spriteid)
        {
            SpriteIdentity spriteIdentity = null;
            try
            {
                using (YZReader reader = new YZReader(provider.GetSpriteIdentity(cn, fileid, spriteid)))
                {
                    if (reader.Read())
                        spriteIdentity = new SpriteIdentity(reader);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "BPASpriteIdentity", e.Message);
            }

            return spriteIdentity;
        }

        public static void ClearSpriteIdentityOfFile(IYZDbProvider provider, IDbConnection cn, string fileid)
        {
            provider.ClearSpriteIdentityOfFile(cn, fileid);
        }

        public static void ClearLinkOfFile(IYZDbProvider provider, IDbConnection cn, string fileid)
        {
            provider.ClearLinkOfFile(cn, fileid);
        }

        public static void Insert(IYZDbProvider provider, IDbConnection cn, SpriteIdentity spriteIdentity)
        {
            try
            {
                provider.Insert(cn, spriteIdentity);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBInsertDataErr, "BPASpriteIdentity", e.Message);
            }
        }

        public static void Insert(IYZDbProvider provider, IDbConnection cn, SpriteLink link)
        {
            try
            {
                provider.Insert(cn, link);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBInsertDataErr, "BPASpriteLink", e.Message);
            }
        }

        #endregion
    }
}