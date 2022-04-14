using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;

/// <summary>
///Employee 的摘要说明
/// </summary>
///
namespace YZSoft.Web.Queue
{
    public class WebQueueManager
    {
        public static PageResult GetLogSucceed(IYZDbProvider provider, IDbConnection cn, DateTime date, string filter, string sort, int startRowIndex, int rows)
        {
            try
            {
                using (IDataReader reader = provider.GetQueueLogSucceed(cn, date, filter, sort, startRowIndex, rows))
                {
                    PageResult result = provider.LoadPageResult(reader);

                    result.RegularColumnsName(new string[] {
                        "MessageID",
                        "Server",
                        "QueueName",
                        "HandlerType",
                        "HandlerMethod",
                        "Params",
                        "CreateAt",
                        "ProcessedAt",
                        "FailCount",
                        "ErrorMessage",
                        "LastFailAt",
                        "Ticks"
                    });

                    return result;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "BPMInstQueueSucceed", e);
            }
        }

        public static PageResult GetLogFailed(IYZDbProvider provider, IDbConnection cn, DateTime date, string filter, string sort, int startRowIndex, int rows)
        {
            try
            {
                using (IDataReader reader = provider.GetQueueLogFailed(cn, date, filter, sort, startRowIndex, rows))
                {
                    PageResult result = provider.LoadPageResult(reader);

                    result.RegularColumnsName(new string[] {
                        "MessageID",
                        "Server",
                        "QueueName",
                        "HandlerType",
                        "HandlerMethod",
                        "Params",
                        "CreateAt",
                        "RemoveAt",
                        "FailCount",
                        "ErrorMessage",
                        "LastFailAt"
                    });

                    return result;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "BPMInstQueueFailed", e);
            }
        }

        public static PageResult GetQueueMessages(IYZDbProvider provider, IDbConnection cn, string filter, string sort, int startRowIndex, int rows)
        {
            try
            {
                using (IDataReader reader = provider.GetQueueMessages(cn, filter, sort, startRowIndex, rows))
                {
                    PageResult result = provider.LoadPageResult(reader);

                    result.RegularColumnsName(new string[] {
                        "MessageID",
                        "Server",
                        "QueueName",
                        "HandlerType",
                        "HandlerMethod",
                        "Params",
                        "CreateAt",
                        "ProcessSchedule",
                        "FailCount",
                        "ErrorMessage",
                        "LastFailAt"
                    });

                    return result;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "BPMInstQueue", e);
            }
        }
    }
}