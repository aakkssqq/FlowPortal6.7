<%@ WebHandler Language="C#" Class="BPMApp.TaskAdminModuleTree" %>

using System;
using System.Web;
using System.Text;

namespace BPMApp
{
    public class TaskAdminModuleTree : YZServiceHandler
    {
        public object GetModuleTree(HttpContext context)
        {
            object[] modules = new object[] {
                new {
                    text = Resources.YZStrings.Module_Cat_OrgChange,
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "TaskHandover",
                            text = Resources.YZStrings.Module_TaskHandover,
                            glyph = 0xeabd,
                            xclass = "YZSoft.bpm.maintenance.TaskHandoverSummaryPanel",
                            tabWrap = false
                        },
                        new {
                            id = "OrgRelationshipHandover",
                            text = Resources.YZStrings.Module_OrgRelationshipHandover,
                            glyph = 0xeabe,
                            xclass = "YZSoft.bpm.maintenance.OrgRelationshipHandoverSummaryPanel",
                            tabWrap = false
                        }
                    }
                },
                new {
                    text = Resources.YZStrings.Module_Cat_ActiveTask,
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "TaskAdmin",
                            text = Resources.YZStrings.Module_TaskAdmin,
                            glyph = 0xeb1f,
                            xclass = "YZSoft.bpm.maintenance.TaskAdminPanel"
                        },
                        new {
                            id = "ExceptionTask",
                            text = Resources.YZStrings.Module_ExceptionTask,
                            glyph = 0xeac1,
                            xclass = "YZSoft.bpm.maintenance.ExceptionTaskPanel"
                        },
                        new {
                            id = "TaskRepair",
                            text = Resources.YZStrings.Module_TaskRepair,
                            glyph = 0xeabf,
                            xclass = "YZSoft.bpm.maintenance.TaskRepairPanel"
                        }
                    }
                },
                new {
                    text = Resources.YZStrings.Module_Cat_ArchivedTask,
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "ArchiveReActive",
                            text = Resources.YZStrings.Module_ArchiveReActive,
                            glyph = 0xe997,
                            xclass = "YZSoft.bpm.maintenance.ArchiveReactivePanel"
                        }
                    }
                },
                new {
                    text = Resources.YZStrings.Module_Cat_TaskRecycleBin,
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "AbortedTask",
                            text = Resources.YZStrings.Module_AbortedTask,
                            glyph = 0xe972,
                            xclass = "YZSoft.bpm.maintenance.RecycleBinPanel",
                            config = new
                            {
                                historyTaskType = "Aborted"
                            }
                        },
                        new {
                            id = "DeletedTask",
                            text = Resources.YZStrings.Module_DeletedTask,
                            glyph = 0xe64d,
                            xclass = "YZSoft.bpm.maintenance.RecycleBinPanel",
                            config = new
                            {
                                historyTaskType = "Deleted"
                            }
                        }
                    }
                }
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}
