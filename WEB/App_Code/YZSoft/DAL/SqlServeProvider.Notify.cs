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
        public virtual IDataReader GetNotifyNewMessageCount(IDbConnection cn, string uid, int days)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                cmd.CommandText = @"
WITH GroupIDs AS(
	SELECT GroupID FROM YZAppGroupMembers WHERE UID=@uid
),
GroupMessages AS(
    SELECT id,resType,resId FROM YZAppCommunication WHERE resType='Group' AND resId IN (SELECT GroupID FROM GroupIDs)
),
P2PGroupIDs AS(
	SELECT GroupID FROM YZAppP2PGroup WHERE Account1=@uid OR Account2=@uid
),
P2PMessages AS(
    SELECT id,resType,resId FROM YZAppCommunication WHERE resType='SingleChat' AND resId IN (SELECT GroupID FROM P2PGroupIDs)
),
SpecMessages AS(
    SELECT id,resType,resId  FROM YZAppCommunication WHERE resType='TaskApproved' AND resId=@uid AND ExtDate>@fromdate union all
    SELECT id,resType,resId  FROM YZAppCommunication WHERE resType='TaskRejected' AND resId=@uid AND ExtDate>@fromdate union all
    SELECT id,resType,resId  FROM YZAppCommunication WHERE resType='ProcessRemind' AND resId=@uid AND ExtDate>@fromdate union all
    SELECT id,resType,resId  FROM YZAppCommunication WHERE resType='AdministratorNotification' AND resId=@uid AND ExtDate>@fromdate
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
	SELECT id,resType,resId  FROM YZAppCommunication WHERE resType='Task' AND resId in (SELECT resId from TaskIDs)
),
A AS(
	SELECT * FROM GroupMessages union all
	SELECT * FROM P2PMessages union all
	SELECT * FROM TaskMessages union all
	SELECT * FROM SpecMessages
),
B AS(
	SELECT * from YZAppCommunicationRead
),
C1 AS(
	SELECT A.*,ISNULL(B.readId,0) readId FROM A LEFT JOIN B ON A.resType=B.resType AND A.resId=B.resId AND B.uid=@uid
),
C AS(
    SELECT * FROM C1 WHERE id>readId 
),
D AS(
	SELECT resType,count(*) newmessage from C group by resType
)
SELECT * FROM D
";

                cmd.Parameters.Add("@fromdate", SqlDbType.DateTime).Value = DateTime.Today.AddDays(-days);
                cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = this.Convert(uid, false);

                return cmd.ExecuteReader();
            }
        }

        public virtual IDataReader GetNotifyTopics(IDbConnection cn, string uid,int days, int startRowIndex, int rows)
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
    SELECT * FROM YZAppCommunication WHERE resType='TaskRejected' AND resId=@uid AND ExtDate>@fromdate union all
    SELECT * FROM YZAppCommunication WHERE resType='ProcessRemind' AND resId=@uid AND ExtDate>@fromdate union all
    SELECT * FROM YZAppCommunication WHERE resType='AdministratorNotification' AND resId=@uid AND ExtDate>@fromdate
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
	SELECT * from YZAppCommunicationRead
),
C AS(
	SELECT A.*,ISNULL(B.readId,0) readId FROM A LEFT JOIN B ON A.resType=B.resType AND A.resId=B.resId AND B.uid=@uid
),
D AS(
	SELECT resType,resId,sum(case when id>readId then 1 else 0 end) newmessage,count(*) total,max(id) as lastMsgId from C group by resType,resId
),
E AS(
	SELECT D.*,A.uid,A.date,A.message,A.replyto,A.duration,(case when newmessage>0 then 1 else 0 end) hasnewmessage FROM D LEFT JOIN A ON D.lastMsgId=A.id
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
T AS(
	SELECT * from TaskF union all
	SELECT * from GroupF union all
	SELECT * from P2PF union all
	SELECT * from SpecF
),
X AS(SELECT *,ROW_NUMBER() OVER(ORDER BY hasnewmessage desc, date DESC,newmessage desc,total desc) AS RowNum FROM T),
Y AS(SELECT count(*) AS TotalRows FROM X),
Z AS(SELECT X.*,Y.TotalRows FROM Y,X)
SELECT * FROM Z WHERE RowNum >= @StartRowIndex AND (RowNum<=@EndRowIndex OR @EndRowIndex < @StartRowIndex ) ORDER BY RowNum
";
            
                PageInfo pageInfo = this.AjaxPageToDbPage(startRowIndex, rows);
                cmd.Parameters.Add("@StartRowIndex", SqlDbType.Int).Value = pageInfo.StartRowIndex;
                cmd.Parameters.Add("@EndRowIndex", SqlDbType.Int).Value = pageInfo.EndRowIndex;

                cmd.Parameters.Add("@fromdate", SqlDbType.DateTime).Value = DateTime.Today.AddDays(-days);
                cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = this.Convert(uid, false);
                cmd.Parameters.Add("@TaskApprovedText", SqlDbType.NVarChar).Value = Resources.YZStrings.Aspx_Message_Title_Approved;
                cmd.Parameters.Add("@TaskRejectedText", SqlDbType.NVarChar).Value = Resources.YZStrings.Aspx_Message_Title_Rejected;
                cmd.Parameters.Add("@ProcessRemindText", SqlDbType.NVarChar).Value = Resources.YZStrings.Aspx_Message_Title_ProcessRemind;
                cmd.Parameters.Add("@AdministratorNotificationText", SqlDbType.NVarChar).Value = Resources.YZStrings.Aspx_Message_Title_AdministratorNotification;

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetNotifyUsersTaskSocial(IDbConnection cn, int taskid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                cmd.CommandText = @"
WITH A AS(
	SELECT OwnerAccount,AgentAccount FROM BPMInstTasks WHERE TaskID=@TaskID
),
B AS(
	SELECT OwnerAccount as Account FROM A WHERE OwnerAccount is not null union
	SELECT AgentAccount as Accountt FROM A WHERE AgentAccount is not null
),
C AS(
	SELECT OwnerAccount,AgentAccount,ConsignOwnerAccount FROM BPMInstProcSteps WHERE TaskID=@TaskID
),
D AS(
	SELECT OwnerAccount as Account FROM C WHERE OwnerAccount is not null union
	SELECT AgentAccount as Account FROM C WHERE AgentAccount is not null union
	SELECT ConsignOwnerAccount as Account FROM C WHERE ConsignOwnerAccount is not null
),
E AS(
	SELECT Account FROM B union
	SELECT Account FROM D
)
SELECT * FROM E
";

                cmd.Parameters.Add("@TaskID", SqlDbType.Int).Value = taskid;

                return cmd.ExecuteReader();
            }
        }
    }
}
