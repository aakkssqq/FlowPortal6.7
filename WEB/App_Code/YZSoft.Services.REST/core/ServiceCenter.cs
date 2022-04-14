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
using BPM.Client.Security;
using BPM.Client.Notify;
using YZSoft.Web.DAL;
using YZSoft.Web.ServiceCenter;
using YZSoft.Web.Push;

namespace YZSoft.Services.REST.core
{
    public class ServiceCenterHandler : YZServiceHandler
    {
        public virtual ServiceContactsCollection GetAllContacts(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string product = request.GetString("product");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return ServiceCenterManager.GetAllContacts(provider,cn, product);
                }
            }
        }
    }
}