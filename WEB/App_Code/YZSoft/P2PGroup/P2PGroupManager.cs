using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using YZSoft.Web.DAL;
using BPM;
using BPM.Client;

namespace YZSoft.P2PGroup
{
    public class P2PGroupManager
    {
        private static P2PGroupManager _instance = null;

        static P2PGroupManager()
        {
            P2PGroupManager._instance = new P2PGroupManager();
        }

        #region 公共属性

        internal static P2PGroupManager Instance
        {
            get
            {
                return P2PGroupManager._instance;
            }
        }

        #endregion

        #region 服务

        public static P2PGroup GetGroup(IYZDbProvider provider, IDbConnection cn, int groupid)
        {
            P2PGroup group = null;
            try
            {
                using (YZReader reader = new YZReader(provider.GetP2PGroup(cn, groupid)))
                {
                    if (reader.Read())
                        group = new P2PGroup(reader);

                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppP2PGroup", e.Message);
            }

            if (group == null)
                throw new BPMException(String.Format(Resources.YZStrings.Aspx_Group_Ext_GroupNotExist, groupid));

            return group;
        }

        public static P2PGroup TryGetGroup(IYZDbProvider provider, IDbConnection cn, string  account1, string account2)
        {
            P2PGroup group = null;
            try
            {
                using (YZReader reader = new YZReader(provider.GetP2PGroup(cn, account1, account2)))
                {
                    if (reader.Read())
                        group = new P2PGroup(reader);

                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppP2PGroup", e.Message);
            }

            return group;
        }

        public static void Insert(IYZDbProvider provider, IDbConnection cn, P2PGroup group)
        {
            try
            {
                provider.Insert(cn, group);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBInsertDataErr, "YZAppP2PGroup", e.Message);
            }
        }

        #endregion
    }
}