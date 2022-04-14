<%@ WebHandler Language="C#" Class="BPMApp.Developer.SJModuleTree" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json.Linq;

namespace BPMApp.Developer
{
    public class SJModuleTree : YZServiceHandler
    {
        public object GetModuleTree(HttpContext context)
        {
            object[] modules = new object[] {
                new {
                    text = "客户",
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "BasicPanel",
                            text = "客户登记",
                            glyph = 0xeb22,
                            xclass = "Demo.SJ.CustomerPanel"
                        }
                    }
                }
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}




