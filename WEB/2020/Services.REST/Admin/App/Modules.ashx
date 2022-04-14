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
                    id = "FormApp",
                    text = Resources.YZStrings.Module_FormAppAdmin,
                    glyph = 0xe800,
                    modulePerm = new YZModulePermision("2c2b5525-62ed-47b2-85a0-583d56876c36", YZModuleDeniedBehavior.Hide), 
                    xclass = "YZSoft.app.formservice.ModulePanel"
                }
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}