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

namespace YZSoft.Web.DAL
{
    partial class OracleProvider
    {
        public IDataReader GetProcessAnalysisTrend(IDbConnection cn, int year, BPMObjectNameCollection include, BPMObjectNameCollection exclude)
        {
            //Command
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = cn as OracleConnection;
            cmd.BindByName = true;

            //in过滤
            string extFilter = this.GetFilter(cmd, "PROCESSNAME", include, exclude);
            if (!String.IsNullOrEmpty(extFilter))
                extFilter = " AND " + extFilter;

            //查询语句
            cmd.CommandText =
@"
--DECLARE :ExtYear int;
--DECLARE :ProcessName nvarchar(50);
--SELECT :ExtYear=2015;

WITH A AS(
	SELECT to_number(to_char(CreateAt,'MM')) Month,ProcessName,State,GREATEST(ROUND(TO_NUMBER(FinishAt-CreateAt) * 24 * 60),0) Minutes FROM BPMInstTasks WHERE ExtYear=:ExtYear" + extFilter + @"
),
AA AS(
	SELECT State,Month,Count(*) Counts,avg(Minutes) AvgMinutes FROM A GROUP BY State,Month
),
B AS(
	SELECT Month,
	max(case when State='Approved' then Counts else 0 end) Approved,
	max(case when State='Rejected' then Counts else 0 end) Rejected,
	max(case when State='Running' then Counts else 0 end) Running,
	max(case when State='Aborted' then Counts else 0 end) Aborted,
	max(case when State='Deleted' then Counts else 0 end) Deleted,
	nvl(sum(Counts),0) Total,
	max(case when State='Approved' then AvgMinutes else 0 end) AvgMinutes
	FROM AA GROUP BY Month
),
C AS(
	SELECT rownum Month from dual connect by rownum <=12
),
D AS(
	SELECT C.Month,
	nvl(B.Approved,0) Approved,
	nvl(B.Rejected,0) Rejected,
	nvl(B.Running,0) Running,
	nvl(B.Aborted,0) Aborted,
	nvl(B.Deleted,0) Deleted,
	nvl(B.Total,0) Total,
	nvl(B.AvgMinutes,0) AvgMinutes
	FROM C LEFT JOIN B ON C.Month=B.Month
)
SELECT * FROM D ORDER BY Month
";

            cmd.Parameters.Add(":ExtYear", OracleDbType.Int32).Value = year;
            return cmd.ExecuteReader();
        }

        public IDataReader GetProcessAnalysisTrend(IDbConnection cn, int year, int month, BPMObjectNameCollection include, BPMObjectNameCollection exclude)
        {
            //Command
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = cn as OracleConnection;
            cmd.BindByName = true;

            //in过滤
            string extFilter = this.GetFilter(cmd, "ProcessName", include, exclude);
            if (!String.IsNullOrEmpty(extFilter))
                extFilter = " AND " + extFilter;

            //查询语句
            cmd.CommandText =
@"
--DECLARE :ExtYear int;
--DECLARE :Month int;
--DECLARE :ProcessName nvarchar(50)
--SELECT :ExtYear=2015;
--SELECT :Month=8;
--SELECT :ProcessName='A'
--*****获得一个月中的天数

WITH A AS(
	SELECT to_number(to_char(CreateAt,'DD')) DAY,ProcessName,State,GREATEST(ROUND(TO_NUMBER(FinishAt-CreateAt) * 24 * 60),0) Minutes FROM BPMInstTasks WHERE ExtYear=:ExtYear AND to_number(to_char(CreateAt,'MM'))=:Month" + extFilter + @"
),
AA AS(
	SELECT State,DAY,Count(*) Counts,avg(Minutes) AvgMinutes FROM A GROUP BY State,DAY
),
B AS(
	SELECT DAY,
	max(case when State='Approved' then Counts else 0 end) Approved,
	max(case when State='Rejected' then Counts else 0 end) Rejected,
	max(case when State='Running' then Counts else 0 end) Running,
	max(case when State='Aborted' then Counts else 0 end) Aborted,
	max(case when State='Deleted' then Counts else 0 end) Deleted,
	nvl(sum(Counts),0) Total,
	max(case when State='Approved' then AvgMinutes else 0 end) AvgMinutes
	FROM AA GROUP BY DAY
),
C AS(
    SELECT rownum DAY from dual connect by rownum <= :MonthDays
),
D AS(
	SELECT C.DAY,
	nvl(B.Approved,0) Approved,
	nvl(B.Rejected,0) Rejected,
	nvl(B.Running,0) Running,
	nvl(B.Aborted,0) Aborted,
	nvl(B.Deleted,0) Deleted,
	nvl(B.Total,0) Total,
	nvl(B.AvgMinutes,0) AvgMinutes
	FROM C LEFT JOIN B ON C.DAY=B.DAY
)
SELECT * FROM D ORDER BY DAY
";

            cmd.Parameters.Add(":MonthDays", OracleDbType.Int32).Value = DateTime.DaysInMonth(year,month+1);
            cmd.Parameters.Add(":ExtYear", OracleDbType.Int32).Value = year;
            cmd.Parameters.Add(":Month", OracleDbType.Int32).Value = month + 1;

            return cmd.ExecuteReader();
        }

        public IDataReader GetProcessUsage(IDbConnection cn, int year, int month)
        {
            //Command
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = cn as OracleConnection;
            cmd.BindByName = true;

            //查询语句
            cmd.CommandText =
@"
--DECLARE :ExtYear int;
--DECLARE :Month int;
--SELECT :ExtYear=2015;
----SELECT :Month=2;

WITH A AS(
	SELECT ProcessName,Count(*) Counts FROM BPMInstTasks WHERE ExtYear=:ExtYear AND (:Month IS NULL OR to_number(to_char(CreateAt,'MM'))=:Month) GROUP BY ProcessName
),
B AS(
	SELECT sum(Counts) Total FROM A
),
C AS(
	SELECT A.*,B.Total,A.Counts*10000/B.Total Per FROM A,B
)
SELECT * FROM C ORDER BY Counts DESC
";

            cmd.Parameters.Add(":ExtYear", OracleDbType.Int32).Value = year;

            if (month == -1)
                cmd.Parameters.Add(":Month", OracleDbType.Int32).Value = DBNull.Value;
            else
                cmd.Parameters.Add(":Month", OracleDbType.Int32).Value = month + 1;

            return cmd.ExecuteReader();
        }

        public IDataReader GetProcessUsageKPI(IDbConnection cn, int year, int month, BPMObjectNameCollection include, BPMObjectNameCollection exclude)
        {
            //Command
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = cn as OracleConnection;
            cmd.BindByName = true;

            //in过滤
            string extFilter = this.GetFilter(cmd, "ProcessName", include, exclude);
            if (!String.IsNullOrEmpty(extFilter))
                extFilter = " AND " + extFilter;

            //查询语句
            cmd.CommandText =
@"
--DECLARE :ExtYear int;
--DECLARE :Month int;
--SELECT :ExtYear=2015;
----SELECT :Month=2;

WITH A AS(
	SELECT ProcessName,State FROM BPMInstTasks WHERE ExtYear=:ExtYear AND (:Month IS NULL OR to_number(to_char(CreateAt,'MM'))=:Month)" + extFilter + @"
),
B AS
(
	SELECT :ExtYear ExtYear,State,Count(*) Counts FROM A GROUP BY State
),
C AS(
	SELECT ExtYear,
	max(case when State='Approved' then Counts else 0 end) Approved,
	max(case when State='Rejected' then Counts else 0 end) Rejected,
	max(case when State='Running' then Counts else 0 end) Running,
	max(case when State='Aborted' then Counts else 0 end) Aborted,
	max(case when State='Deleted' then Counts else 0 end) Deleted,
	nvl(sum(Counts),0) Total
	FROM B GROUP BY ExtYear
),
D AS(
	SELECT nvl(count(DISTINCT ProcessName),0) ProcessCount FROM A
)
SELECT C.*,D.* FROM C,D
";

            cmd.Parameters.Add(":ExtYear", OracleDbType.Int32).Value = year;

            if (month == -1)
                cmd.Parameters.Add(":Month", OracleDbType.Int32).Value = DBNull.Value;
            else
                cmd.Parameters.Add(":Month", OracleDbType.Int32).Value = month + 1;

            return cmd.ExecuteReader();
        }

        public IDataReader GetProcessPerformanceByProcess(IDbConnection cn, int year, int month, string orderBy)
        {
            //Command
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = cn as OracleConnection;
            cmd.BindByName = true;

            //查询语句
            cmd.CommandText =
@"
--DECLARE :ExtYear int;
--DECLARE :Month int;
--SELECT :ExtYear=2015;
----SELECT :Month=8;

WITH A AS(
	SELECT ProcessName,GREATEST(ROUND(TO_NUMBER(FinishAt-CreateAt) * 24 * 60),0) Minutes FROM BPMInstTasks WHERE ExtYear=:ExtYear AND (:Month IS NULL OR to_number(to_char(CreateAt,'MM'))=:Month) AND State='Approved'
),
B AS(
	SELECT ProcessName,Count(*) Counts,sum(Minutes) SumMinutes,avg(Minutes) AvgMinutes,max(Minutes) MaxMinutes FROM A GROUP BY ProcessName
),
C AS(
	SELECT sum(SumMinutes) TotalMinutes FROM  B
),
D AS(
	SELECT B.*,C.TotalMinutes,B.SumMinutes*10000/C.TotalMinutes Per FROM B,C
)
SELECT * FROM D ORDER BY " + orderBy + @" DESC
";

            cmd.Parameters.Add(":ExtYear", OracleDbType.Int32).Value = year;

            if (month == -1)
                cmd.Parameters.Add(":Month", OracleDbType.Int32).Value = DBNull.Value;
            else
                cmd.Parameters.Add(":Month", OracleDbType.Int32).Value = month + 1;

            return cmd.ExecuteReader();
        }

        public IDataReader GetProcessPerformanceKPI(IDbConnection cn, int year, int month, BPMObjectNameCollection include, BPMObjectNameCollection exclude)
        {
            //Command
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = cn as OracleConnection;
            cmd.BindByName = true;

            //in过滤
            string extFilter = this.GetFilter(cmd, "ProcessName", include, exclude);
            if (!String.IsNullOrEmpty(extFilter))
                extFilter = " AND " + extFilter;

            //查询语句
            cmd.CommandText =
@"
--DECLARE :ExtYear int;
--DECLARE :Month int;
--SELECT :ExtYear=2015;
----SELECT :Month=2;

WITH A AS(
	SELECT ProcessName,State,GREATEST(ROUND(TO_NUMBER(FinishAt-CreateAt) * 24 * 60),0) Minutes FROM BPMInstTasks WHERE ExtYear=:ExtYear AND (:Month IS NULL OR to_number(to_char(CreateAt,'MM'))=:Month) AND State='Approved'" + extFilter + @"
),
B AS(
	SELECT Count(*) TaskCounts,nvl(avg(Minutes),0) AvgMinutes,nvl(max(Minutes),0) MaxMinutes FROM A
),
C AS(
	SELECT nvl(count(DISTINCT ProcessName),0) ProcessCounts FROM A
)
SELECT C.*,B.* FROM B,C
";

            cmd.Parameters.Add(":ExtYear", OracleDbType.Int32).Value = year;

            if (month == -1)
                cmd.Parameters.Add(":Month", OracleDbType.Int32).Value = DBNull.Value;
            else
                cmd.Parameters.Add(":Month", OracleDbType.Int32).Value = month + 1;

            return cmd.ExecuteReader();
        }

        public IDataReader GetProcessAnalysisByNode(IDbConnection cn, int year, int month, string processName, string orderBy)
        {
            //Command
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = cn as OracleConnection;
            cmd.BindByName = true;

            //查询语句
            cmd.CommandText =
@"
--DECLARE :ExtYear int;
--DECLARE :ProcessName nvarchar(50);
--DECLARE :Month int;
--SELECT :ExtYear=2015;
--SELECT :ProcessName = 'A';
----SELECT :Month=8;

WITH A AS(
	SELECT TaskID,StepID,NodeName,HandlerAccount,GREATEST(ROUND(TO_NUMBER(FinishAt-ReceiveAt) * 24 * 60),0) Minutes FROM BPMInstProcSteps WHERE ExtStepYear=:ExtYear AND HumanStep=1 AND ProcessName=:ProcessName AND (:Month IS NULL OR to_number(to_char(ReceiveAt,'MM'))=:Month) AND FinishAt IS NOT NULL AND NodeName NOT IN('sysTaskOpt','sysInform','sysIndicate')
),
B AS(
	SELECT NodeName,Count(*) Counts,sum(Minutes) SumMinutes,avg(Minutes) AvgMinutes,max(Minutes) MaxMinutes FROM A GROUP BY NodeName
),
C AS(
	SELECT sum(SumMinutes) TotalMinutes FROM  B
),
D AS(
	SELECT B.*,C.TotalMinutes,B.SumMinutes*10000/C.TotalMinutes Per FROM B,C
)
SELECT * FROM D ORDER BY " + orderBy + @" DESC
";

            cmd.Parameters.Add(":ExtYear", OracleDbType.Int32).Value = year;
            cmd.Parameters.Add(":ProcessName", OracleDbType.NVarchar2).Value = processName;

            if (month == -1)
                cmd.Parameters.Add(":Month", OracleDbType.Int32).Value = DBNull.Value;
            else
                cmd.Parameters.Add(":Month", OracleDbType.Int32).Value = month + 1;

            return cmd.ExecuteReader();
        }

        public IDataReader GetProcessAnalysisByHandlerAccount(IDbConnection cn, int year, int month, string processName, string orderBy, BPMObjectNameCollection include, BPMObjectNameCollection exclude)
        {
            //Command
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = cn as OracleConnection;
            cmd.BindByName = true;

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
--DECLARE :ExtYear int;
--DECLARE :ProcessName nvarchar(50);
--DECLARE :Month int;
--SELECT :ExtYear=2015;
--SELECT :ProcessNAme = 'A';
----SELECT :Month=8;

WITH A AS(
	SELECT TaskID,StepID,NodeName,HandlerAccount,GREATEST(ROUND(TO_NUMBER(FinishAt-ReceiveAt) * 24 * 60),0) Minutes FROM BPMInstProcSteps WHERE ExtStepYear=:ExtYear AND HumanStep=1 AND ProcessName=:ProcessName AND (:Month IS NULL OR to_number(to_char(ReceiveAt,'MM'))=:Month) AND FinishAt IS NOT NULL" + extFilter + @"
),
B AS(
	SELECT HandlerAccount,Count(*) Counts,sum(Minutes) SumMinutes,avg(Minutes) AvgMinutes,max(Minutes) MaxMinutes FROM A GROUP BY HandlerAccount
),
C AS(
	SELECT sum(Minutes) TotalMinutes FROM  A
),
D AS(
	SELECT B.*,C.TotalMinutes,decode(C.TotalMinutes,0,0,B.SumMinutes*10000/C.TotalMinutes) Per FROM B,C
)
SELECT * FROM D ORDER BY " + orderBy + @" DESC
";

            cmd.Parameters.Add(":ExtYear", OracleDbType.Int32).Value = year;
            cmd.Parameters.Add(":ProcessName", OracleDbType.NVarchar2).Value = processName;

            if (month == -1)
                cmd.Parameters.Add(":Month", OracleDbType.Int32).Value = DBNull.Value;
            else
                cmd.Parameters.Add(":Month", OracleDbType.Int32).Value = month + 1;

            return cmd.ExecuteReader();
        }
    }
}
