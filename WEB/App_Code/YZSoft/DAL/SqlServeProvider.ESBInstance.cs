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
        public IDataReader GetESBInstance(IDbConnection cn, DateTime date, string filter, string sort, int startRowIndex, int rows)
        {
            date = new DateTime(date.Year, date.Month, date.Day, 0, 0, 0);

            //Command
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                //获得查询条件
                filter = this.CombinCond("ExtDate=@ExtDate", filter);
                cmd.Parameters.Add("@ExtDate", SqlDbType.DateTime).Value = date;

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "TaskID DESC";

                this.GeneratePageCommand(cmd, "SELECT * FROM BPMInstESBTask" + filter, sort, startRowIndex, rows);
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetESBInterruptedInstance(IDbConnection cn, string filter, string sort, int startRowIndex, int rows)
        {
            //Command
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                //获得查询条件
                filter = this.CombinCond("Status='Interrupted' AND AsyncCall=1", filter);

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "TaskID DESC";

                this.GeneratePageCommand(cmd, "SELECT * FROM BPMInstESBTask" + filter, sort, startRowIndex, rows);
                return cmd.ExecuteReader();
            }
        }

        public IDataReader LoadTask(IDbConnection cn, int taskId)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                cmd.CommandText = "SELECT * FROM BPMInstESBTask WHERE TaskID=@TaskID";
                cmd.Parameters.Add("@TaskID", SqlDbType.Int).Value = taskId;
                return cmd.ExecuteReader();
            }
        }

        public IDataReader LoadSteps(IDbConnection cn, int taskId)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                cmd.CommandText = "SELECT * FROM BPMInstESBStep WHERE TaskID=@TaskID ORDER BY StepID ASC";
                cmd.Parameters.Add("@TaskID", SqlDbType.Int).Value = taskId;
                return cmd.ExecuteReader();
            }
        }

        public void UpdateStepInput(IDbConnection cn, int stepId, string input)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                cmd.CommandText = "UPDATE BPMInstESBStep SET Input=@Input WHERE StepID=@StepID";
                cmd.Parameters.Add("@Input", SqlDbType.NVarChar).Value = input;
                cmd.Parameters.Add("@StepID", SqlDbType.Int).Value = stepId;
                cmd.ExecuteNonQuery();
            }
        }

        public void UpdateStepOutput(IDbConnection cn, int stepId, string output)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                cmd.CommandText = "UPDATE BPMInstESBStep SET Output=@Output WHERE StepID=@StepID";
                cmd.Parameters.Add("@Output", SqlDbType.NVarChar).Value = output;
                cmd.Parameters.Add("@StepID", SqlDbType.Int).Value = stepId;
                cmd.ExecuteNonQuery();
            }
        }

        public void UpdateTaskRequest(IDbConnection cn, int taskId, string request)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                cmd.CommandText = "UPDATE BPMInstESBTask SET Request=@Request WHERE TaskID=@TaskID";
                cmd.Parameters.Add("@Request", SqlDbType.NVarChar).Value = request;
                cmd.Parameters.Add("@TaskID", SqlDbType.Int).Value = taskId;
                cmd.ExecuteNonQuery();
            }
        }
        public void UpdateTaskResponse(IDbConnection cn, int taskId, string response)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                cmd.CommandText = "UPDATE BPMInstESBTask SET Response=@Response WHERE TaskID=@TaskID";
                cmd.Parameters.Add("@Response", SqlDbType.NVarChar).Value = response;
                cmd.Parameters.Add("@TaskID", SqlDbType.Int).Value = taskId;
                cmd.ExecuteNonQuery();
            }
        }

        public void UpdateTaskVariables(IDbConnection cn, int taskId, string variables)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                cmd.CommandText = "UPDATE BPMInstESBTask SET Variables=@Variables WHERE TaskID=@TaskID";
                cmd.Parameters.Add("@Variables", SqlDbType.NVarChar).Value = variables;
                cmd.Parameters.Add("@TaskID", SqlDbType.Int).Value = taskId;
                cmd.ExecuteNonQuery();
            }
        }
    }
}
