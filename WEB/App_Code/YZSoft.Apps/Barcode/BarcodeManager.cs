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
    public class BarcodeManager
    {
        private static BarcodeManager _instance = null;

        static BarcodeManager()
        {
            BarcodeManager._instance = new BarcodeManager();
        }

        #region 公共属性

        internal static BarcodeManager Instance
        {
            get
            {
                return BarcodeManager._instance;
            }
        }

        #endregion

        public static void Update(IYZDbProvider provider, IDbConnection cn, Barcode barcode)
        {
            try
            {
                provider.Update(cn, barcode);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZAppNotesBarcode", e.Message);
            }
        }

        public static void Insert(IYZDbProvider provider, IDbConnection cn, Barcode barcode)
        {
            try
            {
                provider.Insert(cn, barcode);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBInsertDataErr, "YZAppNotesBarcode", e.Message);
            }
        }

        #region 服务

        public static PageResult GetBarcodes(IYZDbProvider provider, IDbConnection cn, string account, string filter, string sort, int startRowIndex, int rows)
        {
            try
            {
                using (IDataReader reader = provider.GetNotesBarcodes(cn, account, filter, sort, startRowIndex, rows))
                {
                    PageResult result = provider.LoadPageResult(reader);

                    result.RegularColumnsName(new string[] {
                        "ItemID",
                        "Account",
                        "Barcode",
                        "Format",
                        "ProductName",
                        "Comments",
                        "CreateAt"
                    });

                    return result;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppNotesBarcode", e.Message);
            }
        }

        public static Barcode GetBarcode(IYZDbProvider provider, IDbConnection cn, int itemid)
        {
            Barcode barcode = null;
            try
            {
                using (YZReader reader = new YZReader(provider.GetNotesBarcode(cn, itemid)))
                {
                    if (reader.Read())
                        barcode = new Barcode(reader);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppNotesBarcode", e.Message);
            }

            if (barcode == null)
                throw new BPMException(String.Format(Resources.YZStrings.Aspx_RecordNotExist, itemid));

            return barcode;
        }

        public static void DeleteBarcode(IYZDbProvider provider, IDbConnection cn, int itemid)
        {
            try
            {
                provider.DeleteNotesBarcode(cn, itemid);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZAppNotesBarcode", e.Message);
            }
        }

        #endregion
    }
}