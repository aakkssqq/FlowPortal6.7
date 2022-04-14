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
using Oracle.ManagedDataAccess.Client;
using BPM;
using YZSoft.Web.Social;

namespace YZSoft.Web.DAL
{
    partial class OracleProvider
    {
        public virtual IDataReader GetTopicMessages(IDbConnection cn, YZResourceType resType, string resId)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "SELECT * FROM YZAPPCOMMUNICATION WHERE RESTYPE=:RESTYPE AND RESID=:RESID AND REPLYTO IS NULL ORDER BY ID DESC";

                cmd.Parameters.Add(":RESTYPE", OracleDbType.NVarchar2).Value = resType.ToString();
                cmd.Parameters.Add(":RESID", OracleDbType.NVarchar2).Value = resId;
                return cmd.ExecuteReader();
            }
        }

        public virtual IDataReader GetSocialMessagesPrev(IDbConnection cn, YZResourceType resType, string resId, int msgId, int rows)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"
WITH A AS(
    SELECT * FROM YZAppCommunication WHERE resType=:resType AND resId=:resId AND ((id < :msgId) OR :msgId=-1) ORDER BY id DESC
),
B AS(
	SELECT A.*,ROWNUM RN__ FROM A
)
SELECT * FROM B WHERE RN__ <= :PM_rows ORDER BY id ASC
";

                cmd.Parameters.Add(":resType", OracleDbType.NVarchar2).Value = resType.ToString();
                cmd.Parameters.Add(":resId", OracleDbType.NVarchar2).Value = resId;
                cmd.Parameters.Add(":msgId", OracleDbType.Int32).Value = msgId;
                cmd.Parameters.Add(":PM_rows", OracleDbType.Int32).Value = rows;
                return cmd.ExecuteReader();
            }
        }

        public virtual IDataReader GetSocialMessagesNext(IDbConnection cn, YZResourceType resType, string resId, int msgId, int rows)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"
WITH A AS(
    SELECT * FROM YZAppCommunication WHERE resType=:resType AND resId=:resId AND ((id > :msgId) OR :msgId=-1) ORDER BY id ASC
),
B AS(
	SELECT *,ROWNUM RN__ FROM A
)
SELECT * FROM B WHERE RN__ <= :PM_rows ORDER BY id ASC
";

                cmd.Parameters.Add(":resType", OracleDbType.NVarchar2).Value = resType.ToString();
                cmd.Parameters.Add(":resId", OracleDbType.NVarchar2).Value = resId;
                cmd.Parameters.Add(":msgId", OracleDbType.Int32).Value = msgId;
                cmd.Parameters.Add(":PM_rows", OracleDbType.Int32).Value = rows;
                return cmd.ExecuteReader();
            }
        }

        public virtual IDataReader GetMessageReplies(IDbConnection cn, int replyto)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "SELECT * FROM YZAPPCOMMUNICATION WHERE REPLYTO=:REPLYTO ORDER BY ID";

                cmd.Parameters.Add(":REPLYTO", OracleDbType.Int32).Value = replyto;
                return cmd.ExecuteReader();
            }
        }

        public virtual IDataReader GetTopicMessageCount(IDbConnection cn, YZResourceType resType, string resId)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "SELECT COUNT(*) FROM YZAPPCOMMUNICATION WHERE RESTYPE=:RESTYPE AND RESID=:RESID";
                cmd.Parameters.Add(":RESTYPE", OracleDbType.NVarchar2).Value = resType.ToString();
                cmd.Parameters.Add(":RESID", OracleDbType.NVarchar2).Value = resId;
                return cmd.ExecuteReader();
            }
        }

        public virtual IDataReader GetTopicNewMessageCount(IDbConnection cn, YZResourceType resType, string resId, string uid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "select NVL(max(readId),0) from YZAppCommunicationRead WHERE resType=:resType and resId=:resId and \"UID\"=:pm_uid";
                cmd.Parameters.Add(":resType", OracleDbType.NVarchar2).Value = resType.ToString();
                cmd.Parameters.Add(":resId", OracleDbType.NVarchar2).Value = resId;
                cmd.Parameters.Add(":pm_uid", OracleDbType.NVarchar2).Value = uid;

                int readId = 0;
                using (YZReader rd = new YZReader(cmd.ExecuteReader()))
                {
                    if (rd.Read())
                    {
                        readId = rd.ReadInt32(0);
                    }
                }

                cmd.Parameters.Clear();
                cmd.CommandText = "select count(*) from YZAppCommunication WHERE resType=:resType and resId=:resId and id>:readId";

                cmd.Parameters.Add(":resType", OracleDbType.NVarchar2).Value = resType.ToString();
                cmd.Parameters.Add(":resId", OracleDbType.NVarchar2).Value = resId;
                cmd.Parameters.Add(":readId", OracleDbType.Int32).Value = readId;

                return cmd.ExecuteReader();
            }
        }

        public virtual IDataReader GetTopicNewMessages(IDbConnection cn, YZResourceType resType, string resId, int maxReadedMessageId)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "SELECT * FROM YZAPPCOMMUNICATION WHERE RESTYPE=:RESTYPE AND RESID=:RESID AND ID>:ID ORDER BY ID";

                cmd.Parameters.Add(":RESTYPE", OracleDbType.NVarchar2).Value = resType.ToString();
                cmd.Parameters.Add(":RESID", OracleDbType.NVarchar2).Value = resId;
                cmd.Parameters.Add(":ID", OracleDbType.Int32).Value = maxReadedMessageId;
                return cmd.ExecuteReader();
            }
        }

        public virtual void UpdateTopicReaded(IDbConnection cn, YZResourceType resType, string resId, string uid, int maxReadedMessageId)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                StringBuilder sb = new StringBuilder();
                sb.AppendLine("DECLARE");
                sb.AppendLine("cnt NUMBER;");
                sb.AppendLine("cnt1 NUMBER;");
                sb.AppendLine("BEGIN");
                sb.AppendLine("SELECT COUNT(*) INTO cnt FROM YZAppCommunicationRead WHERE \"UID\"=:pm_uid AND resType=:resType AND resId=:resId AND readId>:readId;");
                sb.AppendLine("SELECT COUNT(*) INTO cnt1 FROM YZAppCommunicationRead WHERE \"UID\"=:pm_uid AND resType=:resType AND resId=:resId;");
                sb.AppendLine("IF(cnt = 0) THEN");
                sb.AppendLine("BEGIN");
                sb.AppendLine("IF(cnt1 != 0) THEN");
                sb.AppendLine("UPDATE YZAppCommunicationRead SET readId=:readId WHERE \"UID\"=:pm_uid AND resType=:resType AND resId=:resId;");
                sb.AppendLine("ELSE");
                sb.AppendLine("INSERT INTO YZAppCommunicationRead(\"UID\",resType,resId,readId) VALUES(:pm_uid,:resType,:resId,:readId);");
                sb.AppendLine("END IF;");
                sb.AppendLine("END;");
                sb.AppendLine("END IF;");
                sb.AppendLine("END;");

                cmd.CommandText = this.SBToString(sb);

                cmd.Parameters.Add(":pm_uid", OracleDbType.NVarchar2).Value = uid;
                cmd.Parameters.Add(":resType", OracleDbType.NVarchar2).Value = resType.ToString();
                cmd.Parameters.Add(":resId", OracleDbType.NVarchar2).Value = resId;
                cmd.Parameters.Add(":readId", OracleDbType.Int32).Value = maxReadedMessageId;

                cmd.ExecuteNonQuery();
            }
        }

        public IDataReader GetMessageByID(IDbConnection cn, int messageid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "SELECT * FROM YZAPPCOMMUNICATION WHERE ID=:ID";
                cmd.Parameters.Add(":ID", OracleDbType.Int32).Value = messageid;
                return cmd.ExecuteReader();
            }
        }

        public void Insert(IDbConnection cn, YZMessage message)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "SELECT BPMSEQ_YZAPPCOMMUNICATION.NEXTVAL FROM DUAL";
                message.id = System.Convert.ToInt32(cmd.ExecuteScalar());

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO YZAPPCOMMUNICATION(");
                sb.Append("ID,");
                sb.Append("RESTYPE,");
                sb.Append("RESID,");
                sb.Append("\"UID\",");
                sb.Append("\"DATE\",");
                sb.Append("MESSAGE,");
                sb.Append("REPLYTO,");
                sb.Append("DURATION) ");
                sb.Append("VALUES(");
                sb.Append(":ID,");
                sb.Append(":RESTYPE,");
                sb.Append(":RESID,");
                sb.Append(":PM_UID,");
                sb.Append(":DATE1,");
                sb.Append(":MESSAGE,");
                sb.Append(":REPLYTO,");
                sb.Append(":DURATION)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":ID", OracleDbType.Int32).Value = message.id;
                cmd.Parameters.Add(":RESTYPE", OracleDbType.NVarchar2).Value = message.resType.ToString();
                cmd.Parameters.Add(":RESID", OracleDbType.NVarchar2).Value = this.Convert(message.resId, false);
                cmd.Parameters.Add(":PM_UID", OracleDbType.NVarchar2).Value = this.Convert(message.uid, true);
                cmd.Parameters.Add(":DATE1", OracleDbType.Date).Value = this.Convert(message.date, true);
                cmd.Parameters.Add(":MESSAGE", OracleDbType.NVarchar2).Value = this.Convert(message.message, true);
                cmd.Parameters.Add(":REPLYTO", OracleDbType.Int32).Value = this.Convert(message.replyto, true);
                cmd.Parameters.Add(":DURATION", OracleDbType.Int32).Value = this.Convert(message.duration, true);

                cmd.ExecuteNonQuery();
            }
        }

        public void Insert(IDbConnection cn, YZMessageVote vote)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "SELECT BPMSEQ_YZAPPCOMMUNICATIONVOTE.NEXTVAL FROM DUAL";
                vote.id = System.Convert.ToInt32(cmd.ExecuteScalar());

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO YZAPPCOMMUNICATIONVOTE(");
                sb.Append("ID,");
                sb.Append("MESSAGEID,");
                sb.Append("\"UID\",");
                sb.Append("\"DATE\") ");
                sb.Append("VALUES(");
                sb.Append(":ID,");
                sb.Append(":MESSAGEID,");
                sb.Append(":PM_UID,");
                sb.Append(":DATE1)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":ID", OracleDbType.Int32).Value = vote.id;
                cmd.Parameters.Add(":MESSAGEID", OracleDbType.NVarchar2).Value = vote.messageid;
                cmd.Parameters.Add(":PM_UID", OracleDbType.NVarchar2).Value = this.Convert(vote.uid, false);
                cmd.Parameters.Add(":DATE1", OracleDbType.Date).Value = this.Convert(vote.date, false);

                cmd.ExecuteNonQuery();
            }
        }

        public IDataReader GetVotePraisedCount(IDbConnection cn, int messageid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"SELECT COUNT(*) FROM YZAPPCOMMUNICATIONVOTE WHERE MESSAGEID=:MESSAGEID";
                cmd.Parameters.Add(":MESSAGEID", OracleDbType.Int32).Value = messageid;
                return cmd.ExecuteReader();
            }
        }

        public IDataReader HasVoted(IDbConnection cn, int messageid, string uid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "SELECT COUNT(*) FROM YZAPPCOMMUNICATIONVOTE WHERE MESSAGEID=:MESSAGEID AND \"UID\"=:PM_UID";
                cmd.Parameters.Add(":MESSAGEID", OracleDbType.Int32).Value = messageid;
                cmd.Parameters.Add(":PM_UID", OracleDbType.NVarchar2).Value = uid;
                return cmd.ExecuteReader();
            }
        }

        public void DeleteVote(IDbConnection cn, int messageid, string uid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "DELETE FROM YZAPPCOMMUNICATIONVOTE WHERE MESSAGEID=:MESSAGEID AND \"UID\"=:PM_UID";
                cmd.Parameters.Add(":MESSAGEID", OracleDbType.Int32).Value = messageid;
                cmd.Parameters.Add(":PM_UID", OracleDbType.NVarchar2).Value = uid;
                cmd.ExecuteNonQuery();
            }
        }

        public virtual IDataReader SearchSocialTopics(IDbConnection cn, string uid, int days, string keyword)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = String.Format(String.Format(@"
WITH GroupIDs AS(
	SELECT GroupID FROM YZAppGroupMembers WHERE " + "\"UID\"" + @"=:PM_uid
),
TaskIDsAll AS(
	SELECT resId from YZAppCommunication WHERE resType='Task' AND ExtDate>:fromdate GROUP BY resId
),
TaskIDs AS(
	SELECT * from TaskIDsAll WHERE
    exists(SELECT TaskID FROM BPMInstTasks WHERE TaskID=TaskIDsAll.resId and State<>'Deleted' and State<>'Aborted')
	and (
		exists(SELECT TaskID FROM BPMInstTasks WHERE TaskID=TaskIDsAll.resId and (OwnerAccount=:PM_uid or AgentAccount=:PM_uid))
		or exists(SELECT TaskID FROM BPMInstProcSteps WHERE TaskID=TaskIDsAll.resId and (OwnerAccount=:PM_uid or AgentAccount=:PM_uid or ConsignOwnerAccount=:PM_uid))
	)
),
TopicsAll AS(
	SELECT N'Group' resType,CAST(YZAppGroup.GroupID AS nvarchar2(30)) resId,YZAppGroup.Name resName FROM GroupIDs LEFT JOIN YZAppGroup ON GroupIDs.GroupID=YZAppGroup.GroupID WHERE YZAppGroup.Deleted<>1 union all
    SELECT N'Task' resType,TaskIDs.resId,BPMInstTasks.ProcessName resName FROM TaskIDs LEFT JOIN BPMInstTasks ON TaskIDs.resId=BPMInstTasks.TaskID union all
    SELECT N'TaskApproved' resType,:PM_uid resId,:TaskApprovedText resName FROM dual union all
    SELECT N'TaskRejected' resType,:PM_uid resId,:TaskRejectedText resName FROM dual union all
    SELECT N'ProcessRemind' resType,:PM_uid resId,:ProcessRemindText resName FROM dual union all
    SELECT N'AdministratorNotification' resType,:PM_uid resId,:AdministratorNotificationText resName FROM dual
),
Z AS(
    SELECT * FROM TopicsAll WHERE resName LIKE(N'%{0}%')
)
SELECT * FROM Z
", this.EncodeText(keyword)));

                cmd.Parameters.Add(":fromdate", OracleDbType.Date).Value = DateTime.Today.AddDays(-days);
                cmd.Parameters.Add(":PM_uid", OracleDbType.NVarchar2).Value = this.Convert(uid, false);
                cmd.Parameters.Add(":TaskApprovedText", OracleDbType.NVarchar2).Value = Resources.YZStrings.Aspx_Message_Title_Approved;
                cmd.Parameters.Add(":TaskRejectedText", OracleDbType.NVarchar2).Value = Resources.YZStrings.Aspx_Message_Title_Rejected;
                cmd.Parameters.Add(":ProcessRemindText", OracleDbType.NVarchar2).Value = Resources.YZStrings.Aspx_Message_Title_ProcessRemind;
                cmd.Parameters.Add(":AdministratorNotificationText", OracleDbType.NVarchar2).Value = Resources.YZStrings.Aspx_Message_Title_AdministratorNotification;

                return cmd.ExecuteReader();
            }
        }

        public virtual IDataReader SearchSocialMessages(IDbConnection cn, string uid, int days, string keyword)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = String.Format(String.Format(@"
WITH GroupIDs AS(
	SELECT GroupID FROM YZAppGroupMembers WHERE "+"\"UID\""+ @"=:PM_uid
),
P2PGroupIDs AS(
	SELECT GroupID FROM YZAppP2PGroup WHERE Account1 =:PM_uid OR Account2 =:PM_uid
),
TaskIDsAll AS(
	SELECT resId from YZAppCommunication WHERE resType='Task' AND ExtDate>:fromdate GROUP BY resId
),
TaskIDs AS(
	SELECT * from TaskIDsAll WHERE
    exists (SELECT TaskID FROM BPMInstTasks WHERE TaskID=TaskIDsAll.resId and State<>'Deleted' and State<>'Aborted')
	and (
		exists (SELECT TaskID FROM BPMInstTasks WHERE TaskID=TaskIDsAll.resId and (OwnerAccount=:PM_uid or AgentAccount=:PM_uid))
		or exists (SELECT TaskID FROM BPMInstProcSteps WHERE TaskID=TaskIDsAll.resId and (OwnerAccount=:PM_uid or AgentAccount=:PM_uid or ConsignOwnerAccount=:PM_uid))
	)
),
MessagesAll AS(
    SELECT * FROM YZAppCommunication WHERE resType='Group' AND exists (SELECT GroupID FROM GroupIDs) union all
    SELECT * FROM YZAppCommunication WHERE resType='SingleChat' AND exists (SELECT GroupID FROM P2PGroupIDs) union all
	SELECT * FROM YZAppCommunication WHERE resType='Task' AND resId in (SELECT resId from TaskIDs) union all
    SELECT * FROM YZAppCommunication WHERE resType='TaskApproved' AND resId=:PM_uid AND ExtDate>:fromdate union all
    SELECT * FROM YZAppCommunication WHERE resType='TaskRejected' AND resId=:PM_uid AND ExtDate>:fromdate
),
A AS(
	SELECT * FROM MessagesAll WHERE message LIKE(N'%{0}%')
),
D AS(
	SELECT resType,resId,count(*) as total,max(id) as lastMsgId FROM A GROUP BY resType,resId
),
ResNames AS(
	SELECT 'Task' resType, CAST(TaskID as nvarchar2(30)) resId, ProcessName as resName FROM BPMInstTasks union all
    SELECT 'Group' resType, CAST(GroupID as nvarchar2(30)) resId, Name as resName FROM YZAppGroup WHERE YZAppGroup.Deleted<>1 union all
    SELECT 'SingleChat' resType, CAST(GroupID as nvarchar2(30)) resId, CASE :PM_uid WHEN  Account1 THEN UserName2 ELSE UserName1 END as resName FROM YZAppP2PGroup union all
	SELECT 'TaskApproved' resType,:PM_uid resId,:TaskApprovedText resName FROM dual union all
	SELECT 'TaskRejected' resType,:PM_uid resId,:TaskRejectedText resName FROM dual
),
T AS(
    SELECT ResNames.resName,D.* FROM D JOIN ResNames ON D.resType=ResNames.resType AND D.resId=ResNames.resId
),
U AS(
	SELECT T.*,A." + "\"UID\"" + @",A." + "\"DATE\"" + @",A.message,A.replyto,A.duration FROM T LEFT JOIN A ON T.lastMsgId=A.id
)
SELECT * FROM U ORDER BY " + "\"DATE\"" + @"DESC
", this.EncodeText(keyword)));

                cmd.Parameters.Add(":fromdate", OracleDbType.Date).Value = DateTime.Today.AddDays(-days);
                cmd.Parameters.Add(":PM_uid", OracleDbType.NVarchar2).Value = this.Convert(uid, false);
                cmd.Parameters.Add(":TaskApprovedText", OracleDbType.NVarchar2).Value = Resources.YZStrings.Aspx_Message_Title_Approved;
                cmd.Parameters.Add(":TaskRejectedText", OracleDbType.NVarchar2).Value = Resources.YZStrings.Aspx_Message_Title_Rejected;

                return cmd.ExecuteReader();
            }
        }

        public virtual IDataReader SearchSocialMessagesInTopic(IDbConnection cn, string resType, string resId, int days, string keyword, int startRowIndex, int rows)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = String.Format(String.Format(@"
WITH T AS(
	SELECT * FROM YZAppCommunication WHERE resType=:resType AND resId=:resId AND message LIKE(N'%{0}%') ORDER BY " + "\"DATE\"" + @" DESC
),
X AS(SELECT T.*,ROWNUM RN__ FROM T),
Y AS(SELECT count(*) AS TotalRows FROM X),
Z AS(SELECT X.*,Y.TotalRows FROM Y,X)
SELECT * FROM Z WHERE RN__ >= :StartRowIndex AND (RN__<=:EndRowIndex OR :EndRowIndex < :StartRowIndex ) ORDER BY RN__
", this.EncodeText(keyword)));

                PageInfo pageInfo = this.AjaxPageToDbPage(startRowIndex, rows);
                cmd.Parameters.Add(":StartRowIndex", OracleDbType.Int32).Value = pageInfo.StartRowIndex;
                cmd.Parameters.Add(":EndRowIndex", OracleDbType.Int32).Value = pageInfo.EndRowIndex;

                cmd.Parameters.Add(":resType", OracleDbType.NVarchar2).Value = resType;
                cmd.Parameters.Add(":resId", OracleDbType.NVarchar2).Value = resId;

                return cmd.ExecuteReader();
            }
        }
    }
}
