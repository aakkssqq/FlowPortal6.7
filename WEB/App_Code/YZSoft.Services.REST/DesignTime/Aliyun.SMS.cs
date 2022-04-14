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
using System.Text.RegularExpressions;

namespace YZSoft.Services.REST.DesignTime
{
    partial class AliyunHandler
    {
        private const string smsDomain = "dysmsapi.aliyuncs.com";
        private static Regex regexMessageParams = new Regex(@"\${\s*(?<name>[^\s}]+)\s*}");

        public object ParseSMSTemplateParamsSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string connectionName = request.GetString("connectionName");
            string templateCode = request.GetString("templateCode");

            IClientProfile profile = this.OpenConnection(connectionName);
            DefaultAcsClient client = new DefaultAcsClient(profile);
            CommonRequest aliRequest = new CommonRequest();
            aliRequest.Method = MethodType.POST;
            aliRequest.Domain = AliyunHandler.smsDomain;
            aliRequest.Version = "2017-05-25";
            aliRequest.Action = "QuerySmsTemplate";
            aliRequest.AddQueryParameters("TemplateCode", templateCode);

            CommonResponse response = client.GetCommonResponse(aliRequest);
            JObject jResponse = this.DecodeResponse(response);
            string templateContent = Convert.ToString(jResponse["TemplateContent"]);

            MatchCollection martches = AliyunHandler.regexMessageParams.Matches(templateContent);
            JObject rv = new JObject();
            foreach (Match match in martches)
            {
                string paramName = match.Groups["name"].Value;

                if (String.IsNullOrEmpty(paramName))
                    continue;

                paramName = paramName.Trim();

                rv[paramName] = JObject.FromObject(new
                {
                    type = "string"
                });
            }

            return rv;
        }
    }

    public class AliSMSMessageTemplate
    {
        string TemplateContent;
        int TemplateType;
        string TemplateName;
        string Message;
        string RequestId;
        string TemplateCode;
        DateTime CreateDate;
        string Code;
        string Reason;
        int TemplateStatus;
    }
}