using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Notify;
using BPM.Client.Security;
using YZSoft.Web.DAL;
using YZSoft.Web.Mobile;

namespace YZSoft.Services.REST.Mobile
{
    public class DeviceHandler : YZServiceHandler
    {
        public virtual PageResult GetDevicesList(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = request.GetString("uid", null);
            PageResult result;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    if (String.IsNullOrEmpty(uid))
                        result = DeviceManager.GetDevices(provider, cn, null, request.GetSortString("LastLogin DESC"), request.Start, request.Limit);
                    else
                        result = DeviceManager.GetUserDevices(provider, cn, uid, null, request.GetSortString("LastLogin DESC"), request.Start, request.Limit);


                }

                result.Table.Columns.Add("UserShortName");
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach (DataRow row in result.Table.Rows)
                    {
                        string account = Convert.ToString(row["Account"]);
                        User user = User.TryGetUser(cn, account);
                        if (user != null)
                            row["UserShortName"] = user.ShortName;
                    }
                }
            }

            return result;
        }

        public virtual void DisableDevice(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = request.GetString("uid");
            string UUID = request.GetString("UUID");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    Device device = DeviceManager.GetDevice(provider, cn, uid, UUID);
                    device.Disabled = true;
                    DeviceManager.Update(provider, cn, device);
                }
            }
        }

        public virtual void EnableDevice(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = request.GetString("uid");
            string UUID = request.GetString("UUID");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    Device device = DeviceManager.GetDevice(provider, cn, uid, UUID);
                    device.Disabled = false;
                    DeviceManager.Update(provider, cn, device);
                }
            }
        }
    }
}