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
                    text = Resources.YZStrings.Module_Cat_ExtServer,
                    modulePerm = new YZModulePermision("c973ecb4-e90f-477e-bcf3-13dbf59ca5e1", YZModuleDeniedBehavior.Hide),
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "ExtServer",
                            text = Resources.YZStrings.Module_ExtServer,
                            glyph = 0xeb0d,
                            xclass = "YZSoft.extserver.ModulePanel"
                        }
                    }
                },
                new {
                    text = Resources.YZStrings.Module_Cat_ESB,
                    modulePerm = new YZModulePermision("bcf56c0a-54ae-489f-8883-4a2f64604e6d", YZModuleDeniedBehavior.Hide),
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "Connections",
                            text = Resources.YZStrings.Module_Connections,
                            glyph = 0xeb07,
                            modulePerm = new YZModulePermision("7c2cba80-09be-4cb2-8fd6-68f558373d4b", YZModuleDeniedBehavior.Hide),
                            xclass = "YZSoft.connection.admin.Panel"
                        },
                        new {
                            id = "ESBFlows",
                            text = Resources.YZStrings.Module_ESBFlows,
                            glyph = 0xe9c4,
                            modulePerm = new YZModulePermision("404efe9c-7324-4826-b760-d53b82eb1b31", YZModuleDeniedBehavior.Hide),
                            xclass = "YZSoft.esb.admin.FlowPanel"
                        },
                        new {
                            id = "ESBDSFlows",
                            text = Resources.YZStrings.Module_ESBDSFlows,
                            glyph = 0xeb0d,
                            modulePerm = new YZModulePermision("4bd178a9-b12a-4e10-ab31-8156998a74c3", YZModuleDeniedBehavior.Hide),
                            xclass = "YZSoft.esb.admin.DSFlowPanel"
                        },
                        new {
                            id = "ESB5Connections",
                            text = Resources.YZStrings.Module_ESBConnections,
                            glyph = 0xeb07,
                            modulePerm = new YZModulePermision("50c97f45-16f7-4968-a7cb-11a73f3e3da6", YZModuleDeniedBehavior.Hide),
                            xclass = "YZSoft.esb.esb5.connect.ConnectPanel"
                        },
                        new {
                            id = "ESB5DataSource",
                            text = Resources.YZStrings.Module_ESBDataSource,
                            glyph = 0xeb0d,
                            modulePerm = new YZModulePermision("b0946542-4e02-4937-83c3-a9c91da734c5", YZModuleDeniedBehavior.Hide),
                            xclass = "YZSoft.esb.esb5.source.SourcePanel"
                        }
                    }
                },
                new {
                    text = Resources.YZStrings.Module_Cat_ESBInstance,
                    modulePerm = new YZModulePermision("66de72f24-1ac1-4e18-b2be-d66c31e306d1", YZModuleDeniedBehavior.Hide),
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "ESBInterrupted",
                            text = Resources.YZStrings.Module_ESBInterruptedRepair,
                            glyph = 0xeac1,
                            modulePerm = new YZModulePermision("06ea7109-6f40-4e24-85ad-f19eb4df93d8", YZModuleDeniedBehavior.Hide),
                            xclass = "YZSoft.esb.instance.InterruptedPanel"
                        },
                        new {
                            id = "ESBLog",
                            text = Resources.YZStrings.Module_ESBLog,
                            glyph = 0xea9c,
                            modulePerm = new YZModulePermision("ab03aa90-9df8-419f-84c5-f5d63dfad8d4", YZModuleDeniedBehavior.Hide),
                            xclass = "YZSoft.esb.instance.LogPanel"
                        }
                    }
                },
                new {
                    text = Resources.YZStrings.Module_Cat_QueueInstance,
                    modulePerm = new YZModulePermision("39cc53b3-e6ca-4223-ae87-e4e2493c6cd3", YZModuleDeniedBehavior.Hide),
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "Queue",
                            text = Resources.YZStrings.Module_Queue,
                            glyph = 0xeb25,
                            modulePerm = new YZModulePermision("a0f97c2c-84e2-4f98-a5ac-7908466ff9f5", YZModuleDeniedBehavior.Hide),
                            xclass = "YZSoft.queue.QueueMessagesPanel"
                        },
                        new {
                            id = "SucceedQueueLog",
                            text = Resources.YZStrings.Module_SucceedQueueLog,
                            glyph = 0xeb36,
                            modulePerm = new YZModulePermision("f3272385-6e98-42da-a2d5-96e1574bc35c", YZModuleDeniedBehavior.Hide),
                            xclass = "YZSoft.queue.SucceedLogPanel"
                        },
                        new {
                            id = "FailedQueueLog",
                            text = Resources.YZStrings.Module_FailedQueueLog,
                            glyph = 0xeb37,
                            modulePerm = new YZModulePermision("62034d66-b0b2-48ae-abbf-94c012fa9ced", YZModuleDeniedBehavior.Hide),
                            xclass = "YZSoft.queue.FailedLogPanel"
                        }
                    }
                }
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}