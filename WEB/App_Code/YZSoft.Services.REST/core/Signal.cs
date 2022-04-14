using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using BPM.Client.Notify;
using System.Data;
using YZSoft.Web.DAL;
using YZSoft.Signal;

namespace YZSoft.Services.REST.core
{
    public class SignalHandler : YZServiceHandler
    {
        public virtual object WaitSignal(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string signalId = request.GetString("signalId");

            int count;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    count = SignalManager.GetSignalCount(provider,cn,signalId);
                    if (count != 0)
                        SignalManager.DeleteSignal(provider, cn, signalId);
                }
            }

            if (count != 0)
            {
                return new
                {
                    success = true
                };
            }
            else
            {
                return new
                {
                    success = false
                };
            }
        }

        public virtual object InsertSignal(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string signalId = request.GetString("signalId");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    SignalManager.InsertSignal(provider, cn, signalId);
                }
            }

            return new
            {
                success = true
            };
        }
    }
}