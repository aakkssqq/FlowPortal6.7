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
namespace YZSoft.Web.Log
{
    public class LogManager
    {
        public static PageResult GetLog(IYZDbProvider provider, IDbConnection cn, BPMObjectNameCollection sids, DateTime date, string filter, string sort, int startRowIndex, int rows)
        {
            try
            {
                using (IDataReader reader = provider.GetAppLog(cn, sids, date, filter, sort, startRowIndex, rows))
                {
                    PageResult result = provider.LoadPageResult(reader);

                    result.RegularColumnsName(new string[] {
                        "ObjectID",
                        "LogDate",
                        "ClientIP",
                        "UserAccount",
                        "Action",
                        "ActParam1",
                        "ActParam2",
                        "ActParam3",
                        "TickUsed",
                        "Succeed",
                        "Error",
                        "ExtDate"
                    });

                    using (BPMConnection bpmcn = new BPMConnection())
                    {
                        bpmcn.WebOpen();
                        result.Table.Columns.Add("UserDisplayName");

                        foreach (DataRow row in result.Table.Rows)
                        {
                            string ip = Convert.ToString(row["ClientIP"]);
                            if (ip != null)
                                ip = ip.Trim();
                            row["ClientIP"] = ip;

                            string account = Convert.ToString(row["UserAccount"]);
                            User user = User.TryGetUser(bpmcn, account);
                            row["UserDisplayName"] = user != null ? user.DisplayName : account;
                        }
                    }

                    return result;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "BPMSysAppLog", e);
            }
        }
    }
}