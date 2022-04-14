using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using YZSoft.Web.DAL;
using BPM;
using BPM.Client;

namespace YZSoft.Apps
{
    public class DailyReportManager
    {
        private static DailyReportManager _instance = null;

        static DailyReportManager()
        {
            DailyReportManager._instance = new DailyReportManager();
        }

        #region 公共属性

        internal static DailyReportManager Instance
        {
            get
            {
                return DailyReportManager._instance;
            }
        }

        #endregion

        #region 服务

        public static DailyReportCollection GetReports(IYZDbProvider provider, IDbConnection cn, string account, int year, int month)
        {
            try
            {
                DailyReportCollection rv = new DailyReportCollection();
                using (YZReader reader = new YZReader(provider.GetDailyReports(cn, account, year, month)))
                {
                    while (reader.Read())
                    {
                        rv.Add(new DailyReport(reader));
                    }
                }

                return rv;
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "iDailyReport", e.Message);
            }
        }

        public static DailyReport TryGetReport(IYZDbProvider provider, IDbConnection cn, string uid, DateTime date)
        {
            DailyReport dailyReport = null;
            try
            {
                using (YZReader reader = new YZReader(provider.GetDailyReport(cn, uid, date)))
                {
                    if (reader.Read())
                        dailyReport = new DailyReport(reader);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "iDailyReport", e.Message);
            }

            return dailyReport;
        }

        #endregion
    }
}