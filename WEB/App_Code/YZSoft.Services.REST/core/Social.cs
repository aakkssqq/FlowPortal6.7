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
using YZSoft.Group;

namespace YZSoft.Services.REST.core
{
    public class SocialHandler : YZServiceHandler
    {
        public virtual object GetMessages(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            YZResourceType resType = request.GetEnum<YZResourceType>("resType");
            string resId = request.GetString("resId");

            YZMessageCollection messagesAll = new YZMessageCollection();
            YZMessageCollection messages;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    messages = SocialManager.GetMessages(provider, cn, resType, resId);
                    messagesAll.AddRange(messages);

                    foreach (YZMessage message in messages)
                    {
                        YZMessageCollection replies = SocialManager.GetMessageReplies(provider, cn, message.id);
                        message["Replies"] = replies;
                        message["Praised"] = SocialManager.GetVotePraisedCount(provider, cn, message.id);

                        messagesAll.AddRange(replies);
                    }
                }
            }

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach (YZMessage message in messagesAll)
                    this.PostProcessMessage(cn, message);
            }

            return messages;
        }

        public virtual object GetSocialMessages(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            YZResourceType resType = request.GetEnum<YZResourceType>("resType");
            string resId = request.GetString("resId");
            string dir = request.GetString("dir");
            int msgId = request.GetInt32("msgId", -1);
            int rows = request.GetInt32("rows", 20);

            YZMessageCollection messages;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    if (NameCompare.EquName(dir,"prev"))
                        messages = SocialManager.GetSocialMessagesPrev(provider, cn, resType, resId, msgId, rows);
                    else
                        messages = SocialManager.GetSocialMessagesNext(provider, cn, resType, resId, msgId, rows);
                }
            }

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach (YZMessage message in messages)
                    this.PostProcessMessage(cn, message);
            }

            return messages;
        }

        public virtual object PostComments(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string clientid = request.GetString("clientid",null);
            YZResourceType resType = request.GetEnum<YZResourceType>("resType");
            string resId = request.GetString("resId");
            int duration = request.GetInt32("duration", -1);
            JObject jPost = request.GetPostData<JObject>();
            string msg = (string)jPost["message"];
            string uid = YZAuthHelper.LoginUserAccount;

            YZMessage message = new YZMessage();
            message.resType = resType;
            message.resId = resId;
            message.uid = uid;
            message.date = DateTime.Now;
            message.message = msg;
            message.replyto = -1;
            message.duration = duration;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                this.PostProcessMessage(cn, message);
            }

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    SocialManager.Insert(provider, cn, message);
                    SocialManager.UpdateReaded(provider, cn, resType, resId, uid, message.id);
                }
            }

            YZSoft.Web.Push.MessageBus.Instance.onPostComments(clientid, message);
            return message;
        }

        public virtual object Reply(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string clientid = request.GetString("clientid", null);
            int messageid = request.GetInt32("messageid");
            JObject jPost = request.GetPostData<JObject>();
            string msg = (string)jPost["message"];

            YZMessage parentMessage;
            YZMessage message = new YZMessage();
            YZMessageCollection replies;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    parentMessage = SocialManager.GetMessageByID(provider, cn, messageid);

                    message.resType = parentMessage.resType;
                    message.resId = parentMessage.resId;
                    message.uid = YZAuthHelper.LoginUserAccount;
                    message.date = DateTime.Now;
                    message.message = msg;
                    message.replyto = parentMessage.id;

                    SocialManager.Insert(provider, cn, message);

                    replies = SocialManager.GetMessageReplies(provider, cn, parentMessage.id);
                    parentMessage["Replies"] = replies;
                    parentMessage["Praised"] = SocialManager.GetVotePraisedCount(provider, cn, parentMessage.id);
                }
            }

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                this.PostProcessMessage(cn, parentMessage);

                foreach (YZMessage replyMessage in replies)
                    this.PostProcessMessage(cn, replyMessage);
            }

            YZSoft.Web.Push.MessageBus.Instance.onPostComments(clientid, message);

            return parentMessage;
        }

        public virtual object Praise(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int messageid = request.GetInt32("messageid");
            string uid = YZAuthHelper.LoginUserAccount;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    if (SocialManager.HasVoted(provider, cn, messageid, uid))
                    {
                        SocialManager.DeleteVote(provider, cn, messageid, uid);
                    }
                    else
                    {
                        YZMessageVote vote = new YZMessageVote();
                        vote.messageid = messageid;
                        vote.uid = uid;
                        vote.date = DateTime.Today;

                        SocialManager.Insert(provider, cn, vote);
                    }

                    return new {
                        Praised = SocialManager.GetVotePraisedCount(provider, cn, messageid)
                    };
                }
            }
        }

        public virtual object GetNewMesssageCount(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            YZResourceType resType = request.GetEnum<YZResourceType>("resType");
            string resId = request.GetString("resId");
            string uid = YZAuthHelper.LoginUserAccount;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return YZSoft.Web.Social.SocialManager.GetNewMessageCount(provider, cn, resType, resId, uid);
                }
            }
        }

        public virtual void UpdateReaded(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            YZResourceType resType = request.GetEnum<YZResourceType>("resType");
            string resId = request.GetString("resId");
            int msgId = request.GetInt32("msgId");
            string uid = YZAuthHelper.LoginUserAccount;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    YZSoft.Web.Social.SocialManager.UpdateReaded(provider, cn, resType, resId, uid, msgId);
                }
            }

            JObject jMessage = new JObject();
            YZMessage message = new YZMessage();
            message.resType = resType;
            message.resId = resId;
            message.uid = uid;
            message.message = jMessage.ToString();
            message.date = DateTime.Now;
            YZSoft.Web.Push.MessageBus.Instance.PushMessage(null, new string[] { "readed" }, message, false);
        }

        protected virtual void PostProcessMessage(BPMConnection cn, YZMessage message)
        {
            User user = User.TryGetUser(cn, message.uid);
            if (user == null)
            {
                user = new User();
                user.Account = message.uid;
            }

            message["UserDisplayName"] = user.ShortName;
        }

        public virtual object GetOUObjects(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path", null);
            bool role = request.GetBool("role", true);
            bool user = request.GetBool("user", true);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (String.IsNullOrEmpty(path))
                {
                    OUCollection ous = cn.GetRootOUs();
                    if (ous.Count == 1)
                        return this.GetOUObjects(cn, ous[0].FullName, role, user);
                }

                return this.GetOUObjects(cn, path, role, user);
            }
        }

        private OUCollection GetAllParentOU(BPMConnection cn, OU ou)
        {
            OUCollection ous = new OUCollection();

            while (ou != null)
            {
                ous.Insert(0,ou);
                ou = ou.GetParentOU(cn);
            }

            OUCollection roots = cn.GetRootOUs();
            if (roots.Count > 1)
            {
                ous.Insert(0, new OU()
                {
                    IsRootOU = true,
                    Name = Resources.YZStrings.All_OU1,
                    FullName = ""
                });
            }

            return ous;
        }

        private object GetOUObjects(BPMConnection cn, string path, bool includeRole, bool includeMember)
        {
            OUCollection parents = new OUCollection();
            OUCollection ous = new OUCollection();
            RoleCollection roles = new RoleCollection();
            BPMClient.MemberCollection members = new BPMClient.MemberCollection();

            if (String.IsNullOrEmpty(path))
            {
                ous = cn.GetRootOUs();
                parents = new OUCollection();
            }
            else
            {
                OU ou = OU.FromFullName(cn, path);
                parents = this.GetAllParentOU(cn, ou);

                ous = OU.GetChildren(cn, path);

                if (includeRole)
                    roles = OU.GetRoles(cn, path);

                if (includeMember)
                    members = OU.GetMembers(cn, path);
            }

            List<object> children = new List<object>();

            foreach (OU ou in ous)
            {
                children.Add(new {
                    Type = "OU",
                    data = ou
                });
            }

            foreach (Role role in roles)
            {
                children.Add(new
                {
                    Type = "Role",
                    data = role
                });
            }

            foreach (BPMClient.Member member in members)
            {
                User user = User.TryGetUser(cn, member.UserAccount);
                if (user != null && !user.Disabled)
                {
                    children.Add(new
                    {
                        Type = "Member",
                        data = new
                        {
                            member = member,
                            user = member.GetUser(cn)
                        }
                    });
                }
            }

            return new {
                metaData = new {
                    parents = parents
                },
                children = children
            };
        }
    }
}