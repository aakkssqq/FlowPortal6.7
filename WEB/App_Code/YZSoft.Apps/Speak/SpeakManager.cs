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
    public class SpeakManager
    {
        private static SpeakManager _instance = null;

        static SpeakManager()
        {
            SpeakManager._instance = new SpeakManager();
        }

        #region 公共属性

        internal static SpeakManager Instance
        {
            get
            {
                return SpeakManager._instance;
            }
        }

        #endregion

        public static void Update(IYZDbProvider provider, IDbConnection cn, Speak speak)
        {
            try
            {
                provider.Update(cn, speak);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZAppNotesSpeak", e.Message);
            }
        }

        public static void Insert(IYZDbProvider provider, IDbConnection cn, Speak speak)
        {
            try
            {
                provider.Insert(cn, speak);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBInsertDataErr, "YZAppNotesSpeak", e.Message);
            }
        }

        #region 服务

        public static PageResult GetSpeaks(IYZDbProvider provider, IDbConnection cn, string account, string filter, string sort, int startRowIndex, int rows)
        {
            try
            {
                using (IDataReader reader = provider.GetNotesSpeaks(cn, account, filter, sort, startRowIndex, rows))
                {
                    PageResult result = provider.LoadPageResult(reader);

                    result.RegularColumnsName(new string[] {
                        "ItemID",
                        "Account",
                        "FileID",
                        "Duration",
                        "Comments",
                        "CreateAt"
                    });

                    return result;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppNotesSpeak", e.Message);
            }
        }

        public static Speak GetSpeak(IYZDbProvider provider, IDbConnection cn, int itemid)
        {
            Speak speak = null;
            try
            {
                using (YZReader reader = new YZReader(provider.GetNotesSpeak(cn, itemid)))
                {
                    if (reader.Read())
                        speak = new Speak(reader);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppNotesSpeak", e.Message);
            }

            if (speak == null)
                throw new BPMException(String.Format(Resources.YZStrings.Aspx_RecordNotExist, itemid));

            return speak;
        }

        public static void DeleteSpeak(IYZDbProvider provider, IDbConnection cn, int itemid)
        {
            try
            {
                provider.DeleteNotesSpeak(cn, itemid);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZAppNotesSpeak", e.Message);
            }
        }

        #endregion
    }
}