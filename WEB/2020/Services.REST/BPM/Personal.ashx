<%@ WebHandler Language="C#" Class="BPMApp.PersonalModuleTree" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json.Linq;

namespace BPMApp
{
    public class PersonalModuleTree : YZServiceHandler
    {        
        public object GetModuleTree(HttpContext context)
        {
            object[] modules = new object[] {
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
                },
                new {
                    id = "LeavingSetting",
                    text = Resources.YZStrings.Module_LeavingSetting,
                    glyph = 0xe613,
                    xclass = "YZSoft.personal.LeavingSettingPanel",
                    tabWrap = false
                },
                new {
                    id = "UserInfo",
                    text = Resources.YZStrings.Module_UserInfo,
                    glyph = 0xea98,
                    xclass = "YZSoft.personal.UserInfoTab",
                    tabWrap = false
                },
                new {
                    id = "OrgRelationship",
                    text = Resources.YZStrings.Module_OrgRelationship,
                    glyph = 0xeabe,
                    xclass = "YZSoft.personal.OrgRelationshipPanel",
                    tabWrap = false
                }
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}
