using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using YZSoft.Web.DAL;
using BPM;
using BPM.Client;

namespace YZSoft.Web.Mobile
{
    public class DeviceManager
    {
        private static DeviceManager _instance = null;

        static DeviceManager()
        {
            DeviceManager._instance = new DeviceManager();
        }

        #region 公共属性

        internal static DeviceManager Instance
        {
            get
            {
                return DeviceManager._instance;
            }
        }

        #endregion

        public static void Update(IYZDbProvider provider, IDbConnection cn, Device device)
        {
            try
            {
                provider.Update(cn, device);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZSysMobileDevice", e.Message);
            }
        }

        public static void Insert(IYZDbProvider provider, IDbConnection cn, Device device)
        {
            try
            {
                provider.Insert(cn, device);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBInsertDataErr, "YZSysMobileDevice", e.Message);
            }
        }

        #region 服务

        public static PageResult GetUserDevices(IYZDbProvider provider, IDbConnection cn, string account, string filter, string sort, int startRowIndex, int rows)
        {
            try
            {
                using (IDataReader reader = provider.GetUserDevices(cn, account, filter, sort, startRowIndex, rows))
                {
                    PageResult result = provider.LoadPageResult(reader);

                    result.RegularColumnsName(new string[] {
                        "Account",
                        "UUID",
                        "Name",
                        "Model",
                        "Description",
                        "RegisterAt",
                        "Disabled",
                        "LastLogin"
                    });

                    return result;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZSysMobileDevice", e.Message);
            }
        }

        public static Device TryGetDevice(IYZDbProvider provider, IDbConnection cn, string account, string uuid)
        {
            Device device = null;
            try
            {
                using (YZReader reader = new YZReader(provider.GetDevice(cn, account, uuid)))
                {
                    if (reader.Read())
                        device = new Device(reader);
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZSysMobileDevice", e.Message);
            }

            return device;
        }

        public static Device GetDevice(IYZDbProvider provider, IDbConnection cn, string account, string uuid)
        {
            Device device = TryGetDevice(provider, cn, account, uuid);

            if (device == null)
                throw new BPMException(String.Format(Resources.YZStrings.Aspx_MobileDevice_Ext_DeviceNotExist, account, uuid));

            return device;
        }

        public static void DeleteDevice(IYZDbProvider provider, IDbConnection cn, string account, string uuid)
        {
            try
            {
                provider.DeleteDevice(cn, account, uuid);
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZSysMobileDevice", e.Message);
            }
        }

        public static PageResult GetDevices(IYZDbProvider provider, IDbConnection cn, string filter, string sort, int startRowIndex, int rows)
        {
            try
            {
                using (IDataReader reader = provider.GetDevices(cn, filter, sort, startRowIndex, rows))
                {
                    PageResult result = provider.LoadPageResult(reader);

                    result.RegularColumnsName(new string[] {
                        "Account",
                        "UUID",
                        "Name",
                        "Model",
                        "Description",
                        "RegisterAt",
                        "Disabled",
                        "LastLogin"
                    });

                    return result;
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZSysMobileDevice", e.Message);
            }
        }

        #endregion
    }
}