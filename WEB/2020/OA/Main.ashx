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
                    id = "MH",
                    title = "门户",
                    //modulePerm = new YZModulePermision("afb5a2b3-85f2-4105-8df7-21b4586f4f29", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/BPM/BPM.ashx"),
                        activeNode = "Worklist"
                    }
                },
                new {
                    id = "BG",
                    title = "办公",
                    //modulePerm = new YZModulePermision("afb5a2b3-85f2-4105-8df7-21b4586f4f29", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/BPM/Reports.ashx"),
                        leafOnly = true
                    }
                },
                new {
                    id = "XZ",
                    title = "行政",
                    //modulePerm = new YZModulePermision("afb5a2b3-85f2-4105-8df7-21b4586f4f29", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/BPM/BPAKM.ashx"),
                        activeNode = "Responsibilities"
                    }
                },
                new {
                    id = "ZZ",
                    title = "自助",
                    //modulePerm = new YZModulePermision("afb5a2b3-85f2-4105-8df7-21b4586f4f29", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/BPM/Personal.ashx"),
                        leafOnly = true,
                        activeNode = "NotificationSetting"
                    }
                },
                new {
                    id = "MH1",
                    title = "门户",
                    //modulePerm = new YZModulePermision("afb5a2b3-85f2-4105-8df7-21b4586f4f29", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/BPM/BPM.ashx"),
                        activeNode = "Worklist" //"Post/Worklist"
                    }
                },
                new {
                    id = "BG1",
                    title = "办公",
                    //modulePerm = new YZModulePermision("afb5a2b3-85f2-4105-8df7-21b4586f4f29", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/BPM/Reports.ashx"),
                        leafOnly = true
                    }
                },
                new {
                    id = "XZ1",
                    title = "行政",
                    //modulePerm = new YZModulePermision("afb5a2b3-85f2-4105-8df7-21b4586f4f29", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/BPM/BPAKM.ashx"),
                        activeNode = "Responsibilities"
                    }
                },
                new {
                    id = "ZZ1",
                    title = "自助",
                    //modulePerm = new YZModulePermision("afb5a2b3-85f2-4105-8df7-21b4586f4f29", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/BPM/Personal.ashx"),
                        leafOnly = true,
                        activeNode = "NotificationSetting"
                    }
                }
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}