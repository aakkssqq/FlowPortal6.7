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

namespace YZSoft.Services.REST.core
{
    public class BasicHandler : YZServiceHandler
    {
        public virtual object GenGuid(HttpContext context)
        {
            return new
            {
                success = true,
                guid = Guid.NewGuid().ToString()
            };
        }

        public virtual List<object> GetACEDisplayName(HttpContext context)
        {
            YZRequest request = new YZRequest(context);

            List<object> rv = new List<object>();

            JsonSerializer serializer = new JsonSerializer();
            StreamReader reader = new StreamReader(context.Request.InputStream);
            using (JsonTextReader streamReader = new JsonTextReader(reader))
            {
                JArray @params = serializer.Deserialize(streamReader) as JArray;

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    foreach (JObject jAce in @params)
                    {
                        ACE ace = jAce.ToObject<ACE>(serializer);

                        rv.Add(new {
                            DisplayName = ace.GetSIDDisplayName(cn)
                        });
                    }
                }
            }

            return rv;
        }

        public virtual NotifyProviderInfoCollection GetNotifyProviders(HttpContext context)
        {
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return NotifyManager.GetProviders(cn);
            }
        }

        public virtual MessageGroupCollection GetServerNotifyMessages(HttpContext context)
        {
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return NotifyManager.GetDefaultNotifyMessages(cn);
            }
        }

        public virtual void SaveServerNotifyMessageCat(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            MessageCat messageCat = request.GetEnum<MessageCat>("messageCat");

            JArray post = request.GetPostData<JArray>();
            MessageItemCollection messageItems = post.ToObject<MessageItemCollection>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                MessageGroupCollection messageGroups = NotifyManager.GetDefaultNotifyMessages(cn);
                messageGroups[messageCat.ToString()].MessageItems = messageItems;
                NotifyManager.SaveDefaultNotifyMessages(cn, messageGroups);
            }
        }

        public virtual JObject GetFileUploadAccessParams(HttpContext context)
        {
            JObject rv = new JObject();
            rv["UploadAuthorAccount"] = YZAuthHelper.LoginUserAccount;
            rv["UploadAuthorToken"] = YZSecurityHelper.GenFileUploadToken();
            return rv;
        }

        public virtual AccountSelfServicesSetting GetAccountSelfServiceSetting(HttpContext context)
        {
            AccountSelfServicesSetting setting = new AccountSelfServicesSetting();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                setting.Load(cn);
            }

            return setting;
        }

        public virtual void SaveAccountSelfServiceSetting(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JObject post = request.GetPostData<JObject>();
            AccountSelfServicesSetting setting = post.ToObject<AccountSelfServicesSetting>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                setting.Save(cn);
            }
        }

        public virtual JObject GetServerInfo(HttpContext context)
        {
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                JObject rv = JObject.FromObject(cn.GetSysInfo());
                rv["Now"] = DateTime.Now;
                return rv;
            }
        }

        public virtual object GetTempStorageData(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string id = request.GetString("id");

            object data = YZTempStorageManager.CurrentStore.Load(id);
            YZTempStorageManager.CurrentStore.Delete(id);
            return data;
        }

        public virtual void SetLanguage(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int lcid = request.GetInt32("lcid");
            YZAuthHelper.SetLangPersistent(lcid);
        }
    }
}