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

namespace YZSoft.Web.DAL
{
    partial class SqlServerProvider
    {
        public IDataReader GetProcessAnalysisTrend(IDbConnection cn, int year, BPMObjectNameCollection include, BPMObjectNameCollection exclude)
        {
            //Command
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = cn as SqlConnection;

            //in过滤
            string extFilter = this.GetFilter(cmd, "ProcessName", include, exclude);
            if (!String.IsNullOrEmpty(extFilter))
                extFilter = " AND " + extFilter;

            //查询语句
            cmd.CommandText =
@"
--DECLARE @ExtYear int;
--DECLARE @ProcessName nvarchar(50);
--SELECT @ExtYear=2015;

WITH A AS(
	SELECT Month(CreateAt) [Month],ProcessName,State,DATEDIFF(mi,CreateAt,FinishAt) Minutes FROM BPMInstTasks WHERE ExtYear=@ExtYear" + extFilter + @"
),
AA AS(
	SELECT State,[Month],Count(*) Counts,avg(Minutes) AvgMinutes FROM A GROUP BY State,[Month]
),
B AS(
	SELECT [Month],
	max(case when State='Approved' then Counts else 0 end) Approved,
	max(case when State='Rejected' then Counts else 0 end) Rejected,
	max(case when State='Running' then Counts else 0 end) Running,
	max(case when State='Aborted' then Counts else 0 end) Aborted,
	max(case when State='Deleted' then Counts else 0 end) Deleted,
	ISNULL(sum(Counts),0) Total,
	max(case when State='Approved' then AvgMinutes else 0 end) AvgMinutes
	FROM AA GROUP BY [Month]
),
C AS(
	SELECT number [Month] FROM MASTER..spt_values WHERE type='P' and number between 1 and 12
),
D AS(
	SELECT C.[Month],
	ISNULL(B.Approved,0) Approved,
	ISNULL(B.Rejected,0) Rejected,
	ISNULL(B.Running,0) Running,
	ISNULL(B.Aborted,0) Aborted,
	ISNULL(B.Deleted,0) Deleted,
	ISNULL(B.Total,0) Total,
	ISNULL(B.AvgMinutes,0) AvgMinutes
	FROM C LEFT JOIN B ON C.[Month]=B.[Month]
)
SELECT * FROM D ORDER BY [Month]
";

            cmd.Parameters.Add("@ExtYear", SqlDbType.Int).Value = year;
            return cmd.ExecuteReader();
        }

        public IDataReader GetProcessAnalysisTrend(IDbConnection cn, int year, int month, BPMObjectNameCollection include, BPMObjectNameCollection exclude)
        {
            //Command
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = cn as SqlConnection;

            //in过滤
            string extFilter = this.GetFilter(cmd, "ProcessName", include, exclude);
            if (!String.IsNullOrEmpty(extFilter))
                extFilter = " AND " + extFilter;

            //查询语句
            cmd.CommandText =
@"
--DECLARE @ExtYear int;
--DECLARE @Month int;
--DECLARE @ProcessName nvarchar(50)
--SELECT @ExtYear=2015;
--SELECT @Month=8;
--SELECT @ProcessName='A'
--*****获得一个月中的天数

DECLARE @MonthDays int;
SELECT @MonthDays=DAY(DATEADD(DAY, -1, DATEADD(m, ((@ExtYear - 1900) * 12) + @Month, 0)));

WITH A AS(
	SELECT DAY(CreateAt) [DAY],ProcessName,State,DATEDIFF(mi,CreateAt,FinishAt) Minutes FROM BPMInstTasks WHERE ExtYear=@ExtYear AND MONTH(CreateAt)=@Month" + extFilter + @"
),
AA AS(
	SELECT State,[DAY],Count(*) Counts,avg(Minutes) AvgMinutes FROM A GROUP BY State,[DAY]
),
B AS(
	SELECT [DAY],
	max(case when State='Approved' then Counts else 0 end) Approved,
	max(case when State='Rejected' then Counts else 0 end) Rejected,
	max(case when State='Running' then Counts else 0 end) Running,
	max(case when State='Aborted' then Counts else 0 end) Aborted,
	max(case when State='Deleted' then Counts else 0 end) Deleted,
	ISNULL(sum(Counts),0) Total,
	max(case when State='Approved' then AvgMinutes else 0 end) AvgMinutes
	FROM AA GROUP BY [DAY]
),
C AS(
	SELECT number [DAY] FROM MASTER..spt_values WHERE type='P' and number between 1 and @MonthDays
),
D AS(
	SELECT C.[DAY],
	ISNULL(B.Approved,0) Approved,
	ISNULL(B.Rejected,0) Rejected,
	ISNULL(B.Running,0) Running,
	ISNULL(B.Aborted,0) Aborted,
	ISNULL(B.Deleted,0) Deleted,
	ISNULL(B.Total,0) Total,
	ISNULL(B.AvgMinutes,0) AvgMinutes
	FROM C LEFT JOIN B ON C.[DAY]=B.[DAY]
)
SELECT * FROM D ORDER BY [DAY]
";

            cmd.Parameters.Add("@ExtYear", SqlDbType.Int).Value = year;
            cmd.Parameters.Add("@Month", SqlDbType.Int).Value = month + 1;

            return cmd.ExecuteReader();
        }

        public IDataReader GetProcessUsage(IDbConnection cn, int year, int month)
        {
            //Command
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = cn as SqlConnection;

            //查询语句
            cmd.CommandText =
@"
--DECLARE @ExtYear int;
--DECLARE @Month int;
--SELECT @ExtYear=2015;
----SELECT @Month=2;

WITH A AS(
	SELECT ProcessName,Count(*) Counts FROM BPMInstTasks WHERE ExtYear=@ExtYear AND (@Month IS NULL OR MONTH(CreateAt)=@Month) GROUP BY ProcessName
),
B AS(
	SELECT sum(Counts) Total FROM A
),
C AS(
	SELECT A.*,B.Total,A.Counts*10000/B.Total Per FROM A,B
)
SELECT * FROM C ORDER BY Counts DESC
";

            cmd.Parameters.Add("@ExtYear", SqlDbType.Int).Value = year;

            if (month == -1)
                cmd.Parameters.Add("@Month", SqlDbType.Int).Value = DBNull.Value;
            else
                cmd.Parameters.Add("@Month", SqlDbType.Int).Value = month + 1;

            return cmd.ExecuteReader();
        }

        public IDataReader GetProcessUsageKPI(IDbConnection cn, int year, int month, BPMObjectNameCollection include, BPMObjectNameCollection exclude)
        {
            //Command
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = cn as SqlConnection;

            //in过滤
            string extFilter = this.GetFilter(cmd, "ProcessName", include, exclude);
            if (!String.IsNullOrEmpty(extFilter))
                extFilter = " AND " + extFilter;

            //查询语句
            cmd.CommandText =
@"
--DECLARE @ExtYear int;
--DECLARE @Month int;
--SELECT @ExtYear=2015;
----SELECT @Month=2;

WITH A AS(
	SELECT ProcessName,State FROM BPMInstTasks WHERE ExtYear=@ExtYear AND (@Month IS NULL OR MONTH(CreateAt)=@Month)" + extFilter + @"
),
B AS
(
	SELECT @ExtYear ExtYear,State,Count(*) Counts FROM A GROUP BY State
),
C AS(
	SELECT ExtYear,
	max(case when State='Approved' then Counts else 0 end) Approved,
	max(case when State='Rejected' then Counts else 0 end) Rejected,
	max(case when State='Running' then Counts else 0 end) Running,
	max(case when State='Aborted' then Counts else 0 end) Aborted,
	max(case when State='Deleted' then Counts else 0 end) Deleted,
	ISNULL(sum(Counts),0) Total
	FROM B GROUP BY ExtYear
),
D AS(
	SELECT ISNULL(count(DISTINCT ProcessName),0) ProcessCount FROM A
)
SELECT C.*,D.* FROM C,D
";

            cmd.Parameters.Add("@ExtYear", SqlDbType.Int).Value = year;

            if (month == -1)
                cmd.Parameters.Add("@Month", SqlDbType.Int).Value = DBNull.Value;
            else
                cmd.Parameters.Add("@Month", SqlDbType.Int).Value = month + 1;

            return cmd.ExecuteReader();
        }

        public IDataReader GetProcessPerformanceByProcess(IDbConnection cn, int year, int month, string orderBy)
        {
            //Command
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = cn as SqlConnection;

            //查询语句
            cmd.CommandText =
@"
--DECLARE @ExtYear int;
--DECLARE @Month int;
--SELECT @ExtYear=2015;
----SELECT @Month=8;

WITH A AS(
	SELECT ProcessName,DATEDIFF(mi,CreateAt,FinishAt) Minutes FROM BPMInstTasks WHERE ExtYear=@ExtYear AND (@Month IS NULL OR MONTH(CreateAt)=@Month) AND State='Approved'
),
B AS(
	SELECT ProcessName,Count(*) Counts,sum(cast(Minutes as bigint)) SumMinutes,avg(Minutes) AvgMinutes,max(Minutes) MaxMinutes FROM A GROUP BY ProcessName
),
C AS(
	SELECT sum(SumMinutes) TotalMinutes FROM  B
),
D AS(
	SELECT B.*,C.TotalMinutes,B.SumMinutes*10000/C.TotalMinutes Per FROM B,C
)
SELECT * FROM D ORDER BY " + orderBy + @" DESC
";

            cmd.Parameters.Add("@ExtYear", SqlDbType.Int).Value = year;

            if (month == -1)
                cmd.Parameters.Add("@Month", SqlDbType.Int).Value = DBNull.Value;
            else
                cmd.Parameters.Add("@Month", SqlDbType.Int).Value = month + 1;

            return cmd.ExecuteReader();
        }

        public IDataReader GetProcessPerformanceKPI(IDbConnection cn, int year, int month, BPMObjectNameCollection include, BPMObjectNameCollection exclude)
        {
            //Command
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = cn as SqlConnection;

            //in过滤
            string extFilter = this.GetFilter(cmd, "ProcessName", include, exclude);
            if (!String.IsNullOrEmpty(extFilter))
                extFilter = " AND " + extFilter;

            //查询语句
            cmd.CommandText =
@"
--DECLARE @ExtYear int;
--DECLARE @Month int;
--SELECT @ExtYear=2015;
----SELECT @Month=2;

WITH A AS(
	SELECT ProcessName,State,DATEDIFF(mi,CreateAt,FinishAt) Minutes FROM BPMInstTasks WHERE ExtYear=@ExtYear AND (@Month IS NULL OR MONTH(CreateAt)=@Month) AND State='Approved'" + extFilter + @"
),
B AS(
	SELECT Count(*) TaskCounts,ISNULL(avg(Minutes),0) AvgMinutes,ISNULL(max(Minutes),0) MaxMinutes FROM A
),
C AS(
	SELECT ISNULL(count(DISTINCT ProcessName),0) ProcessCounts FROM A
)
SELECT C.*,B.* FROM B,C
";

            cmd.Parameters.Add("@ExtYear", SqlDbType.Int).Value = year;

            if (month == -1)
                cmd.Parameters.Add("@Month", SqlDbType.Int).Value = DBNull.Value;
            else
                cmd.Parameters.Add("@Month", SqlDbType.Int).Value = month + 1;

            return cmd.ExecuteReader();
        }

        public IDataReader GetProcessAnalysisByNode(IDbConnection cn, int year, int month, string processName, string orderBy)
        {
            //Command
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = cn as SqlConnection;

            //查询语句
            cmd.CommandText =
@"
--DECLARE @ExtYear int;
--DECLARE @ProcessName nvarchar(50);
--DECLARE @Month int;
--SELECT @ExtYear=2015;
--SELECT @ProcessName = 'A';
----SELECT @Month=8;

WITH A AS(
	SELECT TaskID,StepID,NodeName,HandlerAccount,DATEDIFF(mi,ReceiveAt,FinishAt) Minutes FROM BPMInstProcSteps WHERE ExtStepYear=@ExtYear AND HumanStep=1 AND ProcessName=@ProcessName AND (@Month IS NULL OR MONTH(ReceiveAt)=@Month) AND FinishAt IS NOT NULL AND NodeName NOT IN('sysTaskOpt','sysInform','sysIndicate')
),
B AS(
	SELECT NodeName,Count(*) Counts,sum(cast(Minutes as bigint)) SumMinutes,avg(Minutes) AvgMinutes,max(Minutes) MaxMinutes FROM A GROUP BY NodeName
),
C AS(
	SELECT sum(SumMinutes) TotalMinutes FROM  B
),
D AS(
	SELECT B.*,C.TotalMinutes,B.SumMinutes*10000/C.TotalMinutes Per FROM B,C
)
SELECT * FROM D ORDER BY " + orderBy + @" DESC
";

            cmd.Parameters.Add("@ExtYear", SqlDbType.Int).Value = year;
            cmd.Parameters.Add("@ProcessName", SqlDbType.NVarChar).Value = processName;

            if (month == -1)
                cmd.Parameters.Add("@Month", SqlDbType.Int).Value = DBNull.Value;
            else
                cmd.Parameters.Add("@Month", SqlDbType.Int).Value = month + 1;

            return cmd.ExecuteReader();
        }

        public IDataReader GetProcessAnalysisByHandlerAccount(IDbConnection cn, int year, int month, string processName, string orderBy, BPMObjectNameCollection include, BPMObjectNameCollection exclude)
        {
            //Command
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = cn as SqlConnection;

            //in过滤
            if (include == null || include.Count == 0)
            {
                if (exclude == null)
                    exclude = new BPMObjectNameCollection();

                exclude.Add("sysTaskOpt");
                exclude.Add("sysInform");
                exclude.Add("sysIndicate");
            }

            string extFilter = this.GetFilter(cmd, "NodeName", include, exclude);
            if (!String.IsNullOrEmpty(extFilter))
                extFilter = " AND " + extFilter;

            //查询语句
            cmd.CommandText =
@"
--DECLARE @ExtYear int;
--DECLARE @ProcessName nvarchar(50);
--DECLARE @Month int;
--SELECT @ExtYear=2015;
--SELECT @ProcessNAme = 'A';
----SELECT @Month=8;

WITH A AS(
	SELECT TaskID,StepID,NodeName,HandlerAccount,DATEDIFF(mi,ReceiveAt,FinishAt) Minutes FROM BPMInstProcSteps WHERE ExtStepYear=@ExtYear AND HumanStep=1 AND ProcessName=@ProcessName AND (@Month IS NULL OR MONTH(ReceiveAt)=@Month) AND FinishAt IS NOT NULL" + extFilter + @"
),
B AS(
	SELECT HandlerAccount,Count(*) Counts,sum(cast(Minutes as bigint)) SumMinutes,avg(Minutes) AvgMinutes,max(Minutes) MaxMinutes FROM A GROUP BY HandlerAccount
),
C AS(
	SELECT sum(Minutes) TotalMinutes FROM  A
),
D AS(
	SELECT B.*,C.TotalMinutes,B.SumMinutes*10000/C.TotalMinutes Per FROM B,C
)
SELECT * FROM D ORDER BY " + orderBy + @" DESC
";

            cmd.Parameters.Add("@ExtYear", SqlDbType.Int).Value = year;
            cmd.Parameters.Add("@ProcessName", SqlDbType.NVarChar).Value = processName;

            if (month == -1)
                cmd.Parameters.Add("@Month", SqlDbType.Int).Value = DBNull.Value;
            else
                cmd.Parameters.Add("@Month", SqlDbType.Int).Value = month + 1;

            return cmd.ExecuteReader();
        }
    }
}
