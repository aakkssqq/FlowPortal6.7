using System;
using System.Collections.Generic;
using System.Web;

public class YZClientParamCollection : List<YZClientParam>
{
    public YZClientParam TryGetItem(string paramName)
    {
        foreach (YZClientParam param in this)
        {
            if (String.Compare(param.name, paramName, true) == 0)
                return param;
        }

        return null;
    }
}
