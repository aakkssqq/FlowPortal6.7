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
    public class FormHandler : YZServiceHandler
    {
        public virtual object GetMobileFormSetting(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string processName = request.GetString("processName");
            Version version = request.GetVersion("version");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                return new
                {
                    tables = BPMProcess.GetProcessGlobalTableIdentitys(cn, processName, version),
                    mobileFormSetting = BPMProcess.GetMobileFormSetting(cn, processName, version)
                };
            }
        }

        public virtual void SaveMobileFormSetting(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string processName = request.GetString("processName");
            Version version = request.GetVersion("version");

            JObject post = request.GetPostData<JObject>();
            MobileFormSetting mobileFormSetting = post.ToObject<MobileFormSetting>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                BPMProcess.SaveMobileFormSetting(cn, processName, version, mobileFormSetting);
            }
        }

        public virtual DataTable GetFormFields(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return MobileManager.GetFormFields(provider,cn);
                }
            }
        }

        public virtual DataTable GetFormRenders(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return MobileManager.GetFormRenders(provider, cn);
                }
            }
        }
    }
}