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
    public class FootmarkManager
    {
        private static FootmarkManager _instance = null;

        static FootmarkManager()
        {
            FootmarkManager._instance = new FootmarkManager();
        }

        #region 公共属性

        internal static FootmarkManager Instance
        {
            get
            {
                return FootmarkManager._instance;
            }
        }

        #endregion

        public static void Update(IYZDbProvider provider, IDbConnection cn, Footmark footmark)
        {
            try
            {
                provider.Update(cn, footmark);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZAppNotesFootmark", e.Message);
            }
        }

        public static void Insert(IYZDbProvider provider, IDbConnection cn, Footmark footmark)
        {
            try
            {
                provider.Insert(cn, footmark);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBInsertDataErr, "YZAppNotesFootmark", e.Message);
            }
        }

        #region 服务

        public static int GetSignCount(IYZDbProvider provider, IDbConnection cn, string account, DateTime date)
        {
            try
            {
                return provider.GetNotesFootmarkSignCount(cn, account, date);
            }

            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppNotesFootmark", e.Message);
            }
        }

        public static FootmarkCollection GetFootmarks(IYZDbProvider provider, IDbConnection cn, BPMObjectNameCollection accounts, DateTime date)
        {
            try
            {
                FootmarkCollection footmarks = new FootmarkCollection();

                using (YZReader reader = new YZReader(provider.GetNotesFootmarks(cn, accounts, new DateTime(date.Year, date.Month, date.Day))))
                {
                    while (reader.Read())
                    {
                        footmarks.Add(new Footmark(reader));
                    }
                }

                return footmarks;
            }

            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppNotesFootmark", e.Message);
            }
        }

        public static PageResult GetFootmarks(IYZDbProvider provider, IDbConnection cn, string account, int year,int month,string filter, string sort, int startRowIndex, int rows)
        {
            try
            {
                using (IDataReader reader = provider.GetNotesFootmarks(cn, account, year, month, filter, sort, startRowIndex, rows))
                {
                    PageResult result = provider.LoadPageResult(reader);

                    result.RegularColumnsName(new string[] {
                        "ItemID",
                        "Account",
                        "Time",
                        "Rawlat",
                        "Rawlon",
                        "Lat",
                        "Lon",
                        "LocId",
                        "LocName",
                        "LocAddress",
                        "Contact",
                        "Comments",
                        "Attachments",
                        "Date"
                    });

                    return result;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppNotesFootmark", e.Message);
            }
        }

        public static Footmark GetFootmark(IYZDbProvider provider, IDbConnection cn, int itemid)
        {
            Footmark footmark = null;
            try
            {
                using (YZReader reader = new YZReader(provider.GetNotesFootmark(cn, itemid)))
                {
                    if (reader.Read())
                        footmark = new Footmark(reader);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppNotesFootmark", e.Message);
            }

            if (footmark == null)
                throw new BPMException(String.Format(Resources.YZStrings.Aspx_RecordNotExist, itemid));

            return footmark;
        }

        public static void DeleteFootmark(IYZDbProvider provider, IDbConnection cn, int itemid)
        {
            try
            {
                provider.DeleteNotesFootmark(cn, itemid);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZAppNotesFootmark", e.Message);
            }
        }

        #endregion
    }
}