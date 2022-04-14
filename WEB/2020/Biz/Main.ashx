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
                    id = "HT",
                    title = "合同",
                    //modulePerm = new YZModulePermision("e52e8214-6e6e-4132-9873-d33a54eb977d", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/BPM/BPM.ashx"),
                        activeNode = "Worklist"
                    }
                },
                new {
                    id = "XS",
                    title = "销售",
                    //modulePerm = new YZModulePermision("e52e8214-6e6e-4132-9873-d33a54eb977d", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/BPM/Reports.ashx"),
                        leafOnly = true
                    }
                },
                new {
                    id = "CG",
                    title = "采购",
                    //modulePerm = new YZModulePermision("e52e8214-6e6e-4132-9873-d33a54eb977d", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/BPM/BPAKM.ashx"),
                        activeNode = "Responsibilities"
                    }
                },
                new {
                    id = "ZL",
                    title = "租赁",
                    //modulePerm = new YZModulePermision("e52e8214-6e6e-4132-9873-d33a54eb977d", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/BPM/Personal.ashx"),
                        leafOnly = true,
                        activeNode = "NotificationSetting"
                    }
                }/*,
                new {
                    id = "SJ",
                    title = "商机",
                    //modulePerm = new YZModulePermision("e52e8214-6e6e-4132-9873-d33a54eb977d", YZModuleDeniedBehavior.Hide),
                    navigator = new {
                        dataURL = this.ResolveUrl(context,"../Services.REST/Demo/Customer.ashx"),
                        leafOnly = true
                    }
                }*/
            };
            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}
