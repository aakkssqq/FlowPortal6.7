using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using BPM;

namespace YZSoft.Apps
{
    public class MonthlyReportCollection : BPMList<MonthlyReport>
    {
        public MonthlyReport TryGetItem(int year, int month)
        {
            foreach (MonthlyReport monthlyReport in this)
            {
                if (monthlyReport.Date.Year == year &&
                    monthlyReport.Date.Month == month)
                    return monthlyReport;
            }

            return null;
        }
    }
}