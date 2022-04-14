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
                    id = "BPALibrary",
                    iconCls = "bpa-mainmenu-lib",
                    modulePerm = new YZModulePermision("19E802FB-605A-4BD6-B5D9-3501CE842966", YZModuleDeniedBehavior.Hide),
                    module = new{
                        xclass = "YZSoft.bpa.library.Panel"
                    }
                },
                new {
                    id = "BPADocument",
                    iconCls = "bpa-mainmenu-doclib",
                    modulePerm = new YZModulePermision("CC94E14F-9702-469C-9FC6-16763700FE5A", YZModuleDeniedBehavior.Hide),
                    module = new{
                        xclass = "YZSoft.bpa.document.Panel"
                    }
                },
                new {
                    id = "BPAGroup",
                    modulePerm = new YZModulePermision("06DFA056-80E9-48E2-9C2A-ED34EB40A65D", YZModuleDeniedBehavior.Hide),
                    iconCls = "bpa-mainmenu-group",
                    module = new{
                        xclass = "YZSoft.bpa.group.Panel"
                    }
                },
                new {
                    id = "BPASysAdmin",
                    modulePerm = new YZModulePermision("01EC8CE8-CCCC-4196-93B3-A598813902E4", YZModuleDeniedBehavior.Hide),
                    iconCls = "bpa-mainmenu-setting",
                    module = new{
                        xclass = "YZSoft.bpa.admin.Panel"
                    }
                },
                new {
                    id = "BPAHelp",
                    modulePerm = new YZModulePermision("DDE2A259-8702-4FA5-86B0-9EA73FA1B6C0", YZModuleDeniedBehavior.Hide),
                    iconCls = "bpa-mainmenu-help",
                    module = new{
                        xclass = "YZSoft.bpa.help.Panel"
                    }
                },
                new {
                    id = "BPARecyclebin",
                    modulePerm = new YZModulePermision("6B86A356-485B-4439-AE75-B5FC3A251775", YZModuleDeniedBehavior.Hide),
                    iconCls = "bpa-mainmenu-recyclebin",
                    module = new{
                        xclass = "YZSoft.bpa.recyclebin.Panel"
                    }
                }
            };

            return YZSecurityManager.ApplayPermision(modules,false);
        }
    }
}