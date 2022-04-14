using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading;
using System.Data;
using BPM;
using YZSoft.Group;
using YZSoft.Web.DAL;

namespace YZSoft.Web.PushNotification
{
    public class PushNotificationManager
    {
        public static BPMObjectNameCollection GetUidsFromRegisterId(IYZDbProvider provider, IDbConnection cn, string registerId)
        {
            try
            {
                BPMObjectNameCollection uids = new BPMObjectNameCollection();
                using (YZReader reader = new YZReader(provider.GetUidsFromPushNotificationRegisterId(cn, registerId)))
                {
                    while (reader.Read())
                    {
                        uids.Add(reader.ReadString(0));
                    }
                    return uids;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "BPMSysUserCommonInfo", e.Message);
            }
        }
    }
}