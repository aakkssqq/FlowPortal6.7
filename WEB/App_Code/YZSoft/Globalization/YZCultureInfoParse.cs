using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Web.Configuration;
using System.Collections.Generic;
using System.Globalization;

namespace YZSoft
{
    public class YZCultureInfoParse
    {
        protected static Dictionary<string, Dictionary<string, CultureInfo>> _langMap = new Dictionary<string, Dictionary<string, CultureInfo>>();
        protected static CultureInfo _defauleCultureInfo = new CultureInfo(1033); //en-us

        static YZCultureInfoParse()
        {
            //中文
            Dictionary<string, CultureInfo> zhmap = new Dictionary<string,CultureInfo>(StringComparer.OrdinalIgnoreCase);
            YZCultureInfoParse._langMap.Add("zh", zhmap);

            //简体
            zhmap.Add("zh-CN", new CultureInfo(2052)); //中文 - 中国
            zhmap.Add("zh-CHS", new CultureInfo(2052)); //中文（简体）
            zhmap.Add("zh-Hans", new CultureInfo(2052)); //IE11 简体
            zhmap.Add("zh", new CultureInfo(2052)); //中文（简体）

            //繁体
            zhmap.Add("zh-CHT", new CultureInfo(1028)); //中文（繁体）
            zhmap.Add("zh-Hant", new CultureInfo(1028)); //IE11 繁体
            zhmap.Add("zh-HK", new CultureInfo(1028)); //中文 - 香港特别行政区
            zhmap.Add("zh-MO", new CultureInfo(1028)); //中文 - 澳门特别行政区
            zhmap.Add("zh-SG", new CultureInfo(1028)); //中文 - 新加坡
            zhmap.Add("zh-TW", new CultureInfo(1028)); //中文 - 台湾
        }

        public static CultureInfo Parse(Dictionary<string, CultureInfo> map,string lang)
        {
            CultureInfo cultureInfo;
            if (map.TryGetValue(lang, out cultureInfo))
                return cultureInfo;
            return null;
        }

        public static CultureInfo Parse(string[] langs, CultureInfo defaultCultureInfo)
        {
            foreach (string lang in langs)
            {
                foreach (KeyValuePair<string,Dictionary<string, CultureInfo>> kv in YZCultureInfoParse._langMap)
                {
                    if (lang.StartsWith(kv.Key, StringComparison.OrdinalIgnoreCase))
                    {
                        CultureInfo cultureInfo = YZCultureInfoParse.Parse(kv.Value,lang);
                        if (cultureInfo != null)
                        {
                            return cultureInfo;
                        }
                    }
                }
            }

            return defaultCultureInfo;
        }

        public static CultureInfo Parse(string lang, CultureInfo defaultCultureInfo)
        {
            return Parse(new string[] { lang }, defaultCultureInfo);
        }

        public static CultureInfo DefauleCultureInfo
        {
            get
            {
                return YZCultureInfoParse._defauleCultureInfo;
            }
        }
    }
}
