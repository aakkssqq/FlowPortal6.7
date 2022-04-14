using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Globalization;

public class YZDateHelper
{
    private static CultureInfo Culture = new CultureInfo(1033);

    public static int GetWeekOfYear(DateTime date)
    {
        return Culture.Calendar.GetWeekOfYear(date, CalendarWeekRule.FirstDay, DayOfWeek.Monday);
    }

    public static int WeeksInYear(int year)
    {
        return GetWeekOfYear(new DateTime(year, 12, 31));
    }

    public static void GetWeekStartEndDate(DateTime date,out DateTime firstDate,out DateTime lastDate)
    {
        firstDate = GetWeekFirstDate(date);
        lastDate = firstDate.AddDays(6);
    }

    public static DateTime GetWeekFirstDate(int year, int week)
    {
        DateTime firstDate = GetWeekFirstDate(new DateTime(year, 1, 1));
        return firstDate.AddDays((week - 1) * 7);
    }

    public static DateTime GetWeekFirstDate(DateTime date)
    {
        //星期一为第一天  
        int weeknow = Convert.ToInt32(date.DayOfWeek);

        //因为是以星期一为第一天，所以要判断weeknow等于0时，要向前推6天。  
        weeknow = (weeknow == 0 ? (7 - 1) : (weeknow - 1));
        int daydiff = (-1) * weeknow;

        //本周第一天
        date = date.AddDays(daydiff);
        return new DateTime(date.Year,date.Month,date.Day);
    }
}
