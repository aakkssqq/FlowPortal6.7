<%@ WebHandler Language="C#" Class="BPMApp.SystemModuleTree" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json.Linq;

namespace BPMApp
{
    public class SystemModuleTree : YZServiceHandler
    {        
        public object GetModuleTree(HttpContext context)
        {
            object[] modules = new object[] {
                new {
                    id = "SecurityGroup",
                    text = Resources.YZStrings.Module_SecurityGroup,
                    glyph = 0xeb14,
                    modulePerm = new YZModulePermision("3a0c58ec-f240-4584-9024-1470156a9a7c", YZModuleDeniedBehavior.Hide),
                    xclass = "YZSoft.security.group.Panel"
                },
                new {
                    text = Resources.YZStrings.Module_Cat_ServerConfig,
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "SystemInfo",
                            text = Resources.YZStrings.Module_SystemInfo,
                            glyph = 0xeb19,
                            xclass = "YZSoft.system.server.ServerInfoPanel",
                            tabWrap = false
                        },
                        new {
                            id = "MessageTemplatesSetting",
                            text = Resources.YZStrings.Module_MessageTemplateSetting,
                            glyph = 0xeaa3,
                            xclass = "YZSoft.system.server.MessageTemplatesSettingPanel"
                        },
                        new {
                            id = "EmployeeSelfServicesSetting",
                            text = Resources.YZStrings.Module_AccountSelfServicesSetting,
                            glyph = 0xeabf,
                            xclass = "YZSoft.system.server.AccountSelfServicesSettingPanel"
                        }
                    }
                },
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
                    text = Resources.YZStrings.Module_Cat_SysMonitor,
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "ProcessUsage",
                            text = Resources.YZStrings.Module_ProcessUsage,
                            glyph = 0xeb12,
                            xclass = "YZSoft.bpm.report.ProcessUsage",
                            tabWrap = false
                        },
                        new {
                            id = "ProcessPerformance",
                            text = Resources.YZStrings.Module_ProcessPerformance,
                            glyph = 0xeb17,
                            xclass = "YZSoft.bpm.report.ProcessPerformance",
                            tabWrap = false
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
                            xclass = "YZSoft.bpm.report.ProcessAnalysis",
                            tabWrap = false
                        }
                    }
                }
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}
