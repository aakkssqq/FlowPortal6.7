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
                //Add by Xine at 20220414 Reason 定義PMS模組引用泛型
            object[] modules = new object[]{
                new {
                    id = "PMS",
                    title = Resources.YZStrings.Module_APP,
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services/PMS/Application.ashx"),
                        activeNode = "BasicPanel"
                    }
                }
            };
                //Mark by xine at 20220414 Reason 保留原有程式碼
            //object[] modules = new object[]{
            //    new {
            //        id = "APPDemo",
            //        title = Resources.YZStrings.Module_APP,
            //        navigator = new {
            //            dataURL = this.ResolveUrl(context,"../Services/PMS/Application.ashx"),
            //            activeNode = "BasicPanel"
            //        }
            //    },
            //    new {
            //        id = "Samples",
            //        title = Resources.YZStrings.All_Module_FuncDemo,
            //        navigator = new {
            //            dataURL = this.ResolveUrl(context,"../Services/PMS/Form.ashx"),
            //            activeNode = "FormSamples"
            //        }
            //    }
            //};
            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}