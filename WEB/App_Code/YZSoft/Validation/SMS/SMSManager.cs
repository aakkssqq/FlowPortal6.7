using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using YZSoft.Web.DAL;
using BPM;
using BPM.Client;

namespace YZSoft.Web.Validation
{
    public class SMSManager
    {
        private static SMSManager _instance = null;

        static SMSManager()
        {
            SMSManager._instance = new SMSManager();
        }

        #region 公共属性

        internal static SMSManager Instance
        {
            get
            {
                return SMSManager._instance;
            }
        }

        #endregion

        #region 服务

        public static void Insert(IYZDbProvider provider, IDbConnection cn, SMS sms)
        {
            try
            {
                provider.Insert(cn, sms);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBInsertDataErr, "YZSysSMSValidation", e.Message);
            }
        }

        public static SMS TryGetSMS(IYZDbProvider provider, IDbConnection cn, string itemguid)
        {
            SMS sms = null;
            try
            {
                using (YZReader reader = new YZReader(provider.GetValidationSMS(cn, itemguid)))
                {
                    if (reader.Read())
                        sms = new SMS(reader);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZSysSMSValidation", e.Message);
            }

            return sms;
        }

        public static void DeleteSMS(IYZDbProvider provider, IDbConnection cn, string itemguid)
        {
            try
            {
                provider.DeleteValidationSMS(cn, itemguid);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZSysSMSValidation", e.Message);
            }
        }

        #endregion
    }
}