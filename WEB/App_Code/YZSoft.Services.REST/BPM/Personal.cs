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
using BPM.Client.Notify;
using YZSoft.Web.Org;

namespace YZSoft.Services.REST.BPM
{
    public class PersonalHandler : YZServiceHandler
    {
        public virtual JObject GetCurrentNotificationSetting(HttpContext context)
        {
            string account = YZAuthHelper.LoginUserAccount;
            
            NotifyProviderInfoCollection providers;
            UserCommonInfo userCommonInfo;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                providers = NotifyManager.GetProviders(cn);
                userCommonInfo = UserCommonInfo.FromAccount(cn, account);
            }

            JObject rv = new JObject();
            JArray jProviders = new JArray();
            rv["providers"] = jProviders;
            foreach (NotifyProviderInfo provider in providers)
            {
                JObject jProvider = new JObject();
                jProviders.Add(jProvider);

                jProvider["ProviderName"] = provider.Name;
                jProvider["Enabled"] = !userCommonInfo.RejectedNotifys.Contains(provider.Name);
            }

            rv[YZJsonProperty.success] = true;
            return rv;
        }

        public virtual void SaveNotificationSetting(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string account = YZAuthHelper.LoginUserAccount;
            BPMObjectNameCollection rejectedNotifys = BPMObjectNameCollection.FromStringList(request.GetString("rejectedNotifys",""), ';');

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                User.SaveNotifySetting(cn, YZAuthHelper.LoginUserAccount, rejectedNotifys);
            }
        }

        public virtual JObject GetCurrentLeavingSetting(HttpContext context)
        {
            string account = YZAuthHelper.LoginUserAccount;
            
            UserCommonInfo userCommonInfo;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                userCommonInfo = UserCommonInfo.FromAccount(cn, account);
            }

            JObject rv = new JObject();
            rv["State"] = userCommonInfo.OutOfOfficeState.ToString();
            rv["From"] = userCommonInfo.OutOfOfficeFrom;
            rv["To"] = userCommonInfo.OutOfOfficeTo;

            rv[YZJsonProperty.success] = true;
            return rv;
        }

        public virtual void SaveLeavingSetting(HttpContext context)
        {
            string account = YZAuthHelper.LoginUserAccount;
            YZRequest request = new YZRequest(context);

            OutOfOfficeState state = request.GetEnum<OutOfOfficeState>("State");
            DateTime from = request.GetDateTime("From",DateTime.MinValue);
            DateTime to = request.GetDateTime("To", DateTime.MinValue);
            
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                User.SetOutOfOffice(cn, account, state, from, to);
            }      
        }

        public virtual object GetLoginUserInfo(HttpContext context)
        {
            string account = YZAuthHelper.LoginUserAccount;

            User user;
            AccountSelfServicesSetting setting = new AccountSelfServicesSetting();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                user = User.FromAccount(cn, account);
                setting.Load(cn);
            }

            return new
            {
                success = true,
                user = user,
                setting = setting
            };
        }

        public virtual object GetLoginUserOrgRelationship(HttpContext context)
        {
            string account = YZAuthHelper.LoginUserAccount;
            
            List<object> rvPositions = new List<object>();
            List<object> supervisors = new List<object>();
            List<object> directXSs = new List<object>();
            List<object> roles = new List<object>();
            object[] groups;
            
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                MemberCollection positions = OrgSvr.GetUserPositions(cn, account);
                foreach (Member member in positions)
                {
                    rvPositions.Add(
                        new
                        {
                            ou = member.GetParentOU(cn).GetFriendlyFullName(cn),
                            LeaderTitle = member.LeaderTitle,
                            Level = member.Level
                        }
                    );

                    supervisors.AddRange(OrgManager.GetSupervisors(cn, member.FullName,false));
                    directXSs.AddRange(OrgManager.GetDirectXSs(cn, member.FullName,false));
                    roles.AddRange(OrgManager.GetRoles(cn, member.FullName));
                }

                groups = OrgManager.GetGroups(cn, account);
            }

            return new {
                success = true,
                positions = rvPositions,
                supervisors = supervisors,
                directxss = directXSs,
                roles = roles,
                groups = groups
            };
        }

        public virtual void SaveUserInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string account = YZAuthHelper.LoginUserAccount;

            JArray @params = request.GetPostData<JArray>();
            JObject jUserInfo = (JObject)@params[0];
            User userNew = jUserInfo.ToObject<User>(request.Serializer);
            Type userType = typeof(User);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                User user = User.FromAccount(cn, account);
                foreach (KeyValuePair<string, JToken> kv in jUserInfo)
                {
                    if (NameCompare.EquName(kv.Key, "Account"))
                        continue;

                    System.Reflection.PropertyInfo prop = userType.GetProperty(kv.Key);
                    if (prop != null)
                    {
                        prop.SetValue(user, prop.GetValue(userNew, null), null);
                    }
                }

                User.Update(cn, account, user);
            }
        }

        public virtual void ChangePassword(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string account = YZAuthHelper.LoginUserAccount;
            string orgPwd = request.GetString("OrgPassword","");
            string newPwd = request.GetString("NewPassword","");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                User.ChangePassword(cn, account , orgPwd, newPwd);
            }
        }
    }
}