using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web;
using System.Threading;
using System.Net;
using System.Text;
using System.IO;
using System.Security.Cryptography;
using System.Net.Mime;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;

namespace YZSoft.Web.DingTalk
{
    public class DingTalkManager
    {
        private AccessTokenCollection accessTokens = new AccessTokenCollection();
        private string jsapi_ticket = null;
        private DateTime jsapi_ticket_expiredate = DateTime.MinValue;

        private ReaderWriterLock RWLocker = new ReaderWriterLock();
        private int AcquireReadTimeOut = 30 * 1000;
        private int AcquireWriteTimeOut = 30 * 1000;
        private object ModifyLockObj = new object();

        private static DingTalkManager _instance = null;

        static DingTalkManager()
        {
            DingTalkManager._instance = new DingTalkManager();
        }

        #region 公共属性

        public static DingTalkManager Instance
        {
            get
            {
                return DingTalkManager._instance;
            }
        }

        #endregion

        #region 锁支持

        private void AcquireReaderLock()
        {
            this.RWLocker.AcquireReaderLock(this.AcquireReadTimeOut);
        }

        private void AcquireWriterLock()
        {
            this.RWLocker.AcquireWriterLock(this.AcquireWriteTimeOut);
        }

        private void UpgradeToWriterLock()
        {
            this.RWLocker.UpgradeToWriterLock(this.AcquireWriteTimeOut);
        }

        private void ReleaseLock()
        {
            this.RWLocker.ReleaseLock();
        }

        private void ReleaseReaderLock()
        {
            this.RWLocker.ReleaseReaderLock();
        }

        private void ReleaseWriterLock()
        {
            this.RWLocker.ReleaseWriterLock();
        }

        #endregion

        #region 对外服务

        //https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.pWvodE&treeId=385&articleId=104980&docType=1
        public virtual string GetAccessToken(string cropId, string appSecret)
        {
            this.AcquireReaderLock();
            try
            {
                AccessToken accessToken = this.accessTokens.Contains(appSecret) ? this.accessTokens[appSecret] : null;

                if (accessToken == null ||
                    (accessToken.expireDate - DateTime.Now).TotalSeconds < 60)
                {
                    this.UpgradeToWriterLock();

                    WebClient webClient = new WebClient();
                    webClient.Encoding = Encoding.UTF8;
                    webClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    webClient.Headers.Add(HttpRequestHeader.KeepAlive, "false");

                    YZUrlBuilder uri = new YZUrlBuilder("https://oapi.dingtalk.com/gettoken");
                    uri.QueryString["corpid"] = cropId;
                    uri.QueryString["corpsecret"] = appSecret;

                    DateTime now = DateTime.Now;
                    byte[] dataResult = webClient.DownloadData(uri.ToString());
                    string strResult = Encoding.UTF8.GetString(dataResult);

                    JObject rv = JObject.Parse(strResult);
                    if ((int)rv["errcode"] != 0)
                        throw new Exception((string)rv["errmsg"]);

                    string strAccessToken = (string)rv["access_token"];
                    double expiresin = 7200;

                    if (accessToken == null)
                    {
                        accessToken = new AccessToken();
                        accessToken.appSecret = appSecret;
                        this.accessTokens.Add(accessToken);
                    }

                    accessToken.accessToken = strAccessToken;
                    accessToken.expireDate = now + TimeSpan.FromSeconds(expiresin);
                }

                return accessToken.accessToken;
            }
            finally
            {
                this.ReleaseLock();
            }
        }

        //https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.UGqlWf&treeId=385&articleId=104966&docType=1
        public virtual string GetJSapiTicket(string accessToken)
        {
            this.AcquireReaderLock();
            try
            {
                if (String.IsNullOrEmpty(this.jsapi_ticket) ||
                    (this.jsapi_ticket_expiredate - DateTime.Now).TotalSeconds < 60)
                {
                    this.UpgradeToWriterLock();

                    WebClient webClient = new WebClient();
                    webClient.Encoding = Encoding.UTF8;
                    webClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    webClient.Headers.Add(HttpRequestHeader.KeepAlive, "false");

                    YZUrlBuilder uri = new YZUrlBuilder("https://oapi.dingtalk.com/get_jsapi_ticket");
                    uri.QueryString["access_token"] = accessToken;

                    DateTime now = DateTime.Now;
                    byte[] dataResult = webClient.DownloadData(uri.ToString());
                    string strResult = Encoding.UTF8.GetString(dataResult);

                    JObject rv = JObject.Parse(strResult);
                    if ((int)rv["errcode"] != 0)
                        throw new Exception((string)rv["errmsg"]);

                    string ticket = (string)rv["ticket"];
                    double expiresin = Convert.ToDouble(rv["expires_in"]);

                    this.jsapi_ticket = ticket;
                    this.jsapi_ticket_expiredate = now + TimeSpan.FromSeconds(expiresin);
                }

                return this.jsapi_ticket;
            }
            finally
            {
                this.ReleaseLock();
            }
        }

        //https://github.com/JackWangCUMT/DDHelper/blob/master/DingTalkAuth.cs
        public virtual string GenSigurate(string noncestr, string sTimeStamp, string jsapi_ticket, string url)
        {
            //例如：
            //noncestr = Zn4zmLFKD0wzilzM
            //jsapi_ticket = mS5k98fdkdgDKxkXGEs8LORVREiweeWETE40P37wkidkfksDSKDJFD5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcKIDU8l
            //timestamp = 1414588745
            //url = http://open.dingtalk.com

            //步骤1.sort()含义为对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）
            //注意，此处是是按照【字段名】的ASCII字典序，而不是参数值的字典序（这个细节折磨我很久了)
            //0:jsapi_ticket 1:noncestr 2:timestamp 3:url;

            //步骤2.assemble()含义为根据步骤1中获的参数字段的顺序，使用URL键值对的格式（即key1 = value1 & key2 = value2…）拼接成字符串
            //string assemble = "jsapi_ticket=3fOo5UfWhmvRKnRGMmm6cWwmIxDMCnniyVYL2fqcz1I4GNU4054IOlif0dZjDaXUScEjoOnJWOVrdwTCkYrwSl&noncestr=CUMT1987wlrrlw&timestamp=1461565921&url=https://jackwangcumt.github.io/home.html";
            string assemble = string.Format("jsapi_ticket={0}&noncestr={1}&timestamp={2}&url={3}", jsapi_ticket, noncestr, sTimeStamp, url);
            //步骤2.sha1()的含义为对在步骤2拼接好的字符串进行sha1加密。
            SHA1 sha;
            ASCIIEncoding enc;
            string hash = "";

            sha = new SHA1CryptoServiceProvider();
            enc = new ASCIIEncoding();
            byte[] dataToHash = enc.GetBytes(assemble);
            byte[] dataHashed = sha.ComputeHash(dataToHash);
            hash = BitConverter.ToString(dataHashed).Replace("-", "");
            hash = hash.ToLower();

            return hash;
        }

        //https://github.com/JackWangCUMT/DDHelper/blob/master/DingTalkAuth.cs
        public virtual string GetTimeStamp()
        {
            TimeSpan ts = DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0);
            return Convert.ToInt64(ts.TotalSeconds).ToString();
        }

        //https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.h16qh4&treeId=172&articleId=104969&docType=1
        public JObject GetUserInfoFromCode(string accessToken,string code)
        {
            WebClient webClient = new WebClient();
            webClient.Encoding = Encoding.UTF8;
            webClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            webClient.Headers.Add(HttpRequestHeader.KeepAlive, "false");

            YZUrlBuilder uri = new YZUrlBuilder("https://oapi.dingtalk.com/user/getuserinfo");
            uri.QueryString["access_token"] = accessToken;
            uri.QueryString["code"] = code;

            byte[] dataResult = webClient.DownloadData(uri.ToString());
            string strResult = Encoding.UTF8.GetString(dataResult);

            JObject rv = JObject.Parse(strResult);
            if ((int)rv["errcode"] != 0)
                throw new Exception((string)rv["errmsg"]);

            return rv;
        }

        //https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.h16qh4&treeId=172&articleId=104969&docType=1
        public string TryGetUserIdFromCode(string accessToken, string code)
        {
            JObject jUserInfo = this.GetUserInfoFromCode(accessToken, code);
            string userid = Convert.ToString(jUserInfo["userid"]);
            return userid;
        }

        #endregion

        public static AttachmentInfo DownloadTempMediaFile(string url, string ext)
        {
            WebClient webClient = new WebClient();
            webClient.Encoding = Encoding.UTF8;
            webClient.Headers.Add(HttpRequestHeader.KeepAlive, "false");

            using (Stream stream = webClient.OpenRead(url))
            {
                StreamReader reader = new StreamReader(stream);

                AttachmentInfo attachment = new AttachmentInfo();
                attachment.Name = "";
                attachment.Ext = ext;

                attachment = AttachmentManager.SaveAsAttachment(stream, attachment);
                return attachment;
            }
        }
    }
}