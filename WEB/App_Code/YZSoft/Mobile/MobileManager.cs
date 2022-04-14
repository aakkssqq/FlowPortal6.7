using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using Newtonsoft.Json.Linq;
using YZSoft.Web.DAL;

/// <summary>
///Employee 的摘要说明
/// </summary>
///
namespace YZSoft.Web.Mobile
{
    public class MobileManager
    {
        public static DataTable GetFormFields(IYZDbProvider provider, IDbConnection cn)
        {
            try
            {
                using (IDataReader reader = provider.GetMobileFormFields(cn))
                {
                    DataTable table = provider.Load(reader);
                    table.Columns[0].ColumnName = "XClass";
                    table.Columns[1].ColumnName = "Desc";
                    return table;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "BPMSysMobileAppFormFields", e);
            }
        }

        public static DataTable GetFormRenders(IYZDbProvider provider, IDbConnection cn)
        {
            try
            {
                using (IDataReader reader = provider.GetMobileFormRenders(cn))
                {
                    DataTable table = provider.Load(reader);
                    table.Columns[0].ColumnName = "Render";
                    table.Columns[1].ColumnName = "Sample";
                    table.Columns[2].ColumnName = "Desc";
                    return table;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "BPMSysMobileAppFormRenders", e);
            }
        }
    }
}