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
    public class MonthlyReportManager
    {
        private static MonthlyReportManager _instance = null;

        static MonthlyReportManager()
        {
            MonthlyReportManager._instance = new MonthlyReportManager();
        }

        #region 公共属性

        internal static MonthlyReportManager Instance
        {
            get
            {
                return MonthlyReportManager._instance;
            }
        }

        #endregion

        #region 服务

        public static MonthlyReportCollection GetReports(IYZDbProvider provider, IDbConnection cn, string account, int year)
        {
            try
            {
                MonthlyReportCollection rv = new MonthlyReportCollection();
                using (YZReader reader = new YZReader(provider.GetMonthlyReports(cn, account, year)))
                {
                    while (reader.Read())
                    {
                        rv.Add(new MonthlyReport(reader));
                    }
                }

                return rv;
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "iMonthlyReport", e.Message);
            }
        }

        public static MonthlyReport TryGetReport(IYZDbProvider provider, IDbConnection cn, string uid, DateTime date)
        {
            MonthlyReport monthlyReport = null;
            try
            {
                using (YZReader reader = new YZReader(provider.GetMonthlyReport(cn, uid, date)))
                {
                    if (reader.Read())
                        monthlyReport = new MonthlyReport(reader);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "iMonthlyReport", e.Message);
            }

            return monthlyReport;
        }

        #endregion
    }
}