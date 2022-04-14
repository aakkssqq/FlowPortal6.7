using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using BPM;

namespace YZSoft.Apps
{
    public class DailyReportCollection : BPMList<DailyReport>
    {
        public DailyReport TryGetItem(int year, int month, int day)
        {
            foreach (DailyReport dailyReport in this)
            {
                if (dailyReport.Date.Year == year &&
                    dailyReport.Date.Month == month &&
                    dailyReport.Date.Day == day)
                    return dailyReport;
            }

            return null;
        }
    }
}