using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Drawing;
using System.IO;
using System.Data.Common;
using System.Runtime.Serialization;
using BPM;
using YZSoft.Web.Social;

namespace YZSoft.Web.DAL
{
    partial interface IYZDbProvider
    {
        IDataReader GetTopicMessages(IDbConnection cn, YZResourceType resType, string resId);
        IDataReader GetSocialMessagesPrev(IDbConnection cn, YZResourceType resType, string resId, int msgId, int rows);
        IDataReader GetSocialMessagesNext(IDbConnection cn, YZResourceType resType, string resId, int msgId, int rows);
        IDataReader GetMessageReplies(IDbConnection cn, int replyto);
        IDataReader GetTopicMessageCount(IDbConnection cn, YZResourceType resType, string resId);
        IDataReader GetTopicNewMessageCount(IDbConnection cn, YZResourceType resType, string resId, string uid);
        IDataReader GetTopicNewMessages(IDbConnection cn, YZResourceType resType, string resId, int maxReadedMessageId);
        void UpdateTopicReaded(IDbConnection cn, YZResourceType resType, string resId, string uid, int maxReadedMessageId);
        IDataReader GetMessageByID(IDbConnection cn, int messageid);
        void Insert(IDbConnection cn, YZMessage message);

        //vote
        void Insert(IDbConnection cn, YZMessageVote vote);
        IDataReader GetVotePraisedCount(IDbConnection cn, int messageid);
        IDataReader HasVoted(IDbConnection cn, int messageid, string uid);
        void DeleteVote(IDbConnection cn, int messageid, string uid);

        //search
        IDataReader SearchSocialTopics(IDbConnection cn, string uid, int days, string keyword);
        IDataReader SearchSocialMessages(IDbConnection cn, string uid, int days, string keyword);
        IDataReader SearchSocialMessagesInTopic(IDbConnection cn, string resType, string resId, int days, string keyword, int startRowIndex, int rows);
    }
}
