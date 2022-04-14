using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Runtime.Serialization.Json;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System.IO;
using BPM;
using BPM.Client;
using BPM.Client.Security;

namespace YZSoft.Services.REST.BPM
{
    public class TimeSheetHandler : YZServiceHandler
    {
        public virtual object[] GetTimeSheets(HttpContext context)
        {
            TimeSheetCollection timesheets = new TimeSheetCollection();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                if (SecurityManager.CheckPermision(cn, WellKnownRSID.TimeSheetRoot, BPMPermision.Read))
                    timesheets = cn.GetTimeSheets();
            }

            List<object> rv = new List<object>();
            foreach (TimeSheet timesheet in timesheets)
            {
                rv.Add(new
                {
                    Name = timesheet.Name
                });
            }

            return rv.ToArray();
        }

        public virtual int[][] GetMonthData(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string sheetName = request.GetString("sheetName");
            int year = request.GetInt32("year");
            int month = request.GetInt32("month") + 1;

            TimeSheet timesheet;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                timesheet = TimeSheet.Load(cn, sheetName);
            }

            int daysInMonth = DateTime.DaysInMonth(year,month);
            List<int[]> monthDays = new List<int[]>();
            for (int i = 0; i < DateTime.DaysInMonth(year, month); i++)
            {
                TimeSheetDay day = timesheet[new DateTime(year, month, i + 1)];
                monthDays.Add(new int[] { (int)(day.Data & 0xffffff),(int)(day.Data >> 24) & 0xffffff});
            }

            return monthDays.ToArray();
        }

        public virtual TimeSheet GetTimeSheetDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string sheetName = request.GetString("sheetName");

            TimeSheet timesheet;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                timesheet = TimeSheet.Load(cn, sheetName);
                timesheet.Data.Clear();
            }

            return timesheet;
        }

        public virtual void SaveTimeSheetCalendar(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string sheetName = request.GetString("sheetName");

            JsonSerializer serializer = new JsonSerializer();
            StreamReader reader = new StreamReader(context.Request.InputStream);
            using (JsonTextReader streamReader = new JsonTextReader(reader))
            {
                JArray @params = serializer.Deserialize(streamReader) as JArray;

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    TimeSheet sheet = TimeSheet.Load(cn, sheetName);
                    this.MarginClientData(sheet, @params);
                    sheet.Save(cn, true);
                }
            }
        }

        public virtual void SaveTimeSheet(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string mode = request.GetString("mode");
            string sheetName = request.GetString("sheetName", mode == "new", null);

            JArray @params = request.GetPostData<JArray>();
            TimeSheet timesheet = @params[0].ToObject<TimeSheet>(request.Serializer);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (mode == "edit")
                {
                    TimeSheet sheet = TimeSheet.Load(cn, sheetName);
                    timesheet.Data = sheet.Data;

                    if (sheetName != timesheet.Name)
                        TimeSheet.Rename(cn, sheetName, timesheet.Name);


                    timesheet.Save(cn, true);
                }
                else
                    timesheet.Save(cn, false);
            }
        }

        public virtual void DeleteTimeSheets(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string folder = request.GetString("folder", "");
            JArray jPost = request.GetPostData<JArray>();
            StoreObjectIdentityCollection objects = jPost.ToObject<StoreObjectIdentityCollection>();

            JObject rv = new JObject();
            JArray deletedItems = new JArray();
            rv["deletedItems"] = deletedItems;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                cn.DeleteObjects(StoreZoneType.TimeSheet, folder, objects);
            }
        }

        protected virtual void MarginClientData(TimeSheet sheet, JArray @params)
        {
            foreach(JObject jmonth in  @params){
                int year = (int)jmonth["year"];
                int month = (int)jmonth["month"];
                JArray jdatas = jmonth["data"] as JArray;

                for(int i = 0 ; i < jdatas.Count ; i++)
                {
                    DateTime date = new DateTime(year,month+1,i+1);

                    JArray jday = jdatas[i] as JArray;
                    ulong dayData1 = (ulong)jday[0];
                    ulong dayData2 = (ulong)jday[1];

                    sheet[date].Data = dayData1 + (dayData2 << 24);
                }
            }
        }
    }
}