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
        public virtual IDataReader GetNotifyNewMessageCount(IDbConnection cn, string uid, int days)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"
WITH GroupIDs AS(
	SELECT GroupID FROM YZAppGroupMembers WHERE " + "\"UID\"" + @"=:PM_uid
),
GroupMessages AS(
    SELECT id,resType,resId FROM YZAppCommunication WHERE resType='Group' AND resId IN (SELECT GroupID FROM GroupIDs)
),
P2PGroupIDs AS(
	SELECT GroupID FROM YZAppP2PGroup WHERE Account1=:PM_uid OR Account2=:PM_uid
),
P2PMessages AS(
    SELECT id,resType,resId FROM YZAppCommunication WHERE resType='SingleChat' AND resId IN (SELECT GroupID FROM P2PGroupIDs)
),
SpecMessages AS(
    SELECT id,resType,resId FROM YZAppCommunication WHERE resType='TaskApproved' AND resId=:PM_uid AND ExtDate>:fromdate union all
    SELECT id,resType,resId FROM YZAppCommunication WHERE resType='TaskRejected' AND resId=:PM_uid AND ExtDate>:fromdate union all
    SELECT id,resType,resId FROM YZAppCommunication WHERE resType='ProcessRemind' AND resId=:PM_uid AND ExtDate>:fromdate union all
    SELECT id,resType,resId FROM YZAppCommunication WHERE resType='AdministratorNotification' AND resId=:PM_uid AND ExtDate>:fromdate
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
TaskMessages AS(
	SELECT id,resType,resId FROM YZAppCommunication WHERE resType='Task' AND resId in (SELECT resId from TaskIDs)
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
	SELECT A.*,NVL(B.readId,0) readId FROM A LEFT JOIN B ON A.resType=B.resType AND A.resId=B.resId AND B." + "\"UID\"" + @"=:PM_uid
),
C AS(
    SELECT * FROM C1 WHERE id>readId 
),
D AS(
	SELECT resType,count(*) newmessage from C group by resType
)
SELECT * FROM D
";

                cmd.Parameters.Add(":fromdate", OracleDbType.Date).Value = DateTime.Today.AddDays(-days);
                cmd.Parameters.Add(":PM_uid", OracleDbType.NVarchar2).Value = this.Convert(uid, false);

                return cmd.ExecuteReader();
            }
        }

        public virtual IDataReader GetNotifyTopics(IDbConnection cn, string uid, int days, int startRowIndex, int rows)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = @"
WITH GroupIDs AS(
	SELECT GroupID FROM YZAppGroupMembers WHERE " + "\"UID\"" + @"=:PM_uid
),
GroupMessages AS(
    SELECT * FROM YZAppCommunication WHERE resType='Group' AND resId IN (SELECT GroupID FROM GroupIDs)
),
P2PGroupIDs AS(
	SELECT GroupID FROM YZAppP2PGroup WHERE Account1=:PM_uid OR Account2=:PM_uid
),
P2PMessages AS(
    SELECT * FROM YZAppCommunication WHERE resType='SingleChat' AND resId IN (SELECT GroupID FROM P2PGroupIDs)
),
SpecMessages AS(
    SELECT * FROM YZAppCommunication WHERE resType='TaskApproved' AND resId=:PM_uid AND ExtDate>:fromdate union all
    SELECT * FROM YZAppCommunication WHERE resType='TaskRejected' AND resId=:PM_uid AND ExtDate>:fromdate union all
    SELECT * FROM YZAppCommunication WHERE resType='ProcessRemind' AND resId=:PM_uid AND ExtDate>:fromdate union all
    SELECT * FROM YZAppCommunication WHERE resType='AdministratorNotification' AND resId=:PM_uid AND ExtDate>:fromdate
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
	SELECT A.*,NVL(B.readId,0) readId FROM A LEFT JOIN B ON A.resType=B.resType AND A.resId=B.resId AND B." + "\"UID\"" + @"=:PM_uid
),
D AS(
	SELECT resType,resId,sum(case when id>readId then 1 else 0 end) newmessage,count(*) total,max(id) as lastMsgId from C group by resType,resId
),
ResNames AS(
	SELECT 'Task' resType, CAST(TaskID as nvarchar2(30)) resId, ProcessName as resName FROM BPMInstTasks union all
    SELECT 'Group' resType, CAST(GroupID as nvarchar2(30)) resId, Name as resName FROM YZAppGroup WHERE YZAppGroup.Deleted<>1 union all
    SELECT 'SingleChat' resType, CAST(GroupID as nvarchar2(30)) resId, CASE :PM_uid WHEN  Account1 THEN UserName2 ELSE UserName1 END as resName FROM YZAppP2PGroup union all
	SELECT 'TaskApproved' resType,:PM_uid resId,:TaskApprovedText resName FROM dual union all
	SELECT 'TaskRejected' resType,:PM_uid resId,:TaskRejectedText resName FROM dual union all
	SELECT 'ProcessRemind' resType,:PM_uid resId,:ProcessRemindText resName FROM dual union all
	SELECT 'AdministratorNotification' resType,:PM_uid resId,:AdministratorNotificationText resName FROM dual
),
T AS(
    SELECT ResNames.resName,D.* FROM D JOIN ResNames ON D.resType=ResNames.resType AND D.resId=ResNames.resId
),
U AS(
	SELECT T.*,A." + "\"UID\"" + @",A." + "\"DATE\"" + @",A.message,A.replyto,A.duration,(case when newmessage>0 then 1 else 0 end) hasnewmessage FROM T LEFT JOIN A ON T.lastMsgId=A.id
),
V AS(
    SELECT * FROM U ORDER BY hasnewmessage desc, " + "\"DATE\"" + @" DESC,newmessage desc,total desc
),
Z AS(SELECT V.*,ROWNUM RN__,count(*) over() as TotalRows FROM V)
SELECT * FROM Z WHERE RN__ >= :StartRowIndex AND (RN__<=:EndRowIndex OR :EndRowIndex < :StartRowIndex ) ORDER BY RN__
";

                PageInfo pageInfo = this.AjaxPageToDbPage(startRowIndex, rows);
                cmd.Parameters.Add(":StartRowIndex", OracleDbType.Int32).Value = pageInfo.StartRowIndex;
                cmd.Parameters.Add(":EndRowIndex", OracleDbType.Int32).Value = pageInfo.EndRowIndex;

                cmd.Parameters.Add(":fromdate", OracleDbType.Date).Value = DateTime.Today.AddDays(-days);
                cmd.Parameters.Add(":PM_uid", OracleDbType.NVarchar2).Value = this.Convert(uid, false);
                cmd.Parameters.Add(":TaskApprovedText", OracleDbType.NVarchar2).Value = Resources.YZStrings.Aspx_Message_Title_Approved;
                cmd.Parameters.Add(":TaskRejectedText", OracleDbType.NVarchar2).Value = Resources.YZStrings.Aspx_Message_Title_Rejected;
                cmd.Parameters.Add(":ProcessRemindText", OracleDbType.NVarchar2).Value = Resources.YZStrings.Aspx_Message_Title_ProcessRemind;
                cmd.Parameters.Add(":AdministratorNotificationText", OracleDbType.NVarchar2).Value = Resources.YZStrings.Aspx_Message_Title_AdministratorNotification;

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetNotifyUsersTaskSocial(IDbConnection cn, int taskid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = @"
WITH A AS(
	SELECT OwnerAccount,AgentAccount FROM BPMInstTasks WHERE TaskID=:TaskID
),
B AS(
	SELECT OwnerAccount as Account FROM A WHERE OwnerAccount is not null union
	SELECT AgentAccount as Accountt FROM A WHERE AgentAccount is not null
),
C AS(
	SELECT OwnerAccount,AgentAccount,ConsignOwnerAccount FROM BPMInstProcSteps WHERE TaskID=:TaskID
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

                cmd.Parameters.Add(":TaskID", OracleDbType.Int32).Value = taskid;

                return cmd.ExecuteReader();
            }
        }
    }
}
