--开启SQL查询通知
--DECLARE @DBName nvarchar(50);
--SELECT @DBName=Name From Master..SysDataBases Where DbId=(Select Dbid From Master..SysProcesses Where Spid = @@spid);
--if not exists(SELECT * FROM sys.databases WHERE name = @DBName AND is_broker_enabled=1)
--BEGIN
--DECLARE @query nvarchar(400);
--SELECT @query=
--'ALTER DATABASE '+@DBName+' SET NEW_BROKER WITH ROLLBACK IMMEDIATE;'+
--'ALTER DATABASE '+@DBName+' SET ENABLE_BROKER;';
--exec sp_executesql @query
--END
--GO


if exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMQuery]') and OBJECTPROPERTY(id, N'IsProcedure') = 1)
drop procedure [dbo].[BPMQuery]
GO

CREATE PROCEDURE BPMQuery 
@sql nvarchar(4000), --查询字符串
@curpage int, --第N页
@pagesize int, --每页行数
@rowcount int output
as
set nocount on
declare @P1 int --P1是游标的id
declare @rowindex int
exec sp_cursoropen @P1 output,@sql,@scrollopt=1,@ccopt=1,@rowcount=@rowcount output
--select ceiling(1.0*@rowcount/@pagesize) as 总页数,@rowcount as 总行数,@currentpage as 当前页 
set @rowindex = (@curpage-1)*@pagesize+1
exec sp_cursorfetch @P1,16,@rowindex,@pagesize 
exec sp_cursorclose @P1
set nocount off
return @rowcount
GO

if exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMQueryNew]') and OBJECTPROPERTY(id, N'IsProcedure') = 1)
drop procedure [dbo].[BPMQueryNew]
GO

CREATE PROCEDURE BPMQueryNew 
@sql nvarchar(4000), --查询字符串
@rowindex int, --第N行，从1开始
@rows int, --行数
@rowcount int output
as
set nocount on
declare @P1 int --P1是游标的id
exec sp_cursoropen @P1 output,@sql,@scrollopt=1,@ccopt=1,@rowcount=@rowcount output
--select ceiling(1.0*@rowcount/@pagesize) as 总页数,@rowcount as 总行数,@currentpage as 当前页 
exec sp_cursorfetch @P1,16,@rowindex,@rows 
exec sp_cursorclose @P1
set nocount off
return @rowcount
GO

if exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[CreateSnapshot]') and OBJECTPROPERTY(id, N'IsProcedure') = 1)
drop procedure [dbo].[CreateSnapshot]
GO

CREATE PROCEDURE CreateSnapshot 
@TaskID int, --任务号
@VerDesc nvarchar(500), --版本描述
@FormData ntext --XML格式的表单数据
as
DECLARE @ver int

SELECT @ver = max(Version) FROM BPMSysSnapshot WHERE TaskID=@TaskID
IF @ver IS NULL
  SET @ver = 1
ELSE
  SET @ver = @ver + 1

INSERT INTO BPMSysSnapshot(TaskID,Version,VerDesc,FormData) VALUES(@TaskID,@ver,@VerDesc,@FormData)
GO

if exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[PublicTask]') and OBJECTPROPERTY(id, N'IsProcedure') = 1)
drop procedure [dbo].[PublicTask]
GO

CREATE PROCEDURE PublicTask 
@TaskID int,
@SID nvarchar(100),
@CreateBy nvarchar(100)
as
IF exists (SELECT * FROM BPMSecurityTACL WHERE TaskID=@TaskID and SID=@SID)
UPDATE BPMSecurityTACL SET AllowRead=1 WHERE TaskID=@TaskID and SID=@SID
ELSE
INSERT INTO BPMSecurityTACL(TaskID,SID,AllowRead,AllowAdmin,ShareByUser,CreateDate,CreateBy) VALUES(@TaskID,@SID,1,0,1,GetDate(),@CreateBy)
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMInstProcSteps]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[BPMInstProcSteps] (
	[StepID] [int] IDENTITY (1, 1) NOT NULL ,
	[TaskID] [int] NOT NULL ,
	[ProcessName] [nvarchar] (30) NOT NULL ,
	[NodeName] [nvarchar] (30) NOT NULL ,
	[OwnerPosition] [nvarchar] (200) NULL ,
	[OwnerAccount] [nvarchar] (50) NULL ,
	[AgentAccount] [nvarchar] (50) NULL ,
	[ReceiveAt] [datetime] NOT NULL ,
	[FinishAt] [datetime] NULL ,
	[SelAction] [nvarchar] (30) NULL ,
	[Share] [bit] NOT NULL ,
	[Memo] [nvarchar] (200) NULL ,
	[HumanStep] [bit] NOT NULL 
) ON [PRIMARY]
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMInstRouting]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[BPMInstRouting] (
	[TaskID] [int] NOT NULL ,
	[FromStepID] [int] NOT NULL ,
	[ToStepID] [int] NOT NULL 
) ON [PRIMARY]
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMInstShare]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[BPMInstShare] (
	[StepID] [int] NOT NULL ,
	[UserAccount] [nvarchar] (50) NOT NULL ,
	[MemberFullName] [nvarchar] (200) NOT NULL 
) ON [PRIMARY]
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMInstTasks]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[BPMInstTasks] (
	[TaskID] [int] IDENTITY (1, 1) NOT NULL ,
	[ProcessName] [nvarchar] (30) NOT NULL ,
	[OwnerPosition] [nvarchar](200) NOT NULL,
	[OwnerAccount] [nvarchar] (50) NULL ,
	[AgentAccount] [nvarchar] (50) NULL ,
	[CreateAt] [datetime] NOT NULL ,
	[Description] [nvarchar] (1024) NULL ,
	[FinishAt] [datetime] NULL ,
	[State] [char] (10) NOT NULL ,
) ON [PRIMARY]
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysOUFGOUs]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[BPMSysOUFGOUs] (
	[OUID] [int] NOT NULL ,
	[UserAccount] [nvarchar] (50) NOT NULL ,
	[FGOUID] [int] NOT NULL 
) ON [PRIMARY]
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysOUFGYWs]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[BPMSysOUFGYWs] (
	[OUID] [int] NOT NULL ,
	[UserAccount] [nvarchar] (50) NOT NULL ,
	[YWName] [nvarchar] (30) NOT NULL 
) ON [PRIMARY]
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysOUMembers]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[BPMSysOUMembers] (
	[OUID] [int] NOT NULL ,
	[UserAccount] [nvarchar] (50) NOT NULL ,
	[OrderIndex] [int] NOT NULL ,
	[UserDefaultRole] [bit] NOT NULL ,
	[LeaderTitle] [nvarchar] (30) NULL ,
	[Department] [nvarchar] (50) NULL ,
	[FGOUEnabled] [bit] NOT NULL ,
	[FGYWEnabled] [bit] NOT NULL 
) ON [PRIMARY]
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysOURoleMembers]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[BPMSysOURoleMembers] (
	[OUID] [int] NOT NULL ,
	[RoleName] [nvarchar] (30) NOT NULL ,
	[MemberOUID] [int] NOT NULL ,
	[UserAccount] [nvarchar] (50) NOT NULL ,
	[OrderIndex] [int] NOT NULL 
) ON [PRIMARY]
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysOURoles]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[BPMSysOURoles] (
	[OUID] [int] NOT NULL ,
	[RoleName] [nvarchar] (30) NOT NULL 
) ON [PRIMARY]
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysOUSupervisors]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[BPMSysOUSupervisors] (
	[OUID] [int] NOT NULL ,
	[UserAccount] [nvarchar] (50) NOT NULL ,
	[SupervisorOUID] [int] NOT NULL ,
	[SupervisorUserAccount] [nvarchar] (50) NOT NULL 
) ON [PRIMARY]
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysOUs]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[BPMSysOUs] (
	[OUID] [int] IDENTITY (1, 1) NOT NULL ,
	[ParentOUID] [int] NULL ,
	[OUName] [nvarchar] (30) NOT NULL ,
	[OULevel] [nvarchar] (30) NOT NULL 
) ON [PRIMARY]
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysUserCommonInfo]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[BPMSysUserCommonInfo] (
	[Account] [nvarchar] (50) NOT NULL ,
	[IsOutOfOffice] [bit] NOT NULL ,
	[UseAgent] [bit] NOT NULL ,
	[Agent] [nvarchar] (300) NULL 
) ON [PRIMARY]
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysUsers]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[BPMSysUsers] (
	[Account] [nvarchar] (50) NOT NULL ,
	[Password] [char] (100) NOT NULL ,
	[SysUser] [bit] NOT NULL ,
	[DisplayName] [nvarchar] (30) NULL ,
	[Description] [nvarchar] (200) NULL ,
	[Sex] [char] (7) NULL ,
	[Birthday] [datetime] NULL ,
	[HRID] [nvarchar] (30) NULL ,
	[DateHired] [datetime] NULL ,
	[Office] [nvarchar] (100) NULL ,
	[CostCenter] [nvarchar] (30) NULL ,
	[OfficePhone] [nvarchar] (30) NULL ,
	[HomePhone] [nvarchar] (30) NULL ,
	[Mobile] [nvarchar] (30) NULL ,
	[EMail] [nvarchar] (100) NULL ,
	[WWWHomePage] [nvarchar] (200) NULL ,
	[Location] [nvarchar] (50) NULL ,
	[Age] [int] NULL ,
	[UserLevel] [int] NULL ,
	[家庭电话] [nvarchar] (50) NULL 
) ON [PRIMARY]
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[Purchase]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[Purchase] (
	[TaskID] [int] NOT NULL ,
	[RequestUser] [nvarchar] (50) NULL ,
	[Phone] [nvarchar] (50) NULL ,
	[Dept] [nvarchar] (50) NULL ,
	[RequestDate] [datetime] NULL ,
	[UseDate] [datetime] NULL ,
	[Reason] [nvarchar] (200) NULL ,
	[Amount] [float] NULL 
) ON [PRIMARY]
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[PurchaseDetail]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[PurchaseDetail] (
	[ItemID] [int] IDENTITY(1,1) NOT NULL,
	[TaskID] [int] NOT NULL ,
	[OrderIndex] [int] NOT NULL ,
	[ItemName] [nvarchar] (50) NULL ,
	[ItemCat] [nvarchar] (50) NULL ,
	[ItemDesc] [nvarchar] (50) NULL ,
	[Price] [float] NULL ,
	[Qty] [float] NULL ,
	[SubTotal] [float] NULL ,
	[RequestUser] [nvarchar] (50) NULL,
	CONSTRAINT [PK_PurchaseDetail] PRIMARY KEY CLUSTERED 
	(
		[ItemID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[SetProductCat]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[SetProductCat] (
	[ProductCat] [nvarchar] (30) NOT NULL 
) ON [PRIMARY]

ALTER TABLE [dbo].[SetProductCat] WITH NOCHECK ADD 
	CONSTRAINT [PK_SetProductCat] PRIMARY KEY  CLUSTERED 
	(
		[ProductCat]
	)  ON [PRIMARY]
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[SetProduct]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[SetProduct] (
	[ProdCat] [nvarchar] (50) NOT NULL ,
	[ProdName] [nvarchar] (50) NOT NULL ,
	[ProdDesc] [nvarchar] (50) NULL ,
	[Price] [float] NOT NULL 
) ON [PRIMARY]
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[DF_BPMInstProcSteps_ReceiveAt]'))
ALTER TABLE [dbo].[BPMInstProcSteps] ADD 
	CONSTRAINT [DF_BPMInstProcSteps_ReceiveAt] DEFAULT (getdate()) FOR [ReceiveAt],
	CONSTRAINT [DF_BPMInstProcSteps_Share] DEFAULT (0) FOR [Share],
	CONSTRAINT [DF_BPMInstProcSteps_HumanStep] DEFAULT (1) FOR [HumanStep]
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[DF_BPMInstTasks_CreateAt]'))
ALTER TABLE [dbo].[BPMInstTasks] ADD 
	CONSTRAINT [DF_BPMInstTasks_CreateAt] DEFAULT (getdate()) FOR [CreateAt],
	CONSTRAINT [DF_BPMInstTasks_Status] DEFAULT ('running') FOR [State]
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[DF_BPMSysOUMembers_OUFGEnabled]'))
ALTER TABLE [dbo].[BPMSysOUMembers] ADD 
	CONSTRAINT [DF_BPMSysOUMembers_OUFGEnabled] DEFAULT (0) FOR [FGOUEnabled],
	CONSTRAINT [DF_BPMSysOUMembers_FGYWEnabled] DEFAULT (0) FOR [FGYWEnabled]
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[DF_BPMSysUserCommonInfo_UseAgent]'))
ALTER TABLE [dbo].[BPMSysUserCommonInfo] ADD 
	CONSTRAINT [DF_BPMSysUserCommonInfo_UseAgent] DEFAULT (0) FOR [UseAgent]
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[DF_BPMSysUsers_SystemUser]'))
ALTER TABLE [dbo].[BPMSysUsers] ADD 
	CONSTRAINT [DF_BPMSysUsers_SystemUser] DEFAULT (0) FOR [SysUser]
GO

/********************************************* ver3.01 DBUpdate *********************************************/

if exists(select * from syscolumns where name = 'InitiatorPosition' and id = object_id('BPMInstTasks'))
BEGIN
EXEC sp_rename 'BPMInstTasks.InitiatorPosition', 'OwnerPosition', 'COLUMN'
EXEC sp_rename 'BPMInstTasks.InitiatorAccount', 'OwnerAccount', 'COLUMN'
ALTER TABLE BPMInstTasks ADD AgentAccount [nvarchar] (50) NULL
END
GO

if exists(select * from syscolumns where name = 'RecipientPosition' and id = object_id('BPMInstProcSteps'))
BEGIN
EXEC sp_rename 'BPMInstProcSteps.RecipientPosition', 'OwnerPosition', 'COLUMN'
EXEC sp_rename 'BPMInstProcSteps.RecipientAccount', 'OwnerAccount', 'COLUMN'
ALTER TABLE BPMInstProcSteps ADD AgentAccount [nvarchar] (50) NULL
END
GO

if not exists(select * from syscolumns where name = 'SerialNum' and id = object_id('BPMInstTasks'))
BEGIN
ALTER TABLE BPMInstTasks ADD SerialNum [nvarchar] (50) NULL
END
GO

/********************************************* ver3.02 DBUpdate *********************************************/

if exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[IX_BPMSysOUFGOUs]'))
ALTER TABLE BPMSysOUFGOUs DROP CONSTRAINT IX_BPMSysOUFGOUs
GO

/********************************************* ver3.03 DBUpdate *********************************************/
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysSnapshot]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSysSnapshot] (
	[TaskID] [int] NOT NULL ,
	[Version] [int] NOT NULL ,
	[CreateDate] [datetime] DEFAULT (getdate()) NOT NULL ,
	[VerDesc] [nvarchar] (500) NULL ,
	[FormData] [ntext]  NULL 
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO

/********************************************* ver3.04 DBUpdate *********************************************/

if exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[DF_BPMInstTasks_Deleted]'))
ALTER TABLE BPMInstTasks DROP CONSTRAINT DF_BPMInstTasks_Deleted
GO

if exists(select * from syscolumns where name = 'Deleted' and id = object_id('BPMInstTasks'))
BEGIN
ALTER TABLE BPMInstTasks DROP COLUMN Deleted
END
GO

if not exists(select * from syscolumns where name = 'OptUser' and id = object_id('BPMInstTasks'))
BEGIN
ALTER TABLE BPMInstTasks ADD OptUser [nvarchar] (50) NULL
END
GO

if not exists(select * from syscolumns where name = 'OptAt' and id = object_id('BPMInstTasks'))
BEGIN
ALTER TABLE BPMInstTasks ADD OptAt [datetime] NULL
END
GO

if not exists(select * from syscolumns where name = 'OptMemo' and id = object_id('BPMInstTasks'))
BEGIN
ALTER TABLE BPMInstTasks ADD OptMemo [nvarchar] (50) NULL
END
GO

if not exists(select * from syscolumns where name = 'RSID' and id = object_id('BPMSysOUs'))
BEGIN
ALTER TABLE BPMSysOUs ADD RSID [char] (36) NOT NULL DEFAULT(newid())
END
GO

if not exists(select * from syscolumns where name = 'SID' and id = object_id('BPMSysOUs'))
BEGIN
ALTER TABLE BPMSysOUs ADD SID [char] (36) NOT NULL DEFAULT(newid())
END
GO

if not exists(select * from syscolumns where name = 'SID' and id = object_id('BPMSysUsers'))
BEGIN
ALTER TABLE BPMSysUsers ADD SID [char] (36) NOT NULL DEFAULT(newid())
END
GO


if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSecurityACL]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSecurityACL] (
	[IDA] [int] IDENTITY (1, 1) NOT NULL ,
	[RoleType] [varchar] (30) NOT NULL ,
	[RoleParam1] [ntext] NOT NULL ,
	[RoleParam2] [nvarchar] (50) NULL ,
	[RoleParam3] [nvarchar] (50) NULL ,
	[RSID] [nvarchar] (400) NOT NULL ,
	[AllowPermision] [nvarchar] (200) NULL ,
	[DenyPermision] [nvarchar] (200) NULL ,
	[Inherited] [bit] NOT NULL ,
	[Inheritable] [bit] NOT NULL ,
	[CreateDate] [datetime] NOT NULL ,
	[CreateBy] [nvarchar] (50) NOT NULL 
) ON [PRIMARY]
INSERT INTO BPMSecurityACL VALUES('GroupSID','S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',NULL,NULL,'1CCFE783-7FBF-4582-B2F3-CE11F57917E7','Read',NULL,0,1,getdate(),'sa')
INSERT INTO BPMSecurityACL VALUES('GroupSID','S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',NULL,NULL,'7CBB72A3-1731-4212-8C5C-9C4E0C86FE31','Read,Execute',NULL,0,1,getdate(),'sa')
INSERT INTO BPMSecurityACL VALUES('GroupSID','S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',NULL,NULL,'036F6F25-A004-4109-962F-AD9F0A8F516A','Read',NULL,0,1,getdate(),'sa')
INSERT INTO BPMSecurityACL VALUES('GroupSID','S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',NULL,NULL,'45D14DE0-13F1-47de-80D5-CBE657BD39C9','Read,Execute',NULL,0,1,getdate(),'sa')
INSERT INTO BPMSecurityACL VALUES('GroupSID','S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',NULL,NULL,'79A6D413-827D-4dfa-AEA3-4C64CA715975','Read',NULL,0,1,getdate(),'sa')
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSecurityGroupMembers]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSecurityGroupMembers] (
	[GroupName] [nvarchar] (50) NOT NULL ,
	[UserAccount] [nvarchar] (50) NOT NULL 
) ON [PRIMARY]
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSecurityGroups]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSecurityGroups] (
	[GroupName] [nvarchar] (50) NOT NULL ,
	[SID] [nvarchar] (50) NOT NULL 
) ON [PRIMARY]
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSecurityTACL]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSecurityTACL] (
	[TaskID] [int] NOT NULL ,
	[SID] [nvarchar] (50) NOT NULL ,
	[AllowRead] [bit] NOT NULL ,
	[AllowAdmin] [bit] NOT NULL ,
	[ShareByUser] [bit] NOT NULL ,
	[CreateDate] [datetime] NULL ,
	[CreateBy] [nvarchar] (50) NULL 
) ON [PRIMARY]
END
GO

if not exists(select * from syscolumns where name = 'HandlerAccount' and id = object_id('BPMInstProcSteps'))
BEGIN
ALTER TABLE BPMInstProcSteps ADD HandlerAccount [nvarchar] (50) NULL
END
GO

/********************************************* ver3.05 DBUpdate *********************************************/

if not exists(select * from syscolumns where name = 'LnkID' and id = object_id('BPMSysOUSupervisors'))
BEGIN
ALTER TABLE BPMSysOUSupervisors ADD LnkID [int] IDENTITY (1, 1) NOT NULL
END
GO

if not exists(select * from syscolumns where name = 'FGYWEnabled' and id = object_id('BPMSysOUSupervisors'))
BEGIN
ALTER TABLE BPMSysOUSupervisors ADD FGYWEnabled [bit] NOT NULL DEFAULT(0)
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysOUSupervisorFGYWs]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSysOUSupervisorFGYWs] (
	[LnkID] [int] NOT NULL ,
	[YWName] [nvarchar] (30) NULL 
) ON [PRIMARY]
END
GO

if exists(select * from BPMSecurityGroups where GroupName='Administrator' AND SID='S_GS_B639EB43-67D7-42fb-BD2E-B754BB11915B')
BEGIN
DELETE BPMSecurityGroups WHERE GroupName='Administrators'
UPDATE BPMSecurityGroups SET GroupName='Administrators' WHERE GroupName='Administrator' AND SID='S_GS_B639EB43-67D7-42fb-BD2E-B754BB11915B'
UPDATE BPMSecurityGroupMembers SET GroupName='Administrators' WHERE GroupName='Administrator'
END
GO

if not exists(select * from syscolumns where name = 'RejectedNotifys' and id = object_id('BPMSysUserCommonInfo'))
BEGIN
ALTER TABLE BPMSysUserCommonInfo ADD RejectedNotifys [nvarchar] (200) NULL
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysSettings]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSysSettings] (
	[ItemName] [nvarchar] (50) NOT NULL ,
	[ItemValue] [nvarchar] (1024) NULL 
) ON [PRIMARY]
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysMessagesFailed]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSysMessagesFailed] (
	[MessageID] [int] NOT NULL ,
	[ProviderName] [nvarchar] (30) NOT NULL ,
	[Address] [nvarchar] (100) NOT NULL ,
	[Title] [nvarchar] (500) NULL ,
	[Message] [ntext] NULL ,
	[CreateAt] [datetime] NOT NULL ,
	[FailCount] [int] NOT NULL ,
	[RemoveAt] [datetime] NOT NULL 
) ON [PRIMARY]
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysMessagesQueue]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSysMessagesQueue] (
	[MessageID] [int] IDENTITY (1, 1) NOT NULL ,
	[ProviderName] [nvarchar] (30) NOT NULL ,
	[Address] [nvarchar] (100) NOT NULL ,
	[Title] [nvarchar] (500) NULL ,
	[Message] [ntext] NULL ,
	[CreateAt] [datetime] NOT NULL ,
	[LastSendAt] [datetime] NULL ,
	[FailCount] [int] NOT NULL 
) ON [PRIMARY]
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysMessagesSucceed]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSysMessagesSucceed] (
	[MessageID] [int] NOT NULL ,
	[ProviderName] [nvarchar] (30) NOT NULL ,
	[Address] [nvarchar] (100) NOT NULL ,
	[Title] [nvarchar] (500) NULL ,
	[Message] [ntext] NULL ,
	[CreateAt] [datetime] NOT NULL ,
	[SendAt] [datetime] NOT NULL 
) ON [PRIMARY]
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_NewTaskNormal_Title')
INSERT INTO BPMSysSettings VALUES('Mail_NewTaskNormal_Title',N'[工作流][新任务]提交人：<%=Initiator.UserFriendlyName%>，业务名：<%=Context.Current.Process.Name%>，流水号：<%=Context.Current.Task.SerialNum%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_NewTaskNormal_Message')
INSERT INTO BPMSysSettings VALUES('Mail_NewTaskNormal_Message',N'业务名：<%=Context.Current.Process.Name%>
提交人：<%=Initiator.UserFriendlyName%>
提交日期：<%=Context.Current.Task.CreateAt.ToString()%>
流水号：<%=Context.Current.Task.SerialNum%>
来自：<%=Context.Current.LoginUser.FriendlyName%>
内容摘要：
<%=Context.Current.Task.Description%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_Approved_Title')
INSERT INTO BPMSysSettings VALUES('Mail_Approved_Title',N'[工作流][已同意]业务名：<%=Context.Current.Process.Name%>，流水号：<%=Context.Current.Task.SerialNum%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_Approved_Message')
INSERT INTO BPMSysSettings VALUES('Mail_Approved_Message',N'业务名：<%=Context.Current.Process.Name%>
提交人：<%=Initiator.UserFriendlyName%>
提交日期：<%=Context.Current.Task.CreateAt.ToString()%>
流水号：<%=Context.Current.Task.SerialNum%>
同意人：<%=Context.Current.LoginUser.FriendlyName%>
同意日期：<%=Context.Current.Task.FinishAt.ToString()%>
内容摘要：
<%=Context.Current.Task.Description%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_Rejected_Title')
INSERT INTO BPMSysSettings VALUES(N'Mail_Rejected_Title',N'[工作流][已拒绝]业务名：<%=Context.Current.Process.Name%>，流水号：<%=Context.Current.Task.SerialNum%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_Rejected_Message')
INSERT INTO BPMSysSettings VALUES('Mail_Rejected_Message',N'业务名：<%=Context.Current.Process.Name%>
提交人：<%=Initiator.UserFriendlyName%>
提交日期：<%=Context.Current.Task.CreateAt.ToString()%>
流水号：<%=Context.Current.Task.SerialNum%>
拒绝人：<%=Context.Current.LoginUser.FriendlyName%>
拒绝日期：<%=Context.Current.Task.FinishAt.ToString()%>
内容摘要：
<%=Context.Current.Task.Description%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_Aborted_Title')
INSERT INTO BPMSysSettings VALUES('Mail_Aborted_Title',N'[工作流][已撤销]业务名：<%=Context.Current.Process.Name%>，流水号：<%=Context.Current.Task.SerialNum%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_Aborted_Message')
INSERT INTO BPMSysSettings VALUES(N'Mail_Aborted_Message',N'业务名：<%=Context.Current.Process.Name%>
提交人：<%=Initiator.UserFriendlyName%>
提交日期：<%=Context.Current.Task.CreateAt.ToString()%>
流水号：<%=Context.Current.Task.SerialNum%>
撤消日期：<%=DateTime.Now.ToString()%>
撤销人：<%=Context.Current.LoginUser.FriendlyName%>
内容摘要：
<%=Context.Current.Task.Description%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_Deleted_Title')
INSERT INTO BPMSysSettings VALUES('Mail_Deleted_Title',N'[工作流][已删除]业务名：<%=Context.Current.Process.Name%>，流水号：<%=Context.Current.Task.SerialNum%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_Deleted_Message')
INSERT INTO BPMSysSettings VALUES('Mail_Deleted_Message',N'业务名：<%=Context.Current.Process.Name%>
提交人：<%=Initiator.UserFriendlyName%>
提交日期：<%=Context.Current.Task.CreateAt.ToString()%>
流水号：<%=Context.Current.Task.SerialNum%>
删除日期：<%=DateTime.Now.ToString()%>
删除人：<%=Context.Current.LoginUser.FriendlyName%>
内容摘要：
<%=Context.Current.Task.Description%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_StepStopHumanOpt_Title')
INSERT INTO BPMSysSettings VALUES('Mail_StepStopHumanOpt_Title',N'[工作流][步骤中止]提交人：<%=Initiator.UserFriendlyName%>，业务名：<%=Context.Current.Process.Name%>，流水号：<%=Context.Current.Task.SerialNum%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_StepStopHumanOpt_Message')
INSERT INTO BPMSysSettings VALUES('Mail_StepStopHumanOpt_Message',N'被中止步骤：<%=Context.Current.Step.NodeName%>

任务基本信息：
业务名：<%=Context.Current.Process.Name%>
提交人：<%=Initiator.UserFriendlyName%>
提交日期：<%=Context.Current.Task.CreateAt.ToString()%>
流水号：<%=Context.Current.Task.SerialNum%>

任务被执行了以下操作：
操作人：<%=Context.Current.LoginUser.FriendlyName%>\n执行操作：<%=Context.Current.Step.SelActionDisplayString%>
操作日期：<%=DateTime.Now.ToString()%>

内容摘要：
<%=Context.Current.Task.Description%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_StepStopVoteFinished_Title')
INSERT INTO BPMSysSettings VALUES('Mail_StepStopVoteFinished_Title',N'[工作流][投票结束]提交人：<%=Initiator.UserFriendlyName%>，业务名：<%=Context.Current.Process.Name%>，流水号：<%=Context.Current.Task.SerialNum%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_StepStopVoteFinished_Message')
INSERT INTO BPMSysSettings VALUES('Mail_StepStopVoteFinished_Message',N'业务名：<%=Context.Current.Process.Name%>
提交人：<%=Initiator.UserFriendlyName%>
提交日期：<%=Context.Current.Task.CreateAt.ToString()%>
流水号：<%=Context.Current.Task.SerialNum%>
内容摘要：
<%=Context.Current.Task.Description%>')
GO


/********************************************* ver3.08 DBUpdate *********************************************/
if not exists(select * from syscolumns where name = 'SubNodeName' and id = object_id('BPMInstProcSteps'))
BEGIN
ALTER TABLE BPMInstProcSteps ADD SubNodeName [nvarchar] (30) NULL
END
GO

if not exists(select * from syscolumns where name = 'Error' and id = object_id('BPMSysMessagesFailed'))
BEGIN
ALTER TABLE BPMSysMessagesFailed ADD Error [ntext] NULL
END
GO

if not exists(select * from syscolumns where name = 'LogonProvider' and id = object_id('BPMSysUsers'))
BEGIN
ALTER TABLE BPMSysUsers ADD LogonProvider [nvarchar] (30) NULL
END
GO

if not exists(select * from syscolumns where name = 'AutoProcess' and id = object_id('BPMInstProcSteps'))
BEGIN
ALTER TABLE BPMInstProcSteps ADD AutoProcess [bit] DEFAULT(0) NOT NULL
END
GO

if not exists(select * from syscolumns where name = 'Comments' and id = object_id('BPMInstProcSteps'))
BEGIN
ALTER TABLE BPMInstProcSteps ADD Comments [ntext] NULL
END
GO

/********************************************* ver3.09 DBUpdate *********************************************/
if not exists(select * from syscolumns where name = 'Level' and id = object_id('BPMSysOUMembers'))
BEGIN
ALTER TABLE BPMSysOUMembers ADD [Level] [int] DEFAULT(0) NOT NULL
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_TimeoutNotify_Title')
INSERT INTO BPMSysSettings VALUES('Mail_TimeoutNotify_Title',N'[工作流][催办通知]提交人：<%=Initiator.UserFriendlyName%>，业务名：<%=Context.Current.Process.Name%>，流水号：<%=Context.Current.Task.SerialNum%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_TimeoutNotify_Message')
INSERT INTO BPMSysSettings VALUES(N'Mail_TimeoutNotify_Message',
N'请速办理以下业务：
业务名：<%=Context.Current.Process.Name%>
提交人：<%=Initiator.UserFriendlyName%>
提交日期：<%=Context.Current.Task.CreateAt.ToString()%>
流水号：<%=Context.Current.Task.SerialNum%>
内容摘要：
<%=Context.Current.Task.Description%>')
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysTimeoutQueue]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSysTimeoutQueue] (
	[ItemType] [nvarchar](30) NOT NULL,
	[ObjectID] [int] NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	[ExpireDate] [datetime] NOT NULL,
	[LastProcessDate] [datetime] NULL,
	[FailCount] [int] NULL
) ON [PRIMARY]
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysTimeoutSucceed]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSysTimeoutSucceed] (
	[ItemType] [nvarchar](30) NOT NULL,
	[ObjectID] [int] NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	[ExpireDate] [datetime] NOT NULL,
	[DoneDate] [datetime] NOT NULL,
) ON [PRIMARY]
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysTimeoutFailed]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSysTimeoutFailed] (
	[ItemType] [nvarchar](30) NOT NULL,
	[ObjectID] [int] NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	[ExpireDate] [datetime] NOT NULL,
	[RemoveDate] [datetime] NOT NULL,
	[FailCount] [int] NOT NULL,
	[Error] [ntext] NULL,
) ON [PRIMARY]
END
GO

if not exists(select * from syscolumns where name = 'UsedMinutes' and id = object_id('BPMInstProcSteps'))
BEGIN
ALTER TABLE BPMInstProcSteps ADD UsedMinutes [int] NULL
ALTER TABLE BPMInstProcSteps ADD UsedMinutesWork [int] NULL
END
GO

/********************************************* ver3.10 DBUpdate *********************************************/
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysAppLog]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSysAppLog](
	[ObjectID] [uniqueidentifier] ROWGUIDCOL  NOT NULL CONSTRAINT [DF_BPMSysAppLog_ObjectID]  DEFAULT (newid()),
	[LogDate] [datetime] NOT NULL,
	[ClientIP] [char](36) NOT NULL,
	[UserAccount] [nvarchar](50) NOT NULL,
	[Action] [nvarchar](50) NOT NULL,
	[ActParam1] [nvarchar](50) NULL,
	[ActParam2] [nvarchar](50) NULL,
	[ActParam3] [nvarchar](50) NULL,
	[TickUsed] [int] NOT NULL,
	[Succeed] [bit] NOT NULL,
	[Error] [ntext] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysAppLogACL]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSysAppLogACL](
	[ItemID] [uniqueidentifier] ROWGUIDCOL  NOT NULL CONSTRAINT [DF_BPMSysAppLogACL_ObjectID]  DEFAULT (newid()),
	[CreateDate] [datetime] NOT NULL CONSTRAINT [DF_BPMSysAppLogACL_CreateDate]  DEFAULT (getdate()),
	[ObjectID] [uniqueidentifier] NOT NULL,
	[SID] [nvarchar](50) NULL
) ON [PRIMARY]
END
GO

if not exists(select * from syscolumns where name = 'RecedeFromStep' and id = object_id('BPMInstProcSteps'))
BEGIN
ALTER TABLE BPMInstProcSteps ADD RecedeFromStep [int] NULL
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_RecedeBack_Title')
INSERT INTO BPMSysSettings VALUES('Mail_RecedeBack_Title',N'[工作流][退回通知]提交人：<%=Initiator.UserFriendlyName%>，业务名：<%=Context.Current.Process.Name%>，流水号：<%=Context.Current.Task.SerialNum%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_RecedeBack_Message')
INSERT INTO BPMSysSettings VALUES('Mail_RecedeBack_Message',N'业务名：<%=Context.Current.Process.Name%>
提交人：<%=Initiator.UserFriendlyName%>
提交日期：<%=Context.Current.Task.CreateAt.ToString()%>
流水号：<%=Context.Current.Task.SerialNum%>
来自：<%=Context.Current.LoginUser.FriendlyName%>
内容摘要：
<%=Context.Current.Task.Description%>')
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMInstDrafts]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMInstDrafts](
	[DraftID] [nvarchar](50) NOT NULL,
	[Name] [nvarchar](50) NULL,
	[ProcessName] [nvarchar](50) NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	[ModifyDate] [datetime] NOT NULL,
	[Account] [nvarchar](50) NOT NULL,
	[OwnerPosition] [nvarchar](200) NOT NULL,
	[OwnerAccount] [nvarchar](50) NOT NULL,
	[FormData] [ntext] NOT NULL,
	[Description] [nvarchar](200) NULL,
	[Comment] [nvarchar](200) NULL
) ON [PRIMARY]
END
GO

if not exists(select * from syscolumns where name = 'TimeoutNotifyCount' and id = object_id('BPMInstProcSteps'))
BEGIN
ALTER TABLE BPMInstProcSteps ADD TimeoutNotifyCount [int] NOT NULL DEFAULT(0);
END
GO

/********************************************* ver3.20a DBUpdate *********************************************/
if not exists(select * from syscolumns where name = 'FormDataSetID' and id = object_id('BPMInstTasks'))
BEGIN
ALTER TABLE BPMInstTasks ADD FormDataSetID [int] NULL;
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMInstFormDataSets]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMInstFormDataSets](
	[FormDataSetID] [int] IDENTITY(1,1) NOT NULL,
	[FormDataSetDesc] [nvarchar](50) NULL
) ON [PRIMARY]
END

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMInstFormDataSetLinks]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMInstFormDataSetLinks](
	[FormDataSetID] [int] NOT NULL,
	[DataSourceName] [nvarchar](50) NULL,
	[TableName] [nvarchar](50) NOT NULL,
	[KeyValue] [nvarchar](50) NOT NULL
) ON [PRIMARY]
END
GO

/********************************************* ver3.20g DBUpdate *********************************************/
if not exists(select * from syscolumns where name = 'OutOfOfficeState' and id = object_id('BPMSysUserCommonInfo'))
BEGIN
ALTER TABLE BPMSysUserCommonInfo ADD OutOfOfficeState [nvarchar](50) NULL;
ALTER TABLE BPMSysUserCommonInfo ADD OutOfOfficeFrom [datetime] NULL;
ALTER TABLE BPMSysUserCommonInfo ADD OutOfOfficeTo [datetime] NULL;
END
GO

if exists(select * from dbo.sysobjects where id = object_id(N'[dbo].[DF_BPMSysUserComInfo_IsOutOfOffice]'))
BEGIN
ALTER TABLE BPMSysUserCommonInfo DROP [DF_BPMSysUserComInfo_IsOutOfOffice];
END
GO

if exists(select * from syscolumns where name = 'IsOutOfOffice' and id = object_id('BPMSysUserCommonInfo'))
BEGIN
EXEC ('UPDATE BPMSysUserCommonInfo SET OutOfOfficeState=''Out'' WHERE IsOutOfOffice = 1');
ALTER TABLE BPMSysUserCommonInfo DROP COLUMN IsOutOfOffice;
END
GO

/********************************************* ver3.20j DBUpdate *********************************************/
if not exists(select * from syscolumns where name = 'RisedConsignID' and id = object_id('BPMInstProcSteps'))
BEGIN
ALTER TABLE BPMInstProcSteps ADD RisedConsignID [int] NULL;
ALTER TABLE BPMInstProcSteps ADD BelongConsignID [int] NULL;
ALTER TABLE BPMInstProcSteps ADD ConsignOwnerAccount [nvarchar](50) NULL;
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMInstConsign]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMInstConsign](
	[ConsignID] [int] IDENTITY (1, 1) NOT NULL ,
	[Enabled] [bit] DEFAULT(1) NOT NULL,
	[OwnerStepID] [int] NOT NULL,
	[ReturnType] [nvarchar](20) NOT NULL,
	[RoutingType] [nvarchar](20) NOT NULL
) ON [PRIMARY]
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMInstConsignUsers]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMInstConsignUsers](
	[ConsignID] [int] NOT NULL ,
	[UserAccount] [nvarchar](50) NOT NULL
) ON [PRIMARY]
END
GO

/********************************************* ver3.20r DBUpdate *********************************************/
if not exists(select * from syscolumns where name = 'TimeoutFirstNotifyDate' and id = object_id('BPMInstProcSteps'))
BEGIN
ALTER TABLE BPMInstProcSteps ADD TimeoutFirstNotifyDate [datetime] NULL;
ALTER TABLE BPMInstProcSteps ADD TimeoutDeadline [datetime] NULL;
ALTER TABLE BPMInstProcSteps ADD StandardMinutesWork [int] NULL;
END
GO

/********************************************* ver3.20x DBUpdate *********************************************/
if not exists (select * from BPMSysUsers where Account='sa')
INSERT INTO BPMSysUsers(Account,Password,SysUser,SID) VALUES('sa','',1,'9864A43A-876C-46e6-829B-A7223D8B6B76')
GO

--if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysSeeks]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
--BEGIN
--CREATE TABLE [dbo].[BPMSysSeeks](
--	[DataSourceName] [nvarchar](50) NULL,
--	[TableName] [nvarchar](50) NOT NULL,
--	[ColumnName] [nvarchar](50) NOT NULL,
--	[Prefix] [nvarchar](50) NULL,
--	[Columns] [int] NOT NULL,
--	[CurrSeekValue] [int] NOT NULL,
--	[ActiveDate] [datetime] NOT NULL
--) ON [PRIMARY]
--END
--GO

--if not exists(select * from syscolumns where name = 'DataSourceName' and id = object_id('BPMSysSeeks'))
--BEGIN
--ALTER TABLE BPMSysSeeks ADD DataSourceName [nvarchar](50) NULL;
--END
--GO

/********************************************* ver3.40i DBUpdate *********************************************/
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysTaskRule]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSysTaskRule](
	[RuleID] [int] IDENTITY(1,1) NOT NULL,
	[Enabled] [bit] NOT NULL,
	[Account] [nvarchar](50) NOT NULL,
	[OrderIndex] [int] NOT NULL,
	[RuleType] [nvarchar](50) NOT NULL,
	[ProcessDefineType] [nvarchar](50) NULL
) ON [PRIMARY]
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysTaskRuleProcess]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSysTaskRuleProcess](
	[RuleID] [int] NOT NULL,
	[OrderIndex] [int] NOT NULL,
	[ProcessName] [nvarchar](50) NOT NULL,
	[Condition] [ntext] NULL
) ON [PRIMARY]
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysUserElement]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSysUserElement](
	[ParentObjectID] [int] NOT NULL,
	[Category] [nvarchar](50) NOT NULL,
	[OrderIndex] [int] NOT NULL,
	[UserElementType] [nvarchar](50) NOT NULL,
	[SParam1] [nvarchar](256) NULL,
	[SParam2] [nvarchar](256) NULL,
	[SParam3] [nvarchar](256) NULL,
	[SParam4] [nvarchar](256) NULL,
	[SParam5] [nvarchar](256) NULL,
	[LParam1] [int] NULL,
	[LParam2] [int] NULL,
	[LParam3] [int] NULL,
	[Include] [bit] NOT NULL,
	[Exclude] [bit] NOT NULL,
	[Express] [ntext] NULL
) ON [PRIMARY]
END
GO

/********************************************* ver3.50a DBUpdate *********************************************/
if not exists(select * from syscolumns where name = 'Code' and id = object_id('BPMSysOUs'))
BEGIN
ALTER TABLE BPMSysOUs ADD Code [nvarchar](50) NULL;
END
GO

/********************************************* ver3.50a DBUpdate *********************************************/
if not exists(select * from syscolumns where name = 'Disabled' and id = object_id('BPMSysUsers'))
BEGIN
ALTER TABLE BPMSysUsers ADD Disabled [bit] NOT NULL DEFAULT (0);
END
GO

/********************************************* ver3.50d DBUpdate *********************************************/
if not exists(select * from syscolumns where name = 'ItemID' and id = object_id('BPMSysTimeoutQueue'))
BEGIN
ALTER TABLE BPMSysTimeoutQueue ADD ItemID [int] IDENTITY (1, 1) NOT NULL;
ALTER TABLE BPMSysTimeoutFailed ADD ItemID [int] IDENTITY (1, 1) NOT NULL;
ALTER TABLE BPMSysTimeoutSucceed ADD ItemID [int] IDENTITY (1, 1) NOT NULL;
ALTER TABLE BPMSysTimeoutFailed ADD QueueItemID [int] NOT NULL DEFAULT(-1);
ALTER TABLE BPMSysTimeoutSucceed ADD QueueItemID [int] NOT NULL DEFAULT(-1);
END
GO

if not exists(select * from syscolumns where name = 'BatchApprove' and id = object_id('BPMInstProcSteps'))
BEGIN
ALTER TABLE BPMInstProcSteps ADD BatchApprove [bit] DEFAULT(0) NOT NULL
END
GO

/********************************************* ver3.50l DBUpdate *********************************************/
if not exists(select * from syscolumns where name = 'Posted' and id = object_id('BPMInstProcSteps'))
BEGIN
ALTER TABLE BPMInstProcSteps ADD Posted [bit] DEFAULT(0) NOT NULL;
INSERT BPMSysSettings(ItemName,ItemValue) VALUES('Flag_PostedColumnCreated','1');
END
GO

if exists (select * from BPMSysSettings WHERE ItemName = 'Flag_PostedColumnCreated')
BEGIN
Update BPMInstProcSteps SET Posted=1 WHERE StepID IN(SELECT min(StepID) FROM BPMInstProcSteps Group By TaskID);
DELETE FROM BPMSysSettings WHERE ItemName = 'Flag_PostedColumnCreated';
END
GO

if not exists(select * from syscolumns where name = 'FormSaved' and id = object_id('BPMInstProcSteps'))
BEGIN
ALTER TABLE BPMInstProcSteps ADD FormSaved [bit] DEFAULT(1) NOT NULL;
END
GO

/********************************************* ver3.50x DBUpdate *********************************************/
if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_IndicateTask_Title')
INSERT INTO BPMSysSettings VALUES('Mail_IndicateTask_Title',N'[工作流][阅示]邀请人：<%=Context.Current.LoginUser.FriendlyName%>，业务名：<%=Context.Current.Process.Name%>，流水号：<%=Context.Current.Task.SerialNum%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_IndicateTask_Message')
INSERT INTO BPMSysSettings VALUES('Mail_IndicateTask_Message',
N'业务名：<%=Context.Current.Process.Name%>
提交人：<%=Initiator.UserFriendlyName%>
提交日期：<%=Context.Current.Task.CreateAt.ToString()%>
流水号：<%=Context.Current.Task.SerialNum%>
来自：<%=Context.Current.LoginUser.FriendlyName%>
内容摘要：
<%=Context.Current.Task.Description%>')
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSecurityUserResource]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSecurityUserResource](
	[RSID] [nvarchar](50) NOT NULL CONSTRAINT [DF_BPMSecurityUserResource_RSID]  DEFAULT (newid()),
	[ParentRSID] [nvarchar](50) NULL,
	[OrderIndex] [int] NOT NULL CONSTRAINT [DF_BPMSecurityUserResource_OrderIndex]  DEFAULT ((0)),
	[ResourceName] [nvarchar](200) NOT NULL
) ON [PRIMARY]
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSecurityUserResourceACL]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSecurityUserResourceACL](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[RoleType] [varchar](30) NOT NULL,
	[RoleParam1] [ntext] NOT NULL,
	[RoleParam2] [nvarchar](50) NULL,
	[RoleParam3] [nvarchar](50) NULL,
	[RSID] [nvarchar](50) NOT NULL,
	[AllowPermision] [nvarchar](200) NULL,
	[DenyPermision] [nvarchar](200) NULL,
	[LeadershipTokenPermision] [nvarchar](200) NULL,
	[Inherited] [bit] NOT NULL,
	[Inheritable] [bit] NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreateBy] [nvarchar](50) NOT NULL
) ON [PRIMARY]
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSecurityUserResourcePerm]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSecurityUserResourcePerm](
	[RSID] [nvarchar](50) NOT NULL,
	[PermName] [nvarchar](50) NOT NULL,
	[OrderIndex] [int] NOT NULL CONSTRAINT [DF_BPMSecurityUserResourcePerm_OrderIndex]  DEFAULT ((0)),
	[PermDisplayName] [nvarchar](50) NOT NULL,
	[PermType] [nvarchar](50) NOT NULL,
	[LeadershipTokenEnabled] [bit] NOT NULL
) ON [PRIMARY]
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSecurityRecordACL]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSecurityRecordACL](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[TableName] [nvarchar](50) NOT NULL,
	[KeyValue] [nvarchar](50) NOT NULL,
	[SIDType] [varchar](30) NOT NULL,
	[SID] [nvarchar](50) NOT NULL,
	[Permision] [nvarchar](50) NOT NULL,
	[LeadershipToken] [bit] NOT NULL,
	[PublicByUser] [bit] NOT NULL,
	[CreateDate] [datetime] NULL,
	[CreateBy] [nvarchar](50) NULL,
	[Comments] [nvarchar](500) NULL
) ON [PRIMARY]
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZAppFileConvert]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[YZAppFileConvert](
	[ItemGuid] [varchar](50) NOT NULL,
	[CreateDate] [datetime] NULL CONSTRAINT [DF_YZAppFileConvert_CreateDate]  DEFAULT (getdate()),
	[FileBody] [image] NOT NULL,
	[Processed] [bit] NULL CONSTRAINT [DF_YZAppFileConvert_Processed]  DEFAULT ((0)),
	[Image] [image] NULL,
	[Width] [int] NULL CONSTRAINT [DF_YZAppFileConvert_Width]  DEFAULT ((0)),
	[Height] [int] NULL CONSTRAINT [DF_YZAppFileConvert_Height]  DEFAULT ((0)),
	[ErrorMsg] [ntext] NULL
) ON [PRIMARY]
END
GO

if not exists(select * from syscolumns where name = 'SID' and id = object_id('BPMSysOURoles'))
BEGIN
ALTER TABLE BPMSysOURoles ADD SID [nvarchar](50) DEFAULT(NEWID()) NOT NULL;
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSecurityExtToken]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSecurityExtToken](
	[Account] [nvarchar](50) NOT NULL,
	[SIDType] [nvarchar](20) NOT NULL,
	[SID] [nvarchar](50) NOT NULL,
) ON [PRIMARY]
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZAppAttachment]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[YZAppAttachment](
	[FileID] [nvarchar](50) NOT NULL,
	[Name] [nvarchar](256) NULL,
	[Ext] [nvarchar](8) NULL,
	[Size] [int] NULL,
	[LastUpdate] [datetime] NULL DEFAULT (getdate()),
	[OwnerAccount] [nvarchar](30) NULL,
) ON [PRIMARY]
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[iSYSFactory]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[iSYSFactory](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](50) NOT NULL,
	[Name] [nvarchar](128) NOT NULL,
	[Remark] [nvarchar](512) NULL,
	[MapX] [int] NULL,
	[MapY] [int] NULL
) ON [PRIMARY]
END
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_NAME = 'v_iSYSLoginStation')
DROP VIEW [dbo].[v_iSYSLoginStation]
GO

CREATE VIEW [dbo].[v_iSYSLoginStation]
AS
SELECT Code AS ID, Name, MapX, MapY
FROM dbo.iSYSFactory
GO

if not exists(select * from syscolumns where name = 'NameSpell' and id = object_id('BPMSysUsers'))
BEGIN
ALTER TABLE BPMSysUsers ADD NameSpell [nvarchar] (50) NULL
END
GO

if exists(select * from syscolumns where name = 'Comment' and id = object_id('BPMInstDrafts'))
BEGIN
ALTER TABLE BPMInstDrafts DROP COLUMN Comment
END
GO

if not exists(select * from syscolumns where name = 'Comments' and id = object_id('BPMInstDrafts'))
BEGIN
ALTER TABLE BPMInstDrafts ADD Comments [ntext] NULL
END
GO

if not exists(select * from syscolumns where name = 'Attachments' and id = object_id('BPMSysMessagesQueue'))
BEGIN
ALTER TABLE BPMSysMessagesQueue ADD Attachments [ntext] NULL
END
GO

if not exists(select * from syscolumns where name = 'Attachments' and id = object_id('BPMSysMessagesSucceed'))
BEGIN
ALTER TABLE BPMSysMessagesSucceed ADD Attachments [ntext] NULL
END
GO

if not exists(select * from syscolumns where name = 'Attachments' and id = object_id('BPMSysMessagesFailed'))
BEGIN
ALTER TABLE BPMSysMessagesFailed ADD Attachments [ntext] NULL
END
GO

if not exists(select * from syscolumns where name = 'ParentStepID' and id = object_id('BPMInstProcSteps'))
BEGIN
ALTER TABLE BPMInstProcSteps ADD ParentStepID [int] NULL
END
GO

if not exists(select * from syscolumns where name = 'NodePath' and id = object_id('BPMInstProcSteps'))
BEGIN
ALTER TABLE BPMInstProcSteps ADD NodePath [nvarchar] (200) NULL
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysSqlTrace]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSysSqlTrace](
	[RunDate] [datetime] NULL,
	[UserAccount] [nvarchar](50) NULL,
	[SqlText] [nvarchar](2000) NULL,
	[SqlTextFull] [ntext] NULL,
	[TickUsed] [int] NULL,
	[Error] [ntext] NULL,
	[xml] [ntext] NULL
) ON [PRIMARY]
END
GO

if not exists(select * from syscolumns where name = 'OrderIndex' and id = object_id('BPMSysOUs'))
BEGIN
ALTER TABLE BPMSysOUs ADD OrderIndex [int] NOT NULL DEFAULT(1)
END
GO

/***v4.6***/
/*************************4.6数据库表结构升级开始**************************/
--BPMInstTasks表升级
if not exists(select * from syscolumns where name = 'ExtYear' and id = object_id('BPMInstTasks'))
BEGIN
ALTER TABLE BPMInstTasks ADD [ExtYear]  AS YEAR(CreateAt) PERSISTED
ALTER TABLE BPMInstTasks ADD [ExtInitiator]  AS ISNULL([AgentAccount],[OwnerAccount]) PERSISTED
ALTER TABLE BPMInstTasks ADD [ExtDeleted]  AS CONVERT(bit,(CASE [State] WHEN 'Deleted' THEN 1 else 0 end)) PERSISTED
END
GO

--BPMInstProcSteps表升级
if not exists(select * from syscolumns where name = 'ExtYear' and id = object_id('BPMInstProcSteps'))
BEGIN
ALTER TABLE BPMInstProcSteps ADD [ExtYear] [int]  --需维护***
ALTER TABLE BPMInstProcSteps ADD [ExtStepYear]  AS YEAR(ReceiveAt) PERSISTED
ALTER TABLE BPMInstProcSteps ADD [ExtRecipient]  AS (ISNULL([AgentAccount],[OwnerAccount])) PERSISTED
ALTER TABLE BPMInstProcSteps ADD [ExtDeleted] bit NOT NULL Default(0) --需维护***

--BPMInstProcSteps表数据升级
exec sp_executesql N'
WITH X AS
(
SELECT A.*,B.ExtYear TaskYear,B.ExtDeleted TaskDeleted FROM BPMInstProcSteps A LEFT JOIN BPMInstTasks B ON A.TaskID=B.TaskID
)
UPDATE X SET ExtYear=TaskYear,ExtDeleted=ISNULL(TaskDeleted,1)
'
END
GO

--BPMSecurityTACL表升级
if not exists(select * from syscolumns where name = 'ExtYear' and id = object_id('BPMSecurityTACL'))
BEGIN
ALTER TABLE BPMSecurityTACL ADD ID [int] IDENTITY (1, 1) NOT NULL;
ALTER TABLE BPMSecurityTACL ADD [ExtYear] [int] --需维护***
ALTER TABLE BPMSecurityTACL ADD [ExtDeleted] bit NOT NULL Default(0) --需维护***

--BPMSecurityTACL表数据升级
exec sp_executesql N'
WITH X AS
(
SELECT A.*,B.ExtYear TaskYear,B.ExtDeleted TaskDeleted FROM BPMSecurityTACL A LEFT JOIN BPMInstTasks B ON A.TaskID=B.TaskID
)
UPDATE X SET ExtYear=TaskYear,ExtDeleted=ISNULL(TaskDeleted,1)
'
END
GO

--BPMInstShare表升级
if not exists(select * from syscolumns where name = 'ItemID' and id = object_id('BPMInstShare'))
BEGIN
ALTER TABLE BPMInstShare ADD ItemID [int] IDENTITY (1, 1) NOT NULL;

--BPMInstShare表数据升级
--StepID UserAccount要唯一***
exec sp_executesql N'
SELECT MIN(ItemID) AS ItemID,StepID,UserAccount INTO #tmp FROM BPMInstShare GROUP BY StepID,UserAccount HAVING COUNT(*)>1
DELETE BPMInstShare FROM BPMInstShare,#tmp WHERE #tmp.StepID=BPMInstShare.StepID AND #tmp.UserAccount=BPMInstShare.UserAccount AND BPMInstShare.ItemID <> #tmp.ItemID
DROP TABLE #tmp
'
END
GO

--BPMSysAppLog表升级
if not exists(select * from syscolumns where name = 'ExtDate' and id = object_id('BPMSysAppLog'))
BEGIN
ALTER TABLE BPMSysAppLog ADD [ExtDate] AS DATEADD(dd, 0, DATEDIFF(dd, 0, LogDate)) PERSISTED --日志日期
END
GO

--BPMSysAppLogACL表升级
if not exists(select * from syscolumns where name = 'ExtDate' and id = object_id('BPMSysAppLogACL'))
BEGIN
ALTER TABLE BPMSysAppLogACL ADD [ExtDate] AS DATEADD(dd, 0, DATEDIFF(dd, 0, CreateDate)) PERSISTED --日志日期
END
GO

--创建表：BPMSysMemberIDMap
if (object_id('BPMSysMemberIDMap') is null)
BEGIN
CREATE TABLE [dbo].[BPMSysMemberIDMap](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[MemberFullName] [nvarchar](300) NOT NULL,
	CONSTRAINT [YZPK_BPMSysMemberIDMap] PRIMARY KEY CLUSTERED 
	(
		[ID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
END
GO

--创建表BPMSysMemberIDMap的索引：YZIX_BPMSysMemberIDMap_MemberFullName
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSysMemberIDMap_MemberFullName')
BEGIN
CREATE NONCLUSTERED INDEX [YZIX_BPMSysMemberIDMap_MemberFullName] ON [dbo].[BPMSysMemberIDMap] 
(
	[MemberFullName] ASC
) ON [PRIMARY]
END
GO

/***BPMInstTasks,OwnerPosition->OwnerPositionID-开始***/
--创建OwnerPositionID列
if not exists(select * from syscolumns where name = 'OwnerPositionID' and id = object_id('BPMInstTasks'))
BEGIN
ALTER TABLE BPMInstTasks ADD [OwnerPositionID] [int]
END
GO

--将OwnerPosition的值转化为OwnerPositionID
if exists(select * from syscolumns where name = 'OwnerPosition' and id = object_id('BPMInstTasks'))
BEGIN
exec sp_executesql N'
--BPMSysMemberIDMap表更新
WITH
X AS(
SELECT DISTINCT OwnerPosition FROM BPMInstTasks WHERE OwnerPosition IS NOT NULL AND OwnerPosition NOT IN(SELECT MemberFullName FROM BPMSysMemberIDMap)
)
INSERT INTO BPMSysMemberIDMap(MemberFullName) SELECT OwnerPosition FROM X;

--OwnerPositionID列更新
WITH
D AS(
SELECT A.*,B.ID NewMemberID FROM BPMInstTasks A INNER JOIN BPMSysMemberIDMap B ON A.OwnerPosition=B.MemberFullName
)
UPDATE D SET OwnerPositionID=NewMemberID;

--删除OwnerPosition列
ALTER TABLE BPMInstTasks DROP COLUMN OwnerPosition
'
END
GO
/***BPMInstTasks,OwnerPosition->OwnerPositionID-结束***/

/***BPMInstProcSteps,OwnerPosition->OwnerPositionID-开始***/
--创建OwnerPositionID列
if not exists(select * from syscolumns where name = 'OwnerPositionID' and id = object_id('BPMInstProcSteps'))
BEGIN
ALTER TABLE BPMInstProcSteps ADD [OwnerPositionID] [int]
END
GO

--将OwnerPosition的值转化为OwnerPositionID
if exists(select * from syscolumns where name = 'OwnerPosition' and id = object_id('BPMInstProcSteps'))
BEGIN
exec sp_executesql N'
--BPMSysMemberIDMap表更新
WITH
X AS(
SELECT DISTINCT OwnerPosition FROM BPMInstProcSteps WHERE OwnerPosition IS NOT NULL AND OwnerPosition NOT IN(SELECT MemberFullName FROM BPMSysMemberIDMap)
)
INSERT INTO BPMSysMemberIDMap(MemberFullName) SELECT OwnerPosition FROM X;

--OwnerPositionID列更新
WITH
D AS(
SELECT A.*,B.ID NewMemberID FROM BPMInstProcSteps A INNER JOIN BPMSysMemberIDMap B ON A.OwnerPosition=B.MemberFullName
)
UPDATE D SET OwnerPositionID=NewMemberID;

--删除OwnerPosition列
ALTER TABLE BPMInstProcSteps DROP COLUMN OwnerPosition
'
END
GO
/***BPMInstProcSteps,OwnerPosition->OwnerPositionID-结束***/

/***BPMInstShare,MemberFullName->PositionID-开始***/
--PositionID
if not exists(select * from syscolumns where name = 'PositionID' and id = object_id('BPMInstShare'))
BEGIN
ALTER TABLE BPMInstShare ADD PositionID [int]
END
GO

--将OwnerPosition的值转化为OwnerPositionID
if exists(select * from syscolumns where name = 'MemberFullName' and id = object_id('BPMInstShare'))
BEGIN
exec sp_executesql N'
--BPMSysMemberIDMap表更新
WITH
X AS(
SELECT DISTINCT MemberFullName FROM BPMInstShare WHERE MemberFullName IS NOT NULL AND MemberFullName NOT IN(SELECT MemberFullName FROM BPMSysMemberIDMap)
)
INSERT INTO BPMSysMemberIDMap(MemberFullName) SELECT MemberFullName FROM X;

--PositionID
WITH
D AS(
SELECT A.*,B.ID NewMemberID FROM BPMInstShare A INNER JOIN BPMSysMemberIDMap B ON A.MemberFullName=B.MemberFullName
)
UPDATE D SET PositionID=NewMemberID;

--删除OwnerPosition列
ALTER TABLE BPMInstShare DROP COLUMN MemberFullName
'
END
GO
/***BPMInstShare,MemberFullName->PositionID-结束***/


/***BPMInstDrafts,OwnerPosition->OwnerPositionID-开始***/
--创建OwnerPositionID列
if not exists(select * from syscolumns where name = 'OwnerPositionID' and id = object_id('BPMInstDrafts'))
BEGIN
ALTER TABLE BPMInstDrafts ADD [OwnerPositionID] [int]
END
GO

--将OwnerPosition的值转化为OwnerPositionID
if exists(select * from syscolumns where name = 'OwnerPosition' and id = object_id('BPMInstDrafts'))
BEGIN
exec sp_executesql N'
--BPMSysMemberIDMap表更新
WITH
X AS(
SELECT DISTINCT OwnerPosition FROM BPMInstDrafts WHERE OwnerPosition IS NOT NULL AND OwnerPosition NOT IN(SELECT MemberFullName FROM BPMSysMemberIDMap)
)
INSERT INTO BPMSysMemberIDMap(MemberFullName) SELECT OwnerPosition FROM X;

--OwnerPositionID列更新
WITH
D AS(
SELECT A.*,B.ID NewMemberID FROM BPMInstDrafts A INNER JOIN BPMSysMemberIDMap B ON A.OwnerPosition=B.MemberFullName
)
UPDATE D SET OwnerPositionID=NewMemberID;

--删除OwnerPosition列
ALTER TABLE BPMInstDrafts DROP COLUMN OwnerPosition
'
END
GO
/***BPMInstDrafts,OwnerPosition->OwnerPositionID-结束***/

--表改名
--BPMInstClickToProcessQuery->BPMInstClickToProcessQueue
if exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMInstClickToProcessQuery]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
EXEC dbo.sp_rename @objname = N'[dbo].[BPMInstClickToProcessQuery]', @newname = N'BPMInstClickToProcessQueue', @objtype = N'OBJECT'
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMInstClickToProcessQueue]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMInstClickToProcessQueue](
	[CreateDate] [datetime] NOT NULL,
	[ItemGUID] [uniqueidentifier] NOT NULL,
	[TaskID] [int] NOT NULL,
	[StepID] [int] NOT NULL,
	[RecipientAccount] [nvarchar](50) NOT NULL,
	[SystemAction] [bit] NOT NULL,
	[ActionName] [nvarchar](50) NOT NULL,
	[ExpireDate] [datetime] NULL
) ON [PRIMARY]
END
GO

--表删除
--BPMInstTaskStepLinks
if (object_id('BPMInstTaskStepLinks') is not null)
BEGIN
DROP TABLE [dbo].[BPMInstTaskStepLinks]
END
GO

--表删除
--BPMSysTrigger
if (object_id('BPMSysTrigger') is not null)
BEGIN
DROP TABLE [dbo].[BPMSysTrigger]
END
GO

--列修改
DECLARE @len INT;
SELECT @len=length FROM syscolumns WHERE name = 'RSID' and id = object_id('BPMSecurityACL')
if @len>900
BEGIN
ALTER TABLE [dbo].[BPMSecurityACL] ALTER COLUMN RSID nvarchar(450)
END
GO

--YZV_TaskList(待处理任务物化视图)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_NAME = 'YZV_TaskList')
BEGIN
exec sp_executesql N'
CREATE VIEW YZV_TaskList
WITH SCHEMABINDING
AS
SELECT a.TaskID,a.StepID,b.ProcessName,b.OwnerPositionID,b.OwnerAccount,b.AgentAccount,b.CreateAt,b.Description,a.NodeName,a.ReceiveAt,a.Share,b.State,b.SerialNum,a.TimeoutFirstNotifyDate,a.TimeoutDeadline,a.TimeoutNotifyCount,a.NodePath,a.ExtRecipient
FROM dbo.BPMInstProcSteps a INNER JOIN dbo.BPMInstTasks b on a.TaskID=b.TaskID
WHERE a.FinishAt IS NULL AND a.HumanStep=1 AND a.ExtRecipient IS NOT NULL AND b.State=''Running''
'
END
GO

--YZV_ShareTask(共享任务物化视图)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_NAME = 'YZV_ShareTask')
BEGIN
exec sp_executesql N'
CREATE VIEW YZV_ShareTask
WITH SCHEMABINDING
AS
SELECT a.TaskID,a.StepID,b.ProcessName,b.OwnerPositionID,b.OwnerAccount,b.AgentAccount,b.CreateAt,b.Description,a.NodeName,a.ReceiveAt,1 as Share,b.State,b.SerialNum,a.TimeoutFirstNotifyDate,a.TimeoutDeadline,a.TimeoutNotifyCount,c.UserAccount
FROM dbo.BPMInstProcSteps a INNER JOIN dbo.BPMInstTasks b ON a.TaskID = b.TaskID INNER JOIN dbo.BPMInstShare c ON a.StepID=c.StepID 
WHERE a.FinishAt IS NULL AND a.ExtRecipient IS NULL AND a.HumanStep=1 AND b.State=''Running''
'
END
GO
/*************************4.6数据库表结构升级结束**************************/


/*************************4.6查询通知功能升级开始**************************/
--创建BPMSysTableVersion表
if (object_id('BPMSysTableVersion') is null)
CREATE TABLE [dbo].[BPMSysTableVersion](
	[TableName] [nvarchar](50) NOT NULL,
	[Version] [int] NOT NULL,
	[LastUpdate] [datetime] NULL
) ON [PRIMARY]
GO

/*************************4.6查询通知功能升级结束**************************/


/*************************4.6创建索引开始**************************/
--删除主键与索引
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstClickToProcessQueue_StepID')
BEGIN
	DECLARE @temptb TABLE  
	(
		ID int IDENTITY(1,1),
		TableName nvarchar(200)
	)

	--删除以下表的索引
	INSERT INTO @temptb VALUES(N'BPMInstClickToProcessQueue')
	INSERT INTO @temptb VALUES(N'BPMInstConsign')
	INSERT INTO @temptb VALUES(N'BPMInstConsignUsers')
	INSERT INTO @temptb VALUES(N'BPMInstDrafts')
	INSERT INTO @temptb VALUES(N'BPMInstFormDataSetLinks')
	INSERT INTO @temptb VALUES(N'BPMInstFormDataSets')
	INSERT INTO @temptb VALUES(N'BPMInstProcSteps')
	INSERT INTO @temptb VALUES(N'BPMInstRouting')
	INSERT INTO @temptb VALUES(N'BPMInstShare')
	INSERT INTO @temptb VALUES(N'BPMInstTasks')
	INSERT INTO @temptb VALUES(N'BPMSecurityACL')
	INSERT INTO @temptb VALUES(N'BPMSecurityExtToken')
	INSERT INTO @temptb VALUES(N'BPMSecurityGroupMembers')
	INSERT INTO @temptb VALUES(N'BPMSecurityGroups')
	INSERT INTO @temptb VALUES(N'BPMSecurityRecordACL')
	INSERT INTO @temptb VALUES(N'BPMSecurityTACL')
	INSERT INTO @temptb VALUES(N'BPMSecurityUserResource')
	INSERT INTO @temptb VALUES(N'BPMSecurityUserResourceACL')
	INSERT INTO @temptb VALUES(N'BPMSecurityUserResourcePerm')
	INSERT INTO @temptb VALUES(N'BPMSysAppLog')
	INSERT INTO @temptb VALUES(N'BPMSysAppLogACL')
	INSERT INTO @temptb VALUES(N'BPMSysMessagesFailed')
	INSERT INTO @temptb VALUES(N'BPMSysMessagesQueue')
	INSERT INTO @temptb VALUES(N'BPMSysMessagesSucceed')
	INSERT INTO @temptb VALUES(N'BPMSysOUFGOUs')
	INSERT INTO @temptb VALUES(N'BPMSysOUFGYWs')
	INSERT INTO @temptb VALUES(N'BPMSysOUMembers')
	INSERT INTO @temptb VALUES(N'BPMSysOURoleMembers')
	INSERT INTO @temptb VALUES(N'BPMSysOURoles')
	INSERT INTO @temptb VALUES(N'BPMSysOUs')
	INSERT INTO @temptb VALUES(N'BPMSysOUSupervisorFGYWs')
	INSERT INTO @temptb VALUES(N'BPMSysOUSupervisors')
	--INSERT INTO @temptb VALUES(N'BPMSysSeeks')
	INSERT INTO @temptb VALUES(N'BPMSysSettings')
	INSERT INTO @temptb VALUES(N'BPMSysSnapshot')
	INSERT INTO @temptb VALUES(N'BPMSysSqlTrace')
	INSERT INTO @temptb VALUES(N'BPMSysTableVersion')
	INSERT INTO @temptb VALUES(N'BPMSysTaskRule')
	INSERT INTO @temptb VALUES(N'BPMSysTaskRuleProcess')
	INSERT INTO @temptb VALUES(N'BPMSysTimeoutFailed')
	INSERT INTO @temptb VALUES(N'BPMSysTimeoutQueue')
	INSERT INTO @temptb VALUES(N'BPMSysTimeoutSucceed')
	INSERT INTO @temptb VALUES(N'BPMSysUserCommonInfo')
	INSERT INTO @temptb VALUES(N'BPMSysUserElement')
	INSERT INTO @temptb VALUES(N'BPMSysUsers')
	INSERT INTO @temptb VALUES(N'YZAppAttachment')
	INSERT INTO @temptb VALUES(N'YZAppFileConvert')
	INSERT INTO @temptb VALUES(N'YZV_TaskList')
	INSERT INTO @temptb VALUES(N'YZV_ShareTask')

	DECLARE @currentIndex int
	DECLARE @totalRows int
	SET @currentIndex=1
	SELECT @totalRows=count(*) from @temptb 
	DECLARE @sql nvarchar(4000);

	WHILE(@currentIndex<=@totalRows)  
	BEGIN
		DECLARE @TableName nvarchar(200);
		SELECT @TableName=TableName FROM @temptb WHERE ID=@currentIndex  

		DECLARE @ltr nvarchar(4000);
		SELECT @ltr = (SELECT 'alter table '+o.name+' drop constraint '+i.name+';'+CHAR(10)
			FROM sys.indexes i join sys.objects o on  i.object_id=o.object_id
			WHERE o.type<>'S' and (is_primary_key=1 OR is_unique_constraint=1) and i.object_id=object_id(@TableName)
			FOR xml path(''));

		--PRINT @ltr;
		EXEC sp_executesql @ltr;

		SELECT @ltr = (SELECT 'drop index '+o.name+'.'+i.name+';'
			FROM sys.indexes i join sys.objects o on  i.object_id=o.object_id
			WHERE o.type<>'S' and is_primary_key<>1 AND is_unique_constraint<>1 and index_id>0 and i.object_id=object_id(@TableName)
			FOR xml path(''));
		--PRINT @ltr;
		EXEC sp_executesql @ltr;

		SET @currentIndex=@currentIndex+1;  
	END
END
GO

/***BPMInstClickToProcessQueue表的索引***/
--YZPK_BPMInstClickToProcessQueue
if not exists (select * from dbo.sysindexes where name = 'YZPK_BPMInstClickToProcessQueue')
BEGIN
	ALTER TABLE [dbo].[BPMInstClickToProcessQueue] ADD  CONSTRAINT [YZPK_BPMInstClickToProcessQueue] PRIMARY KEY CLUSTERED 
	(
		[ItemGUID] ASC
	) ON [PRIMARY]
END
GO

--YZIX_BPMInstClickToProcessQueue_StepID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstClickToProcessQueue_StepID')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMInstClickToProcessQueue_StepID] ON [dbo].[BPMInstClickToProcessQueue] 
	(
		[StepID] ASC
	) ON [PRIMARY]
END
GO

/***BPMInstConsign表的索引***/
--YZPK_BPMInstConsign
if not exists (select * from dbo.sysindexes where name = 'YZPK_BPMInstConsign')
BEGIN
	ALTER TABLE [dbo].[BPMInstConsign] ADD  CONSTRAINT [YZPK_BPMInstConsign] PRIMARY KEY CLUSTERED 
	(
		[ConsignID] ASC
	) ON [PRIMARY]
END
GO

/***BPMInstConsignUsers表的索引***/
--YZIX_BPMInstConsignUsers_CondignID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstConsignUsers_CondignID')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMInstConsignUsers_CondignID] ON [dbo].[BPMInstConsignUsers] 
	(
		[ConsignID] ASC
	) ON [PRIMARY]
END
GO

/***BPMInstDrafts表的索引***/
--YZIX_BPMInstDrafts_DraftID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstDrafts_DraftID')
BEGIN
	CREATE UNIQUE NONCLUSTERED INDEX [YZIX_BPMInstDrafts_DraftID] ON [dbo].[BPMInstDrafts] 
	(
		[DraftID] ASC
	) ON [PRIMARY]
END
GO

--YZIX_BPMInstDrafts_Account
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstDrafts_Account')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMInstDrafts_Account] ON [dbo].[BPMInstDrafts] 
	(
		[Account] ASC
	) ON [PRIMARY]
END
GO

/***BPMInstFormDataSetLinks表的索引***/
--YZIX_BPMInstFormDataSetLinks_FormDataSetID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstFormDataSetLinks_FormDataSetID')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPMInstFormDataSetLinks_FormDataSetID] ON [dbo].[BPMInstFormDataSetLinks] 
	(
		[FormDataSetID] ASC
	) ON [PRIMARY]
END
GO

/***BPMInstFormDataSets表的索引***/
--YZPK_BPMInstFormDataSets
if not exists (select * from dbo.sysindexes where name = 'YZPK_BPMInstFormDataSets')
BEGIN
	ALTER TABLE [dbo].[BPMInstFormDataSets] ADD  CONSTRAINT [YZPK_BPMInstFormDataSets] PRIMARY KEY CLUSTERED 
	(
		[FormDataSetID] ASC
	) ON [PRIMARY]
END
GO

/***BPMInstProcSteps表的索引***/
--YZPK_BPMInstProcSteps
if not exists (select * from dbo.sysindexes where name = 'YZPK_BPMInstProcSteps')
BEGIN
	ALTER TABLE [dbo].[BPMInstProcSteps] ADD  CONSTRAINT [YZPK_BPMInstProcSteps] PRIMARY KEY CLUSTERED 
	(
		[StepID] ASC
	) ON [PRIMARY]
END
GO

--YZIX_BPMInstProcSteps_TaskID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstProcSteps_TaskID')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMInstProcSteps_TaskID] ON [dbo].[BPMInstProcSteps] 
	(
		[TaskID] ASC
	)
	INCLUDE ( [ProcessName],
	[NodeName],
	[OwnerAccount],
	[FinishAt],
	[HumanStep],
	[AgentAccount],
	[Posted]) ON [PRIMARY]
END
GO

--YZIX_BPMInstProcSteps
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstProcSteps')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMInstProcSteps] ON [dbo].[BPMInstProcSteps] 
	(
		[ExtStepYear] ASC,
		[HumanStep] ASC
	)
	INCLUDE ( [TaskID],
	[ProcessName],
	[NodeName],
	[OwnerAccount],
	[ReceiveAt],
	[FinishAt],
	[AutoProcess],
	[UsedMinutes],
	[UsedMinutesWork],
	[TimeoutNotifyCount],
	[StandardMinutesWork],
	[Posted],
	[ExtDeleted],
	[HandlerAccount],
	[TimeoutDeadline]) ON [PRIMARY]
END
GO

--YZIX_BPMInstProcSteps_BelongConsignID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstProcSteps_BelongConsignID')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMInstProcSteps_BelongConsignID] ON [dbo].[BPMInstProcSteps] 
	(
		[BelongConsignID] ASC
	) ON [PRIMARY]
END
GO

--YZIX_BPMInstProcSteps_AgentAccount
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstProcSteps_AgentAccount')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMInstProcSteps_AgentAccount] ON [dbo].[BPMInstProcSteps] 
	(
		[AgentAccount] ASC,
		[ExtYear] ASC
	)
	INCLUDE ( [TaskID],
	[ExtDeleted]) ON [PRIMARY]
END
GO

--YZIX_BPMInstProcSteps_ConsignOwnerAccount
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstProcSteps_ConsignOwnerAccount')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMInstProcSteps_ConsignOwnerAccount] ON [dbo].[BPMInstProcSteps] 
	(
		[ConsignOwnerAccount] ASC,
		[ExtYear] ASC
	)
	INCLUDE ( [TaskID],
	[ExtDeleted]) ON [PRIMARY]
END
GO

--YZIX_BPMInstProcSteps_OwnerAccount
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstProcSteps_OwnerAccount')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMInstProcSteps_OwnerAccount] ON [dbo].[BPMInstProcSteps] 
	(
		[OwnerAccount] ASC,
		[ExtYear] ASC
	)
	INCLUDE ( [TaskID],
	[ExtDeleted]) ON [PRIMARY]
END
GO

--YZIX_BPMInstProcSteps_HandlerAccount
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstProcSteps_HandlerAccount')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMInstProcSteps_HandlerAccount] ON [dbo].[BPMInstProcSteps] 
	(
		[HandlerAccount] ASC,
		[ExtYear] ASC
	)
	INCLUDE ( [TaskID],
	[FinishAt],
	[Posted],
	[ExtDeleted]) ON [PRIMARY]
END
GO

--YZIX_BPMInstRouting_FromStepID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstRouting_FromStepID')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMInstRouting_FromStepID] ON [dbo].[BPMInstRouting] 
	(
		[FromStepID] ASC
	)
	INCLUDE ([ToStepID]) ON [PRIMARY]
END
GO

--YZIX_BPMInstRouting_ToStepID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstRouting_ToStepID')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMInstRouting_ToStepID] ON [dbo].[BPMInstRouting] 
	(
		[ToStepID] ASC
	)
	INCLUDE ([FromStepID]) ON [PRIMARY]
END
GO

/***BPMInstShare表的索引***/
--YZIX_BPMInstShare_StepID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstShare_StepID')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPMInstShare_StepID] ON [dbo].[BPMInstShare] 
	(
		[StepID] ASC
	) ON [PRIMARY]
END
GO

/***BPMInstTasks表的索引***/
--YZPK_BPMInstTasks
if not exists (select * from dbo.sysindexes where name = 'YZPK_BPMInstTasks')
BEGIN
	ALTER TABLE [dbo].[BPMInstTasks] ADD  CONSTRAINT [YZPK_BPMInstTasks] PRIMARY KEY CLUSTERED 
	(
		[TaskID] ASC
	) ON [PRIMARY]
END
GO

--YZIX_BPMInstTasks
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstTasks')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMInstTasks] ON [dbo].[BPMInstTasks] 
	(
		[ExtYear] ASC
	)
	INCLUDE ( [ProcessName],
	[OwnerAccount],
	[Description],
	[AgentAccount],
	[SerialNum],
	[State],
	[ExtDeleted],
	[CreateAt]) ON [PRIMARY]
END
GO

--YZIX_BPMInstTasks_AgentAccount
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstTasks_AgentAccount')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMInstTasks_AgentAccount] ON [dbo].[BPMInstTasks] 
	(
		[AgentAccount] ASC,
		[ExtYear] ASC
	)
	INCLUDE ( [ExtDeleted],
	[ProcessName],
	[CreateAt],
	[Description],
	[State],
	[OwnerAccount],
	[SerialNum]) ON [PRIMARY]
END
GO

--YZIX_BPMInstTasks_OwnerAccount
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstTasks_OwnerAccount')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMInstTasks_OwnerAccount] ON [dbo].[BPMInstTasks] 
	(
		[OwnerAccount] ASC,
		[ExtYear] ASC
	)
	INCLUDE ( [ExtDeleted],
	[ProcessName],
	[CreateAt],
	[Description],
	[State],
	[SerialNum]) ON [PRIMARY]
END
GO

--YZIX_BPMInstTasks_SerialNum
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstTasks_SerialNum')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMInstTasks_SerialNum] ON [dbo].[BPMInstTasks] 
	(
		[SerialNum] ASC
	) ON [PRIMARY]
END
GO

--YZIX_BPMInstTasks_ExtInitiator
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstTasks_ExtInitiator')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMInstTasks_ExtInitiator] ON [dbo].[BPMInstTasks] 
	(
		[ExtInitiator] ASC,
		[ExtYear] ASC
	)
	INCLUDE ( [ProcessName],
	[ExtDeleted]) ON [PRIMARY]
END
GO

/***BPMSecurityACL表的索引***/
--YZIX_BPMSecurityACL_RSID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSecurityACL_RSID')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPMSecurityACL_RSID] ON [dbo].[BPMSecurityACL] 
	(
		[RSID] ASC
	) ON [PRIMARY]
END
GO

/***BPMSecurityGroupMembers表的索引***/
--YZIX_BPMSecurityGroupMembers_GroupName
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSecurityGroupMembers_GroupName')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPMSecurityGroupMembers_GroupName] ON [dbo].[BPMSecurityGroupMembers] 
	(
		[GroupName] ASC
	) ON [PRIMARY]
END
GO

/***BPMSecurityGroups表的索引***/
--YZPK_BPMSecurityGroups
if not exists (select * from dbo.sysindexes where name = 'YZPK_BPMSecurityGroups')
BEGIN
	ALTER TABLE [dbo].[BPMSecurityGroups] ADD  CONSTRAINT [YZPK_BPMSecurityGroups] PRIMARY KEY CLUSTERED 
	(
		[GroupName] ASC
	) ON [PRIMARY]
END
GO

/***BPMSecurityRecordACL表的索引***/
--YZPK_BPMSecurityRecordACL
if not exists (select * from dbo.sysindexes where name = 'YZPK_BPMSecurityRecordACL')
BEGIN
	ALTER TABLE [dbo].[BPMSecurityRecordACL] ADD  CONSTRAINT [YZPK_BPMSecurityRecordACL] PRIMARY KEY CLUSTERED 
	(
		[ID] ASC
	) ON [PRIMARY]
END
GO

--YZIX_BPMSecurityRecordACL_TableNameKeyValue
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSecurityRecordACL_TableNameKeyValue')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMSecurityRecordACL_TableNameKeyValue] ON [dbo].[BPMSecurityRecordACL] 
	(
		[TableName] ASC,
		[KeyValue] ASC
	) ON [PRIMARY]
END
GO

--YZIX_BPMSecurityRecordACL_TableNamePermisionSID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSecurityRecordACL_TableNamePermisionSID')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMSecurityRecordACL_TableNamePermisionSID] ON [dbo].[BPMSecurityRecordACL] 
	(
		[TableName] ASC,
		[Permision] ASC,
		[SID] ASC
	)
	INCLUDE ( [KeyValue]) ON [PRIMARY]
END
GO

/***BPMSecurityTACL表的索引***/
--YZPK_BPMSecurityTACL
if not exists (select * from dbo.sysindexes where name = 'YZPK_BPMSecurityTACL')
BEGIN
	ALTER TABLE [dbo].[BPMSecurityTACL] ADD  CONSTRAINT [YZPK_BPMSecurityTACL] PRIMARY KEY CLUSTERED 
	(
		[ID] ASC
	) ON [PRIMARY]
END
GO

--YZIX_BPMSecurityTACL_TaskID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSecurityTACL_TaskID')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMSecurityTACL_TaskID] ON [dbo].[BPMSecurityTACL] 
	(
		[TaskID] DESC
	)
	INCLUDE ( [SID],
	[AllowAdmin]) ON [PRIMARY]
END
GO

--YZIX_BPMSecurityTACL_SID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSecurityTACL_SID')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMSecurityTACL_SID] ON [dbo].[BPMSecurityTACL] 
	(
		[SID] ASC,
		[ExtYear] ASC
	)
	INCLUDE ( [TaskID],
	[AllowRead],
	[AllowAdmin],
	[ExtDeleted]) ON [PRIMARY]
END
GO

/***BPMSecurityUserResource表的索引***/
--YZPK_BPMSecurityUserResource
if not exists (select * from dbo.sysindexes where name = 'YZPK_BPMSecurityUserResource')
BEGIN
	ALTER TABLE [dbo].[BPMSecurityUserResource] ADD  CONSTRAINT [YZPK_BPMSecurityUserResource] PRIMARY KEY CLUSTERED 
	(
		[RSID] ASC
	) ON [PRIMARY]
END
GO

--YZIX_BPMSecurityUserResource_ParentRSID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSecurityUserResource_ParentRSID')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMSecurityUserResource_ParentRSID] ON [dbo].[BPMSecurityUserResource] 
	(
		[ParentRSID] ASC
	) ON [PRIMARY]
END
GO

/***BPMSecurityUserResourceACL表的索引***/
--YZIX_BPMSecurityUserResourceACL_RSID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSecurityUserResourceACL_RSID')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPMSecurityUserResourceACL_RSID] ON [dbo].[BPMSecurityUserResourceACL] 
	(
		[RSID] ASC
	) ON [PRIMARY]
END
GO

/***BPMSecurityUserResourcePerm表的索引***/
--YZIX_BPMSecurityUserResourcePerm_RSID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSecurityUserResourcePerm_RSID')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPMSecurityUserResourcePerm_RSID] ON [dbo].[BPMSecurityUserResourcePerm] 
	(
		[RSID] ASC
	) ON [PRIMARY]
END
GO

/***BPMSysAppLog表的索引***/
--YZIX_BPMSysAppLog_ExtDate
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSysAppLog_ExtDate')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPMSysAppLog_ExtDate] ON [dbo].[BPMSysAppLog] 
	(
		[ExtDate] ASC
	) ON [PRIMARY]
END
GO

/***BPMSysAppLogACL表的索引***/
--YZIX_BPMSysAppLogACL_ExtDate
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSysAppLogACL_ExtDate')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPMSysAppLogACL_ExtDate] ON [dbo].[BPMSysAppLogACL] 
	(
		[ExtDate] ASC
	) ON [PRIMARY]
END
GO

/***BPMSysMessagesQueue表的索引***/
--YZPK_BPMSysMessagesQueue
if not exists (select * from dbo.sysindexes where name = 'YZPK_BPMSysMessagesQueue')
BEGIN
	ALTER TABLE [dbo].[BPMSysMessagesQueue] ADD  CONSTRAINT [YZPK_BPMSysMessagesQueue] PRIMARY KEY CLUSTERED 
	(
		[MessageID] ASC
	) ON [PRIMARY]
END
GO

/***BPMSysOUFGOUs表的索引***/
--YZIX_BPMSysOUFGOUs_OUID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSysOUFGOUs_OUID')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPMSysOUFGOUs_OUID] ON [dbo].[BPMSysOUFGOUs] 
	(
		[OUID] ASC
	) ON [PRIMARY]
END
GO

/***BPMSysOUFGYWs表的索引***/
--YZIX_BPMSysOUFGYWs_OUID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSysOUFGYWs_OUID')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPMSysOUFGYWs_OUID] ON [dbo].[BPMSysOUFGYWs] 
	(
		[OUID] ASC
	) ON [PRIMARY]
END
GO

/***BPMSysOUMembers表的索引***/
--YZIX_BPMSysOUMembers_OUID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSysOUMembers_OUID')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPMSysOUMembers_OUID] ON [dbo].[BPMSysOUMembers] 
	(
		[OUID] ASC
	) ON [PRIMARY]
END
GO

/***BPMSysOURoleMembers表的索引***/
--YZIX_BPMSysOURoleMembers_OUID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSysOURoleMembers_OUID')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPMSysOURoleMembers_OUID] ON [dbo].[BPMSysOURoleMembers] 
	(
		[OUID] ASC
	) ON [PRIMARY]
END
GO

/***BPMSysOURoles表的索引***/
--YZIX_BPMSysOURoles_OUID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSysOURoles_OUID')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPMSysOURoles_OUID] ON [dbo].[BPMSysOURoles] 
	(
		[OUID] ASC
	) ON [PRIMARY]
END
GO

/***BPMSysOUs表的索引***/
--YZPK_BPMSysOUs
if not exists (select * from dbo.sysindexes where name = 'YZPK_BPMSysOUs')
BEGIN
	ALTER TABLE [dbo].[BPMSysOUs] ADD  CONSTRAINT [YZPK_BPMSysOUs] PRIMARY KEY CLUSTERED 
	(
		[OUID] ASC
	) ON [PRIMARY]
END
GO

/***BPMSysOUSupervisorFGYWs表的索引***/
--YZIX_BPMSysOUSupervisorFGYWs_LnkID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSysOUSupervisorFGYWs_LnkID')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPMSysOUSupervisorFGYWs_LnkID] ON [dbo].[BPMSysOUSupervisorFGYWs] 
	(
		[LnkID] ASC
	) ON [PRIMARY]
END
GO

/***BPMSysOUSupervisors表的索引***/
--YZIX_BPMSysOUSupervisors_OUIDUserAccount
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSysOUSupervisors_OUIDUserAccount')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPMSysOUSupervisors_OUIDUserAccount] ON [dbo].[BPMSysOUSupervisors] 
	(
		[OUID] ASC,
		[UserAccount] ASC
	) ON [PRIMARY]
END
GO

/***BPMSysSeeks表的索引***/
--YZIX_BPMSysSeeks
--if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSysSeeks')
--BEGIN
--	CREATE CLUSTERED INDEX [YZIX_BPMSysSeeks] ON [dbo].[BPMSysSeeks] 
--	(
--		[DataSourceName] ASC,
--		[TableName] ASC,
--		[ColumnName] ASC,
--		[Prefix] ASC,
--		[Columns] ASC
--	) ON [PRIMARY]
--END
--GO

/***BPMSysSettings表的索引***/
--YZPK_BPMSysSettings
if not exists (select * from dbo.sysindexes where name = 'YZPK_BPMSysSettings')
BEGIN
	ALTER TABLE [dbo].[BPMSysSettings] ADD  CONSTRAINT [YZPK_BPMSysSettings] PRIMARY KEY CLUSTERED 
	(
		[ItemName] ASC
	) ON [PRIMARY]
END
GO

/***BPMSysSnapshot表的索引***/
--YZIX_BPMSysSnapshot_TaskID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSysSnapshot_TaskID')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPMSysSnapshot_TaskID] ON [dbo].[BPMSysSnapshot] 
	(
		[TaskID] ASC
	) ON [PRIMARY]
END
GO

/***BPMSysSqlTrace表的索引***/
--YZIX_BPMSysSqlTrace_RunDate
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSysSqlTrace_RunDate')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPMSysSqlTrace_RunDate] ON [dbo].[BPMSysSqlTrace] 
	(
		[RunDate] ASC
	) ON [PRIMARY]
END
GO

/***BPMSysTaskRule表的索引***/
--YZPK_BPMSysTaskRule
if not exists (select * from dbo.sysindexes where name = 'YZPK_BPMSysTaskRule')
BEGIN
	ALTER TABLE [dbo].[BPMSysTaskRule] ADD  CONSTRAINT [YZPK_BPMSysTaskRule] PRIMARY KEY CLUSTERED 
	(
		[RuleID] ASC
	) ON [PRIMARY]
END
GO

--YZIX_BPMTaskRule_Account
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMTaskRule_Account')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMTaskRule_Account] ON [dbo].[BPMSysTaskRule] 
	(
		[Account] ASC
	) ON [PRIMARY]
END
GO

/***BPMSysTaskRuleProcess表的索引***/
--YZIX_BPMSysTaskRuleProcess_RuleID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSysTaskRuleProcess_RuleID')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPMSysTaskRuleProcess_RuleID] ON [dbo].[BPMSysTaskRuleProcess] 
	(
		[RuleID] ASC
	) ON [PRIMARY]
END
GO

/***BPMSysTimeoutQueue表的索引***/
--YZPK_BPMSysTimeoutQueue
if not exists (select * from dbo.sysindexes where name = 'YZPK_BPMSysTimeoutQueue')
BEGIN
	ALTER TABLE [dbo].[BPMSysTimeoutQueue] ADD  CONSTRAINT [YZPK_BPMSysTimeoutQueue] PRIMARY KEY CLUSTERED 
	(
		[ItemID] ASC
	) ON [PRIMARY]
END
GO

--YZIX_BPMSysTimeoutQueue_ExpireDate
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSysTimeoutQueue_ExpireDate')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMSysTimeoutQueue_ExpireDate] ON [dbo].[BPMSysTimeoutQueue] 
	(
		[ExpireDate] ASC
	) ON [PRIMARY]
END
GO

/***BPMSysUserCommonInfo表的索引***/
--YZPK_BPMSysUserCommonInfo
if not exists (select * from dbo.sysindexes where name = 'YZPK_BPMSysUserCommonInfo')
BEGIN
	ALTER TABLE [dbo].[BPMSysUserCommonInfo] ADD  CONSTRAINT [YZPK_BPMSysUserCommonInfo] PRIMARY KEY CLUSTERED 
	(
		[Account] ASC
	) ON [PRIMARY]
END
GO

/***BPMSysUserElement表的索引***/
--YZIX_BPMSysUserElement_ParentObjectID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSysUserElement_ParentObjectID')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPMSysUserElement_ParentObjectID] ON [dbo].[BPMSysUserElement] 
	(
		[ParentObjectID] ASC
	) ON [PRIMARY]
END
GO

/***BPMSysUsers表的索引***/
--YZPK_BPMSysUsers
if not exists (select * from dbo.sysindexes where name = 'YZPK_BPMSysUsers')
BEGIN
	ALTER TABLE [dbo].[BPMSysUsers] ADD  CONSTRAINT [YZPK_BPMSysUsers] PRIMARY KEY CLUSTERED 
	(
		[Account] ASC
	) ON [PRIMARY]
END
GO

/***YZAppAttachment表的索引***/
--YZPK_YZAppAttachment
if not exists (select * from dbo.sysindexes where name = 'YZPK_YZAppAttachment')
BEGIN
	ALTER TABLE [dbo].[YZAppAttachment] ADD  CONSTRAINT [YZPK_YZAppAttachment] PRIMARY KEY CLUSTERED 
	(
		[FileID] ASC
	) ON [PRIMARY]
END
GO

/***YZAppFileConvert表的索引***/
--YZPK_YZAppFileConvert
if not exists (select * from dbo.sysindexes where name = 'YZPK_YZAppFileConvert')
BEGIN
	ALTER TABLE [dbo].[YZAppFileConvert] ADD  CONSTRAINT [YZPK_YZAppFileConvert] PRIMARY KEY CLUSTERED 
	(
		[ItemGuid] ASC
	) ON [PRIMARY]
END
GO

/***YZV_TaskList表的索引***/
--YZIX_TaskList
if not exists (select * from dbo.sysindexes where name = 'YZIX_TaskList')
BEGIN
	CREATE UNIQUE CLUSTERED INDEX [YZIX_TaskList] ON [dbo].[YZV_TaskList] 
	(
		[ExtRecipient] ASC,
		[StepID] ASC
	) ON [PRIMARY]
END
GO

/***YZV_ShareTask表的索引***/
--YZIX_ShareTask
if not exists (select * from dbo.sysindexes where name = 'YZIX_ShareTask')
BEGIN
	CREATE UNIQUE CLUSTERED INDEX [YZIX_ShareTask] ON [dbo].[YZV_ShareTask] 
	(
		[UserAccount] ASC,
		[StepID] ASC
	) ON [PRIMARY]
END
GO
/*************************4.6创建索引结束**************************/

if not exists(select * from syscolumns where name = 'Type' and id = object_id('BPMInstDrafts'))
BEGIN
ALTER TABLE BPMInstDrafts ADD Type [nvarchar] (30) DEFAULT('Draft') NOT NULL;
END
GO

UPDATE BPMInstDrafts SET Type='FormTemplate' WHERE Type='FormModel'

/********************************************* ver4.60d DBUpdate *********************************************/
--创建BPMSysSequence表与主键
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysSequence]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSysSequence](
	[Prefix] [nvarchar](50) NOT NULL,
	[CurValue] [int] NOT NULL,
	[ActiveDate] [datetime] NOT NULL
	CONSTRAINT [YZPK_BPMSysSequence] PRIMARY KEY CLUSTERED 
	(
		[Prefix] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
END
GO

--1.转换数据BPMSysSeeks->BPMSysSequence
--2.删除表BPMSysSeeks
if (object_id('BPMSysSeeks') is not null)
BEGIN
INSERT INTO BPMSysSequence(Prefix,CurValue,ActiveDate) SELECT Prefix,max(CurrSeekValue),GETDATE() FROM BPMSysSeeks GROUP BY Prefix
DROP TABLE [dbo].[BPMSysSeeks]
END
GO

/********************************************* ver4.70a DBUpdate *********************************************/
if not exists(select * from syscolumns where name = 'ParentTaskID' and id = object_id('BPMInstTasks'))
BEGIN
ALTER TABLE BPMInstTasks ADD ParentTaskID [int] NULL;
ALTER TABLE BPMInstTasks ADD ParentStepID [int] NULL;
ALTER TABLE BPMInstTasks ADD ParentStepName [nvarchar] (50) NULL;
ALTER TABLE BPMInstTasks ADD ProcessVersion [nvarchar] (10) DEFAULT('1.0') NOT NULL;
END
GO

if not exists(select * from syscolumns where name = 'ProcessVersion' and id = object_id('BPMInstProcSteps'))
BEGIN
ALTER TABLE BPMInstProcSteps ADD ProcessVersion [nvarchar] (10) DEFAULT('1.0') NOT NULL;
END
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysOUExtRoleMembers]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[BPMSysOUExtRoleMembers](
	[Type] [nvarchar](50) NOT NULL,
	[OUID] [nvarchar](200) NOT NULL,
	[RoleName] [nvarchar](50) NOT NULL,
	[MemberID] [nvarchar](200) NOT NULL,
	[OrderIndex] [int] NOT NULL
) ON [PRIMARY]
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysOUExtRoles]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[BPMSysOUExtRoles](
	[Type] [nvarchar](30) NOT NULL,
	[OUID] [nvarchar](200) NOT NULL,
	[RoleName] [nvarchar](30) NOT NULL,
	[SID] [nvarchar](50) NOT NULL
) ON [PRIMARY]
GO

if not exists(select * from syscolumns where name = 'ProcessVersion' and id = object_id('YZV_TaskList'))
BEGIN
DROP VIEW [dbo].[YZV_TaskList]
exec sp_executesql N'
CREATE VIEW YZV_TaskList
WITH SCHEMABINDING
AS
SELECT a.TaskID,a.StepID,b.ProcessName,b.OwnerPositionID,b.OwnerAccount,b.AgentAccount,b.CreateAt,b.Description,a.NodeName,a.ReceiveAt,a.Share,b.State,b.SerialNum,a.TimeoutFirstNotifyDate,a.TimeoutDeadline,a.TimeoutNotifyCount,a.NodePath,a.ExtRecipient,b.ParentTaskID,b.ParentStepID,b.ParentStepName,b.ProcessVersion
FROM dbo.BPMInstProcSteps a INNER JOIN dbo.BPMInstTasks b on a.TaskID=b.TaskID
WHERE a.FinishAt IS NULL AND a.HumanStep=1 AND a.ExtRecipient IS NOT NULL AND (b.State=''Running'' OR a.NodeName=''sysInform'')
'
END
GO

/***YZV_TaskList表的索引***/
--YZIX_TaskList
if not exists (select * from dbo.sysindexes where name = 'YZIX_TaskList')
BEGIN
	CREATE UNIQUE CLUSTERED INDEX [YZIX_TaskList] ON [dbo].[YZV_TaskList] 
	(
		[ExtRecipient] ASC,
		[StepID] ASC
	) ON [PRIMARY]
END
GO

if not exists(select * from syscolumns where name = 'ProcessVersion' and id = object_id('YZV_ShareTask'))
BEGIN
DROP VIEW [dbo].[YZV_ShareTask]
exec sp_executesql N'
CREATE VIEW YZV_ShareTask
WITH SCHEMABINDING
AS
SELECT a.TaskID,a.StepID,b.ProcessName,b.OwnerPositionID,b.OwnerAccount,b.AgentAccount,b.CreateAt,b.Description,a.NodeName,a.ReceiveAt,1 as Share,b.State,b.SerialNum,a.TimeoutFirstNotifyDate,a.TimeoutDeadline,a.TimeoutNotifyCount,a.NodePath,c.UserAccount,b.ParentTaskID,b.ParentStepID,b.ParentStepName,b.ProcessVersion
FROM dbo.BPMInstProcSteps a INNER JOIN dbo.BPMInstTasks b ON a.TaskID = b.TaskID INNER JOIN dbo.BPMInstShare c ON a.StepID=c.StepID 
WHERE a.FinishAt IS NULL AND a.ExtRecipient IS NULL AND a.HumanStep=1 AND b.State=''Running''
'
END
GO


/***YZV_ShareTask表的索引***/
--YZIX_ShareTask
if not exists (select * from dbo.sysindexes where name = 'YZIX_ShareTask')
BEGIN
	CREATE UNIQUE CLUSTERED INDEX [YZIX_ShareTask] ON [dbo].[YZV_ShareTask] 
	(
		[UserAccount] ASC,
		[StepID] ASC
	) ON [PRIMARY]
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_InformTask_Title')
INSERT INTO BPMSysSettings VALUES('Mail_InformTask_Title',N'[工作流][知会]来自：<%=Context.Current.LoginUser.FriendlyName%>，业务名：<%=Context.Current.Process.Name%>，流水号：<%=Context.Current.Task.SerialNum%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_InformTask_Message')
INSERT INTO BPMSysSettings VALUES('Mail_InformTask_Message',
N'业务名：<%=Context.Current.Process.Name%>
提交人：<%=Initiator.UserFriendlyName%>
提交日期：<%=Context.Current.Task.CreateAt.ToString()%>
流水号：<%=Context.Current.Task.SerialNum%>
来自：<%=Context.Current.LoginUser.FriendlyName%>
内容摘要：
<%=Context.Current.Task.Description%>')
GO

if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysRecordModifies]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[BPMSysRecordModifies](
	[DataSetType] [nvarchar](50) NOT NULL,
	[DatasetName] [nvarchar](50) NOT NULL,
	[DatasetKey] [nvarchar](50) NOT NULL,
	[DataSourceName] [nvarchar](50) NULL,
	[TableName] [nvarchar](50) NOT NULL,
	[PrimaryColumn] [nvarchar](50) NOT NULL,
	[PrimaryKey] [nvarchar](50) NOT NULL,
	[ColumnName] [nvarchar](50) NOT NULL,
	[Value] [nvarchar](200) NOT NULL,
	[Account] [nvarchar](50) NOT NULL,
	[ModifyDate] [datetime] NOT NULL
) ON [PRIMARY]
GO

--创建表BPMSysMemberIDMap的索引：YZIX_BPMSysMemberIDMap_MemberFullName
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSysRecordModifies')
BEGIN
CREATE CLUSTERED INDEX [YZIX_BPMSysRecordModifies] ON [dbo].[BPMSysRecordModifies] 
(
	[DataSourceName] ASC,
	[TableName] ASC,
	[PrimaryKey] ASC,
	[ColumnName] ASC
)ON [PRIMARY]
END
GO

--列修改
DECLARE @len INT;
SELECT @len=length FROM syscolumns WHERE name = 'ItemName' and id = object_id('BPMSysSettings')
if @len<=100
BEGIN
ALTER TABLE [dbo].[BPMSysSettings] DROP CONSTRAINT YZPK_BPMSysSettings
ALTER TABLE [dbo].[BPMSysSettings] ALTER COLUMN ItemName NVARCHAR(200) NOT NULL
ALTER TABLE [dbo].[BPMSysSettings] ALTER COLUMN ItemValue NTEXT
ALTER TABLE [dbo].[BPMSysSettings] ADD CONSTRAINT [YZPK_BPMSysSettings] PRIMARY KEY CLUSTERED 
(
	[ItemName] ASC
) ON [PRIMARY]
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'MobilePushNotification_NewTaskNormal_Message')
INSERT INTO BPMSysSettings VALUES('MobilePushNotification_NewTaskNormal_Message',N'[<%=Context.Current.Step.NodeName%>]<%=Context.Current.Process.Name%>:<%=Initiator.UserInfo.ShortName%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'MobilePushNotification_Approved_Message')
INSERT INTO BPMSysSettings VALUES('MobilePushNotification_Approved_Message',N'[已批准]<%=Context.Current.Process.Name%>:<%=Initiator.UserInfo.ShortName%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'MobilePushNotification_Rejected_Message')
INSERT INTO BPMSysSettings VALUES('MobilePushNotification_Rejected_Message',N'[已拒绝]<%=Context.Current.Process.Name%>:<%=Initiator.UserInfo.ShortName%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'MobilePushNotification_Aborted_Message')
INSERT INTO BPMSysSettings VALUES('MobilePushNotification_Aborted_Message',N'[已撤销]<%=Context.Current.Process.Name%>:<%=Initiator.UserInfo.ShortName%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'MobilePushNotification_Deleted_Message')
INSERT INTO BPMSysSettings VALUES('MobilePushNotification_Deleted_Message',N'[已删除]<%=Context.Current.Process.Name%>:<%=Initiator.UserInfo.ShortName%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'MobilePushNotification_StepStopHumanOpt_Message')
INSERT INTO BPMSysSettings VALUES('MobilePushNotification_StepStopHumanOpt_Message',N'[已中止]<%=Context.Current.Process.Name%>:<%=Initiator.UserInfo.ShortName%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'MobilePushNotification_StepStopVoteFinished_Message')
INSERT INTO BPMSysSettings VALUES('MobilePushNotification_StepStopVoteFinished_Message',N'[已中止]<%=Context.Current.Process.Name%>:<%=Initiator.UserInfo.ShortName%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'MobilePushNotification_TimeoutNotify_Message')
INSERT INTO BPMSysSettings VALUES(N'MobilePushNotification_TimeoutNotify_Message',N'[催办]<%=Context.Current.Process.Name%>:<%=Initiator.UserInfo.ShortName%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'MobilePushNotification_RecedeBack_Message')
INSERT INTO BPMSysSettings VALUES('MobilePushNotification_RecedeBack_Message',N'[已退回]<%=Context.Current.Process.Name%>:<%=Initiator.UserInfo.ShortName%>')
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'MobilePushNotification_IndicateTask_Message')
INSERT INTO BPMSysSettings VALUES('MobilePushNotification_IndicateTask_Message',N'[阅示]<%=Context.Current.Process.Name%>:<%=Initiator.UserInfo.ShortName%>')
GO


if not exists (select * from BPMSysSettings WHERE ItemName = 'MobilePushNotification_InformTask_Message')
INSERT INTO BPMSysSettings VALUES('MobilePushNotification_InformTask_Message',N'[知会]<%=Context.Current.Process.Name%>:<%=Initiator.UserInfo.ShortName%>')
GO

/********************************************* ver4.70d DBUpdate *********************************************/
if not exists(select * from syscolumns where name = 'PushNotificationServiceName' and id = object_id('BPMSysUserCommonInfo'))
BEGIN
ALTER TABLE BPMSysUserCommonInfo ADD PushNotificationServiceName [nvarchar] (50) NULL;
ALTER TABLE BPMSysUserCommonInfo ADD PushNotificationDeviceOS [nvarchar] (50) NULL;
ALTER TABLE BPMSysUserCommonInfo ADD PushNotificationDeviceToken [nvarchar] (200) NULL;
END
GO

--YZV_TaskAccess(任务可访问视图)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_NAME = 'YZV_TaskAccess')
BEGIN
exec sp_executesql N'
CREATE VIEW YZV_TaskAccess
WITH SCHEMABINDING
AS
SELECT TaskID,''S_GS_B639EB43-67D7-42fb-BD2E-B754BB11915B'' AS SID,ExtYear FROM dbo.BPMInstTasks
UNION
SELECT TaskID,OwnerAccount AS SID,ExtYear FROM dbo.BPMInstTasks WHERE OwnerAccount IS NOT NULL
UNION
SELECT TaskID,AgentAccount AS SID,ExtYear FROM dbo.BPMInstTasks WHERE AgentAccount IS NOT NULL
UNION
SELECT TaskID,OwnerAccount AS SID,ExtYear FROM dbo.BPMInstProcSteps WHERE OwnerAccount IS NOT NULL
UNION
SELECT TaskID,AgentAccount AS SID,ExtYear FROM dbo.BPMInstProcSteps WHERE AgentAccount IS NOT NULL
UNION
SELECT TaskID,ConsignOwnerAccount AS SID,ExtYear FROM dbo.BPMInstProcSteps WHERE ConsignOwnerAccount IS NOT NULL
UNION
SELECT TaskID,ConsignOwnerAccount AS SID,ExtYear FROM dbo.BPMInstProcSteps WHERE ConsignOwnerAccount IS NOT NULL
UNION
SELECT TaskID,SID,ExtYear FROM dbo.BPMSecurityTACL WHERE AllowRead=1
'
END
GO

/********************************************* ver4.70f DBUpdate *********************************************/
if not exists(select * from syscolumns where name = 'ParentServerIdentity' and id = object_id('BPMInstTasks'))
BEGIN
ALTER TABLE BPMInstTasks ADD ParentServerIdentity [nvarchar] (50) NULL;
ALTER TABLE BPMInstTasks ADD ReturnToParent [bit] NULL;
END
GO

--YZAppCommunication
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZAppCommunication]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[YZAppCommunication](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[resType] [nvarchar](50) NULL,
	[resId] [nvarchar](50) NULL,
	[uid] [nvarchar](50) NULL,
	[date] [datetime] NULL,
	[message] [ntext] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

--resId int -> nvarchar
DECLARE @len INT;
SELECT @len=length FROM syscolumns WHERE name = 'resId' and id = object_id('YZAppCommunication')
if @len=4
BEGIN
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_NAME = 'YZV_TaskCommunication')
BEGIN
DROP VIEW YZV_TaskCommunication
DROP VIEW YZV_TaskCommunicationRead
END
ALTER TABLE [dbo].[YZAppCommunication] ALTER COLUMN resId nvarchar(50) NOT NULL
END
GO

--YZPK_YZAppCommunication
if not exists (select * from dbo.sysindexes where name = 'YZPK_YZAppCommunication')
BEGIN
	ALTER TABLE [dbo].[YZAppCommunication] ADD  CONSTRAINT [YZPK_YZAppCommunication] PRIMARY KEY CLUSTERED 
	(
		[ID] ASC
	) ON [PRIMARY]
END
GO

--YZIX_YZAppCommunication
if not exists (select * from dbo.sysindexes where name = 'YZIX_YZAppCommunication')
BEGIN
	CREATE INDEX YZIX_YZAppCommunication ON [YZAppCommunication] 
	(
		[resType] ASC,
		[resId] ASC
	) ON [PRIMARY]
END
GO

--YZAppCommunicationRead
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZAppCommunicationRead]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[YZAppCommunicationRead](
	[uid] [nvarchar](50) NOT NULL,
	[resType] [nvarchar](50) NOT NULL,
	[resId] [nvarchar](50) NOT NULL,
	[readId] [int] NULL
) ON [PRIMARY]
GO

--resId int -> nvarchar
DECLARE @len INT;
SELECT @len=length FROM syscolumns WHERE name = 'resId' and id = object_id('YZAppCommunicationRead')
if @len=4
BEGIN
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_NAME = 'YZV_TaskCommunication')
BEGIN
ALTER TABLE YZAppCommunicationRead DROP CONSTRAINT YZPK_YZAppCommunicationRead
DROP VIEW YZV_TaskCommunication
DROP VIEW YZV_TaskCommunicationRead
END
ALTER TABLE [dbo].[YZAppCommunicationRead] ALTER COLUMN uid nvarchar(50) NOT NULL
ALTER TABLE [dbo].[YZAppCommunicationRead] ALTER COLUMN resType nvarchar(50) NOT NULL
ALTER TABLE [dbo].[YZAppCommunicationRead] ALTER COLUMN resId nvarchar(50) NOT NULL
END
GO

--YZPK_YZAppCommunicationRead
if not exists (select * from dbo.sysindexes where name = 'YZPK_YZAppCommunicationRead')
BEGIN
	ALTER TABLE [dbo].[YZAppCommunicationRead] ADD  CONSTRAINT [YZPK_YZAppCommunicationRead] PRIMARY KEY CLUSTERED 
	(
		[resType] ASC,
		[resId] ASC,
		[uid] ASC
	) ON [PRIMARY]
END
GO

--YZV_TaskCommunication(正在跑的流程的交流信息)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_NAME = 'YZV_TaskCommunication')
BEGIN
exec sp_executesql N'
CREATE VIEW YZV_TaskCommunication
WITH SCHEMABINDING
AS
SELECT A.id,B.TaskID,A.uid,A.date,A.message FROM dbo.YZAppCommunication A INNER JOIN dbo.BPMInstTasks B ON A.resId=B.TaskID WHERE A.resType=''Task'' AND B.State=''Running''
'
END
GO

/***YZV_TaskCommunication表的索引***/
--YZVIX_TaskCommunication
--if not exists (select * from dbo.sysindexes where name = 'YZVIX_TaskCommunication')
--BEGIN
--	CREATE UNIQUE CLUSTERED INDEX YZVIX_TaskCommunication ON [dbo].[YZV_TaskCommunication] 
--	(
--		[id] ASC,
--		[TaskID] ASC
--	) ON [PRIMARY]
--END
--GO

--YZV_TaskCommunicationRead(正在跑的流程的交流信息Read情况)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_NAME = 'YZV_TaskCommunicationRead')
BEGIN
exec sp_executesql N'
CREATE VIEW YZV_TaskCommunicationRead
WITH SCHEMABINDING
AS
SELECT A.uid,B.TaskID,A.readId FROM dbo.YZAppCommunicationRead A INNER JOIN dbo.BPMInstTasks B ON A.resId=B.TaskID WHERE A.resType=''Task'' AND B.State=''Running''
'
END
GO


/********************************************* ver5.00a DBUpdate *********************************************/
--BPMInstTasks 表增加 UrlParams
if not exists(select * from syscolumns where name = 'UrlParams' and id = object_id('BPMInstTasks'))
BEGIN
ALTER TABLE BPMInstTasks ADD UrlParams [nvarchar] (500) NULL;
END
GO

--BPMSecurityGroupMembers表修改
if not exists(select * from syscolumns where name = 'SIDType' and id = object_id('BPMSecurityGroupMembers'))
BEGIN
DROP TABLE [BPMSecurityGroupMembers]
CREATE TABLE [BPMSecurityGroupMembers](
	[GroupName] [nvarchar](50) NOT NULL,
	[SIDType] [nvarchar](50) NOT NULL,
	[SID] [nvarchar](50) NOT NULL,
	[OrderIndex] [int] NOT NULL
) ON [PRIMARY]
END
GO

/***BPMSecurityGroupMembers表的索引***/
--YZIX_BPMSecurityGroupMembers_GroupName
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSecurityGroupMembers_GroupName')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPMSecurityGroupMembers_GroupName] ON [dbo].[BPMSecurityGroupMembers] 
	(
		[GroupName] ASC
	) ON [PRIMARY]
END
GO

--BPMSysRecordModifies
if not exists(select * from syscolumns where name = 'DataSetType' and id = object_id('BPMSysRecordModifies'))
BEGIN
ALTER TABLE BPMSysRecordModifies ADD DataSetType [nvarchar] (50) NOT NULL DEFAULT('Task');
END
GO

--创建表BPMSysRecordModifies的索引：YZIX_BPMSysRecordModifies
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMSysRecordModifies_FieldDirty')
BEGIN
CREATE NONCLUSTERED INDEX [YZIX_BPMSysRecordModifies_FieldDirty] ON [dbo].[BPMSysRecordModifies] 
(
	[DataSetType] ASC,
	[DatasetName] ASC,
	[DataSetKey] ASC
)INCLUDE (
[DataSourceName],
[TableName],
[PrimaryKey],
[ColumnName]) ON [PRIMARY]
END
GO

--if not exists(select * from syscolumns where name = 'ViewVersion' and id = object_id('YZV_TaskList'))
--BEGIN
--DROP VIEW [dbo].[YZV_TaskList]
--exec sp_executesql N'
--CREATE VIEW YZV_TaskList
--WITH SCHEMABINDING
--AS
--SELECT a.TaskID,a.StepID,b.ProcessName,b.OwnerPositionID,b.OwnerAccount,b.AgentAccount,b.CreateAt,b.Description,a.NodeName,a.ReceiveAt,a.Share,b.State,b.SerialNum,a.TimeoutFirstNotifyDate,a.TimeoutDeadline,a.TimeoutNotifyCount,a.NodePath,a.ExtRecipient,b.ParentTaskID,b.ParentStepID,b.ParentStepName,b.ProcessVersion,1 ViewVersion
--FROM dbo.BPMInstProcSteps a INNER JOIN dbo.BPMInstTasks b on a.TaskID=b.TaskID
--WHERE a.FinishAt IS NULL AND a.HumanStep=1 AND (b.State=''Running'' OR a.NodeName=''sysInform'')
--'
--END
--GO
--
--/***YZV_TaskList表的索引***/
----YZIX_TaskList
--if not exists (select * from dbo.sysindexes where name = 'YZIX_TaskList')
--BEGIN
--	CREATE UNIQUE CLUSTERED INDEX [YZIX_TaskList] ON [dbo].[YZV_TaskList] 
--	(
--		[ExtRecipient] ASC,
--		[StepID] ASC
--	) ON [PRIMARY]
--END
--GO

--ESB_ConnectInfo
if not exists (select * from sysobjects where id = object_id('ESB_ConnectInfo') and OBJECTPROPERTY(id, 'IsTable') = 1)
BEGIN
CREATE TABLE ESB_ConnectInfo
(
	connectId int PRIMARY KEY identity(1,1),	--编号
	connectName nvarchar(50) not null,		--数据连接名称
	connectType int not null,				--源类型（1.web;2.sap;3.数据库）
	caption nvarchar(500) null,				--备注
	connectStr nvarchar(max) null,				--xml描述文档
	createTime datetime null,				--创建时间
	updateTime datetime	null,				--修改时间
	isvalid int not null					--是否有效
) ON [PRIMARY]
END
GO

--ESB_SourceInfo
if not exists (select * from sysobjects where id = object_id('ESB_SourceInfo') and OBJECTPROPERTY(id, 'IsTable') = 1)
BEGIN
CREATE TABLE ESB_SourceInfo
(
	sourceId int PRIMARY KEY identity(1,1),	--编号
	sourceName nvarchar(50) not null,		--数据连接名称
	sourceType int not null,				--源类型（1.web源;2.sap源;3.sql源）
	connectId int not null,					--连接id
	caption nvarchar(500) null,				--备注
	sourceStr nvarchar(max) null,				--xml描述文档
	createTime datetime null,				--创建时间
	updateTime datetime	null,				--修改时间
	isvalid int not null					--是否有效
) ON [PRIMARY]
END
GO

--YZV_ESB_SourceView
if exists (select * from sysobjects where id = object_id('YZV_ESB_SourceView') and OBJECTPROPERTY(id, 'IsView') = 1)
  DROP VIEW [YZV_ESB_SourceView]
GO

CREATE VIEW YZV_ESB_SourceView
AS
select 
a.*,b.connectName,b.connectType,b.caption as connectCaption,b.connectStr,
b.createTime as connectCreateTime,b.updateTime as connectUpdateTime,b.isvalid as connectIsvalid
from ESB_SourceInfo a left join ESB_ConnectInfo b on a.connectId=b.connectId 
GO

/***删除原有系统资源***/
DELETE FROM BPMSecurityUserResource WHERE RSID IN('efec54e1-bb63-43f8-8635-3b07d1199309','E0DCB7ED-1289-40e2-A945-6F8E1578BA2A','A6F94246-9BCA-409c-9938-5A4FC963FF02','5E6FD5EC-D784-4888-BE30-F8F2600EC01F','C79E4457-9A8C-4b2f-AD1F-4A349B768A25','BB1E3F5B-CA27-455a-89D4-C62BF80F3230','C2FB0BC1-934E-486f-91DC-980761222588','725DC58D-277E-4c78-BA7A-3B96ED58E0B5')
DELETE FROM BPMSecurityUserResourcePerm WHERE RSID IN('efec54e1-bb63-43f8-8635-3b07d1199309','E0DCB7ED-1289-40e2-A945-6F8E1578BA2A','A6F94246-9BCA-409c-9938-5A4FC963FF02','5E6FD5EC-D784-4888-BE30-F8F2600EC01F','C79E4457-9A8C-4b2f-AD1F-4A349B768A25','BB1E3F5B-CA27-455a-89D4-C62BF80F3230','C2FB0BC1-934E-486f-91DC-980761222588','725DC58D-277E-4c78-BA7A-3B96ED58E0B5')
DELETE FROM BPMSecurityUserResourceACL WHERE RSID IN('efec54e1-bb63-43f8-8635-3b07d1199309','E0DCB7ED-1289-40e2-A945-6F8E1578BA2A','A6F94246-9BCA-409c-9938-5A4FC963FF02','5E6FD5EC-D784-4888-BE30-F8F2600EC01F','C79E4457-9A8C-4b2f-AD1F-4A349B768A25','BB1E3F5B-CA27-455a-89D4-C62BF80F3230','C2FB0BC1-934E-486f-91DC-980761222588','725DC58D-277E-4c78-BA7A-3B96ED58E0B5');

--流程门户
if not exists(select * from BPMSecurityUserResource where RSID='997d1aef-d5c1-4645-a7ef-b39f1b06e1a4')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'997d1aef-d5c1-4645-a7ef-b39f1b06e1a4',NULL,10,N'流程门户')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'997d1aef-d5c1-4645-a7ef-b39f1b06e1a4',N'Execute',0,N'模块访问',N'Module',0)
END
GO

--管理门户
if not exists(select * from BPMSecurityUserResource where RSID='d783ae40-f57c-4209-bbc5-bf01ae913854')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'd783ae40-f57c-4209-bbc5-bf01ae913854',NULL,20,N'管理门户')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'd783ae40-f57c-4209-bbc5-bf01ae913854',N'Execute',0,N'模块访问',N'Module',0)
END
GO

--应用门户
if not exists(select * from BPMSecurityUserResource where RSID='49f6f78b-8706-4ac3-a8de-b3ce0188f08b')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'49f6f78b-8706-4ac3-a8de-b3ce0188f08b',NULL,30,N'应用门户')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'49f6f78b-8706-4ac3-a8de-b3ce0188f08b',N'Execute',0,N'模块访问',N'Module',0)
END
GO

--模块权限
if not exists(select * from BPMSecurityUserResource where RSID='ae77e96c-7d5f-4332-b9ad-1b90ada27118')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'ae77e96c-7d5f-4332-b9ad-1b90ada27118',NULL,40,N'模块权限')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'ae77e96c-7d5f-4332-b9ad-1b90ada27118',N'Execute',0,N'模块访问',N'Module',0)
END
GO

--流程执行
if not exists(select * from BPMSecurityUserResource where RSID='e52e8214-6e6e-4132-9873-d33a54eb977d')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'e52e8214-6e6e-4132-9873-d33a54eb977d',N'997d1aef-d5c1-4645-a7ef-b39f1b06e1a4',10,N'流程执行')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'e52e8214-6e6e-4132-9873-d33a54eb977d',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'e52e8214-6e6e-4132-9873-d33a54eb977d','Execute',0,1,getdate(),'sa')
END
GO

--流程测试
if not exists(select * from BPMSecurityUserResource where RSID='725cdb22-1f96-4535-99ff-6e627cd2bf88')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'725cdb22-1f96-4535-99ff-6e627cd2bf88',N'997d1aef-d5c1-4645-a7ef-b39f1b06e1a4',20,N'流程测试')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'725cdb22-1f96-4535-99ff-6e627cd2bf88',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'725cdb22-1f96-4535-99ff-6e627cd2bf88','Execute',0,1,getdate(),'sa')
END
GO

--流程运维
if not exists(select * from BPMSecurityUserResource where RSID='d2c8e9fc-0697-4345-86a4-160007fd7ec3')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'd2c8e9fc-0697-4345-86a4-160007fd7ec3',N'997d1aef-d5c1-4645-a7ef-b39f1b06e1a4',30,N'流程运维')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'd2c8e9fc-0697-4345-86a4-160007fd7ec3',N'Execute',0,N'模块访问',N'Module',0)
--INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'd2c8e9fc-0697-4345-86a4-160007fd7ec3','Execute',0,1,getdate(),'sa')
END
GO

--系统监控
if not exists(select * from BPMSecurityUserResource where RSID='afb5a2b3-85f2-4105-8df7-21b4586f4f29')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'afb5a2b3-85f2-4105-8df7-21b4586f4f29',N'997d1aef-d5c1-4645-a7ef-b39f1b06e1a4',40,N'系统监控')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'afb5a2b3-85f2-4105-8df7-21b4586f4f29',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'afb5a2b3-85f2-4105-8df7-21b4586f4f29','Execute',0,1,getdate(),'sa')
END
GO

--业务报表
if not exists(select * from BPMSecurityUserResource where RSID='5199d7f8-6a19-49da-ad7c-784b7d4a8788')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'5199d7f8-6a19-49da-ad7c-784b7d4a8788',N'997d1aef-d5c1-4645-a7ef-b39f1b06e1a4',50,N'业务报表')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'5199d7f8-6a19-49da-ad7c-784b7d4a8788',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'5199d7f8-6a19-49da-ad7c-784b7d4a8788','Execute',0,1,getdate(),'sa')
END
GO

--系统报表
if not exists(select * from BPMSecurityUserResource where RSID='5147b758-b363-4ff8-8d27-58b3c1bd1f74')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'5147b758-b363-4ff8-8d27-58b3c1bd1f74',N'997d1aef-d5c1-4645-a7ef-b39f1b06e1a4',60,N'系统报表')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'5147b758-b363-4ff8-8d27-58b3c1bd1f74',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'5147b758-b363-4ff8-8d27-58b3c1bd1f74','Execute',0,1,getdate(),'sa')
END
GO

--应用客制
if not exists(select * from BPMSecurityUserResource where RSID='d127e087-f1f8-4650-80a6-b8468821330e')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'd127e087-f1f8-4650-80a6-b8468821330e',N'997d1aef-d5c1-4645-a7ef-b39f1b06e1a4',70,N'应用客制')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'd127e087-f1f8-4650-80a6-b8468821330e',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'd127e087-f1f8-4650-80a6-b8468821330e','Execute',0,1,getdate(),'sa')
END
GO

--个人信息
if not exists(select * from BPMSecurityUserResource where RSID='e98e2489-6cf5-4d13-a309-596ee252d013')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'e98e2489-6cf5-4d13-a309-596ee252d013',N'997d1aef-d5c1-4645-a7ef-b39f1b06e1a4',80,N'个人信息')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'e98e2489-6cf5-4d13-a309-596ee252d013',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'e98e2489-6cf5-4d13-a309-596ee252d013','Execute',0,1,getdate(),'sa')
END
GO

--组织管理
if not exists(select * from BPMSecurityUserResource where RSID='2694420f-a074-446c-bdf3-72dae1920298')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'2694420f-a074-446c-bdf3-72dae1920298',N'd783ae40-f57c-4209-bbc5-bf01ae913854',10,N'组织管理')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'2694420f-a074-446c-bdf3-72dae1920298',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'2694420f-a074-446c-bdf3-72dae1920298','Execute',0,1,getdate(),'sa')
END
GO

--流程设计
if not exists(select * from BPMSecurityUserResource where RSID='7631a828-55f0-439b-8acf-551d0ce3dfce')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'7631a828-55f0-439b-8acf-551d0ce3dfce',N'd783ae40-f57c-4209-bbc5-bf01ae913854',20,N'流程设计')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'7631a828-55f0-439b-8acf-551d0ce3dfce',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'7631a828-55f0-439b-8acf-551d0ce3dfce','Execute',0,1,getdate(),'sa')
END
GO

--表单设计
if not exists(select * from BPMSecurityUserResource where RSID='afea2fa9-de8e-438c-b784-839bdcd32139')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'afea2fa9-de8e-438c-b784-839bdcd32139',N'd783ae40-f57c-4209-bbc5-bf01ae913854',30,N'表单设计')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'afea2fa9-de8e-438c-b784-839bdcd32139',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'afea2fa9-de8e-438c-b784-839bdcd32139','Execute',0,1,getdate(),'sa')
END
GO

--报表设计
if not exists(select * from BPMSecurityUserResource where RSID='25a9de61-fc9f-45df-8d99-2f8279b5a1e6')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'25a9de61-fc9f-45df-8d99-2f8279b5a1e6',N'd783ae40-f57c-4209-bbc5-bf01ae913854',40,N'报表设计')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'25a9de61-fc9f-45df-8d99-2f8279b5a1e6',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'25a9de61-fc9f-45df-8d99-2f8279b5a1e6','Execute',0,1,getdate(),'sa')
END
GO

--访问控制
if not exists(select * from BPMSecurityUserResource where RSID='719fdbe8-3172-4078-a33e-199db75b9b40')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'719fdbe8-3172-4078-a33e-199db75b9b40',N'd783ae40-f57c-4209-bbc5-bf01ae913854',50,N'访问控制')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'719fdbe8-3172-4078-a33e-199db75b9b40',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'719fdbe8-3172-4078-a33e-199db75b9b40','Execute',0,1,getdate(),'sa')
END
GO

--权限分配
if not exists(select * from BPMSecurityUserResource where RSID='1439c8f5-e410-4262-b69b-6402bf86a79b')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'1439c8f5-e410-4262-b69b-6402bf86a79b',N'd783ae40-f57c-4209-bbc5-bf01ae913854',60,N'权限分配')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'1439c8f5-e410-4262-b69b-6402bf86a79b',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'1439c8f5-e410-4262-b69b-6402bf86a79b','Execute',0,1,getdate(),'sa')
END
GO

--表单服务
if not exists(select * from BPMSecurityUserResource where RSID='2c2b5525-62ed-47b2-85a0-583d56876c36')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'2c2b5525-62ed-47b2-85a0-583d56876c36',N'd783ae40-f57c-4209-bbc5-bf01ae913854',70,N'表单服务')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'2c2b5525-62ed-47b2-85a0-583d56876c36',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'2c2b5525-62ed-47b2-85a0-583d56876c36','Execute',0,1,getdate(),'sa')
END
GO

--移动表单
if not exists(select * from BPMSecurityUserResource where RSID='5fae8abe-272e-4afc-8cad-8b2ab6455ca7')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'5fae8abe-272e-4afc-8cad-8b2ab6455ca7',N'd783ae40-f57c-4209-bbc5-bf01ae913854',80,N'移动表单')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'5fae8abe-272e-4afc-8cad-8b2ab6455ca7',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'5fae8abe-272e-4afc-8cad-8b2ab6455ca7','Execute',0,1,getdate(),'sa')
END
GO

--管理工具
if not exists(select * from BPMSecurityUserResource where RSID='e9570a9d-5362-4d58-99d8-2bd7c5685c5c')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'e9570a9d-5362-4d58-99d8-2bd7c5685c5c',N'd783ae40-f57c-4209-bbc5-bf01ae913854',90,N'管理工具')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'e9570a9d-5362-4d58-99d8-2bd7c5685c5c',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'e9570a9d-5362-4d58-99d8-2bd7c5685c5c','Execute',0,1,getdate(),'sa')
END
GO

--通用数据源
if not exists(select * from BPMSecurityUserResource where RSID='c973ecb4-e90f-477e-bcf3-13dbf59ca5e1')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'c973ecb4-e90f-477e-bcf3-13dbf59ca5e1',N'd783ae40-f57c-4209-bbc5-bf01ae913854',100,N'通用数据源')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'c973ecb4-e90f-477e-bcf3-13dbf59ca5e1',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'c973ecb4-e90f-477e-bcf3-13dbf59ca5e1','Execute',0,1,getdate(),'sa')
END
GO

--ESB
if not exists(select * from BPMSecurityUserResource where RSID='bcf56c0a-54ae-489f-8883-4a2f64604e6d')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'bcf56c0a-54ae-489f-8883-4a2f64604e6d',N'd783ae40-f57c-4209-bbc5-bf01ae913854',110,N'ESB')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'bcf56c0a-54ae-489f-8883-4a2f64604e6d',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'bcf56c0a-54ae-489f-8883-4a2f64604e6d','Execute',0,1,getdate(),'sa')
END
GO

--系统管理
if not exists(select * from BPMSecurityUserResource where RSID='d2871cb2-415b-40cb-9ed8-7dcb8d8c9283')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'd2871cb2-415b-40cb-9ed8-7dcb8d8c9283',N'd783ae40-f57c-4209-bbc5-bf01ae913854',120,N'系统管理')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'd2871cb2-415b-40cb-9ed8-7dcb8d8c9283',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'd2871cb2-415b-40cb-9ed8-7dcb8d8c9283','Execute',0,1,getdate(),'sa')
END
GO

--安全组
if not exists(select * from BPMSecurityUserResource where RSID='3a0c58ec-f240-4584-9024-1470156a9a7c')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'3a0c58ec-f240-4584-9024-1470156a9a7c',N'e9570a9d-5362-4d58-99d8-2bd7c5685c5c',10,N'安全组')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'3a0c58ec-f240-4584-9024-1470156a9a7c',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'3a0c58ec-f240-4584-9024-1470156a9a7c','Execute',0,1,getdate(),'sa')
END
GO

--工作日历
if not exists(select * from BPMSecurityUserResource where RSID='ac73842c-163f-4a9a-b862-2ee2eb7dc0e2')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'ac73842c-163f-4a9a-b862-2ee2eb7dc0e2',N'e9570a9d-5362-4d58-99d8-2bd7c5685c5c',30,N'工作日历')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'ac73842c-163f-4a9a-b862-2ee2eb7dc0e2',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'ac73842c-163f-4a9a-b862-2ee2eb7dc0e2','Execute',0,1,getdate(),'sa')
END
GO

--Purchase
if not exists(select * from syscolumns where name = 'SN' and id = object_id('Purchase'))
BEGIN
ALTER TABLE Purchase ADD SN [nvarchar] (50) NULL;
END
GO

if not exists(select * from syscolumns where name = 'Str1' and id = object_id('Purchase'))
BEGIN
ALTER TABLE Purchase ADD Str1 [nvarchar] (50) NULL;
END
GO
if not exists(select * from syscolumns where name = 'Str2' and id = object_id('Purchase'))
BEGIN
ALTER TABLE Purchase ADD Str2 [nvarchar] (50) NULL;
END
GO
if not exists(select * from syscolumns where name = 'Str3' and id = object_id('Purchase'))
BEGIN
ALTER TABLE Purchase ADD Str3 [nvarchar] (50) NULL;
END
GO
if not exists(select * from syscolumns where name = 'Str4' and id = object_id('Purchase'))
BEGIN
ALTER TABLE Purchase ADD Str4 [nvarchar] (50) NULL;
END
GO
if not exists(select * from syscolumns where name = 'Str5' and id = object_id('Purchase'))
BEGIN
ALTER TABLE Purchase ADD Str5 [nvarchar] (50) NULL;
END
GO
if not exists(select * from syscolumns where name = 'Str6' and id = object_id('Purchase'))
BEGIN
ALTER TABLE Purchase ADD Str6 [nvarchar] (50) NULL;
END
GO
if not exists(select * from syscolumns where name = 'Str7' and id = object_id('Purchase'))
BEGIN
ALTER TABLE Purchase ADD Str7 [nvarchar] (50) NULL;
END
GO
if not exists(select * from syscolumns where name = 'Str8' and id = object_id('Purchase'))
BEGIN
ALTER TABLE Purchase ADD Str8 [nvarchar] (50) NULL;
END
GO

if not exists(select * from syscolumns where name = 'Int1' and id = object_id('Purchase'))
BEGIN
ALTER TABLE Purchase ADD Int1 [int] NULL;
END
GO
if not exists(select * from syscolumns where name = 'Int2' and id = object_id('Purchase'))
BEGIN
ALTER TABLE Purchase ADD Int2 [int] NULL;
END
GO
if not exists(select * from syscolumns where name = 'Int3' and id = object_id('Purchase'))
BEGIN
ALTER TABLE Purchase ADD Int3 [int] NULL;
END
GO
if not exists(select * from syscolumns where name = 'Int4' and id = object_id('Purchase'))
BEGIN
ALTER TABLE Purchase ADD Int4 [int] NULL;
END
GO

if not exists(select * from syscolumns where name = 'ItemID' and id = object_id('Purchase'))
BEGIN
ALTER TABLE Purchase ADD ItemID [int] IDENTITY(1,1) NOT NULL;
END
GO

if not exists(select * from syscolumns where name = 'Attachments' and id = object_id('Purchase'))
BEGIN
ALTER TABLE Purchase ADD Attachments [nvarchar] (300) NULL;
END
GO

--PK_Purchase
if not exists (select * from dbo.sysindexes where name = 'PK_Purchase')
BEGIN
	ALTER TABLE [dbo].[Purchase] ADD  CONSTRAINT [PK_Purchase] PRIMARY KEY CLUSTERED 
	(
		[ItemID] ASC
	) ON [PRIMARY]
END
GO

if not exists(select * from syscolumns where name = 'ItemCode' and id = object_id('PurchaseDetail'))
BEGIN
ALTER TABLE PurchaseDetail ADD ItemCode [nvarchar] (50) NULL;
END
GO

--BPMSysMobileAppFormFields
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysMobileAppFormFields]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSysMobileAppFormFields](
	[XClass] [nvarchar](50) NOT NULL,
	[Desc] [nvarchar](500) NULL,
	[OrderIndex] [int] NULL,
	CONSTRAINT [PK_BPMSysMobileAppFormFields] PRIMARY KEY CLUSTERED 
	(
		[XClass] ASC
	) ON [PRIMARY]
) ON [PRIMARY]

INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES('Ext.field.Text',N'Text',1)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES('Ext.field.Number',N'Number',2)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES('Ext.field.TextArea',N'TextArea',3)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES('Ext.field.Field',N'Display',4)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES('YZSoft$ux.field.Attachment',N'Attachment',5)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES('Ext.field.DatePicker',N'DatePicker',6)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES('Ext.field.Email',N'Email',7)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES('Ext.field.Url',N'Url',8)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES('Ext.field.Password',N'Password',9)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES('Ext.field.Checkbox',N'Checkbox',10)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES('Ext.field.Radio',N'Radio',11)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES('Ext.field.Select',N'Select',12)
END
GO

--BPMSysMobileAppFormRenders
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMSysMobileAppFormRenders]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMSysMobileAppFormRenders](
	[Render] [nvarchar](50) NOT NULL,
	[Sample] [nvarchar](500) NULL,
	[Desc] [nvarchar](500) NULL,
	[OrderIndex] [int] NULL,
	CONSTRAINT [PK_BPMSysMobileAppFormRenders] PRIMARY KEY CLUSTERED 
	(
		[Render] ASC
	) ON [PRIMARY]
) ON [PRIMARY]

INSERT INTO BPMSysMobileAppFormRenders(Render,Sample,OrderIndex) VALUES('Default',N'',1)
INSERT INTO BPMSysMobileAppFormRenders(Render,Sample,OrderIndex) VALUES('DateYMD',N'2015-12-03',2)
INSERT INTO BPMSysMobileAppFormRenders(Render,Sample,OrderIndex) VALUES('DateYMDHM',N'2015-12-03 12:03',3)
INSERT INTO BPMSysMobileAppFormRenders(Render,Sample,OrderIndex) VALUES('DateYMDHMS',N'2015-12-03 12:03:45',4)
INSERT INTO BPMSysMobileAppFormRenders(Render,Sample,OrderIndex) VALUES('Currency',N'1,234.12',5)
INSERT INTO BPMSysMobileAppFormRenders(Render,Sample,OrderIndex) VALUES('CurrencyD3',N'1,234.123',6)
INSERT INTO BPMSysMobileAppFormRenders(Render,Sample,OrderIndex) VALUES('CurrencyD4',N'1,234.1234',7)
INSERT INTO BPMSysMobileAppFormRenders(Render,Sample,OrderIndex) VALUES('CurrencyD0',N'1,234',8)
INSERT INTO BPMSysMobileAppFormRenders(Render,Sample,OrderIndex) VALUES('Qty',N'1234.12',9)
INSERT INTO BPMSysMobileAppFormRenders(Render,Sample,OrderIndex) VALUES('QtyD3',N'1234.123',10)
INSERT INTO BPMSysMobileAppFormRenders(Render,Sample,OrderIndex) VALUES('QtyD4',N'1234.1234',11)
INSERT INTO BPMSysMobileAppFormRenders(Render,Sample,OrderIndex) VALUES('QtyD0',N'1234',12)
INSERT INTO BPMSysMobileAppFormRenders(Render,Sample,OrderIndex) VALUES('HtmlEncode',N'',13)
END
GO

--通用数据源
UPDATE BPMSecurityUserResource SET ParentRSID=N'd783ae40-f57c-4209-bbc5-bf01ae913854',ResourceName=N'通用数据源',OrderIndex=10 WHERE RSID=N'c973ecb4-e90f-477e-bcf3-13dbf59ca5e1' AND ParentRSID=N'e9570a9d-5362-4d58-99d8-2bd7c5685c5c' AND ResourceName=N'外部服务器'

/********************************************* ver5.00h DBUpdate *********************************************/
--BPMInstTasks
if not exists(select * from syscolumns where name = 'Context' and id = object_id('BPMInstTasks'))
BEGIN
ALTER TABLE BPMInstTasks ADD Context [nvarchar] (2000) NULL;
END
GO

--BPMInstProcSteps
if not exists(select * from syscolumns where name = 'Context' and id = object_id('BPMInstProcSteps'))
BEGIN
ALTER TABLE BPMInstProcSteps ADD Context [nvarchar] (1000) NULL;
END
GO

--BPMInstDrafts
if not exists(select * from syscolumns where name = 'Header' and id = object_id('BPMInstDrafts'))
BEGIN
ALTER TABLE BPMInstDrafts ADD Header [nvarchar] (2000) NULL;
END
GO

/********************************************* ver5.00j DBUpdate *********************************************/
--ESB_ConnectInfo/connectType int -> nvarchar
DECLARE @len INT;
SELECT @len=length FROM syscolumns WHERE name = 'connectType' and id = object_id('ESB_ConnectInfo')
if @len=4
BEGIN
--修改ESB_ConnectInfo数据类型
ALTER TABLE ESB_ConnectInfo ALTER COLUMN connectType nvarchar(50)
ALTER TABLE ESB_ConnectInfo ALTER COLUMN isvalid bit
--修改ESB_SourceInfo数据类型
ALTER TABLE ESB_SourceInfo ALTER COLUMN sourceType nvarchar(50)
ALTER TABLE ESB_SourceInfo ALTER COLUMN isvalid bit
--更新ESB_ConnectInfo表数据
UPDATE ESB_ConnectInfo SET connectType = (
	case 
	when connectType='1' then 'WebService'
	when connectType='2' then 'SAP'
	when connectType='3' then 'SqlServer'
	when connectType='4' then 'Oracle'
	when connectType='5' then 'Excel'
	end
)
--更新ESB_SourceInfo表数据
UPDATE ESB_SourceInfo SET sourceType = (
	case 
	when sourceType='1' then 'WebService'
	when sourceType='2' then 'SAP'
	when sourceType='3' then 'SqlServer'
	when sourceType='4' then 'Oracle'
	when sourceType='5' then 'Excel'
	end
)
END
GO

--BPMSysTaskRule
if not exists(select * from syscolumns where name = 'ConditionEnabled' and id = object_id('BPMSysTaskRule'))
BEGIN
ALTER TABLE BPMSysTaskRule ADD ConditionEnabled [bit] NOT NULL DEFAULT(0);
ALTER TABLE BPMSysTaskRule ADD Condition [ntext] NULL;
END
GO

/********************************************* ver5.70a BPA DBUpdate *********************************************/
--BPASpriteIdentity
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPASpriteIdentity]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPASpriteIdentity](
	[FileID] [nvarchar](50) NOT NULL,
	[SpriteID] [nvarchar](50) NOT NULL,
	[Name] [nvarchar](200) NULL,
	CONSTRAINT [PK_BPASpriteName] PRIMARY KEY CLUSTERED 
	(
		[FileID] ASC,
		[SpriteID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
END
GO

--BPASpriteLink
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPASpriteLink]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPASpriteLink](
	[FileID] [nvarchar](50) NULL,
	[SpriteID] [nvarchar](50) NULL,
	[LinkType] [nvarchar](50) NULL,
	[LinkedFileID] [nvarchar](50) NULL,
	[LinkedSpriteID] [nvarchar](50) NULL,
	[LinkedByProperty] [nvarchar](50) NULL,
	[FileDeleted] [bit] NOT NULL CONSTRAINT [DF_BPASpriteLink_FileDeleted]  DEFAULT ((0)),
	[LinkedFileDeleted] [bit] NOT NULL CONSTRAINT [DF_BPASpriteLink_LinkedFileDeleted]  DEFAULT ((0))
) ON [PRIMARY]
END
GO

--YZIX_BPASpriteLink_LinkedFileID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPASpriteLink_LinkedFileID')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPASpriteLink_LinkedFileID] ON [BPASpriteLink] 
	(
		[LinkedFileID] ASC
	) ON [PRIMARY]
END
GO

--YZIX_BPASpriteLink_FileID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPASpriteLink_FileID')
BEGIN
	CREATE INDEX [YZIX_BPASpriteLink_FileID] ON [BPASpriteLink] 
	(
		[FileID] ASC
	) ON [PRIMARY]
END
GO

--BPAUserPosition
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPAUserPosition]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPAUserPosition](
	[UID] [nvarchar](50) NOT NULL,
	[FileID] [nvarchar](50) NOT NULL,
	[SpriteID] [nvarchar](50) NOT NULL
) ON [PRIMARY]
END
GO

--YZIX_BPAUserPosition
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPAUserPosition')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_BPAUserPosition] ON [dbo].[BPAUserPosition] 
	(
		[UID] ASC
	) ON [PRIMARY]
END
GO

--YZAppCommunication/replyto
if not exists(select * from syscolumns where name = 'replyto' and id = object_id('YZAppCommunication'))
BEGIN
ALTER TABLE YZAppCommunication ADD replyto [int] NULL
END
GO

--YZAppCommunicationVote
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZAppCommunicationVote]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[YZAppCommunicationVote](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[messageid] [int] NOT NULL,
	[uid] [nvarchar](50) NOT NULL,
	[date] [datetime] NOT NULL,
	CONSTRAINT [PK_YZCommunicationVote] PRIMARY KEY CLUSTERED 
	(
		[id] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
END
GO

--YZAppFolders
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZAppFolders]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[YZAppFolders](
	[FolderID] [int] IDENTITY(1,1) NOT NULL,
	[RootID] [int] NULL,
	[ParentID] [int] NULL,
	[FolderType] [nvarchar](50) NULL,
	[Name] [nvarchar](50) NULL,
	[Desc] [nvarchar](500) NULL,
	[Owner] [nvarchar](50) NULL,
	[CreateAt] [datetime] NULL,
	[Deleted] [bit] NOT NULL CONSTRAINT [DF_YZAppFolders_Deleted]  DEFAULT ((0)),
	[DeleteBy] [nvarchar](50) NULL,
	[DeleteAt] [datetime] NULL,
	[Recyclebin] [bit] NULL CONSTRAINT [DF_YZAppFolders_Recyclebin]  DEFAULT ((0)),
	[OrderIndex] [int] NULL,
	CONSTRAINT [PK_YZAppFolders] PRIMARY KEY CLUSTERED 
	(
		[FolderID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
END
GO

--YZIX_YZAppFolders_RootID
if not exists (select * from dbo.sysindexes where name = 'YZIX_YZAppFolders_RootID')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_YZAppFolders_RootID] ON [dbo].[YZAppFolders] 
	(
		[RootID] ASC
	) ON [PRIMARY]
END
GO

--YZAppFolderFiles
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZAppFolderFiles]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
	CREATE TABLE [dbo].[YZAppFolderFiles](
		[ID] [int] IDENTITY(1,1) NOT NULL,
		[FolderID] [int] NOT NULL,
		[FileID] [nvarchar](50) NOT NULL,
		[AddBy] [nvarchar](50) NULL,
		[AddAt] [datetime] NULL,
		[Comments] [nvarchar](50) NULL,
		[Deleted] [bit] NOT NULL CONSTRAINT [DF_YZAppFolderFiles_Deleted]  DEFAULT ((0)),
		[DeleteBy] [nvarchar](50) NULL,
		[DeleteAt] [datetime] NULL,
		[Recyclebin] [bit] NULL CONSTRAINT [DF_YZAppFolderFiles_Recyclebin]  DEFAULT ((0)),
		CONSTRAINT [PK_YZAppFolderFiles] PRIMARY KEY CLUSTERED 
		(
			[ID] ASC
		) ON [PRIMARY]
	) ON [PRIMARY]
END
GO

--YZIX_YZAppFolderFiles_Recy
if not exists (select * from dbo.sysindexes where name = 'YZIX_YZAppFolderFiles_Recy')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_YZAppFolderFiles_Recy] ON [dbo].[YZAppFolderFiles] 
	(
		[FolderID] ASC
	)
	INCLUDE (
	[Deleted],
	[DeleteBy]
	) ON [PRIMARY]
END
GO

--YZAppGroup
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZAppGroup]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
	CREATE TABLE [dbo].[YZAppGroup](
		[GroupID] [int] IDENTITY(1,1) NOT NULL,
		[GroupType] [nvarchar](50) NULL,
		[Name] [nvarchar](50) NULL,
		[Desc] [nvarchar](500) NULL,
		[FolderID] [int] NULL,
		[DocumentFolderID] [int] NULL,
		[Owner] [nvarchar](50) NULL,
		[CreateAt] [datetime] NULL,
		[ImageFileID] [nvarchar](50) NULL,
		[Deleted] [bit] NOT NULL CONSTRAINT [DF_YZAppGroup_Deleted]  DEFAULT ((0)),
		[DeleteBy] [nvarchar](50) NULL,
		[DeleteAt] [datetime] NULL,
		CONSTRAINT [PK_BPMSysGroups] PRIMARY KEY CLUSTERED 
		(
			[GroupID] ASC
		) ON [PRIMARY]
	) ON [PRIMARY]
END
GO

--YZAppGroupMembers
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZAppGroupMembers]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
	CREATE TABLE [dbo].[YZAppGroupMembers](
		[ItemID] [int] IDENTITY(1,1) NOT NULL,
		[GroupID] [int] NULL,
		[UID] [nvarchar](50) NULL,
		[Role] [nvarchar](50) NULL,
		CONSTRAINT [PK_YZAppGroupMembers] PRIMARY KEY CLUSTERED 
		(
			[ItemID] ASC
		) ON [PRIMARY]
	) ON [PRIMARY]
END
GO

--YZAppLibrary
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZAppLibrary]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
	CREATE TABLE [dbo].[YZAppLibrary](
		[LibID] [int] IDENTITY(1,1) NOT NULL,
		[LibType] [nvarchar](50) NULL,
		[Name] [nvarchar](50) NULL,
		[Desc] [nvarchar](500) NULL,
		[FolderID] [int] NULL,
		[DocumentFolderID] [int] NULL,
		[Owner] [nvarchar](50) NULL,
		[CreateAt] [datetime] NULL,
		[ImageFileID] [nvarchar](50) NULL,
		[Deleted] [bit] NOT NULL CONSTRAINT [DF_YZAppLibrary_Deleted]  DEFAULT ((0)),
		[DeleteBy] [nvarchar](50) NULL,
		[DeleteAt] [datetime] NULL,
		CONSTRAINT [PK_YZAppLibrarys] PRIMARY KEY CLUSTERED 
		(
			[LibID] ASC
		) ON [PRIMARY]
	) ON [PRIMARY]
END
GO

--YZV_RootFolders
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_NAME = 'YZV_RootFolders')
BEGIN
exec sp_executesql N'
CREATE VIEW YZV_RootFolders
AS
SELECT LibType, LibID, Name AS LibName, [Desc] AS LibDesc, FolderID AS RootFolderID FROM dbo.YZAppLibrary WHERE (Deleted <> 1)
UNION
SELECT GroupType AS LibType, GroupID AS LibID, Name AS LibName, [Desc] AS LibDesc, FolderID AS RootFolderID FROM dbo.YZAppGroup WHERE (Deleted <> 1)
'
END
GO

--YZDirectoryGetPath函数
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZDirectoryGetPath]') and OBJECTPROPERTY(id, N'IsScalarFunction') = 1)
BEGIN
exec sp_executesql N'
	CREATE FUNCTION [dbo].[YZDirectoryGetPath]
	(
		@FolderID int
	)
	RETURNS nvarchar(1024)
	AS
	BEGIN
		DECLARE @Path nvarchar(1024)
		DECLARE @ParentID int
		DECLARE @FolderName nvarchar(50)
		WHILE @FolderID IS NOT NULL
		BEGIN
			SELECT @ParentID = ParentID,@FolderName=[Name] FROM YZAppFolders WHERE FolderID = @FolderID
			IF @ParentID IS NOT NULL
				SELECT @Path = case when @Path IS NULL then @FolderName else @FolderName + ''\'' + @Path end
			SELECT @FolderID = @ParentID
		END
		RETURN @Path
	END
'
END
GO

--YZAppAttachment
if not exists(select * from syscolumns where name = 'LParam1' and id = object_id('YZAppAttachment'))
BEGIN
ALTER TABLE YZAppAttachment ADD LParam1 [int] NULL;
END
GO

--模块权限
if not exists(select * from BPMSecurityACL where RSID='EE5117DF-FCAF-4814-AD17-32497EB0092D')
BEGIN
--管理站点
INSERT INTO BPMSecurityACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID','S_GS_B639EB43-67D7-42fb-BD2E-B754BB11915B','EE5117DF-FCAF-4814-AD17-32497EB0092D','Execute',0,1,getdate(),'sa')
INSERT INTO BPMSecurityACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID','S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542','EE5117DF-FCAF-4814-AD17-32497EB0092D','Execute',0,1,getdate(),'sa')
--流程库
INSERT INTO BPMSecurityACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID','S_GS_B639EB43-67D7-42fb-BD2E-B754BB11915B','19E802FB-605A-4BD6-B5D9-3501CE842966','Execute,Write',0,1,getdate(),'sa')
INSERT INTO BPMSecurityACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID','S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542','19E802FB-605A-4BD6-B5D9-3501CE842966','Execute',0,1,getdate(),'sa')
--文档库
INSERT INTO BPMSecurityACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID','S_GS_B639EB43-67D7-42fb-BD2E-B754BB11915B','CC94E14F-9702-469C-9FC6-16763700FE5A','Execute,Write',0,1,getdate(),'sa')
INSERT INTO BPMSecurityACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID','S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542','CC94E14F-9702-469C-9FC6-16763700FE5A','Execute',0,1,getdate(),'sa')
--流程小组
INSERT INTO BPMSecurityACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID','S_GS_B639EB43-67D7-42fb-BD2E-B754BB11915B','06DFA056-80E9-48E2-9C2A-ED34EB40A65D','Execute,Write',0,1,getdate(),'sa')
INSERT INTO BPMSecurityACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID','S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542','06DFA056-80E9-48E2-9C2A-ED34EB40A65D','Execute,Write',0,1,getdate(),'sa')
--系统管理
INSERT INTO BPMSecurityACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID','S_GS_B639EB43-67D7-42fb-BD2E-B754BB11915B','01EC8CE8-CCCC-4196-93B3-A598813902E4','Execute',0,1,getdate(),'sa')
--模板管理
INSERT INTO BPMSecurityACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID','S_GS_B639EB43-67D7-42fb-BD2E-B754BB11915B','B52100EA-081B-483C-92D0-46AA00C3B025','Execute',0,1,getdate(),'sa')
--小组管理
INSERT INTO BPMSecurityACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID','S_GS_B639EB43-67D7-42fb-BD2E-B754BB11915B','09C6D1E5-F9F9-4E51-AAA2-4DC2DC17F09D','Execute',0,1,getdate(),'sa')
--权限管理
INSERT INTO BPMSecurityACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID','S_GS_B639EB43-67D7-42fb-BD2E-B754BB11915B','FE9BD49A-416D-4E67-9505-84CF6DFF353D','Execute',0,1,getdate(),'sa')
--帮助
INSERT INTO BPMSecurityACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID','S_GS_B639EB43-67D7-42fb-BD2E-B754BB11915B','DDE2A259-8702-4FA5-86B0-9EA73FA1B6C0','Execute',0,1,getdate(),'sa')
INSERT INTO BPMSecurityACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID','S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542','DDE2A259-8702-4FA5-86B0-9EA73FA1B6C0','Execute',0,1,getdate(),'sa')
--回收站
INSERT INTO BPMSecurityACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID','S_GS_B639EB43-67D7-42fb-BD2E-B754BB11915B','6B86A356-485B-4439-AE75-B5FC3A251775','Execute',0,1,getdate(),'sa')
INSERT INTO BPMSecurityACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID','S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542','6B86A356-485B-4439-AE75-B5FC3A251775','Execute',0,1,getdate(),'sa')
END
GO

/********************************************* 企信通 *********************************************/
--YZV_TaskList
if not exists(select * from syscolumns where name = 'duration' and id = object_id('YZAppCommunication'))
BEGIN
DROP VIEW [dbo].[YZV_TaskList]
exec sp_executesql N'
CREATE VIEW YZV_TaskList
WITH SCHEMABINDING
AS
SELECT a.TaskID,a.StepID,b.ProcessName,b.OwnerPositionID,b.OwnerAccount,b.AgentAccount,b.CreateAt,b.Description,a.NodeName,a.ReceiveAt,a.Share,b.State,b.SerialNum,a.TimeoutFirstNotifyDate,a.TimeoutDeadline,a.TimeoutNotifyCount,a.NodePath,a.ExtRecipient,b.ParentTaskID,b.ParentStepID,b.ParentStepName,b.ProcessVersion
FROM dbo.BPMInstProcSteps a INNER JOIN dbo.BPMInstTasks b on a.TaskID=b.TaskID
WHERE a.FinishAt IS NULL AND a.HumanStep=1 AND a.ExtRecipient IS NOT NULL AND (b.State=''Running'' OR (a.NodeName=''sysInform'' AND b.State<>''Deleted'' AND b.State<>''Aborted''))
'
END
GO

/***YZV_TaskList表的索引***/
--YZIX_TaskList
if not exists (select * from dbo.sysindexes where name = 'YZIX_TaskList')
BEGIN
	CREATE UNIQUE CLUSTERED INDEX [YZIX_TaskList] ON [dbo].[YZV_TaskList] 
	(
		[ExtRecipient] ASC,
		[StepID] ASC
	) ON [PRIMARY]
END
GO

--BPMSysUserCommonInfo
if not exists(select * from syscolumns where name = 'AppLoginProtect' and id = object_id('BPMSysUserCommonInfo'))
BEGIN
ALTER TABLE BPMSysUserCommonInfo ADD AppLoginProtect [bit] NOT NULL DEFAULT(0);
END
GO

--BPMSysUserCommonInfo
if not exists(select * from syscolumns where name = 'PhoneBindNumber' and id = object_id('BPMSysUserCommonInfo'))
BEGIN
ALTER TABLE BPMSysUserCommonInfo ADD PhoneBindIDDCode [nvarchar](10) NULL;
ALTER TABLE BPMSysUserCommonInfo ADD PhoneBindNumber [nvarchar](30) NULL;
END
GO

--BPMSysUserCommonInfo
if not exists(select * from syscolumns where name = 'ScreenLock' and id = object_id('BPMSysUserCommonInfo'))
BEGIN
ALTER TABLE BPMSysUserCommonInfo ADD ScreenLockPassword [nvarchar](50) NULL;
ALTER TABLE BPMSysUserCommonInfo ADD ScreenLock [bit] NOT NULL DEFAULT(0);
ALTER TABLE BPMSysUserCommonInfo ADD TouchUnlock [bit] NOT NULL DEFAULT(0);
END
GO

--YZAppCommunication
if not exists(select * from syscolumns where name = 'duration' and id = object_id('YZAppCommunication'))
BEGIN
ALTER TABLE YZAppCommunication ADD duration [int] NULL;
END
GO

--YZAppCommunication
if not exists(select * from syscolumns where name = 'ExtDate' and id = object_id('YZAppCommunication'))
BEGIN
ALTER TABLE YZAppCommunication ADD [ExtDate] AS DATEADD(dd, 0, DATEDIFF(dd, 0, date)) PERSISTED --日志日期
END
GO

--YZIX_YZAppCommunication_ResType
if not exists (select * from dbo.sysindexes where name = 'YZIX_YZAppCommunication_ResType')
BEGIN
	CREATE INDEX YZIX_YZAppCommunication_ResType ON [YZAppCommunication] 
	(
		[resType] ASC,
		[ExtDate] ASC
	) ON [PRIMARY]
END
GO

/********************************************* 网站改版 *********************************************/
--根目录OrderIndex
if exists(select * from BPMSecurityUserResource where RSID='ae77e96c-7d5f-4332-b9ad-1b90ada27118' AND OrderIndex=360)
BEGIN
UPDATE BPMSecurityUserResource SET OrderIndex=OrderIndex+160 WHERE ParentRSID IS NULL AND OrderIndex>=40
END
GO

--应用门户
if exists(select * from BPMSecurityUserResource where RSID='49f6f78b-8706-4ac3-a8de-b3ce0188f08b' AND OrderIndex=30)
BEGIN
UPDATE BPMSecurityUserResource SET OrderIndex = 20 WHERE RSID='49f6f78b-8706-4ac3-a8de-b3ce0188f08b'
END
GO

--应用客制
if exists(select * from BPMSecurityUserResource where RSID='d127e087-f1f8-4650-80a6-b8468821330e' AND ParentRSID='997d1aef-d5c1-4645-a7ef-b39f1b06e1a4')
BEGIN
UPDATE BPMSecurityUserResource SET ParentRSID = '49f6f78b-8706-4ac3-a8de-b3ce0188f08b',OrderIndex = 10 WHERE RSID='d127e087-f1f8-4650-80a6-b8468821330e'
END
GO

--流程知识库
if not exists(select * from BPMSecurityUserResource where RSID='5fa20260-5340-4398-bee0-5415c98a3155')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'5fa20260-5340-4398-bee0-5415c98a3155',NULL,30,N'流程知识库')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'5fa20260-5340-4398-bee0-5415c98a3155',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'5fa20260-5340-4398-bee0-5415c98a3155','Execute',0,1,getdate(),'sa')
END
GO

--流程监控
if exists(select * from BPMSecurityUserResource where RSID='afb5a2b3-85f2-4105-8df7-21b4586f4f29' AND ParentRSID='997d1aef-d5c1-4645-a7ef-b39f1b06e1a4')
BEGIN
UPDATE BPMSecurityUserResource SET ParentRSID = NULL,OrderIndex = 40,ResourceName=N'流程监控' WHERE RSID='afb5a2b3-85f2-4105-8df7-21b4586f4f29'
END
GO

--业务报表
if exists(select * from BPMSecurityUserResource where RSID='5199d7f8-6a19-49da-ad7c-784b7d4a8788' AND ParentRSID='997d1aef-d5c1-4645-a7ef-b39f1b06e1a4')
BEGIN
UPDATE BPMSecurityUserResource SET ParentRSID = NULL,OrderIndex = 50 WHERE RSID='5199d7f8-6a19-49da-ad7c-784b7d4a8788'
END
GO

--组织管理
if not exists(select * from BPMSecurityUserResource where RSID='78654e0c-fa23-406d-a872-4eb18c59e718')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'78654e0c-fa23-406d-a872-4eb18c59e718',NULL,60,N'组织管理')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'78654e0c-fa23-406d-a872-4eb18c59e718',N'Execute',0,N'模块访问',N'Module',0)
END
GO

--流程运维
if exists(select * from BPMSecurityUserResource where RSID='d2c8e9fc-0697-4345-86a4-160007fd7ec3' AND ParentRSID='997d1aef-d5c1-4645-a7ef-b39f1b06e1a4')
BEGIN
UPDATE BPMSecurityUserResource SET ParentRSID = NULL,OrderIndex = 70 WHERE RSID='d2c8e9fc-0697-4345-86a4-160007fd7ec3'
END
GO

--流程建模
if exists(select * from BPMSecurityUserResource where RSID='d783ae40-f57c-4209-bbc5-bf01ae913854' AND ResourceName=N'管理门户')
BEGIN
UPDATE BPMSecurityUserResource SET ResourceName=N'流程建模', OrderIndex=80 WHERE RSID='d783ae40-f57c-4209-bbc5-bf01ae913854'
END
GO

--流程测试
if exists(select * from BPMSecurityUserResource where RSID='725cdb22-1f96-4535-99ff-6e627cd2bf88' AND ParentRSID='997d1aef-d5c1-4645-a7ef-b39f1b06e1a4')
BEGIN
UPDATE BPMSecurityUserResource SET ParentRSID = 'd783ae40-f57c-4209-bbc5-bf01ae913854',OrderIndex = 50 WHERE RSID='725cdb22-1f96-4535-99ff-6e627cd2bf88'
END
GO

--集成管理
if not exists(select * from BPMSecurityUserResource where RSID='608201db-99f2-4b37-8f58-5e9523375688')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'608201db-99f2-4b37-8f58-5e9523375688',NULL,90,N'集成管理')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'608201db-99f2-4b37-8f58-5e9523375688',N'Execute',0,N'模块访问',N'Module',0)
END
GO

--通用数据源
if exists(select * from BPMSecurityUserResource where RSID='c973ecb4-e90f-477e-bcf3-13dbf59ca5e1' AND ParentRSID='d783ae40-f57c-4209-bbc5-bf01ae913854')
BEGIN
UPDATE BPMSecurityUserResource SET ParentRSID = '608201db-99f2-4b37-8f58-5e9523375688',OrderIndex = 10 WHERE RSID='c973ecb4-e90f-477e-bcf3-13dbf59ca5e1'
END
GO

--ESB
if exists(select * from BPMSecurityUserResource where RSID='bcf56c0a-54ae-489f-8883-4a2f64604e6d' AND ParentRSID='d783ae40-f57c-4209-bbc5-bf01ae913854')
BEGIN
UPDATE BPMSecurityUserResource SET ParentRSID = '608201db-99f2-4b37-8f58-5e9523375688',OrderIndex = 20 WHERE RSID='bcf56c0a-54ae-489f-8883-4a2f64604e6d'
END
GO

--移动管理
if not exists(select * from BPMSecurityUserResource where RSID='cf261f02-3bbe-4ea1-b01b-95c19f850794')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'cf261f02-3bbe-4ea1-b01b-95c19f850794',NULL,100,N'移动管理')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'cf261f02-3bbe-4ea1-b01b-95c19f850794',N'Execute',0,N'模块访问',N'Module',0)
END
GO

--移动表单
if exists(select * from BPMSecurityUserResource where RSID='5fae8abe-272e-4afc-8cad-8b2ab6455ca7' AND ParentRSID='d783ae40-f57c-4209-bbc5-bf01ae913854')
BEGIN
UPDATE BPMSecurityUserResource SET ParentRSID = 'cf261f02-3bbe-4ea1-b01b-95c19f850794',OrderIndex = 10 WHERE RSID='5fae8abe-272e-4afc-8cad-8b2ab6455ca7'
END
GO

--应用管理
if not exists(select * from BPMSecurityUserResource where RSID='0e32f172-b084-40c3-8153-5ecb5436b4e8')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'0e32f172-b084-40c3-8153-5ecb5436b4e8',NULL,110,N'应用管理')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'0e32f172-b084-40c3-8153-5ecb5436b4e8',N'Execute',0,N'模块访问',N'Module',0)
END
GO

--表单服务
if exists(select * from BPMSecurityUserResource where RSID='2c2b5525-62ed-47b2-85a0-583d56876c36' AND ParentRSID='d783ae40-f57c-4209-bbc5-bf01ae913854')
BEGIN
UPDATE BPMSecurityUserResource SET ParentRSID = '0e32f172-b084-40c3-8153-5ecb5436b4e8',OrderIndex = 10 WHERE RSID='2c2b5525-62ed-47b2-85a0-583d56876c36'
END
GO

--访问控制
if exists(select * from BPMSecurityUserResource where RSID='719fdbe8-3172-4078-a33e-199db75b9b40' AND ParentRSID='d783ae40-f57c-4209-bbc5-bf01ae913854')
BEGIN
UPDATE BPMSecurityUserResource SET ParentRSID = '0e32f172-b084-40c3-8153-5ecb5436b4e8',OrderIndex = 10 WHERE RSID='719fdbe8-3172-4078-a33e-199db75b9b40'
END
GO

--流程梳理
if not exists(select * from BPMSecurityUserResource where RSID='c6fe7eb1-971b-4463-bfaf-995bd10c8244')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'c6fe7eb1-971b-4463-bfaf-995bd10c8244',NULL,120,N'流程梳理')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'c6fe7eb1-971b-4463-bfaf-995bd10c8244',N'Execute',0,N'模块访问',N'Module',0)
END
GO

--系统报表
if exists(select * from BPMSecurityUserResource where RSID='5147b758-b363-4ff8-8d27-58b3c1bd1f74')
BEGIN
delete from BPMSecurityUserResource where RSID='5147b758-b363-4ff8-8d27-58b3c1bd1f74'
delete from BPMSecurityUserResourcePerm where RSID='5147b758-b363-4ff8-8d27-58b3c1bd1f74'
END
GO

--YZSysSignal
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZSysSignal]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[YZSysSignal](
	[SignalId] [nvarchar](100) NOT NULL,
	[CreateAt] [datetime] NULL,
	[CreateBy] [nvarchar](50) NULL,
	CONSTRAINT [PK_YZSysSignal] PRIMARY KEY CLUSTERED 
	(
		[SignalId] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
END
GO

/********************************************* 人工催办 *********************************************/
--Mail_ManualRemind_Title
if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_ManualRemind_Title')
INSERT INTO BPMSysSettings VALUES('Mail_ManualRemind_Title',N'[催办][<%=Context.Current.Process.Name%>]<%=Context.Current.LoginUser.ShortName%>:<%=String.IsNullOrEmpty(Context.Current.Comments) ? "请速办理":Context.Current.Comments%>')
GO

--Mail_ManualRemind_Message
if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_ManualRemind_Message')
INSERT INTO BPMSysSettings VALUES('Mail_ManualRemind_Message',
N'业务名：<%=Context.Current.Process.Name%>
提交人：<%=Initiator.UserFriendlyName%>
提交日期：<%=Context.Current.Task.CreateAt.ToString()%>
流水号：<%=Context.Current.Task.SerialNum%>
来自：<%=Context.Current.LoginUser.FriendlyName%>
内容摘要：
<%=Context.Current.Task.Description%>')
GO

--MobilePushNotification_ManualRemind_Message
if not exists (select * from BPMSysSettings WHERE ItemName = 'MobilePushNotification_ManualRemind_Message')
INSERT INTO BPMSysSettings VALUES('MobilePushNotification_ManualRemind_Message',N'[催办][<%=Context.Current.Process.Name%>]<%=Context.Current.LoginUser.ShortName%>:<%=String.IsNullOrEmpty(Context.Current.Comments) ? "请速办理":Context.Current.Comments%>')
GO

--BPMInstRowLock
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[BPMInstRowLock]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[BPMInstRowLock](
	[TableName] [nvarchar](50) NOT NULL,
	[KeyValue] [nvarchar](50) NOT NULL,
	[CreateAt] [datetime] NULL,
	 CONSTRAINT [YZPK_BPMInstRowLock] PRIMARY KEY CLUSTERED 
	(
		[TableName] ASC,
		[KeyValue] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
END
GO

--BPMSysMessagesQueue
if not exists(select * from syscolumns where name = 'Extra' and id = object_id('BPMSysMessagesQueue'))
BEGIN
ALTER TABLE BPMSysMessagesQueue ADD Extra [nvarchar] (200) NULL
END
GO

--BPMSysMessagesSucceed
if not exists(select * from syscolumns where name = 'Extra' and id = object_id('BPMSysMessagesSucceed'))
BEGIN
ALTER TABLE BPMSysMessagesSucceed ADD Extra [nvarchar] (200) NULL
END
GO

--BPMSysMessagesFailed
if not exists(select * from syscolumns where name = 'Extra' and id = object_id('BPMSysMessagesFailed'))
BEGIN
ALTER TABLE BPMSysMessagesFailed ADD Extra [nvarchar] (200) NULL
END
GO

/********************************************* 微信支持直接打开 *********************************************/
if not exists (select * from BPMSysSettings WHERE ItemName = 'WeChat_NewTaskNormal_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_NewTaskNormal_Title'
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_NewTaskNormal_Message'
INSERT INTO BPMSysSettings VALUES('WeChat_NewTaskNormal_Title',N'[新任务]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('WeChat_NewTaskNormal_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'WeChat_Approved_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_Approved_Title'
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_Approved_Message'
INSERT INTO BPMSysSettings VALUES('WeChat_Approved_Title',N'[已核准]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('WeChat_Approved_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'WeChat_Rejected_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_Rejected_Title'
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_Rejected_Message'
INSERT INTO BPMSysSettings VALUES('WeChat_Rejected_Title',N'[已拒绝]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('WeChat_Rejected_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'WeChat_Aborted_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_Aborted_Title'
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_Aborted_Message'
INSERT INTO BPMSysSettings VALUES('WeChat_Aborted_Title',N'[已撤销]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('WeChat_Aborted_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'WeChat_Deleted_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_Deleted_Title'
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_Deleted_Message'
INSERT INTO BPMSysSettings VALUES('WeChat_Deleted_Title',N'[已删除]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('WeChat_Deleted_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'WeChat_StepStopHumanOpt_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_StepStopHumanOpt_Title'
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_StepStopHumanOpt_Message'
INSERT INTO BPMSysSettings VALUES('WeChat_StepStopHumanOpt_Title',N'[已中止]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('WeChat_StepStopHumanOpt_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'WeChat_StepStopVoteFinished_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_StepStopVoteFinished_Title'
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_StepStopVoteFinished_Message'
INSERT INTO BPMSysSettings VALUES('WeChat_StepStopVoteFinished_Title',N'[已中止]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('WeChat_StepStopVoteFinished_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'WeChat_TimeoutNotify_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_TimeoutNotify_Title'
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_TimeoutNotify_Message'
INSERT INTO BPMSysSettings VALUES('WeChat_TimeoutNotify_Title',N'[系统催办]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('WeChat_TimeoutNotify_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'WeChat_RecedeBack_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_RecedeBack_Title'
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_RecedeBack_Message'
INSERT INTO BPMSysSettings VALUES('WeChat_RecedeBack_Title',N'[已退回]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('WeChat_RecedeBack_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'WeChat_IndicateTask_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_IndicateTask_Title'
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_IndicateTask_Message'
INSERT INTO BPMSysSettings VALUES('WeChat_IndicateTask_Title',N'[阅示]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('WeChat_IndicateTask_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'WeChat_InformTask_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_InformTask_Title'
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_InformTask_Message'
INSERT INTO BPMSysSettings VALUES('WeChat_InformTask_Title',N'[知会]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('WeChat_InformTask_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'WeChat_ManualRemind_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_ManualRemind_Title'
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_ManualRemind_Message'
INSERT INTO BPMSysSettings VALUES('WeChat_ManualRemind_Title',N'[催办]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('WeChat_ManualRemind_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>
<%=Context.Current.LoginUser.ShortName%>：<%=String.IsNullOrEmpty(Context.Current.Comments) ? "请速办理":Context.Current.Comments%>')
END
GO

/********************************************* 钉钉支持直接打开 *********************************************/
if not exists (select * from BPMSysSettings WHERE ItemName = 'DingTalk_NewTaskNormal_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_NewTaskNormal_Title'
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_NewTaskNormal_Message'
INSERT INTO BPMSysSettings VALUES('DingTalk_NewTaskNormal_Title',N'[新任务]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('DingTalk_NewTaskNormal_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'DingTalk_Approved_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_Approved_Title'
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_Approved_Message'
INSERT INTO BPMSysSettings VALUES('DingTalk_Approved_Title',N'[已核准]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('DingTalk_Approved_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'DingTalk_Rejected_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_Rejected_Title'
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_Rejected_Message'
INSERT INTO BPMSysSettings VALUES('DingTalk_Rejected_Title',N'[已拒绝]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('DingTalk_Rejected_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'DingTalk_Aborted_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_Aborted_Title'
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_Aborted_Message'
INSERT INTO BPMSysSettings VALUES('DingTalk_Aborted_Title',N'[已撤销]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('DingTalk_Aborted_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'DingTalk_Deleted_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_Deleted_Title'
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_Deleted_Message'
INSERT INTO BPMSysSettings VALUES('DingTalk_Deleted_Title',N'[已删除]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('DingTalk_Deleted_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'DingTalk_StepStopHumanOpt_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_StepStopHumanOpt_Title'
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_StepStopHumanOpt_Message'
INSERT INTO BPMSysSettings VALUES('DingTalk_StepStopHumanOpt_Title',N'[已中止]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('DingTalk_StepStopHumanOpt_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'DingTalk_StepStopVoteFinished_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_StepStopVoteFinished_Title'
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_StepStopVoteFinished_Message'
INSERT INTO BPMSysSettings VALUES('DingTalk_StepStopVoteFinished_Title',N'[已中止]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('DingTalk_StepStopVoteFinished_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'DingTalk_TimeoutNotify_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_TimeoutNotify_Title'
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_TimeoutNotify_Message'
INSERT INTO BPMSysSettings VALUES('DingTalk_TimeoutNotify_Title',N'[系统催办]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('DingTalk_TimeoutNotify_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'DingTalk_RecedeBack_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_RecedeBack_Title'
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_RecedeBack_Message'
INSERT INTO BPMSysSettings VALUES('DingTalk_RecedeBack_Title',N'[已退回]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('DingTalk_RecedeBack_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'DingTalk_IndicateTask_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_IndicateTask_Title'
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_IndicateTask_Message'
INSERT INTO BPMSysSettings VALUES('DingTalk_IndicateTask_Title',N'[阅示]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('DingTalk_IndicateTask_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'DingTalk_InformTask_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_InformTask_Title'
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_InformTask_Message'
INSERT INTO BPMSysSettings VALUES('DingTalk_InformTask_Title',N'[知会]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('DingTalk_InformTask_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>')
END
GO

if not exists (select * from BPMSysSettings WHERE ItemName = 'DingTalk_ManualRemind_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_ManualRemind_Title'
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_ManualRemind_Message'
INSERT INTO BPMSysSettings VALUES('DingTalk_ManualRemind_Title',N'[催办]<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('DingTalk_ManualRemind_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>
<%=Context.Current.LoginUser.ShortName%>：<%=String.IsNullOrEmpty(Context.Current.Comments) ? "请速办理":Context.Current.Comments%>')
END
GO

--移动管理\设备管理
if not exists(select * from BPMSecurityUserResource where RSID='92332b40-bc8c-46f5-b427-d2fc6a12804f')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'92332b40-bc8c-46f5-b427-d2fc6a12804f',N'cf261f02-3bbe-4ea1-b01b-95c19f850794',20,N'设备管理')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'92332b40-bc8c-46f5-b427-d2fc6a12804f',N'Execute',0,N'模块访问',N'Module',0)
INSERT INTO BPMSecurityUserResourceACL(RoleType,RoleParam1,RSID,AllowPermision,Inherited,Inheritable,CreateDate,CreateBy) VALUES('GroupSID',N'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',N'92332b40-bc8c-46f5-b427-d2fc6a12804f','Execute',0,1,getdate(),'sa')
END
GO

--删除表BPMSysMessagesQueue的触发器
if (object_id('YZTR_BPMSysMessagesQueue', 'tr') is not null)
DROP TRIGGER YZTR_BPMSysMessagesQueue
GO

--删除表BPMSysTimeoutQueue的触发器
if (object_id('YZTR_BPMSysTimeoutQueue', 'tr') is not null)
DROP TRIGGER YZTR_BPMSysTimeoutQueue
GO

--删除表YZAppFileConvert触发器
if (object_id('YZTR_YZAppFileConvert', 'tr') is not null)
DROP TRIGGER YZTR_YZAppFileConvert
GO

--YZSysMobileDevice
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZSysMobileDevice]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[YZSysMobileDevice] (
	[Account] [nvarchar](50) NOT NULL,
	[UUID] [nvarchar](50) NOT NULL,
	[Name] [nvarchar](50) NULL,
	[Model] [nvarchar](50) NULL,
	[Description] [nvarchar](100) NULL,
	[RegisterAt] [datetime] NULL,
	[Disabled] [bit] NOT NULL CONSTRAINT [DF_BPMSysMobileDevice_Disabled]  DEFAULT ((0)),
	[LastLogin] [datetime] NULL,
	CONSTRAINT [PK_BPMSysMobileDevice] PRIMARY KEY CLUSTERED 
	(
		[Account] ASC,
		[UUID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
GO

--YZSysMobileDevice
if not exists(select * from syscolumns where name = 'Model' and id = object_id('YZSysMobileDevice'))
BEGIN
EXEC sp_executesql N'
ALTER TABLE YZSysMobileDevice ADD Model [nvarchar] (50) NULL;
ALTER TABLE YZSysMobileDevice ADD RegisterAt [datetime] NULL;
';
EXEC sp_executesql N'
UPDATE YZSysMobileDevice SET RegisterAt=LastLogin,Model=[Name];
';
END
GO

--YZAppFolderFiles
if not exists(select * from syscolumns where name = 'Flag' and id = object_id('YZAppFolderFiles'))
BEGIN
ALTER TABLE YZAppFolderFiles ADD Flag [nvarchar] (50) NULL
END
GO

--YZAppP2PGroup
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZAppP2PGroup]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
	CREATE TABLE [dbo].[YZAppP2PGroup](
	[GroupID] [int] IDENTITY(1,1) NOT NULL,
	[Account1] [nvarchar](50) NOT NULL,
	[Account2] [nvarchar](50) NOT NULL,
	[UserName1] [nvarchar](50) NOT NULL,
	[UserName2] [nvarchar](50) NOT NULL,
	[FolderID] [int] NOT NULL,
	[CreateBy] [nvarchar](50) NOT NULL,
	[CreateAt] [datetime] NOT NULL,
	CONSTRAINT [PK_YZAppP2PGroup] PRIMARY KEY CLUSTERED 
	(
		[GroupID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
END
GO

--YZAppFolderFiles
if not exists(select * from syscolumns where name = 'OrderIndex' and id = object_id('YZAppFolderFiles'))
BEGIN
ALTER TABLE YZAppFolderFiles ADD OrderIndex [int] NULL
END
GO

--YZAppLibrary
if not exists(select * from syscolumns where name = 'OrderIndex' and id = object_id('YZAppLibrary'))
BEGIN
ALTER TABLE YZAppLibrary ADD OrderIndex [int] NULL
END
GO

--BPMSysSettings DBVer
if not exists(select * from BPMSysSettings where ItemName = 'DBVer')
BEGIN
INSERT INTO BPMSysSettings(ItemName,ItemValue) VALUES('DBVer','1000')
END
GO

--BPMSecurityTACL
if not exists(select * from syscolumns where name = 'SIDType' and id = object_id('BPMSecurityTACL'))
BEGIN
ALTER TABLE BPMSecurityTACL ADD SIDType [nvarchar] (30) NULL
END
GO

--YZV_TaskList
declare @DBVer nvarchar(50);
select @DBVer=ItemValue from BPMSysSettings where ItemName = 'DBVer';
if @DBVer < '1001'
BEGIN
DROP VIEW [dbo].[YZV_TaskList]
exec sp_executesql N'
CREATE VIEW YZV_TaskList
WITH SCHEMABINDING
AS
SELECT a.TaskID,a.StepID,b.ProcessName,b.OwnerPositionID,b.OwnerAccount,b.AgentAccount,b.CreateAt,b.Description,a.NodeName,a.ReceiveAt,a.Share,b.State,b.SerialNum,a.TimeoutFirstNotifyDate,a.TimeoutDeadline,a.TimeoutNotifyCount,a.NodePath,a.ExtRecipient,b.ParentTaskID,b.ParentStepID,b.ParentStepName,b.ProcessVersion
FROM dbo.BPMInstProcSteps a INNER JOIN dbo.BPMInstTasks b on a.TaskID=b.TaskID
WHERE a.FinishAt IS NULL AND a.HumanStep=1 AND (a.Share<>1 OR a.ExtRecipient IS NOT NULL) AND (b.State=''Running'' OR (a.NodeName=''sysInform'' AND b.State<>''Deleted'' AND b.State<>''Aborted''))
'
UPDATE BPMSysSettings SET ItemValue='1001' WHERE ItemName='DBVer'
END
GO

/***YZV_TaskList表的索引***/
--YZIX_TaskList
if not exists (select * from dbo.sysindexes where name = 'YZIX_TaskList')
BEGIN
	CREATE UNIQUE CLUSTERED INDEX [YZIX_TaskList] ON [dbo].[YZV_TaskList] 
	(
		[ExtRecipient] ASC,
		[StepID] ASC
	) ON [PRIMARY]
END
GO

--Mail_NoParticipantException_Title
if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_NoParticipantException_Title')
INSERT INTO BPMSysSettings VALUES('Mail_NoParticipantException_Title',N'[工作流][无处理人异常]<%=Initiator.UserInfo.ShortName%>的<%=Context.Current.Process.Name%>（<%=Context.Current.Task.SerialNum%>）')
GO

--Mail_NoParticipantException_Message
if not exists (select * from BPMSysSettings WHERE ItemName = 'Mail_NoParticipantException_Message')
INSERT INTO BPMSysSettings VALUES('Mail_NoParticipantException_Message',
N'业务名：<%=Context.Current.Process.Name%>
提交人：<%=Initiator.UserInfo.ShortName%>
提交日期：<%=Context.Current.Task.CreateAt.ToString()%>
流水号：<%=Context.Current.Task.SerialNum%>
来自：<%=Context.Current.LoginUser.FriendlyName%>
异常关卡：<%=Context.Current.Step.NodeName%>
内容摘要：
<%=Context.Current.Task.Description%>')
GO

--MobilePushNotification_NoParticipantException_Message
if not exists (select * from BPMSysSettings WHERE ItemName = 'MobilePushNotification_NoParticipantException_Message')
INSERT INTO BPMSysSettings VALUES('MobilePushNotification_NoParticipantException_Message',N'[工作流][无处理人异常]<%=Initiator.UserInfo.ShortName%>的<%=Context.Current.Process.Name%>（<%=Context.Current.Task.SerialNum%>）')
GO

--WeChat_NoParticipantException_Title
if not exists (select * from BPMSysSettings WHERE ItemName = 'WeChat_NoParticipantException_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_NoParticipantException_Title'
DELETE FROM BPMSysSettings WHERE ItemName='WeChat_NoParticipantException_Message'
INSERT INTO BPMSysSettings VALUES('WeChat_NoParticipantException_Title',N'[工作流][无处理人异常]<%=Initiator.UserInfo.ShortName%>的<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('WeChat_NoParticipantException_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>
异常关卡：<%=Context.Current.Step.NodeName%>')
END
GO

--DingTalk_NoParticipantException_Title
if not exists (select * from BPMSysSettings WHERE ItemName = 'DingTalk_NoParticipantException_Title')
BEGIN
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_NoParticipantException_Title'
DELETE FROM BPMSysSettings WHERE ItemName='DingTalk_NoParticipantException_Message'
INSERT INTO BPMSysSettings VALUES('DingTalk_NoParticipantException_Title',N'[工作流][无处理人异常]<%=Initiator.UserInfo.ShortName%>的<%=Context.Current.Process.Name%>')
INSERT INTO BPMSysSettings VALUES('DingTalk_NoParticipantException_Message',N'
<%=Context.Current.Task.Description%>
流水号：<%=Context.Current.Task.SerialNum%>
发起于：<%=Context.Current.Task.CreateAt.ToString("yyyy-MM-dd HH:mm")%>，<%=Initiator.UserInfo.ShortName%>
异常关卡：<%=Context.Current.Step.NodeName%>')
END
GO

/********************************************* 6.0 *********************************************/

--YZSysFavorites
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZSysFavorites]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
	CREATE TABLE [dbo].YZSysFavorites(
	[uid] [nvarchar](50) NOT NULL,
	[resType] [nvarchar](50) NOT NULL,
	[resID] [nvarchar](300) NOT NULL,
	[date] [datetime] NULL,
	[comments] [nvarchar](200) NULL,
	[orderIndex] [int] NULL
) ON [PRIMARY]
END
GO

--YZIX_YZSysFavorites
if not exists (select * from dbo.sysindexes where name = 'YZIX_YZSysFavorites')
BEGIN
	CREATE CLUSTERED INDEX [YZIX_YZSysFavorites] ON [dbo].[YZSysFavorites] 
	(
		[uid] ASC,
		[resType] ASC,
		[resID] ASC
	) ON [PRIMARY]
END
GO

--权限菜单
declare @DBVer nvarchar(50);
select @DBVer=ItemValue from BPMSysSettings where ItemName = 'DBVer';
if @DBVer < '1002'
BEGIN

--流程门户
UPDATE BPMSecurityUserResource SET ResourceName = N'流程门户',OrderIndex = 10,ParentRSID=NULL WHERE RSID='997d1aef-d5c1-4645-a7ef-b39f1b06e1a4'
--协同门户
if not exists(select * from BPMSecurityUserResource where RSID='fe0f4277-6d34-4df2-aa21-7b913aed208d')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'fe0f4277-6d34-4df2-aa21-7b913aed208d',NULL,20,N'协同门户')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'fe0f4277-6d34-4df2-aa21-7b913aed208d',N'Execute',0,N'模块访问',N'Module',0)
END
--业务门户
UPDATE BPMSecurityUserResource SET ResourceName = N'业务门户',OrderIndex = 30,ParentRSID=NULL WHERE RSID='49f6f78b-8706-4ac3-a8de-b3ce0188f08b'
--运维门户
if not exists(select * from BPMSecurityUserResource where RSID='71e3df38-475f-40fc-b0a1-9ad23494a7f5')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'71e3df38-475f-40fc-b0a1-9ad23494a7f5',NULL,40,N'运维门户')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'71e3df38-475f-40fc-b0a1-9ad23494a7f5',N'Execute',0,N'模块访问',N'Module',0)
END
--后台管理
if not exists(select * from BPMSecurityUserResource where RSID='bd4a0c6f-f717-4879-bddb-c52b5cd051bc')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'bd4a0c6f-f717-4879-bddb-c52b5cd051bc',NULL,50,N'后台管理')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'bd4a0c6f-f717-4879-bddb-c52b5cd051bc',N'Execute',0,N'模块访问',N'Module',0)
END
--流程梳理
UPDATE BPMSecurityUserResource SET ResourceName = N'流程梳理',OrderIndex = 60,ParentRSID=NULL WHERE RSID='c6fe7eb1-971b-4463-bfaf-995bd10c8244'
--开发学习
if not exists(select * from BPMSecurityUserResource where RSID='cc0d778c-23be-4dfd-b1cb-d88433e0116a')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'cc0d778c-23be-4dfd-b1cb-d88433e0116a',NULL,60,N'开发学习')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'cc0d778c-23be-4dfd-b1cb-d88433e0116a',N'Execute',0,N'模块访问',N'Module',0)
END

--流程门户
UPDATE BPMSecurityUserResource SET ResourceName = N'流程',OrderIndex = 10,ParentRSID='997d1aef-d5c1-4645-a7ef-b39f1b06e1a4' WHERE RSID='e52e8214-6e6e-4132-9873-d33a54eb977d'
UPDATE BPMSecurityUserResource SET ResourceName = N'报表',OrderIndex = 20,ParentRSID='997d1aef-d5c1-4645-a7ef-b39f1b06e1a4' WHERE RSID='5199d7f8-6a19-49da-ad7c-784b7d4a8788'
UPDATE BPMSecurityUserResource SET ResourceName = N'BPA',OrderIndex = 30,ParentRSID='997d1aef-d5c1-4645-a7ef-b39f1b06e1a4' WHERE RSID='5fa20260-5340-4398-bee0-5415c98a3155'
UPDATE BPMSecurityUserResource SET ResourceName = N'个人',OrderIndex = 40,ParentRSID='997d1aef-d5c1-4645-a7ef-b39f1b06e1a4' WHERE RSID='e98e2489-6cf5-4d13-a309-596ee252d013'

--业务门户
UPDATE BPMSecurityUserResource SET ResourceName = N'商机管理',OrderIndex = 10,ParentRSID='49f6f78b-8706-4ac3-a8de-b3ce0188f08b' WHERE RSID='5a430101-5ee1-47c0-bec2-4e60944cf333'
delete from BPMSecurityUserResource where RSID = 'd127e087-f1f8-4650-80a6-b8468821330e'

--运维门户
UPDATE BPMSecurityUserResource SET ResourceName = N'运维',OrderIndex = 10,ParentRSID='71e3df38-475f-40fc-b0a1-9ad23494a7f5' WHERE RSID='d2c8e9fc-0697-4345-86a4-160007fd7ec3'
UPDATE BPMSecurityUserResource SET ResourceName = N'组织',OrderIndex = 20,ParentRSID='71e3df38-475f-40fc-b0a1-9ad23494a7f5' WHERE RSID='78654e0c-fa23-406d-a872-4eb18c59e718'
UPDATE BPMSecurityUserResource SET ResourceName = N'权限',OrderIndex = 30,ParentRSID='71e3df38-475f-40fc-b0a1-9ad23494a7f5' WHERE RSID='1439c8f5-e410-4262-b69b-6402bf86a79b'
UPDATE BPMSecurityUserResource SET ResourceName = N'监控',OrderIndex = 40,ParentRSID='71e3df38-475f-40fc-b0a1-9ad23494a7f5' WHERE RSID='afb5a2b3-85f2-4105-8df7-21b4586f4f29'
delete from BPMSecurityUserResource where RSID = 'ae77e96c-7d5f-4332-b9ad-1b90ada27118'

--后台管理
UPDATE BPMSecurityUserResource SET ResourceName = N'流程建模',OrderIndex = 10,ParentRSID='bd4a0c6f-f717-4879-bddb-c52b5cd051bc' WHERE RSID='d783ae40-f57c-4209-bbc5-bf01ae913854'
UPDATE BPMSecurityUserResource SET ResourceName = N'集成管理',OrderIndex = 20,ParentRSID='bd4a0c6f-f717-4879-bddb-c52b5cd051bc' WHERE RSID='608201db-99f2-4b37-8f58-5e9523375688'
UPDATE BPMSecurityUserResource SET ResourceName = N'移动管理',OrderIndex = 30,ParentRSID='bd4a0c6f-f717-4879-bddb-c52b5cd051bc' WHERE RSID='cf261f02-3bbe-4ea1-b01b-95c19f850794'
UPDATE BPMSecurityUserResource SET ResourceName = N'应用管理',OrderIndex = 40,ParentRSID='bd4a0c6f-f717-4879-bddb-c52b5cd051bc' WHERE RSID='0e32f172-b084-40c3-8153-5ecb5436b4e8'
UPDATE BPMSecurityUserResource SET ResourceName = N'报表定制',OrderIndex = 50,ParentRSID='bd4a0c6f-f717-4879-bddb-c52b5cd051bc' WHERE RSID='25a9de61-fc9f-45df-8d99-2f8279b5a1e6'
UPDATE BPMSecurityUserResource SET ResourceName = N'访问控制',OrderIndex = 60,ParentRSID='bd4a0c6f-f717-4879-bddb-c52b5cd051bc' WHERE RSID='719fdbe8-3172-4078-a33e-199db75b9b40'
UPDATE BPMSecurityUserResource SET ResourceName = N'系统管理',OrderIndex = 70,ParentRSID='bd4a0c6f-f717-4879-bddb-c52b5cd051bc' WHERE RSID='d2871cb2-415b-40cb-9ed8-7dcb8d8c9283'

--后台管理/流程建模
UPDATE BPMSecurityUserResource SET ResourceName = N'公司组织',OrderIndex = 10,ParentRSID='d783ae40-f57c-4209-bbc5-bf01ae913854' WHERE RSID='2694420f-a074-446c-bdf3-72dae1920298'
UPDATE BPMSecurityUserResource SET ResourceName = N'流程库',OrderIndex = 20,ParentRSID='d783ae40-f57c-4209-bbc5-bf01ae913854' WHERE RSID='7631a828-55f0-439b-8acf-551d0ce3dfce'
UPDATE BPMSecurityUserResource SET ResourceName = N'表单库',OrderIndex = 30,ParentRSID='d783ae40-f57c-4209-bbc5-bf01ae913854' WHERE RSID='afea2fa9-de8e-438c-b784-839bdcd32139'
UPDATE BPMSecurityUserResource SET ResourceName = N'工作日历',OrderIndex = 40,ParentRSID='d783ae40-f57c-4209-bbc5-bf01ae913854' WHERE RSID='ac73842c-163f-4a9a-b862-2ee2eb7dc0e2'
UPDATE BPMSecurityUserResource SET ResourceName = N'流程测试',OrderIndex = 50,ParentRSID='d783ae40-f57c-4209-bbc5-bf01ae913854' WHERE RSID='725cdb22-1f96-4535-99ff-6e627cd2bf88'

--后台管理/集成管理
UPDATE BPMSecurityUserResource SET ResourceName = N'通用数据源',OrderIndex = 10,ParentRSID='608201db-99f2-4b37-8f58-5e9523375688' WHERE RSID='c973ecb4-e90f-477e-bcf3-13dbf59ca5e1'
UPDATE BPMSecurityUserResource SET ResourceName = N'ESB',OrderIndex = 20,ParentRSID='608201db-99f2-4b37-8f58-5e9523375688' WHERE RSID='bcf56c0a-54ae-489f-8883-4a2f64604e6d'

--后台管理/移动管理
UPDATE BPMSecurityUserResource SET ResourceName = N'移动设备',OrderIndex = 10,ParentRSID='cf261f02-3bbe-4ea1-b01b-95c19f850794' WHERE RSID='92332b40-bc8c-46f5-b427-d2fc6a12804f'
delete from BPMSecurityUserResource where RSID = '5fae8abe-272e-4afc-8cad-8b2ab6455ca7'

--后台管理/应用管理
UPDATE BPMSecurityUserResource SET ResourceName = N'表单服务',OrderIndex = 10,ParentRSID='0e32f172-b084-40c3-8153-5ecb5436b4e8' WHERE RSID='2c2b5525-62ed-47b2-85a0-583d56876c36'

--后台管理/系统管理
UPDATE BPMSecurityUserResource SET ResourceName = N'安全组',OrderIndex = 10,ParentRSID='d2871cb2-415b-40cb-9ed8-7dcb8d8c9283' WHERE RSID='3a0c58ec-f240-4584-9024-1470156a9a7c'
delete from BPMSecurityUserResource where RSID = 'e9570a9d-5362-4d58-99d8-2bd7c5685c5c'

--开发学习
UPDATE BPMSecurityUserResource SET ResourceName = N'设备管理',OrderIndex = 10,ParentRSID='cc0d778c-23be-4dfd-b1cb-d88433e0116a' WHERE RSID='d0ebfcf9-0007-44b3-b218-ef94628de67e'

UPDATE BPMSysSettings SET ItemValue='1002' WHERE ItemName='DBVer'
END
GO

--BPMSysUserCommonInfo
if not exists(select * from syscolumns where name = 'DefaultPositionId' and id = object_id('BPMSysUserCommonInfo'))
BEGIN
ALTER TABLE BPMSysUserCommonInfo ADD DefaultPositionId [int] NULL;
END
GO

/********************************************* 6.7 *********************************************/

--BPMInstQueue
if not exists (select * from dbo.sysobjects where id = object_id(N'BPMInstQueue') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE BPMInstQueue(
	[MessageID] [int] IDENTITY(1,1) NOT NULL,
	[Server] [nvarchar](30) NOT NULL,
	[QueueName] [nvarchar](30) NOT NULL,
	[HandlerType] [nvarchar](100) NULL,
	[HandlerMethod] [nvarchar](500) NULL,
	[Params] [ntext] NULL,
	[CreateAt] [datetime] NOT NULL,
	[ProcessSchedule] [datetime] NULL,
	[FailCount] [int] NULL,
	[ErrorMessage] [ntext] NULL,
	[LastFailAt] [datetime] NULL,
	CONSTRAINT [PK_BPMInstQueue] PRIMARY KEY CLUSTERED 
	(
		[MessageID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
END
GO

--BPMInstQueueSucceed
if not exists (select * from dbo.sysobjects where id = object_id(N'BPMInstQueueSucceed') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE BPMInstQueueSucceed(
	[MessageID] [int] NOT NULL,
	[Server] [nvarchar](30) NOT NULL,
	[QueueName] [nvarchar](30) NOT NULL,
	[HandlerType] [nvarchar](100) NULL,
	[HandlerMethod] [nvarchar](500) NULL,
	[Params] [ntext] NULL,
	[CreateAt] [datetime] NOT NULL,
	[ProcessedAt] [datetime] NOT NULL,
	[FailCount] [int] NULL,
	[ErrorMessage] [ntext] NULL,
	[LastFailAt] [datetime] NULL,
	[Ticks] [int] NULL,
	[ExtDate] AS DATEADD(dd, 0, DATEDIFF(dd, 0, CreateAt)) PERSISTED,
	CONSTRAINT [PK_BPMInstQueueSucceed] PRIMARY KEY CLUSTERED 
	(
		[MessageID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
END
GO

--YZIX_BPMInstQueueSucceed_ExtDate
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstQueueSucceed_ExtDate')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMInstQueueSucceed_ExtDate] ON BPMInstQueueSucceed 
	(
		[ExtDate] DESC
	) ON [PRIMARY]
END
GO

--BPMInstQueueFailed
if not exists (select * from dbo.sysobjects where id = object_id(N'BPMInstQueueFailed') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE BPMInstQueueFailed(
	[MessageID] [int] NOT NULL,
	[Server] [nvarchar](30) NOT NULL,
	[QueueName] [nvarchar](30) NOT NULL,
	[HandlerType] [nvarchar](100) NULL,
	[HandlerMethod] [nvarchar](500) NULL,
	[Params] [ntext] NULL,
	[CreateAt] [datetime] NOT NULL,
	[RemoveAt] [datetime] NOT NULL,
	[FailCount] [int] NULL,
	[ErrorMessage] [ntext] NULL,
	[LastFailAt] [datetime] NULL,
	[ExtDate] AS DATEADD(dd, 0, DATEDIFF(dd, 0, CreateAt)) PERSISTED,
	CONSTRAINT [PK_BPMInstQueueFailed] PRIMARY KEY CLUSTERED 
	(
		[MessageID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
END
GO

--YZIX_BPMInstQueueFailed_ExtDate
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstQueueFailed_ExtDate')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMInstQueueFailed_ExtDate] ON BPMInstQueueFailed 
	(
		[ExtDate] DESC
	) ON [PRIMARY]
END
GO

--BPMInstESBTask
if not exists (select * from dbo.sysobjects where id = object_id(N'BPMInstESBTask') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE BPMInstESBTask(
	[TaskID] [int] IDENTITY(1,1) NOT NULL,
	[FlowName] [nvarchar](50) NOT NULL,
	[CreateBy] [nvarchar](50) NOT NULL,
	[CreateAt] [datetime] NOT NULL,
	[Status] [nvarchar](20) NOT NULL,
	[FinishedAt] [datetime] NULL,
	[Request] [ntext] NULL,
	[Variables] [ntext] NULL,
	[Stack] [ntext] NULL,
	[Response] [ntext] NULL,
	[ExtInfo] [nvarchar](200) NULL,
	[AsyncCall] [bit] NOT NULL,
	[Callback] [nvarchar](200) NULL,
	[Params] [nvarchar](500) NULL,
	[ExtDate] AS DATEADD(dd, 0, DATEDIFF(dd, 0, CreateAt)) PERSISTED,
	CONSTRAINT [PK_BPMInstESBTask] PRIMARY KEY CLUSTERED 
	(
		[TaskID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
END
GO

--YZIX_BPMInstESBTask_ExtDate
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstESBTask_ExtDate')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMInstESBTask_ExtDate] ON BPMInstESBTask 
	(
		[ExtDate] DESC
	) ON [PRIMARY]
END
GO

--YZIX_BPMInstESBTask_Status
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstESBTask_Status')
BEGIN
	CREATE NONCLUSTERED INDEX [YZIX_BPMInstESBTask_Status] ON BPMInstESBTask 
	(
		[Status] ASC
	)
	INCLUDE ([AsyncCall]) ON [PRIMARY]
END
GO

--BPMInstESBStep
if not exists (select * from dbo.sysobjects where id = object_id(N'BPMInstESBStep') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE BPMInstESBStep(
	[TaskID] [int] NOT NULL,
	[StepID] [int] IDENTITY(1,1) NOT NULL,
	[NodeName] [nvarchar](50) NOT NULL,
	[CreateAt] [datetime] NULL,
	[Status] [nvarchar](20) NULL,
	[FinishedAt] [datetime] NULL,
	[Input] [ntext] NULL,
	[RuntimeInfo] [ntext] NULL,
	[Output] [ntext] NULL,
	[ErrorMessage] [ntext] NULL,
	[Ticks] [int] NULL,
	[ExtDate] AS DATEADD(dd, 0, DATEDIFF(dd, 0, CreateAt)) PERSISTED,
	CONSTRAINT [PK_BPMInstESBStep] PRIMARY KEY CLUSTERED 
	(
		[StepID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
END
GO

--YZIX_BPMInstESBStep_TaskID
if not exists (select * from dbo.sysindexes where name = 'YZIX_BPMInstESBStep_TaskID')
BEGIN
	CREATE NONCLUSTERED INDEX YZIX_BPMInstESBStep_TaskID ON BPMInstESBStep 
	(
		[TaskID] ASC
	) ON [PRIMARY]
END
GO

--权限菜单
declare @DBVer nvarchar(50);
select @DBVer=ItemValue from BPMSysSettings where ItemName = 'DBVer';
if @DBVer < '1003'
BEGIN

--ESB服务
UPDATE BPMSecurityUserResource SET ResourceName = N'ESB服务',OrderIndex = 20, ParentRSID='608201db-99f2-4b37-8f58-5e9523375688' WHERE RSID='bcf56c0a-54ae-489f-8883-4a2f64604e6d'

--ESB输出实例
if not exists(select * from BPMSecurityUserResource where RSID='66de72f24-1ac1-4e18-b2be-d66c31e306d1')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'66de72f24-1ac1-4e18-b2be-d66c31e306d1',N'608201db-99f2-4b37-8f58-5e9523375688',30,N'ESB输出实例')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'66de72f24-1ac1-4e18-b2be-d66c31e306d1',N'Execute',0,N'模块访问',N'Module',0)
END

--队列管理
if not exists(select * from BPMSecurityUserResource where RSID='39cc53b3-e6ca-4223-ae87-e4e2493c6cd3')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'39cc53b3-e6ca-4223-ae87-e4e2493c6cd3',N'608201db-99f2-4b37-8f58-5e9523375688',40,N'队列管理')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'39cc53b3-e6ca-4223-ae87-e4e2493c6cd3',N'Execute',0,N'模块访问',N'Module',0)
END

--连接管理
if not exists(select * from BPMSecurityUserResource where RSID='7c2cba80-09be-4cb2-8fd6-68f558373d4b')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'7c2cba80-09be-4cb2-8fd6-68f558373d4b',N'bcf56c0a-54ae-489f-8883-4a2f64604e6d',10,N'连接管理')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'7c2cba80-09be-4cb2-8fd6-68f558373d4b',N'Execute',0,N'模块访问',N'Module',0)
END

--业务输出
if not exists(select * from BPMSecurityUserResource where RSID='404efe9c-7324-4826-b760-d53b82eb1b31')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'404efe9c-7324-4826-b760-d53b82eb1b31',N'bcf56c0a-54ae-489f-8883-4a2f64604e6d',20,N'业务输出')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'404efe9c-7324-4826-b760-d53b82eb1b31',N'Execute',0,N'模块访问',N'Module',0)
END

--ESB数据源
if not exists(select * from BPMSecurityUserResource where RSID='4bd178a9-b12a-4e10-ab31-8156998a74c3')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'4bd178a9-b12a-4e10-ab31-8156998a74c3',N'bcf56c0a-54ae-489f-8883-4a2f64604e6d',30,N'ESB数据源')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'4bd178a9-b12a-4e10-ab31-8156998a74c3',N'Execute',0,N'模块访问',N'Module',0)
END

--ESB连接(旧)
if not exists(select * from BPMSecurityUserResource where RSID='50c97f45-16f7-4968-a7cb-11a73f3e3da6')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'50c97f45-16f7-4968-a7cb-11a73f3e3da6',N'bcf56c0a-54ae-489f-8883-4a2f64604e6d',40,N'ESB连接(旧)')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'50c97f45-16f7-4968-a7cb-11a73f3e3da6',N'Execute',0,N'模块访问',N'Module',0)
END

--数据源(旧)
if not exists(select * from BPMSecurityUserResource where RSID='b0946542-4e02-4937-83c3-a9c91da734c5')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'b0946542-4e02-4937-83c3-a9c91da734c5',N'bcf56c0a-54ae-489f-8883-4a2f64604e6d',50,N'数据源(旧)')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'b0946542-4e02-4937-83c3-a9c91da734c5',N'Execute',0,N'模块访问',N'Module',0)
END

--异常实例
if not exists(select * from BPMSecurityUserResource where RSID='06ea7109-6f40-4e24-85ad-f19eb4df93d8')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'06ea7109-6f40-4e24-85ad-f19eb4df93d8',N'66de72f24-1ac1-4e18-b2be-d66c31e306d1',10,N'异常实例')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'06ea7109-6f40-4e24-85ad-f19eb4df93d8',N'Execute',0,N'模块访问',N'Module',0)
END

--输出日志
if not exists(select * from BPMSecurityUserResource where RSID='ab03aa90-9df8-419f-84c5-f5d63dfad8d4')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'ab03aa90-9df8-419f-84c5-f5d63dfad8d4',N'66de72f24-1ac1-4e18-b2be-d66c31e306d1',20,N'输出日志')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'ab03aa90-9df8-419f-84c5-f5d63dfad8d4',N'Execute',0,N'模块访问',N'Module',0)
END

--正在处理
if not exists(select * from BPMSecurityUserResource where RSID='a0f97c2c-84e2-4f98-a5ac-7908466ff9f5')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'a0f97c2c-84e2-4f98-a5ac-7908466ff9f5',N'39cc53b3-e6ca-4223-ae87-e4e2493c6cd3',10,N'正在处理')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'a0f97c2c-84e2-4f98-a5ac-7908466ff9f5',N'Execute',0,N'模块访问',N'Module',0)
END

--成功日志
if not exists(select * from BPMSecurityUserResource where RSID='f3272385-6e98-42da-a2d5-96e1574bc35c')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'f3272385-6e98-42da-a2d5-96e1574bc35c',N'39cc53b3-e6ca-4223-ae87-e4e2493c6cd3',20,N'成功日志')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'f3272385-6e98-42da-a2d5-96e1574bc35c',N'Execute',0,N'模块访问',N'Module',0)
END

--失败日志
if not exists(select * from BPMSecurityUserResource where RSID='62034d66-b0b2-48ae-abbf-94c012fa9ced')
BEGIN
INSERT INTO BPMSecurityUserResource(RSID,ParentRSID,OrderIndex,ResourceName) VALUES(N'62034d66-b0b2-48ae-abbf-94c012fa9ced',N'39cc53b3-e6ca-4223-ae87-e4e2493c6cd3',30,N'失败日志')
INSERT INTO BPMSecurityUserResourcePerm(RSID,PermName,OrderIndex,PermDisplayName,PermType,LeadershipTokenEnabled) VALUES(N'62034d66-b0b2-48ae-abbf-94c012fa9ced',N'Execute',0,N'模块访问',N'Module',0)
END

UPDATE BPMSysSettings SET ItemValue='1003' WHERE ItemName='DBVer'
END
GO