using System;
using System.Collections.Generic;
using System.Web;
using System.Data;
using YZSoft.Web.DAL;
using BPM;

/// <summary>
///YZComunity 的摘要说明
/// </summary>
namespace YZSoft.Web.Social
{
    public class SocialManager
    {
        public static YZMessageCollection GetMessages(IYZDbProvider provider, IDbConnection cn, YZResourceType resType, string resId)
        {
            try
            {
                using (IDataReader reader = provider.GetTopicMessages(cn, resType, resId))
                {
                    return new YZMessageCollection(reader);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppCommunication", e.Message);
            }
        }

        public static YZMessageCollection GetSocialMessagesPrev(IYZDbProvider provider, IDbConnection cn, YZResourceType resType, string resId, int msgId, int rows)
        {
            try
            {
                using (IDataReader reader = provider.GetSocialMessagesPrev(cn, resType, resId, msgId, rows))
                {
                    return new YZMessageCollection(reader);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppCommunication", e.Message);
            }
        }

        public static YZMessageCollection GetSocialMessagesNext(IYZDbProvider provider, IDbConnection cn, YZResourceType resType, string resId, int msgId, int rows)
        {
            try
            {
                using (IDataReader reader = provider.GetSocialMessagesNext(cn, resType, resId, msgId, rows))
                {
                    return new YZMessageCollection(reader);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppCommunication", e.Message);
            }
        }

        public static YZMessageCollection GetMessageReplies(IYZDbProvider provider, IDbConnection cn, int replyto)
        {
            try
            {
                using (IDataReader reader = provider.GetMessageReplies(cn, replyto))
                {
                    return new YZMessageCollection(reader);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppCommunication", e.Message);
            }
        }

        public static int GetMessageCount(IYZDbProvider provider, IDbConnection cn, YZResourceType resType, string resId)
        {
            try
            {
                using (YZReader reader = new YZReader(provider.GetTopicMessageCount(cn, resType, resId)))
                {
                    reader.Read();
                    return reader.ReadInt32(0);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBInsertDataErr, "YZAppCommunication", e.Message);
            }
        }

        public static int GetNewMessageCount(IYZDbProvider provider, IDbConnection cn, YZResourceType resType, string resId, string uid)
        {
            try
            {
                using (YZReader reader = new YZReader(provider.GetTopicNewMessageCount(cn, resType, resId, uid)))
                {
                    reader.Read();
                    return reader.ReadInt32(0);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBInsertDataErr, "YZAppCommunication", e.Message);
            }
        }

        public static YZMessageCollection GetNewMessages(IYZDbProvider provider, IDbConnection cn, YZResourceType resType, string resId, int maxReadedMessageId)
        {
            try
            {
                using (IDataReader reader = provider.GetTopicNewMessages(cn, resType, resId, maxReadedMessageId))
                {
                    return new YZMessageCollection(reader);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppCommunication", e.Message);
            }
        }

        public static void UpdateReaded(IYZDbProvider provider, IDbConnection cn, YZResourceType resType, string resId, string uid, int maxReadedMessageId)
        {
            provider.UpdateTopicReaded(cn, resType, resId, uid, maxReadedMessageId);
        }

        public static YZMessage GetMessageByID(IYZDbProvider provider, IDbConnection cn, int messageid)
        {
            YZMessage message = null;
            try
            {
                using (IDataReader reader = provider.GetMessageByID(cn, messageid))
                {
                    if (reader.Read())
                        message = new YZMessage(reader);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppCommunication", e.Message);
            }

            if (message == null)
                throw new BPMException(String.Format(Resources.YZStrings.Aspx_Social_Ext_MessageNotExist, messageid));

            return message;
        }

        public static void Insert(IYZDbProvider provider, IDbConnection cn, YZMessage message)
        {
            try
            {
                provider.Insert(cn, message);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBInsertDataErr, "YZAppCommunication", e.Message);
            }
        }

        public static void Insert(IYZDbProvider provider, IDbConnection cn, YZMessageVote vote)
        {
            try
            {
                provider.Insert(cn, vote);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBInsertDataErr, "YZAppCommunicationVote", e.Message);
            }
        }

        public static int GetVotePraisedCount(IYZDbProvider provider, IDbConnection cn, int messageid)
        {
            try
            {
                using (YZReader reader = new YZReader(provider.GetVotePraisedCount(cn, messageid)))
                {
                    reader.Read();
                    return reader.ReadInt32(0);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBInsertDataErr, "YZAppCommunicationVote", e.Message);
            }
        }

        public static bool HasVoted(IYZDbProvider provider, IDbConnection cn, int messageid,string uid)
        {
            try
            {
                using (YZReader reader = new YZReader(provider.HasVoted(cn, messageid, uid)))
                {
                    reader.Read();
                    return reader.ReadInt32(0) == 0 ? false:true;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppCommunicationVote", e.Message);
            }
        }

        public static void DeleteVote(IYZDbProvider provider, IDbConnection cn, int messageid, string uid)
        {
            try
            {
                provider.DeleteVote(cn, messageid, uid);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZAppCommunicationVote", e.Message);
            }
        }

        public static DataTable SearchSocialTopics(IYZDbProvider provider, IDbConnection cn, string uid, int days, string keyword)
        {
            try
            {
                using (IDataReader reader = provider.SearchSocialTopics(cn, uid, days, keyword))
                {
                    DataTable result = provider.Load(reader);

                    PageResult.RegularColumnsName(result,new string[] {
                        "resType",
                        "resId",
                        "resName"
                    });

                    return result;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppCommunication", e.Message);
            }
        }

        public static DataTable SearchSocialMessages(IYZDbProvider provider, IDbConnection cn, string uid, int days, string keyword)
        {
            try
            {
                using (IDataReader reader = provider.SearchSocialMessages(cn, uid, days, keyword))
                {
                    DataTable result = provider.Load(reader);

                    PageResult.RegularColumnsName(result,new string[] {
                        "resName",
                        "resType",
                        "resId",
                        "total",
                        "lastMsgId",
                        "uid",
                        "date",
                        "message",
                        "replyto",
                        "duration"
                    });

                    return result;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppCommunication", e.Message);
            }
        }

        public static PageResult SearchSocialMessagesInTopic(IYZDbProvider provider, IDbConnection cn, string resType, string resId, int days, string keyword,int startRowIndex,int rows)
        {
            try
            {
                using (IDataReader reader = provider.SearchSocialMessagesInTopic(cn, resType, resId, days, keyword, startRowIndex, rows))
                {
                    PageResult result = provider.LoadPageResult(reader);

                    result.RegularColumnsName(new string[] {
                        "id",
                        "resType",
                        "resId",
                        "uid",
                        "date",
                        "message",
                        "replyto",
                        "duration"
                    });

                    return result;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppCommunication", e.Message);
            }
        }
    }
}