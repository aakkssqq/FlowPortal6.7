using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using System.IO;
using MySql.Data.MySqlClient;
using System.Collections.Specialized;
using System.Data;
using Newtonsoft.Json.Schema.Generation;
using Newtonsoft.Json.Schema;
using System.Runtime.Serialization;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using YZSoft.Web.JSchema.Generation;

namespace YZSoft.Services.REST.DesignTime
{
    public class K3WISEHandler : YZServiceHandler
    {
        public JObject GetTemplate(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");
            string api = request.GetString("api");

            K3WISECnnProperties k3cnInfo = this.GetConnectionInfo(connectionName);
            string token = this.GetToken(k3cnInfo.address, k3cnInfo.authorityCode).Token;


            string address = UrlUtil.CombineUrl(k3cnInfo.address, api, "GetTemplate");
            byte[] rData;
            using (WebClient wc = new WebClient())
            {
                UrlBuilder url = new UrlBuilder(address);
                url.QueryString["token"] = token;

                rData = wc.DownloadData(url.ToString());
            }

            string responseText = Encoding.UTF8.GetString(rData);
            JObject jResponse = JObject.Parse(responseText);
            int statusCode = (int)jResponse["StatusCode"];
            if (statusCode != 200)
                throw new Exception((string)jResponse["Message"]);

            JObject jData = (JObject)jResponse["Data"];

            SampleJsonSchemaGenerator generate = new SampleJsonSchemaGenerator();
            return generate.Generate(jData) as JObject;
        }

        protected K3WISECnnProperties GetConnectionInfo(BPMConnection cn, string connectionName)
        {
            ConnectionInfo cnInfo = ConnectionInfo.OpenByName(cn, connectionName);
            return cnInfo.Cn.ToObject<K3WISECnnProperties>();
        }

        protected K3WISECnnProperties GetConnectionInfo(string connectionName)
        {
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return this.GetConnectionInfo(cn, connectionName);
            }
        }

        protected K3WISETokenData GetToken(string address, string authorityCode)
        {
            address = UrlUtil.CombineUrl(address, "Token/Create");

            byte[] rData;
            using (WebClient wc = new WebClient())
            {
                UrlBuilder url = new UrlBuilder(address);
                url.QueryString["authorityCode"] = authorityCode;

                wc.Encoding = Encoding.UTF8;
                rData = wc.DownloadData(url.ToString());
            }

            //{
            //  "StatusCode": 200,
            //  "Message": "Token申请成功!",
            //  "Data": {
            //    "Token": "B647F2755A728CF868F29785831F09E78D4E94E050560ADE57451341D350FC6DD5E5D4CDEC1EFD9C",
            //    "Code": "Y",
            //    "Validity": 3600.0,
            //    "IPAddress": "127.0.0.1",
            //    "Language": "CHS",
            //    "Create": "2017-07-28 10:47:47"
            //  }
            //}               
            string responseText = Encoding.UTF8.GetString(rData);
            JObject jResponse = JObject.Parse(responseText);
            int statusCode = (int)jResponse["StatusCode"];
            if (statusCode != 200)
                throw new Exception((string)jResponse["Message"]);

            JObject jData = (JObject)jResponse["Data"];
            return jData.ToObject<K3WISETokenData>();
        }
    }

    [DataContract]
    public class K3WISECnnProperties
    {
        [DataMember]
        public string address;
        [DataMember]
        public string authorityCode;
        [DataMember]
        public int timeout;
    }

    [DataContract]
    public class K3WISETokenData
    {
        [DataMember]
        public string Token;
        [DataMember]
        public string Code;
        [DataMember]
        public decimal Validity;
        [DataMember]
        public string IPAddress;
        [DataMember]
        public string Language;
        [DataMember]
        public DateTime Create;
    }
}