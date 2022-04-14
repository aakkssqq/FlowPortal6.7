using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

/// <summary>
///PageResult 的摘要说明
/// </summary>
[DataContract]
public class YZObject
{
    private Dictionary<string,object> _attributes;

    [JsonExtensionData]
    private Dictionary<string, object> Attributes
    {
        get
        {
            if (this._attributes == null)
                this._attributes = new Dictionary<string, object>();

            return this._attributes;
        }
    }

    public object this[string key]
    {
        get
        {
            object value;
            if (this.Attributes.TryGetValue(key, out value))
                return value;
            else
                return null;
        }
        set
        {
            this.Attributes[key] = value;
        }
    }

    public bool Contains(string key)
    {
        return this.Attributes.ContainsKey(key);
    }
}