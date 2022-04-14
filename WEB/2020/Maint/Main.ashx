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
                    id = "Task",
                    title = Resources.YZStrings.V2020_App_Ment,
                    glyph = 0xeaba,
                    modulePerm = new YZModulePermision("d2c8e9fc-0697-4345-86a4-160007fd7ec3", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/Maint/TaskAdmin.ashx"),
                        activeNode = "OrgRelationshipHandover"
                    }
                },
                new {
                    id = "Org",
                    title = Resources.YZStrings.V2020_App_OrgMent,
                    glyph = 0xeabc,
                    modulePerm = new YZModulePermision("78654e0c-fa23-406d-a872-4eb18c59e718", YZModuleDeniedBehavior.Hide),
                    xclass = "YZSoft.bpm.org.admin.ModulePanel"
                },
                new {
                    id = "Perm",
                    title = Resources.YZStrings.V2020_App_AccessMent,
                    glyph = 0xeabb,
                    modulePerm = new YZModulePermision("1439c8f5-e410-4262-b69b-6402bf86a79b", YZModuleDeniedBehavior.Hide), 
                    xclass = "YZSoft.security.accesscontrol.ModulePanel",
                    editable = false
                },
                new {
                    id = "Monitor",
                    title =Resources.YZStrings.V2020_App_Monitor,
                    glyph = 0xeab9,
                    modulePerm = new YZModulePermision("afb5a2b3-85f2-4105-8df7-21b4586f4f29", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/Maint/Monitor.ashx"),
                        activeNode = "TimeoutMonitor" //Log
                    }
                }
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}