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

namespace YZSoft.Web.DAL
{
    partial interface IYZDbProvider
    {
        IDataReader GetESBInstance(IDbConnection cn, DateTime date, string filter, string sort, int startRowIndex, int rows);
        IDataReader GetESBInterruptedInstance(IDbConnection cn, string filter, string sort, int startRowIndex, int rows);
        IDataReader LoadTask(IDbConnection cn, int taskId);
        IDataReader LoadSteps(IDbConnection cn, int taskId);
        void UpdateStepInput(IDbConnection cn, int stepId, string input);
        void UpdateStepOutput(IDbConnection cn, int stepId, string output);
        void UpdateTaskRequest(IDbConnection cn, int taskid, string request);
        void UpdateTaskResponse(IDbConnection cn, int taskid, string response);
        void UpdateTaskVariables(IDbConnection cn, int taskid, string request);
    }
}
