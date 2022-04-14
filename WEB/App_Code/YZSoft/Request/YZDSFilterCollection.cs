using System;
using System.Collections.Generic;
using System.Web;

public class YZDSFilterCollection : Dictionary<string, YZDSFilter>
{
    public YZDSFilterCollection() :
        base(StringComparer.OrdinalIgnoreCase)
    {
    }
}

