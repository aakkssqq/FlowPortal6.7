<%@ WebHandler Language="C#" Class="BPMApp.ExecuteModuleTree" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json.Linq;

namespace BPMApp
{
    public class ExecuteModuleTree : YZServiceHandler
    {
        public object GetModuleTree(HttpContext context)
        {
            object[] modules = new object[] {
                new {
                    text = Resources.YZStrings.Module_Cat_Post,
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "Post",
                            text = Resources.YZStrings.Module_Post,
                            glyph = 0xeaaa,
                            xclass = "YZSoft.bpm.post.Panel"
                        },
                        new {
                            id = "Favorites",
                            text = Resources.YZStrings.Module_Favorites,
                            glyph = 0xead3,
                            xclass = "YZSoft.bpm.post.favorite.Panel"
                        },
                        new {
                            id = "Drafts",
                            text = Resources.YZStrings.Module_Drafts,
                            glyph = 0xeb08,
                            xclass = "YZSoft.bpm.draft.Panel"
                        },
                        new {
                            id = "Templates",
                            text = Resources.YZStrings.Module_FormTemplates,
                            glyph = 0xea97,
                            xclass = "YZSoft.bpm.template.Panel"
                        }
                    }
                },
                new {
                    text = Resources.YZStrings.Module_Cat_MyTasks,
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "Worklist",
                            text = Resources.YZStrings.Module_Worklist,
                            glyph = 0xea98,
                            badgeId = "worklistcount",
                            badgeCls = "yz-nav-badge-taskcount",
                            xclass = "YZSoft.bpm.worklist.Panel"
                        },
                        new {
                            id = "ShareTask",
                            text = Resources.YZStrings.All_ShareTask,
                            glyph = 0xea99,
                            badgeId = "sharetaskcount",
                            badgeCls = "yz-nav-badge-sharetaskcount",
                            xclass = "YZSoft.bpm.sharetask.Panel"
                        }
                    }
                },/* 
                new { //页签排版方式演示，我的任务与共享任务以tab方式排列
                    text = Resources.YZStrings.Module_Cat_MyTasks,
                    expanded = true,
                    children = new object[]{
                        new {
                            text = Resources.YZStrings.Module_Cat_MyTasks,
                            tabs = new object[]{
                                new {
                                    id = "Worklist1",
                                    text = Resources.YZStrings.Module_Worklist,
                                    xclass = "YZSoft.bpm.worklist.Panel"
                                },
                                new {
                                    id = "ShareTask1",
                                    modulePerm = new YZModulePermision("d2c8e9fc-0697-4345-86a4-160007fd7ec3", YZModuleDeniedBehavior.Hide),//运维模块的权限，用于试验
                                    text = Resources.YZStrings.All_ShareTask,
                                    xclass = "YZSoft.bpm.sharetask.Panel"
                                }
                            }
                        }
                    } 
                },*/
                new {
                    text = Resources.YZStrings.Module_Cat_HistoryTasks,
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "MyRequests",
                            text = Resources.YZStrings.Module_MyRequests,
                            glyph = 0xeaa2,
                            xclass = "YZSoft.bpm.history.MyRequestsPanel"
                        },
                        new {
                            id = "DelegationRequests",
                            text = Resources.YZStrings.Module_DelegationRequests,
                            glyph = 0xeaa4,
                            xclass = "YZSoft.bpm.history.DelegationRequestPanel"
                        },
                        new {
                            id = "MyProcessed",
                            text = Resources.YZStrings.Module_MyProcessed,
                            glyph = 0xeb11,
                            xclass = "YZSoft.bpm.history.MyProcessedPanel"
                        },
                        new {
                            id = "AllAccessable",
                            text = Resources.YZStrings.Module_AllAccessable,
                            glyph = 0xea9b,
                            xclass = "YZSoft.bpm.history.AllAccessablePanel"
                        }
                    }
                },
                new {
                    text = Resources.YZStrings.Module_Cat_TaskRule,
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "TaskRule",
                            text = Resources.YZStrings.Module_TaskRule,
                            glyph = 0xea9c,
                            xclass = "YZSoft.bpm.taskrule.Panel"
                        },
                        new {
                            id = "NotificationSetting",
                            text = Resources.YZStrings.Module_NotificationSetting,
                            glyph = 0xeaa3,
                            xclass = "YZSoft.personal.NotificationSettingPanel",
                            tabWrap = false
                        }
                    }
                }
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}
