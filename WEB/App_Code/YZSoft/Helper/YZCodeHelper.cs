using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using BPM;
using BPM.Client;

/// <summary>

/// </summary>
public class YZCodeHelper
{
    public static object GetPCodeValue(BPMConnection cn, object value)
    {
        return GetPCodeValue(cn, value, typeof(object), true, null);
    }

    public static object GetPCodeValue(BPMConnection cn, object value, Type returnType, bool allowEmptyCode, object defaultValue)
    {
        CodeBlock codeBlock = value as CodeBlock;
        
        if (codeBlock == null || String.IsNullOrEmpty(codeBlock.CodeText))
            return value;

        return CodeManager.GetCodeResult(cn, codeBlock.CodeText, returnType, allowEmptyCode, defaultValue);
    }
}
