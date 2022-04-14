using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace YZSoft.Services.REST.MDM
{
    public class EnumHandler : YZServiceHandler
    {
        static EnumDic enumDic = new EnumDic();

        static EnumHandler()
        {
            EnumHandler.enumDic.Add(typeof(ParticipantLeaderType));
            EnumHandler.enumDic.Add(typeof(ParticipantSpecifiedType));
            EnumHandler.enumDic.Add(typeof(ParticipantSponsorType));
        }

        public virtual JObject GetEnumDefine(HttpContext context)
        {
            string enumName = context.Request.Params["enumName"];

            Type enumType;
            if (!EnumHandler.enumDic.TryGetValue(enumName, out enumType))
                throw new Exception(String.Format("Type {0} not registed\nplease regist the type in App_Code/YZSoft.Services.REST/MDM/Enum.cs", enumName));

            JObject data = new JObject();
            foreach (object value in Enum.GetValues(enumType))
            {
                string name = value.ToString();
                data[Convert.ToInt32(value).ToString()] = name;
            }

            JObject rv = new JObject();
            rv[YZJsonProperty.success] = true;
            rv["data"] = data;

            return rv;
        }
    }

    internal class EnumDic : Dictionary<string, Type>
    {
        public void Add(Type type)
        {
            this.Add(type.FullName, type);
        }
    }
}