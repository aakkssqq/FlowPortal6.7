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
    public class WeeklyReportManager
    {
        private static WeeklyReportManager _instance = null;

        static WeeklyReportManager()
        {
            WeeklyReportManager._instance = new WeeklyReportManager();
        }

        #region 公共属性

        internal static WeeklyReportManager Instance
        {
            get
            {
                return WeeklyReportManager._instance;
            }
        }

        #endregion

        #region 服务

        public static WeeklyReportCollection GetReports(IYZDbProvider provider, IDbConnection cn, string account, int year)
        {
            try
            {
                WeeklyReportCollection rv = new WeeklyReportCollection();
                using (YZReader reader = new YZReader(provider.GetWeeklyReports(cn, account, year)))
                {
                    while (reader.Read())
                    {
                        rv.Add(new WeeklyReport(reader));
                    }
                }

                return rv;
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "iWeeklyReport", e.Message);
            }
        }

        public static WeeklyReport TryGetReport(IYZDbProvider provider, IDbConnection cn, string uid, DateTime date)
        {
            WeeklyReport weeklyReport = null;
            try
            {
                using (YZReader reader = new YZReader(provider.GetWeeklyReport(cn, uid, date)))
                {
                    if (reader.Read())
                        weeklyReport = new WeeklyReport(reader);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "iWeeklyReport", e.Message);
            }

            return weeklyReport;
        }

        #endregion
    }
}