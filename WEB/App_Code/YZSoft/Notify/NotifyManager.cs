using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading;
using System.Data;
using BPM;
using YZSoft.Group;
using YZSoft.P2PGroup;
using YZSoft.Web.DAL;

namespace YZSoft.Web.Notify
{
    public class NotifyManager
    {
        public static DataTable GetNotifyNewMessageCount(IYZDbProvider provider, IDbConnection cn, string uid, int days)
        {
            try
            {
                using (IDataReader reader = provider.GetNotifyNewMessageCount(cn, uid, days))
                {
                    DataTable result = provider.Load(reader);

                    PageResult.RegularColumnsName(result,new string[] {
                        "resType",
                        "newmessage"
                    });

                    return result;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppCommunication", e.Message);
            }
        }

        public static PageResult GetNotifyTopics(IYZDbProvider provider, IDbConnection cn, string uid, int days, int startRowIndex, int rows)
        {
            try
            {
                using (IDataReader reader = provider.GetNotifyTopics(cn, uid, days, startRowIndex, rows))
                {
                    PageResult result = provider.LoadPageResult(reader);

                    result.RegularColumnsName(new string[] {
                        "resName",
                        "resType",
                        "resId",
                        "newmessage",
                        "total",
                        "lastMsgId",
                        "uid",
                        "date",
                        "message",
                        "replyto",
                        "duration",
                        "hasnewmessage"
                    });

                    return result;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppCommunication", e.Message);
            }
        }

        public static BPMObjectNameCollection GetNotifyUsersTaskSocial(IYZDbProvider provider, IDbConnection cn,int taskid)
        {
            try
            {
                BPMObjectNameCollection uids = new BPMObjectNameCollection();
                using (YZReader reader = new YZReader(provider.GetNotifyUsersTaskSocial(cn, taskid)))
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
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "BPMInstProcSteps", e.Message);
            }
        }

        public static BPMObjectNameCollection GetNotifyUsers(YZResourceType resType, string resId)
        {
            BPMObjectNameCollection uids = new BPMObjectNameCollection();

            switch (resType)
            {
                case YZResourceType.Group:
                    using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                    {
                        using (IDbConnection cn = provider.OpenConnection())
                        {
                            MemberCollection members = GroupManager.GetGroupMembers(provider, cn, Int32.Parse(resId));
                            foreach (Member member in members)
                                uids.Add(member.UID);
                        }
                    }
                    break;
                case YZResourceType.SingleChat:
                    using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                    {
                        using (IDbConnection cn = provider.OpenConnection())
                        {
                            P2PGroup.P2PGroup group = P2PGroupManager.GetGroup(provider, cn, Int32.Parse(resId));
                            uids.Add(group.Account1);
                            uids.Add(group.Account2);
                        }
                    }
                    break;
                case YZResourceType.Task:
                    using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                    {
                        using (IDbConnection cn = provider.OpenConnection())
                        {
                            uids = NotifyManager.GetNotifyUsersTaskSocial(provider, cn, Int32.Parse(resId));
                        }
                    }
                    break;
            }

            return uids;
        }
    }
}