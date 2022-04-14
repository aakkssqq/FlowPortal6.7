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
                    id = "Modeling",
                    title = Resources.YZStrings.V2020_App_BPMModeling,
                    modulePerm = new YZModulePermision("d783ae40-f57c-4209-bbc5-bf01ae913854", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/Admin/BPM/Modules.ashx"),
                        leafOnly = true,
                        activeNode = "Process"
                    }
                },
                new {
                    id = "Intergration",
                    title = Resources.YZStrings.V2020_App_Intergration,
                    modulePerm = new YZModulePermision("608201db-99f2-4b37-8f58-5e9523375688", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/Admin/Integration/Modules.ashx"),
                        activeNode = "ESBDSFlows" //ExtServer
                    }
                },
                new {
                    id = "Mobile",
                    title = Resources.YZStrings.V2020_App_MobileAdmin,
                    modulePerm = new YZModulePermision("cf261f02-3bbe-4ea1-b01b-95c19f850794", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/Admin/Mobile/Modules.ashx"),
                        activeNode = "MobileDevice"
                    }
                },
                new {
                    id = "App",
                    title = Resources.YZStrings.V2020_App_AppAdmin,
                    modulePerm = new YZModulePermision("0e32f172-b084-40c3-8153-5ecb5436b4e8", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/Admin/App/Modules.ashx"),
                        leafOnly = true,
                        activeNode = "FormApp"
                    }
                },
                new {
                    id = "Report",
                    title = Resources.YZStrings.V2020_App_ReportAdmin,
                    modulePerm = new YZModulePermision("25a9de61-fc9f-45df-8d99-2f8279b5a1e6", YZModuleDeniedBehavior.Hide),
                    xclass = "YZSoft.report.admin.ModulePanel"
                },
                new {
                    id = "AccessControl",
                    title = Resources.YZStrings.V2020_App_AccessControl,
                    modulePerm = new YZModulePermision("719fdbe8-3172-4078-a33e-199db75b9b40", YZModuleDeniedBehavior.Hide),
                    xclass = "YZSoft.security.accesscontrol.ModulePanel"
                },
                new {
                    id = "System",
                    title = Resources.YZStrings.V2020_App_System,
                    modulePerm = new YZModulePermision("d2871cb2-415b-40cb-9ed8-7dcb8d8c9283", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/Admin/System/Modules.ashx"),
                        activeNode = "SystemInfo" //OnlineUsers
                    }
                }
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}