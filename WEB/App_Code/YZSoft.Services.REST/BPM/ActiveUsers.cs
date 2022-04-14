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
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;

namespace YZSoft.Services.REST.BPM
{
    public class ActiveUsersHandler : YZServiceHandler
    {
        public virtual object GetOnlineUsers(HttpContext context)
        {
            YZRequest request = new YZRequest(context);

            //获得数据
            ActiveUserCollection activeUsers = new ActiveUserCollection();
            int rowcount;
            int allOnlineUserCount = 0;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                activeUsers = LoginManager.GetActiveUsers(cn, 1200, null, request.GetSortString("LastActiveDate DESC"), request.Start, request.Limit, out rowcount);
                allOnlineUserCount = LoginManager.GetActiveUserCount(cn, 1200);
            }

            List<object> data = new List<object>();
            foreach (ActiveUser user in activeUsers)
            {
                data.Add(
                    new
                    {
                        Account = user.Account,
                        DisplayName = user.DisplayName,
                        Mobile = user.Mobile,
                        OfficePhone = user.OfficePhone,
                        EMail = user.EMail,
                        LastActiveDate = user.LastActiveDate
                    }
                );
            }

            return new
            {
                success = true,
                total = rowcount,
                metaData = new {
                    allOnlineUserCount = allOnlineUserCount
                },
                children = data
            };
        }

        public virtual object GetSystemUsers(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            IYZDbProvider provider = YZDbProviderManager.DefaultProvider;

            //获得数据
            ActiveUserCollection activeUsers = new ActiveUserCollection();
            int rowcount;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                activeUsers = LoginManager.GetSystemUsers(cn, 30, this.GetFilterStringSystemUsers(request, provider), request.GetSortString("LastActiveDate DESC"), request.Start, request.Limit, out rowcount);
            }

            List<object> data = new List<object>();
            foreach (ActiveUser user in activeUsers)
            {
                data.Add(
                    new
                    {
                        Account = user.Account,
                        DisplayName = user.DisplayName,
                        Mobile = user.Mobile,
                        OfficePhone = user.OfficePhone,
                        EMail = user.EMail,
                        LastActiveDate = user.LastActiveDate
                    }
                );
            }
            
            return new
            {
                success = true,
                total = rowcount,
                children = data
            };
        }

        public virtual string GetFilterStringSystemUsers(YZRequest request,IYZDbProvider provider)
        {
            string filter = null;

            string searchType = request.GetString("searchType",null);
            string keyword = request.GetString("kwd", null);

            string accountLike = null;
            string displayNameLike = null;
            string officePhoneLike = null;
            string emailLike = null;
            string hridLike = null;

            if (!String.IsNullOrEmpty(keyword))
            {
                accountLike = String.Format("Account LIKE('%{0}%')", provider.EncodeText(keyword));
                displayNameLike = String.Format("DisplayName LIKE('%{0}%')", provider.EncodeText(keyword));
                officePhoneLike = String.Format("OfficePhone LIKE('%{0}%')", provider.EncodeText(keyword));
                emailLike = String.Format("EMail LIKE('%{0}%')", provider.EncodeText(keyword));
                hridLike = String.Format("HRID LIKE('%{0}%')", provider.EncodeText(keyword));
            }

            filter = provider.CombinCondOR(
                filter,
                accountLike,
                displayNameLike,
                officePhoneLike,
                emailLike,
                hridLike);

            return filter;
        }
    }
}