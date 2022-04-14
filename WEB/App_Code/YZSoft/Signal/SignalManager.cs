using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using YZSoft.Web.DAL;
using BPM;
using BPM.Client;

namespace YZSoft.Signal
{
    public class SignalManager
    {
        #region 服务

        public static int GetSignalCount(IYZDbProvider provider, IDbConnection cn, string singalId)
        {
            try
            {
                return provider.GetSignalCount(cn, singalId);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZSysSignal", e.Message);
            }
        }

        public static void DeleteSignal(IYZDbProvider provider, IDbConnection cn, string singalId)
        {
            try
            {
                provider.DeleteSignal(cn, singalId);

            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZSysSignal", e.Message);
            }
        }

        public static void InsertSignal(IYZDbProvider provider, IDbConnection cn, string singalId)
        {
            try
            {
                provider.InsertSignal(cn, singalId);

            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBInsertDataErr, "YZSysSignal", e.Message);
            }
        }

        #endregion
    }
}