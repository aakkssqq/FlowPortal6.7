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
                    id = "BPM",
                    title = Resources.YZStrings.V2020_App_BPM,
                    modulePerm = new YZModulePermision("e52e8214-6e6e-4132-9873-d33a54eb977d", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/BPM/BPM.ashx"),
                        activeNode = "Worklist" //"Worklist"
                    }
                },
                new {
                    id = "Reports",
                    title = Resources.YZStrings.V2020_App_Report,
                    modulePerm = new YZModulePermision("5199d7f8-6a19-49da-ad7c-784b7d4a8788", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/BPM/Reports.ashx"),
                        leafOnly = true
                       // activeNode = "PRT_Other" //PRT_Other or Report Folder Name
                    }
                },
                new {
                    id = "BPA",
                    title = Resources.YZStrings.V2020_App_KM,
                    modulePerm = new YZModulePermision("5fa20260-5340-4398-bee0-5415c98a3155", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/BPM/BPAKM.ashx"),
                        activeNode = "Responsibilities"
                    }
                },
                new {
                    id = "Personal",
                    title = Resources.YZStrings.V2020_App_Personal,
                    modulePerm = new YZModulePermision("e98e2489-6cf5-4d13-a309-596ee252d013", YZModuleDeniedBehavior.Hide),
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