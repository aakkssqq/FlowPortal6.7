<%@ WebHandler Language="C#" Class="BPMApp.MonitorModuleTree" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json.Linq;

namespace BPMApp
{
    public class MonitorModuleTree : YZServiceHandler
    {        
        public object GetModuleTree(HttpContext context)
        {
            object[] modules = new object[] {
                new {
                    text = Resources.YZStrings.Module_Cat_UserMonitor,
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "Log",
                            text = Resources.YZStrings.Module_AppLog,
                            glyph = 0xeb0b,
                            xclass = "YZSoft.system.log.Panel"
                        },
                        new {
                            id = "OnlineUsers",
                            text = Resources.YZStrings.Module_OnlineUsers,
                            glyph = 0xeac6,
                            xclass = "YZSoft.system.online.OnlineUsersPanel"
                        },
                        new {
                            id = "SystemUsers",
                            text = Resources.YZStrings.Module_RecentlyUsers,
                            glyph = 0xeb16,
                            xclass = "YZSoft.system.online.SystemUsersPanel"
                        }
                    }
                },
                new {
                    text = Resources.YZStrings.Module_Cat_BizMonitor,
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "ProcessUsage",
                            text = Resources.YZStrings.Module_ProcessUsage,
                            glyph = 0xeb12,
                            xclass = "YZSoft.bpm.report.ProcessUsage"
                        },
                        new {
                            id = "ProcessPerformance",
                            text = Resources.YZStrings.Module_ProcessPerformance,
                            glyph = 0xeb17,
                            xclass = "YZSoft.bpm.report.ProcessPerformance"
                        },
                        new {
                            id = "TimeoutMonitor",
                            text = Resources.YZStrings.Module_TimeoutMonitor,
                            glyph = 0xeb0a,
                            xclass = "YZSoft.bpm.monitor.timeout.Panel"
                        },
                        new {
                            id = "ProcessAnalysis",
                            text = Resources.YZStrings.Module_ProcessAnalysis,
                            glyph = 0xeb13,
                            xclass = "YZSoft.bpm.report.ProcessAnalysis"
                        }
                    }
                }
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}
