using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;
using Newtonsoft.Json.Linq;

/// <summary>
///Employee 的摘要说明
/// </summary>
///
namespace YZSoft.Web.ESB.Instance
{
    public class WebESBInstanceManager
    {
        public static PageResult GetLog(IYZDbProvider provider, IDbConnection cn, DateTime date, string filter, string sort, int startRowIndex, int rows)
        {
            try
            {
                using (IDataReader reader = provider.GetESBInstance(cn, date, filter, sort, startRowIndex, rows))
                {
                    PageResult result = provider.LoadPageResult(reader);

                    result.RegularColumnsName(new string[] {
                        "TaskID",
                        "FlowName",
                        "CreateBy",
                        "CreateAt",
                        "Status",
                        "FinishedAt",
                        "AsyncCall",
                        "ExtDate"
                    });

                    using (BPMConnection bpmcn = new BPMConnection())
                    {
                        bpmcn.WebOpen();
                        result.Table.Columns.Add("UserDisplayName");

                        foreach (DataRow row in result.Table.Rows)
                        {
                            string account = Convert.ToString(row["CreateBy"]);
                            User user = User.TryGetUser(bpmcn, account);
                            row["UserDisplayName"] = user != null ? user.DisplayName : account;
                        }
                    }

                    return result;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "BPMInstESBTask", e);
            }
        }

        public static PageResult GetInterruptedInstance(IYZDbProvider provider, IDbConnection cn, string filter, string sort, int startRowIndex, int rows)
        {
            try
            {
                using (IDataReader reader = provider.GetESBInterruptedInstance(cn, filter, sort, startRowIndex, rows))
                {
                    PageResult result = provider.LoadPageResult(reader);

                    result.RegularColumnsName(new string[] {
                        "TaskID",
                        "FlowName",
                        "CreateBy",
                        "CreateAt",
                        "Status",
                        "FinishedAt",
                        "AsyncCall",
                        "ExtDate"
                    });

                    using (BPMConnection bpmcn = new BPMConnection())
                    {
                        bpmcn.WebOpen();
                        result.Table.Columns.Add("UserDisplayName");

                        foreach (DataRow row in result.Table.Rows)
                        {
                            string account = Convert.ToString(row["CreateBy"]);
                            User user = User.TryGetUser(bpmcn, account);
                            row["UserDisplayName"] = user != null ? user.DisplayName : account;
                        }
                    }

                    return result;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "BPMInstESBTask", e);
            }
        }

        public static DataTable LoadTask(IYZDbProvider provider, IDbConnection cn, int taskId)
        {
            try
            {
                using (YZReader reader = new YZReader(provider.LoadTask(cn, taskId)))
                {
                    DataTable table = reader.LoadTable();
                    if (table.Rows.Count == 0)
                        throw new Exception(String.Format(Resources.YZStrings.Aspx_ESB_TaskNotExist, taskId));

                    PageResult.RegularColumnsName(table, new string[] {
                        "TaskID",
                        "FlowName",
                        "CreateBy",
                        "CreateAt",
                        "Status",
                        "FinishedAt",
                        "Request",
                        "Variables",
                        "Response",
                        "ExtInfo",
                        "AsyncCall",
                        "Callback",
                        "Params",
                        "ExtDate"
                    });

                    PageResult.TryConvertToJObject(table, "Request");
                    PageResult.TryConvertToJObject(table, "Variables");
                    PageResult.TryConvertToJObject(table, "Response");
                    PageResult.TryConvertToJObject(table, "ExtInfo");

                    return table;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "BPMInstESBTask", e);
            }
        }

        public static DataTable LoadSteps(IYZDbProvider provider, IDbConnection cn, int taskId)
        {
            try
            {
                using (YZReader reader = new YZReader(provider.LoadSteps(cn, taskId)))
                {
                    DataTable table = reader.LoadTable();
                    PageResult.RegularColumnsName(table, new string[] {
                        "TaskID",
                        "StepID",
                        "NodeName",
                        "CreateAt",
                        "Status",
                        "FinishedAt",
                        "Input",
                        "Output",
                        "ErrorMessage",
                        "Ticks",
                        "ExtDate"
                    });

                    PageResult.TryConvertToJObject(table, "Input");
                    PageResult.TryConvertToJObject(table, "Output");

                    return table;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "BPMInstESBStep", e);
            }
        }

        public static void UpdateStepInput(IYZDbProvider provider, IDbConnection cn, int stepId, string input)
        {
            try
            {
                provider.UpdateStepInput(cn, stepId, input);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "BPMInstESBStep", e);
            }
        }

        public static void UpdateStepOutput(IYZDbProvider provider, IDbConnection cn, int stepId, string output)
        {
            try
            {
                provider.UpdateStepOutput(cn, stepId, output);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "BPMInstESBStep", e);
            }
        }

        public static void UpdateTaskRequest(IYZDbProvider provider, IDbConnection cn, int taskId, string request)
        {
            try
            {
                provider.UpdateTaskRequest(cn, taskId, request);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "BPMInstESBTask", e);
            }
        }

        public static void UpdateTaskResponse(IYZDbProvider provider, IDbConnection cn, int taskId, string response)
        {
            try
            {
                provider.UpdateTaskResponse(cn, taskId, response);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "BPMInstESBTask", e);
            }
        }

        public static void UpdateTaskVariables(IYZDbProvider provider, IDbConnection cn, int taskId, string request)
        {
            try
            {
                provider.UpdateTaskVariables(cn, taskId, request);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "BPMInstESBTask", e);
            }
        }
    }
}