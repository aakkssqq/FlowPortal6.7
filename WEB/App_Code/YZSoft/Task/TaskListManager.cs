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
namespace YZSoft.Web.Task
{
    public class TaskListManager
    {
        public static PageResult GetHandoverMyRequests(IYZDbProvider provider, IDbConnection cn, string uid, string filter, string sort, int startRowIndex, int rows)
        {
            try
            {
                using (IDataReader reader = provider.GetHandoverMyRequests(cn, uid, filter, sort, startRowIndex, rows))
                {
                    PageResult result = provider.LoadPageResult(reader);

                    result.RegularColumnsName(new string[] {
                    });

                    return result;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "BPMInstTasks", e);
            }
        }
    }
}