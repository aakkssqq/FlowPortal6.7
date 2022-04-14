using System;
using System.Collections.Generic;
using System.Web;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

/// <summary>
///YZModulePermision 的摘要说明


/// </summary>
[DataContract]
public class YZModulePermision
{
    private string _rsid;
    private bool _genToolbarPermision = true;
    private YZModuleDeniedBehavior _deniedBahavior;

    public YZModulePermision()
    {
    }

    public YZModulePermision(string rsid,YZModuleDeniedBehavior deniedBehavior)
    {
        this._rsid = rsid;
        this._deniedBahavior = deniedBehavior;
    }

    public YZModulePermision(string rsid, YZModuleDeniedBehavior deniedBehavior,bool genToolbarPermision) 
    {
        this._rsid = rsid;
        this._deniedBahavior = deniedBehavior;
        this._genToolbarPermision = genToolbarPermision;
    }

    [DataMember(Order=0)]
    public string RSID
    {
        get
        {
            return this._rsid;
        }
        set
        {
            this._rsid = value;
        }
    }

    [DataMember(Order = 1)]
    public bool GenToolbarPermision
    {
        get
        {
            return this._genToolbarPermision;
        }
        set
        {
            this._genToolbarPermision = value;
        }
    }

    [DataMember(Order = 2),JsonConverter(typeof(StringEnumConverter))]
    public YZModuleDeniedBehavior DeniedBehavior
    {
        get
        {
            return this._deniedBahavior;
        }
        set
        {
            this._deniedBahavior = value;
        }
    }
}
