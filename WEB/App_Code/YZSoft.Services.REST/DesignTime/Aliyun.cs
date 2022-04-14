using BPM.Client;
using System;
using System.CodeDom;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Web;
using System.Web.Services.Description;
using System.Web.Services.Protocols;
using System.Xml.Serialization;
using Newtonsoft.Json.Schema.Generation;
using Newtonsoft.Json.Schema;
using Newtonsoft.Json.Linq;
using Aliyun.Acs.Core;
using Aliyun.Acs.Core.Profile;
using Aliyun.Acs.Core.Exceptions;
using Aliyun.Acs.Core.Http;
using System.Text;

namespace YZSoft.Services.REST.DesignTime
{
    public partial class AliyunHandler : YZServiceHandler
    {
        private T DecodeResponse<T>(CommonResponse response)
        {
            JObject jResponse = this.DecodeResponse(response);
            return jResponse.ToObject<T>();
        }

        private JObject DecodeResponse(CommonResponse response)
        {
            string responseText = Encoding.UTF8.GetString(response.HttpResponse.Content);
            JObject jResponse = JObject.Parse(responseText);
            string message = (string)jResponse["Message"];
            if (message != "OK")
                throw new Exception(message);

            return jResponse;
        }

        private IClientProfile OpenConnection(string connectionName)
        {
            AliyunConnectionInfo cnInfo = this.GetConnectionInfo(connectionName);
            string accessKeyId = "LTAI4FvAPsEAxM9uLrZrXWVB";
            string accessSecret = "wH7fU07GjeIhbEdZlvL7zaZklvt9wX";
            string regionId = "cn-hangzhou";
            IClientProfile profile = DefaultProfile.GetProfile(regionId, accessKeyId, accessSecret);
            return profile;

        }
        private AliyunConnectionInfo GetConnectionInfo(string connectionName)
        {
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                ConnectionInfo cnInfo = ConnectionInfo.OpenByName(cn, connectionName);
                AliyunConnectionInfo cnContent = cnInfo.Cn.ToObject<AliyunConnectionInfo>();
                return cnContent;
            }
        }
    }

    [DataContract]
    internal class AliyunConnectionInfo
    {
        [DataMember]
        public string accessKeyId;
        [DataMember]
        public string accessSecret;
        [DataMember]
        public string regionId;
        [DataMember]
        public int timeout;
    }
}