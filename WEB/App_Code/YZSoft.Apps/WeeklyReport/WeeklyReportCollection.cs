using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using BPM;

namespace YZSoft.Apps
{
    public class WeeklyReportCollection : BPMList<WeeklyReport>
    {
        public WeeklyReport TryGetItem(DateTime firstDay,DateTime lastDay)
        {
            lastDay = lastDay.AddDays(1);

            foreach (WeeklyReport weeklyReport in this)
            {
                if (weeklyReport.Date >= firstDay && weeklyReport.Date < lastDay)
                    return weeklyReport;
            }

            return null;
        }
    }
}