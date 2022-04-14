using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

/// <summary>
///YZRequest 的摘要说明
/// </summary>
public class YZRequest
{
    private int _start = -1;
    private int _limit = -1;
    private HttpContext _context = null;
    private JsonSerializer _serializer;
    private JsonConverter[] _converters;

    public YZRequest(HttpContext context)
    {
        this._context = context;
    }

    #region 属性

    public HttpContext Context
    {
        get
        {
            return this._context;
        }
    }

    public int Start
    {
        get
        {
            if (this._start == -1)
            {
                if (String.IsNullOrEmpty(this._context.Request.Params["start"]))
                    this._start = 0;
                else
                    this._start = Int32.Parse(this._context.Request.Params["start"]);
            }

            return this._start;
        }
    }

    public int Limit
    {
        get
        {
            if (this._limit == -1)
            {
                if (String.IsNullOrEmpty(this._context.Request.Params["limit"]))
                    this._limit = 25;
                else
                    this._limit = Int32.Parse(this._context.Request.Params["limit"]);
            }

            return this._limit;
        }
    }

    public int RowNumStart
    {
        get
        {
            return this.Start + 1;
        }
    }

    public int RowNumEnd
    {
        get
        {
            return this.Start + this.Limit;
        }
    }

    public bool IsBreakpointContinue
    {
        get
        {
            if (this.Context != null) {
                string range = this.Context.Request.Headers["Range"];
                if (!String.IsNullOrEmpty(range))
                    return true;
            }

            return false;
        }
    }

    #endregion

    #region 客户端信息

    public string ClientIP
    {
        get
        {
            try
            {
                //return "183.63.255.254"; //广东
                //return "58.32.20.51"; //上海
                //return "116.63.255.254"; //北京
                //return "182.143.255.254"; //四川
                //return "27.31.255.254"; //湖北
                //return "220.134.110.231"; //台湾

                if (this.Context == null || this.Context.Request == null || this.Context.Request.ServerVariables == null)
                    return "";

                string CustomerIP = "";

                //CDN加速后取到的IP  
                CustomerIP = this.Context.Request.Headers["Cdn-Src-Ip"];
                if (!string.IsNullOrEmpty(CustomerIP))
                    return CustomerIP;

                CustomerIP = this.Context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
                if (!String.IsNullOrEmpty(CustomerIP))
                    return CustomerIP;

                if (this.Context.Request.ServerVariables["HTTP_VIA"] != null)
                {
                    CustomerIP = this.Context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
                    if (CustomerIP == null)
                        CustomerIP = this.Context.Request.ServerVariables["REMOTE_ADDR"];
                }
                else
                {
                    CustomerIP = this.Context.Request.ServerVariables["REMOTE_ADDR"];
                }

                if (string.Compare(CustomerIP, "unknown", true) == 0)
                    return this.Context.Request.UserHostAddress;

                return CustomerIP;
            }
            catch
            {
            }

            return "";
        }
    }

    public String UserPlatform
    {
        get
        {
            string userAgent = this.Context.Request.UserAgent;

            if (userAgent.Contains("Android"))
                return string.Format("Android {0}", GetMobileVersion(userAgent, "Android"));

            if (userAgent.Contains("iPad"))
                return string.Format("iPad OS {0}", GetMobileVersion(userAgent, "OS"));

            if (userAgent.Contains("iPhone"))
                return string.Format("iPhone OS {0}", GetMobileVersion(userAgent, "OS"));

            if (userAgent.Contains("Linux") && userAgent.Contains("KFAPWI"))
                return "Kindle Fire";

            if (userAgent.Contains("RIM Tablet") || (userAgent.Contains("BB") && userAgent.Contains("Mobile")))
                return "Black Berry";

            if (userAgent.Contains("Windows Phone"))
                return string.Format("Windows Phone {0}", GetMobileVersion(userAgent, "Windows Phone"));

            if (userAgent.Contains("Mac OS"))
                return "Mac OS";

            if (userAgent.Contains("Windows NT 5.1") || userAgent.Contains("Windows NT 5.2"))
                return "Windows XP";

            if (userAgent.Contains("Windows NT 6.0"))
                return "Windows Vista";

            if (userAgent.Contains("Windows NT 6.1"))
                return "Windows 7";

            if (userAgent.Contains("Windows NT 6.2"))
                return "Windows 8";

            if (userAgent.Contains("Windows NT 6.3"))
                return "Windows 8.1";

            if (userAgent.Contains("Windows NT 10"))
                return "Windows 10";

            //else if (userAgent.Contains("Unix"))
            //{
            //    os = "UNIX";
            //}
            //else if (userAgent.Contains("Linux"))
            //{
            //    os = "Linux";
            //}
            //else if (userAgent.Contains("SunOS"))
            //{
            //    os = "SunOS";
            //}
            //fallback to basic platform:
            return this.Context.Request.Browser.Platform + (userAgent.Contains("Mobile") ? " Mobile " : "");
        }
    }

    public bool Crawler
    {
        get
        {
            return Context.Request.Browser.Crawler;
        }
    }

    private String GetMobileVersion(string userAgent, string device)
    {
        var temp = userAgent.Substring(userAgent.IndexOf(device) + device.Length).TrimStart();
        var version = string.Empty;

        foreach (var character in temp)
        {
            var validCharacter = false;
            int test = 0;

            if (Int32.TryParse(character.ToString(), out test))
            {
                version += character;
                validCharacter = true;
            }

            if (character == '.' || character == '_')
            {
                version += '.';
                validCharacter = true;
            }

            if (validCharacter == false)
                break;
        }

        return version;
    }

    #endregion

    public string GetString(string paramName)
    {
        return this.GetString(paramName, false, null);
    }

    public string GetString(string paramName, string defaultValue)
    {
        return this.GetString(paramName, true, defaultValue);
    }

    public string GetString(string paramName, bool allowNull, string defaultValue)
    {
        string value = this.Context.Request.Params[paramName];
        if (value != null)
            value = value.Trim();

        if (String.IsNullOrEmpty(value))
        {
            if (allowNull)
                return defaultValue;
            else
                throw new Exception(String.Format(Resources.YZStrings.Aspx_Request_Params_Empty, paramName));

        }

        return value;
    }

    public DateTime GetDateTime(string param)
    {
        return this.GetDateTime(param, false, DateTime.MinValue);
    }

    public DateTime GetDateTime(string param, DateTime defaultValue)
    {
        return this.GetDateTime(param, true, defaultValue);
    }

    public DateTime GetDateTime(string param, bool allowNull,DateTime defaultValue)
    {
        string value = this.Context.Request.Params[param];
        if (allowNull && String.IsNullOrEmpty(value))
            return defaultValue;

        DateTime rv;
        if (!DateTime.TryParse(value, out rv))
            throw new Exception(String.Format(YZStringHelper.ServerSideResourceStringProcess(Resources.YZStrings.Aspx_Request_Params_Invalid_Date), param, value));

        return rv;
    }

    public bool GetBool(string param)
    {
        return this.GetBool(param, false, false);
    }

    public bool GetBool(string param, bool defaultValue)
    {
        return this.GetBool(param, true, defaultValue);
    }

    public bool GetBool(string param, bool allowNull, bool defaultValue)
    {
        string value = this.Context.Request.Params[param];
        if (allowNull && String.IsNullOrEmpty(value))
            return defaultValue;

        bool rv;
        if (!Boolean.TryParse(value, out rv))
            throw new Exception(String.Format(YZStringHelper.ServerSideResourceStringProcess(Resources.YZStrings.Aspx_Request_Params_Invalid_Bool), param, value));

        return rv;
    }

    public int GetInt32(string param)
    {
        return this.GetInt32(param, false, -1);
    }

    public int GetInt32(string param, int defaultValue)
    {
        return this.GetInt32(param, true, defaultValue);
    }

    public int GetInt32(string param, bool allowNull,int defaultValue)
    {
        string value = this.Context.Request.Params[param];
        if (allowNull && String.IsNullOrEmpty(value))
            return defaultValue;

        int rv;
        if (!Int32.TryParse(value, out rv))
            throw new Exception(String.Format(YZStringHelper.ServerSideResourceStringProcess(Resources.YZStrings.Aspx_Request_Params_Invalid_Int), param, value));

        return rv;
    }

    public decimal GetDecimal(string param)
    {
        return this.GetDecimal(param, false, -1);
    }

    public decimal GetDecimal(string param, decimal defaultValue)
    {
        return this.GetDecimal(param, true, defaultValue);
    }

    public decimal GetDecimal(string param, bool allowNull, decimal defaultValue)
    {
        string value = this.Context.Request.Params[param];
        if (allowNull && String.IsNullOrEmpty(value))
            return defaultValue;

        decimal rv;
        if (!Decimal.TryParse(value, out rv))
            throw new Exception(String.Format(YZStringHelper.ServerSideResourceStringProcess(Resources.YZStrings.Aspx_Request_Params_Invalid_Decimal), param, value));

        return rv;
    }

    public Guid GetGuid(string param, bool allowNull)
    {
        string value = this.Context.Request.Params[param];
        if (allowNull && String.IsNullOrEmpty(value))
            return Guid.Empty;

        Guid rv;
        if (!Guid.TryParse(value, out rv))
            throw new Exception(String.Format(YZStringHelper.ServerSideResourceStringProcess(Resources.YZStrings.Aspx_Request_Params_Invalid_Guid), param, value));

        return rv;
    }

    public T GetEnum<T>(string param) where T : struct
    {
        return this.GetEnum(param, false, default(T));
    }

    public T GetEnum<T>(string param, string defaultValue) where T : struct
    {
        return this.GetEnum(param, true, (T)Enum.Parse(typeof(T), defaultValue, true));
    }

    public T GetEnum<T>(string param, T defaultValue) where T : struct
    {
        return this.GetEnum(param, true, defaultValue);
    }

    public T GetEnum<T>(string param, bool allowNull, T defaultValue) where T : struct
    {
        string value = this.Context.Request.Params[param];
        T rv;

        if (!Enum.TryParse<T>(value, true, out rv))
        {
            if (allowNull)
                return defaultValue;

            throw new Exception(String.Format(YZStringHelper.ServerSideResourceStringProcess(Resources.YZStrings.Aspx_Request_Params_Invalid_Type), param,value, typeof(T).Name));
        }
        else
            return rv;
    }

    public Version GetVersion(string param)
    {
        return this.GetVersion(param, false, new Version(1, 1));
    }

    public Version GetVersion(string param, Version defaultValue)
    {
        return this.GetVersion(param, true, defaultValue);
    }

    public Version GetVersion(string param, bool allowNull, Version defaultValue)
    {
        string value = this.Context.Request.Params[param];
        if (allowNull && String.IsNullOrEmpty(value))
            return defaultValue;

        Version rv;
        if (!Version.TryParse(value, out rv))
            throw new Exception(String.Format(YZStringHelper.ServerSideResourceStringProcess(Resources.YZStrings.Aspx_Request_Params_Invalid_Version), param, value));

        return rv;
    }

    public JObject GetJObject(string param)
    {
        return JObject.Parse(this.Context.Request.Params[param]);
    }

    public JArray GetJArray(string param)
    {
        return JArray.Parse(this.Context.Request.Params[param]);
    }

    public JsonSerializer Serializer
    {
        get
        {
            if (this._serializer == null)
                this._serializer = YZJsonHelper.Serializer;

            return this._serializer;
        }
    }

    public JsonConverter[] Converters
    {
        get
        {
            if (this._converters == null)
                this._converters = YZJsonHelper.Converters;

            return this._converters;
        }
    }

    public T GetPostData<T>() where T : JToken
    {
        using (StreamReader reader = new StreamReader(this.Context.Request.InputStream))
        {
            using (JsonTextReader streamReader = new JsonTextReader(reader))
            {
                T @params = this.Serializer.Deserialize(streamReader) as T;
                return @params;
            }
        }
    }

    public string GetPostData()
    {
        using (StreamReader reader = new StreamReader(this.Context.Request.InputStream)) 
        {
            return reader.ReadToEnd();
        }
    }

    public virtual string GetSortString(string defaultSort, Dictionary<string, string> map, string extsort)
    {
        string sortstr = this.GetString("sort", null);

        //获得Order String
        if (String.IsNullOrEmpty(sortstr))
            return defaultSort;

        ExtJSSortCollection sorts = JsonConvert.DeserializeObject<ExtJSSortCollection>(sortstr);

        List<string> rv = new List<string>();
        foreach (ExtJSSort sort in sorts)
        {
            if (String.Compare(sort.direction, "ASC", true) != 0)
                sort.direction = "DESC";

            if (map != null)
            {
                string sortmaped;
                if (map.TryGetValue(sort.property, out sortmaped))
                    sort.property = sortmaped;
            }

            rv.Add(String.Format("{0} {1}", sort.property, sort.direction));
        }

        if (!String.IsNullOrEmpty(extsort))
            rv.Add(extsort);

        if (String.Compare(YZSoft.Web.DAL.YZDbProviderManager.DBProviderName, "Oracle", true) == 0)
            rv.Add("ROWID");

        return String.Join(",", rv.ToArray());
    }

    public virtual string GetSortString(string defaultSort)
    {
        return this.GetSortString(defaultSort, null, null);
    }
    public class ExtJSSort
    {
        public string property { get; set; }
        public string direction { get; set; }
    }

    public class ExtJSSortCollection : List<ExtJSSort>
    {
    }

}