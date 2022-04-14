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
                    id = "Org",
                    text = Resources.YZStrings.Module_OrgAdmin,
                    glyph = 0xeb0e,
                    modulePerm = new YZModulePermision("2694420f-a074-446c-bdf3-72dae1920298", YZModuleDeniedBehavior.Hide),
                    xclass = "YZSoft.bpm.org.admin.ModulePanel"
                },
                new {
                    id = "Process",
                    text = Resources.YZStrings.Module_ProcessAdmin,
                    glyph = 0xeae5,
                    modulePerm = new YZModulePermision("7631a828-55f0-439b-8acf-551d0ce3dfce", YZModuleDeniedBehavior.Hide),
                    xclass = "YZSoft.bpm.process.admin.ModulePanel"
                    //activeTab = 1,
                    //tabs =  new object[]{
                    //    new{
                    //        text = "流程库",
                    //        xclass = "YZSoft.bpm.process.admin.ModulePanel"
                    //    },
                    //    new{
                    //        id = "aaaa",
                    //        text = "采购申请 v3.7",
                    //        xclass = "YZSoft.bpm.process.admin.DesignerPanel",
                    //        config = new {
                    //            process = new {
                    //                path= "采购申请",
                    //                version= "3.7"
                    //            }
                    //        }
                    //    }
                    //}
                },
                new {
                    id = "Form",
                    text = Resources.YZStrings.Module_FormAdmin,
                    glyph = 0xe800,
                    modulePerm = new YZModulePermision("afea2fa9-de8e-438c-b784-839bdcd32139", YZModuleDeniedBehavior.Hide),
                    xclass = "YZSoft.bpm.xformadmin.ModulePanel"
                },
                new {
                    id = "TimeSheet",
                    text = Resources.YZStrings.Module_TimeSheet,
                    glyph = 0xe60b,
                    modulePerm = new YZModulePermision("ac73842c-163f-4a9a-b862-2ee2eb7dc0e2", YZModuleDeniedBehavior.Hide),
                    xclass = "YZSoft.bpm.timesheet.Panel"
                },
                new {
                    id = "Simulate",
                    text = Resources.YZStrings.Module_Simulate,
                    glyph = 0xeb0f,
                    modulePerm = new YZModulePermision("725cdb22-1f96-4535-99ff-6e627cd2bf88", YZModuleDeniedBehavior.Hide),
                    xclass = "YZSoft.bpm.simulate.Panel"
                }
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}