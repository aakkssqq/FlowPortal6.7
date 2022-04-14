using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;
using BPM;
using BPM.Client;
using BPM.Client.Security;

namespace YZSoft.Services.REST.BPM
{
    public class PostHandler : YZServiceHandler
    {
        public virtual object Post(HttpContext context)
        {
            YZRequest request = new YZRequest(context);

            this.ApproveCheck(context);

            StringBuilder sb = new StringBuilder();

            //if (String.Compare(YZAuthHelper.LoginUserAccount, "usera06", true) == 0)
            //{
            //using (FileStream fs = new FileStream(@"d:\aaa.xml", FileMode.Create, FileAccess.Write))
            //{
            //    byte[] bytes = new byte[context.Request.InputStream.Length];
            //    context.Request.InputStream.Read(bytes, 0, (int)context.Request.InputStream.Length);
            //    fs.Write(bytes, 0, bytes.Length);
            //}
            //context.Request.InputStream.Seek(0, SeekOrigin.Begin);
            //}

            //qqw888
            //XmlDocument doc = new XmlDocument { XmlResolver = null };
            //doc.Load(context.Request.InputStream);
            //doc.Save("e:\\aaa.xml");//需要打开网站的写权限，和C盘EveryOne的写权限

            System.Globalization.CultureInfo cultureInfo = System.Threading.Thread.CurrentThread.CurrentCulture;
            if (cultureInfo.LCID != 1033 && //en-us
                cultureInfo.LCID != 2052 && //中文 - 中华人民共和国
                cultureInfo.LCID != 3076 && //中文 - 中华人民共和国香港特别行政区
                cultureInfo.LCID != 4100 && //中文 - 新加坡
                cultureInfo.LCID != 1028 && //中文 - 台湾地区
                cultureInfo.LCID != 1041) //日语
            {
                System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(1033);
            }

            PostResult postResult = null;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                postResult = BPMProcess.Post(cn, context.Request.InputStream);
            }

            List<object> recipients = new List<object>();
            foreach (StepRecipient recp in postResult.Recipients)
            {
                recipients.Add(
                    new{
                        Account = recp.Owner.Account,
                        DisplayName = YZStringHelper.GetRecpientDisplayName(recp)
                    }
                );
            }

            List<object> indicators = new List<object>();
            foreach (User indicateUser in postResult.InviteIndicateUsers)
            {
                indicators.Add(
                    new
                    {
                        Account = YZStringHelper.GetUserFriendlyName(indicateUser.Account, indicateUser.DisplayName)
                    }
                );
            }

            List<object> informs = new List<object>();
            foreach (User informUser in postResult.InformUsers)
            {
                indicators.Add(
                    new
                    {
                        Account = YZStringHelper.GetUserFriendlyName(informUser.Account, informUser.DisplayName)
                    }
                );
            }

            return new
            {
                success = true,
                PostResult = postResult.PostResultType.ToString(),
                SN = postResult.SN,
                Key = postResult.Key,
                TaskID = postResult.TaskID,
                CustomMessage = postResult.CustomMessage,
                Accounts = recipients,
                Indicators = indicators,
                Informs = informs
            };
        }
    }
}