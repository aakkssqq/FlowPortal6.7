using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.IO;
using System.Drawing;
using System.Threading;
using System.Collections.Generic;
using System.Text;
using System.Data.Common;
using System.Data.SqlClient;
using BPM;
using YZSoft.Web.Social;

namespace YZSoft.Web.DAL
{
    partial class SqlServerProvider
    {
        public virtual IDataReader GetTopicMessages(IDbConnection cn, YZResourceType resType, string resId)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "SELECT * FROM YZAppCommunication WHERE resType=@resType AND resId=@resId AND replyto IS NULL ORDER BY id DESC";

                cmd.Parameters.Add("@resType", SqlDbType.NVarChar).Value = resType.ToString();
                cmd.Parameters.Add("@resId", SqlDbType.NVarChar).Value = resId;
                return cmd.ExecuteReader();
            }
        }

        public virtual IDataReader GetSocialMessagesPrev(IDbConnection cn, YZResourceType resType, string resId, int msgId, int rows)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"
WITH A AS(
    SELECT * FROM YZAppCommunication WHERE resType=@resType AND resId=@resId AND ((id < @msgId) OR @msgId=-1)
),
B AS(
	SELECT *,ROW_NUMBER() OVER(ORDER BY id DESC) AS RowNum FROM A
)
SELECT * FROM B WHERE RowNum <= @rows ORDER BY id ASC
";

                cmd.Parameters.Add("@resType", SqlDbType.NVarChar).Value = resType.ToString();
                cmd.Parameters.Add("@resId", SqlDbType.NVarChar).Value = resId;
                cmd.Parameters.Add("@msgId", SqlDbType.Int).Value = msgId;
                cmd.Parameters.Add("@rows", SqlDbType.Int).Value = rows;
                return cmd.ExecuteReader();
            }
        }

        public virtual IDataReader GetSocialMessagesNext(IDbConnection cn, YZResourceType resType, string resId, int msgId, int rows)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"
WITH A AS(
    SELECT * FROM YZAppCommunication WHERE resType=@resType AND resId=@resId AND ((id > @msgId) OR @msgId=-1)
),
B AS(
	SELECT *,ROW_NUMBER() OVER(ORDER BY id ASC) AS RowNum FROM A
)
SELECT * FROM B WHERE RowNum <= @rows ORDER BY id ASC
";

                cmd.Parameters.Add("@resType", SqlDbType.NVarChar).Value = resType.ToString();
                cmd.Parameters.Add("@resId", SqlDbType.NVarChar).Value = resId;
                cmd.Parameters.Add("@msgId", SqlDbType.Int).Value = msgId;
                cmd.Parameters.Add("@rows", SqlDbType.Int).Value = rows;
                return cmd.ExecuteReader();
            }
        }

        public virtual IDataReader GetMessageReplies(IDbConnection cn, int replyto)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "SELECT * FROM YZAppCommunication WHERE replyto=@replyto ORDER BY id";

                cmd.Parameters.Add("@replyto", SqlDbType.Int).Value = replyto;
                return cmd.ExecuteReader();
            }
        }

        public virtual IDataReader GetTopicMessageCount(IDbConnection cn, YZResourceType resType, string resId)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SELECT count(*) FROM YZAppCommunication WHERE resType=@resType AND resId=@resId";
                cmd.Parameters.Add("@resType", SqlDbType.NVarChar).Value = resType.ToString();
                cmd.Parameters.Add("@resId", SqlDbType.NVarChar).Value = resId;
                return cmd.ExecuteReader();
            }
        }

        public virtual IDataReader GetTopicNewMessageCount(IDbConnection cn, YZResourceType resType, string resId, string uid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"
DECLARE @readId int
SELECT @readId = ISNULL(max(readId),0) FROM YZAppCommunicationRead WHERE resType=@resType AND resId=@resId and uid=@uid
SELECT count(*) FROM YZAppCommunication WHERE resType=@resType AND resId=@resId and id>@readId
";

                cmd.Parameters.Add("@resType", SqlDbType.NVarChar).Value = resType.ToString();
                cmd.Parameters.Add("@resId", SqlDbType.NVarChar).Value = resId;
                cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = uid;
                return cmd.ExecuteReader();
            }
        }

        public virtual IDataReader GetTopicNewMessages(IDbConnection cn, YZResourceType resType, string resId, int maxReadedMessageId)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "SELECT * FROM YZAppCommunication WHERE resType=@resType AND resId=@resId AND id>@id ORDER BY id";

                cmd.Parameters.Add("@resType", SqlDbType.NVarChar).Value = resType.ToString();
                cmd.Parameters.Add("@resId", SqlDbType.NVarChar).Value = resId;
                cmd.Parameters.Add("@id", SqlDbType.Int).Value = maxReadedMessageId;
                return cmd.ExecuteReader();
            }
        }

        public virtual void UpdateTopicReaded(IDbConnection cn, YZResourceType resType, string resId, string uid, int maxReadedMessageId)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.AppendLine("SELECT * FROM YZAppCommunicationRead WHERE uid=@uid AND resType=@resType AND resId=@resId AND readId>@readId");
                sb.AppendLine("IF @@ROWCOUNT = 0");
                sb.AppendLine("BEGIN");
                sb.AppendLine("UPDATE YZAppCommunicationRead SET readId=@readId WHERE uid=@uid AND resType=@resType AND resId=@resId");
                sb.AppendLine("IF @@ROWCOUNT = 0");
                sb.AppendLine("INSERT INTO YZAppCommunicationRead(uid,resType,resId,readId) VALUES(@uid,@resType,@resId,@readId)");
                sb.AppendLine("END");

                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = uid;
                cmd.Parameters.Add("@resType", SqlDbType.NVarChar).Value = resType.ToString();
                cmd.Parameters.Add("@resId", SqlDbType.NVarChar).Value = resId;
                cmd.Parameters.Add("@readId", SqlDbType.Int).Value = maxReadedMessageId;

                cmd.ExecuteNonQuery();
            }
        }

        public IDataReader GetMessageByID(IDbConnection cn, int messageid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SELECT * FROM YZAppCommunication WHERE id=@id";
                cmd.Parameters.Add("@id", SqlDbType.Int).Value = messageid;
                return cmd.ExecuteReader();
            }
        }

        public void Insert(IDbConnection cn, YZMessage message)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("SET NOCOUNT ON;");
                sb.Append("INSERT INTO YZAppCommunication(");
                sb.Append("resType,");
                sb.Append("resId,");
                sb.Append("uid,");
                sb.Append("date,");
                sb.Append("message,");
                sb.Append("replyto,");
                sb.Append("duration) ");
                sb.Append("VALUES(");
                sb.Append("@resType,");
                sb.Append("@resId,");
                sb.Append("@uid,");
                sb.Append("@date,");
                sb.Append("@message,");
                sb.Append("@replyto,");
                sb.Append("@duration);");
                sb.Append("SELECT SCOPE_IDENTITY()");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@resType", SqlDbType.NVarChar).Value = message.resType.ToString();
                cmd.Parameters.Add("@resId", SqlDbType.NVarChar).Value = this.Convert(message.resId, false);
                cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = this.Convert(message.uid, true);
                cmd.Parameters.Add("@date", SqlDbType.DateTime).Value = this.Convert(message.date, true);
                cmd.Parameters.Add("@message", SqlDbType.NVarChar).Value = this.Convert(message.message, true);
                cmd.Parameters.Add("@replyto", SqlDbType.Int).Value = this.Convert(message.replyto, true);
                cmd.Parameters.Add("@duration", SqlDbType.Int).Value = this.Convert(message.duration, true);

                message.id = System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public void Insert(IDbConnection cn, YZMessageVote vote)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("SET NOCOUNT ON;");
                sb.Append("INSERT INTO YZAppCommunicationVote(");
                sb.Append("messageid,");
                sb.Append("uid,");
                sb.Append("date) ");
                sb.Append("VALUES(");
                sb.Append("@messageid,");
                sb.Append("@uid,");
                sb.Append("@date);");
                sb.Append("SELECT SCOPE_IDENTITY()");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@messageid", SqlDbType.NVarChar).Value = vote.messageid;
                cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = this.Convert(vote.uid, false);
                cmd.Parameters.Add("@date", SqlDbType.DateTime).Value = this.Convert(vote.date, false);

                vote.id = System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public IDataReader GetVotePraisedCount(IDbConnection cn, int messageid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SELECT count(*) FROM YZAppCommunicationVote WHERE messageid=@messageid";
                cmd.Parameters.Add("@messageid", SqlDbType.Int).Value = messageid;
                return cmd.ExecuteReader();
            }
        }

        public IDataReader HasVoted(IDbConnection cn, int messageid, string uid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SELECT count(*) FROM YZAppCommunicationVote WHERE messageid=@messageid AND uid=@uid";
                cmd.Parameters.Add("@messageid", SqlDbType.Int).Value = messageid;
                cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = uid;
                return cmd.ExecuteReader();
            }
        }

        public void DeleteVote(IDbConnection cn, int messageid, string uid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"DELETE FROM YZAppCommunicationVote WHERE messageid=@messageid AND uid=@uid";
                cmd.Parameters.Add("@messageid", SqlDbType.Int).Value = messageid;
                cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = uid;
                cmd.ExecuteNonQuery();
            }
        }

        public virtual IDataReader SearchSocialTopics(IDbConnection cn, string uid, int days, string keyword)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                cmd.CommandText = String.Format(String.Format(@"
WITH GroupIDs AS(
	SELECT GroupID FROM YZAppGroupMembers WHERE UID=@uid
),
Groups AS(
	SELECT 'Group' as resType,YZAppGroup.GroupID as resId,YZAppGroup.Name as resName FROM GroupIDs LEFT JOIN YZAppGroup ON GroupIDs.GroupID=YZAppGroup.GroupID WHERE YZAppGroup.Deleted<>1 AND Name LIKE(N'%{0}%')
),
SpecTopicAll AS(
    SELECT 'TaskApproved' as resType,@uid as resId,@TaskApprovedText as resName union all
    SELECT 'TaskRejected' as resType,@uid as resId,@TaskRejectedText as resName union all
    SELECT 'ProcessRemind' as resType,@uid as resId,@ProcessRemindText as resName union all
    SELECT 'AdministratorNotification' as resType,@uid as resId,@AdministratorNotificationText as resName
),
SpecTopic AS(
    SELECT * FROM SpecTopicAll WHERE resName LIKE(N'%{0}%')
),
TaskIDsAll AS(
	SELECT resId from YZAppCommunication WHERE resType='Task' AND ExtDate>@fromdate GROUP BY resId
),
TaskIDs AS(
	SELECT * from TaskIDsAll WHERE
    exists(SELECT TaskID FROM BPMInstTasks WHERE TaskID=TaskIDsAll.resId and State<>'Deleted' and State<>'Aborted')
	and (
		exists(SELECT TaskID FROM BPMInstTasks WHERE TaskID=TaskIDsAll.resId and (OwnerAccount=@uid or AgentAccount=@uid))
		or exists(SELECT TaskID FROM BPMInstProcSteps WHERE TaskID=TaskIDsAll.resId and (OwnerAccount=@uid or AgentAccount=@uid or ConsignOwnerAccount=@uid))
	)
),
Tasks AS(
	SELECT 'Task' as resType,TaskIDs.resId,BPMInstTasks.ProcessName as resName FROM TaskIDs LEFT JOIN BPMInstTasks ON TaskIDs.resId=BPMInstTasks.TaskID WHERE ProcessName LIKE(N'%{0}%')
),
A AS(
	SELECT * FROM Groups union all
	SELECT * FROM SpecTopic union all
	SELECT * FROM Tasks
)
SELECT * FROM A;
", this.EncodeText(keyword)));

                cmd.Parameters.Add("@fromdate", SqlDbType.DateTime).Value = DateTime.Today.AddDays(-days);
                cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = this.Convert(uid, false);
                cmd.Parameters.Add("@TaskApprovedText", SqlDbType.NVarChar).Value = Resources.YZStrings.Aspx_Message_Title_Approved;
                cmd.Parameters.Add("@TaskRejectedText", SqlDbType.NVarChar).Value = Resources.YZStrings.Aspx_Message_Title_Rejected;
                cmd.Parameters.Add("@ProcessRemindText", SqlDbType.NVarChar).Value = Resources.YZStrings.Aspx_Message_Title_ProcessRemind;
                cmd.Parameters.Add("@AdministratorNotificationText", SqlDbType.NVarChar).Value = Resources.YZStrings.Aspx_Message_Title_AdministratorNotification;

                return cmd.ExecuteReader();
            }
        }

        public virtual IDataReader SearchSocialMessages(IDbConnection cn, string uid, int days, string keyword)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                cmd.CommandText = @"
WITH GroupIDs AS(
	SELECT GroupID FROM YZAppGroupMembers WHERE UID=@uid
),
GroupMessages AS(
    SELECT * FROM YZAppCommunication WHERE resType='Group' AND resId IN (SELECT GroupID FROM GroupIDs)
),
P2PGroupIDs AS(
	SELECT GroupID FROM YZAppP2PGroup WHERE Account1=@uid OR Account2=@uid
),
P2PMessages AS(
    SELECT * FROM YZAppCommunication WHERE resType='SingleChat' AND resId IN (SELECT GroupID FROM P2PGroupIDs)
),
SpecMessages AS(
    SELECT * FROM YZAppCommunication WHERE resType='TaskApproved' AND resId=@uid AND ExtDate>@fromdate union all
    SELECT * FROM YZAppCommunication WHERE resType='TaskRejected' AND resId=@uid AND ExtDate>@fromdate /*union all
    SELECT * FROM YZAppCommunication WHERE resType='ProcessRemind' AND resId=@uid AND ExtDate>@fromdate union all
    SELECT * FROM YZAppCommunication WHERE resType='AdministratorNotification' AND resId=@uid AND ExtDate>@fromdate*/
),
TaskIDsAll AS(
	SELECT resId from YZAppCommunication WHERE resType='Task' AND ExtDate>@fromdate GROUP BY resId
),
TaskIDs AS(
	SELECT * from TaskIDsAll WHERE
    exists(SELECT TaskID FROM BPMInstTasks WHERE TaskID=TaskIDsAll.resId and State<>'Deleted' and State<>'Aborted')
	and (
		exists(SELECT TaskID FROM BPMInstTasks WHERE TaskID=TaskIDsAll.resId and (OwnerAccount=@uid or AgentAccount=@uid))
		or exists(SELECT TaskID FROM BPMInstProcSteps WHERE TaskID=TaskIDsAll.resId and (OwnerAccount=@uid or AgentAccount=@uid or ConsignOwnerAccount=@uid))
	)
),
TaskMessages AS(
	SELECT * FROM YZAppCommunication WHERE resType='Task' AND resId in (SELECT resId from TaskIDs)
),
A AS(
	SELECT * FROM GroupMessages union all
	SELECT * FROM P2PMessages union all
	SELECT * FROM TaskMessages union all
	SELECT * FROM SpecMessages
),
B AS(
	SELECT * FROM A WHERE message LIKE @keyword
),
E AS(
	SELECT resType,resId,count(*) as total,max(id) as lastMsgId FROM B GROUP BY resType,resId
),
TaskF AS(
	SELECT BPMInstTasks.ProcessName as resName,E.* FROM E LEFT JOIN BPMInstTasks ON E.resId=BPMInstTasks.TaskID WHERE resType='Task'
),
GroupF AS(
	SELECT YZAppGroup.Name as resName,E.* FROM E JOIN YZAppGroup ON E.resId=YZAppGroup.GroupID WHERE resType='Group' AND YZAppGroup.Deleted<>1
),
P2PF AS(
	SELECT CASE @uid WHEN YZAppP2PGroup.Account1 THEN UserName2 ELSE UserName1 END as resName,E.* FROM E JOIN YZAppP2PGroup ON E.resId=YZAppP2PGroup.GroupID WHERE resType='SingleChat'
),
SpecF AS(
	SELECT @TaskApprovedText as resName,E.* FROM E WHERE resType='TaskApproved' union all
	SELECT @TaskRejectedText as resName,E.* FROM E WHERE resType='TaskRejected' union all
	SELECT @ProcessRemindText as resName,E.* FROM E WHERE resType='ProcessRemind' union all
	SELECT @AdministratorNotificationText as resName,E.* FROM E WHERE resType='AdministratorNotification'
),
L AS(
	SELECT * from TaskF union all
	SELECT * from GroupF union all
	SELECT * from P2PF union all
	SELECT * from SpecF
),
T AS(
	SELECT L.*,A.uid,A.date,A.message,A.replyto,A.duration FROM L LEFT JOIN A ON L.lastMsgId=A.id
)
SELECT * FROM T ORDER BY date DESC
";

                cmd.Parameters.Add("@fromdate", SqlDbType.DateTime).Value = DateTime.Today.AddDays(-days);
                cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = this.Convert(uid, false);
                cmd.Parameters.Add("@TaskApprovedText", SqlDbType.NVarChar).Value = Resources.YZStrings.Aspx_Message_Title_Approved;
                cmd.Parameters.Add("@TaskRejectedText", SqlDbType.NVarChar).Value = Resources.YZStrings.Aspx_Message_Title_Rejected;
                cmd.Parameters.Add("@ProcessRemindText", SqlDbType.NVarChar).Value = Resources.YZStrings.Aspx_Message_Title_ProcessRemind;
                cmd.Parameters.Add("@AdministratorNotificationText", SqlDbType.NVarChar).Value = Resources.YZStrings.Aspx_Message_Title_AdministratorNotification;
                cmd.Parameters.Add("@keyword", SqlDbType.NVarChar).Value = String.Format("%{0}%", keyword);

                return cmd.ExecuteReader();
            }
        }

        public virtual IDataReader SearchSocialMessagesInTopic(IDbConnection cn, string resType, string resId, int days, string keyword, int startRowIndex, int rows)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                cmd.CommandText = String.Format(String.Format(@"
WITH T AS(
	SELECT * FROM YZAppCommunication WHERE resType=@resType AND resId=@resId AND message LIKE(N'%{0}%')
),
X AS(SELECT *,ROW_NUMBER() OVER(ORDER BY date DESC) AS RowNum FROM T),
Y AS(SELECT count(*) AS TotalRows FROM X),
Z AS(SELECT X.*,Y.TotalRows FROM Y,X)
SELECT * FROM Z WHERE RowNum >= @StartRowIndex AND (RowNum<=@EndRowIndex OR @EndRowIndex < @StartRowIndex ) ORDER BY RowNum
", this.EncodeText(keyword)));

                PageInfo pageInfo = this.AjaxPageToDbPage(startRowIndex, rows);
                cmd.Parameters.Add("@StartRowIndex", SqlDbType.Int).Value = pageInfo.StartRowIndex;
                cmd.Parameters.Add("@EndRowIndex", SqlDbType.Int).Value = pageInfo.EndRowIndex;

                cmd.Parameters.Add("@resType", SqlDbType.NVarChar).Value = resType;
                cmd.Parameters.Add("@resId", SqlDbType.NVarChar).Value = resId;

                return cmd.ExecuteReader();
            }
        }
    }
}
