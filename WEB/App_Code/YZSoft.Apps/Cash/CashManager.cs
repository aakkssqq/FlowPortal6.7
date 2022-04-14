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
    public class CashManager
    {
        private static CashManager _instance = null;

        static CashManager()
        {
            CashManager._instance = new CashManager();
        }

        #region 公共属性

        internal static CashManager Instance
        {
            get
            {
                return CashManager._instance;
            }
        }

        #endregion

        public static void Update(IYZDbProvider provider, IDbConnection cn, Cash cash)
        {
            try
            {
                provider.Update(cn, cash);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZAppNotesCash", e.Message);
            }
        }

        public static void Insert(IYZDbProvider provider, IDbConnection cn, Cash cash)
        {
            try
            {
                provider.Insert(cn, cash);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBInsertDataErr, "YZAppNotesCash", e.Message);
            }
        }

        #region 服务

        public static PageResult GetCashs(IYZDbProvider provider, IDbConnection cn, string account, string filter, string sort, int startRowIndex, int rows)
        {
            try
            {
                using (IDataReader reader = provider.GetNotesCashs(cn, account, filter, sort, startRowIndex, rows))
                {
                    PageResult result = provider.LoadPageResult(reader);

                    result.RegularColumnsName(new string[] {
                        "ItemID",
                        "Account",
                        "Type",
                        "Date",
                        "Amount",
                        "Invoice",
                        "Comments",
                        "CreateAt"
                    });

                    return result;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppNotesCash", e.Message);
            }
        }

        public static Cash GetCash(IYZDbProvider provider, IDbConnection cn, int itemid)
        {
            Cash cash = null;
            try
            {
                using (YZReader reader = new YZReader(provider.GetNotesCash(cn, itemid)))
                {
                    if (reader.Read())
                        cash = new Cash(reader);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppNotesCash", e.Message);
            }

            if (cash == null)
                throw new BPMException(String.Format(Resources.YZStrings.Aspx_RecordNotExist, itemid));

            return cash;
        }

        public static void DeleteCash(IYZDbProvider provider, IDbConnection cn, int itemid)
        {
            try
            {
                provider.DeleteNotesCash(cn, itemid);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZAppNotesCash", e.Message);
            }
        }

        #endregion
    }
}