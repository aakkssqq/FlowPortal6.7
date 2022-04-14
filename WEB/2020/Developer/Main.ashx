<%@ WebHandler Language="C#" Class="BPMApp.MainModuleTree" %>

using System;
using System.Web;
using System.Text;

namespace BPMApp
{
    public class MainModuleTree : YZServiceHandler
    {
        public object GetModuleTree(HttpContext context)
        {
            object[] modules = new object[]{
                new {
                    id = "APPDemo",
                    title = Resources.YZStrings.Module_APP,
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/Developer/Application.ashx"),
                        activeNode = "BasicPanel"
                    }
                },
                new {
                    id = "Samples",
                    title = Resources.YZStrings.All_Module_FuncDemo,
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/Developer/Form.ashx"),
                        activeNode = "FormSamples"
                    }
                }
            };
            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}