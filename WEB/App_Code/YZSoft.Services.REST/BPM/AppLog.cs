using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Runtime.Serialization.Json;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Data;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;
using YZSoft.Web.Log;

namespace YZSoft.Services.REST.BPM
{
    public class AppLogHandler : YZServiceHandler
    {
        public virtual object GetAppLog(HttpContext context)
        {
            YZRequest request = new YZRequest(context);

            BPMObjectNameCollection sids;
            using (BPMConnection bpmcn = new BPMConnection())
            {
                bpmcn.WebOpen();
                sids = bpmcn.Token.SIDs;
            }

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return LogManager.GetLog(provider, cn, sids, request.GetDateTime("date"), this.GetFilterString(request, provider), request.GetSortString("LogDate DESC"), request.Start, request.Limit);
                }
            }
        }

        protected virtual string GetFilterString(YZRequest request, IYZDbProvider provider)
        {
            string filter = null;

            string searchType = request.GetString("searchType", null);
            string keyword = request.GetString("kwd", null);

            string clienIPLike = null;
            string accountLike = null;
            string actionLike = null;
            string actParam1Like = null;
            string actParam2Like = null;
            string errLike = null;

            if (!String.IsNullOrEmpty(keyword))
            {
                clienIPLike = String.Format("ClientIP LIKE(N'%{0}%')", provider.EncodeText(keyword));
                accountLike = String.Format("UserAccount LIKE(N'%{0}%')", provider.EncodeText(keyword));
                actionLike = String.Format("Action LIKE(N'%{0}%')", provider.EncodeText(keyword));
                actParam1Like = String.Format("ActParam1 LIKE(N'%{0}%')", provider.EncodeText(keyword));
                actParam2Like = String.Format("ActParam2 LIKE(N'%{0}%')", provider.EncodeText(keyword));
                errLike = String.Format("Error LIKE(N'%{0}%')", provider.EncodeText(keyword));
            }

            if (YZStringHelper.EquName(searchType, "AdvancedSearch"))
            {
                string account = request.GetString("Account",null);
                string action = request.GetString("Action", null);
                string result = request.GetString("Result", null);
                string clientIP = request.GetString("ClientIP", null);

                string keywordFilter = null;

                if (!String.IsNullOrEmpty(account))
                    filter = provider.CombinCond(filter, String.Format("UserAccount=N'{0}'", provider.EncodeText(account)));
                else
                    keywordFilter = provider.CombinCondOR(keywordFilter, accountLike);

                if (action != "all")
                    filter = provider.CombinCond(filter, String.Format("Action=N'{0}'", provider.EncodeText(action)));
                else
                    keywordFilter = provider.CombinCondOR(keywordFilter, actionLike);

                if (result == YZJsonProperty.success)
                    filter = provider.CombinCond(filter, "Succeed=1");
                if (result == "Failed")
                    filter = provider.CombinCond(filter, "Succeed=0");

                if (!String.IsNullOrEmpty(clientIP))
                    filter = provider.CombinCond(filter, String.Format("ClientIP=N'{0}'", provider.EncodeText(clientIP)));
                else
                    keywordFilter = provider.CombinCondOR(keywordFilter, clienIPLike);

                if (!String.IsNullOrEmpty(keyword))
                {
                    keywordFilter = provider.CombinCondOR(keywordFilter, actParam1Like);
                    keywordFilter = provider.CombinCondOR(keywordFilter, actParam2Like);
                    keywordFilter = provider.CombinCondOR(keywordFilter, errLike);
                }

                filter = provider.CombinCond(filter, keywordFilter);
            }

            return filter;
        }
    }
}