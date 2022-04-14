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
                    text = Resources.YZStrings.Module_Cat_MobileDevice,
                    modulePerm = new YZModulePermision("92332b40-bc8c-46f5-b427-d2fc6a12804f", YZModuleDeniedBehavior.Hide),
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "MobileDevice",
                            text = Resources.YZStrings.Module_MobileDevice,
                            glyph = 0xeb09,
                            xclass = "YZSoft.mobile.device.DevicePanel"
                        }
                    }
                }
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}