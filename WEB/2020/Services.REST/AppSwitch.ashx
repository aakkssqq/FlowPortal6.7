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
                    icon = "YZSoft/frame/images/siteswitch/bpm.png",
                    text = Resources.YZStrings.V2020_Site_BPM,
                    startApp = "2020/BPM"
                },
                new {
                    icon = "YZSoft/frame/images/siteswitch/oa.png",
                    text = Resources.YZStrings.V2020_Site_OA,
                    modulePerm = new YZModulePermision("fe0f4277-6d34-4df2-aa21-7b913aed208d", YZModuleDeniedBehavior.Hide),
                    startApp = "2020/OA"
                },
                new {
                    icon = "YZSoft/frame/images/siteswitch/app.png",
                    text = Resources.YZStrings.V2020_Site_App,
                    modulePerm = new YZModulePermision("49f6f78b-8706-4ac3-a8de-b3ce0188f08b", YZModuleDeniedBehavior.Hide),
                    startApp = "2020/Biz"
                },
                new {
                    icon = "YZSoft/frame/images/siteswitch/ment.png",
                    text = Resources.YZStrings.V2020_Site_Ment,
                    modulePerm = new YZModulePermision("71e3df38-475f-40fc-b0a1-9ad23494a7f5", YZModuleDeniedBehavior.Hide),
                    startApp = "2020/Maint",
                    style = "background-color:#10a29a"
                },
                new {
                    icon = "YZSoft/frame/images/siteswitch/admin.png",
                    text = Resources.YZStrings.V2020_Site_Admin,
                    modulePerm = new YZModulePermision("bd4a0c6f-f717-4879-bddb-c52b5cd051bc", YZModuleDeniedBehavior.Hide),
                    startApp = "2020/Admin",
                    style = "background-color:#656cad"
                },
                new {
                    icon = "YZSoft/frame/images/siteswitch/bpa.png",
                    text = Resources.YZStrings.V2020_Site_BPA,
                    modulePerm = new YZModulePermision("c6fe7eb1-971b-4463-bfaf-995bd10c8244", YZModuleDeniedBehavior.Hide),
                    startApp = "BPA",
                    style = "background-color:#e75725"
                },
                new {
                    icon = "YZSoft/frame/images/siteswitch/developer.png",
                    text = Resources.YZStrings.V2020_Site_Developer,
                    modulePerm = new YZModulePermision("cc0d778c-23be-4dfd-b1cb-d88433e0116a", YZModuleDeniedBehavior.Hide),
                    startApp = "2020/Developer",
                    style = "background-color:#4caf50"
                },//Add by Xine at 20220414 Reason Add PMS
                new {
                    icon = "YZSoft/frame/images/siteswitch/developer.png",
                    text = Resources.YZStrings.V2020_Site_PMS,
                    //modulePerm = new YZModulePermision("cc0d778c-23be-4dfd-b1cb-d88433e0116a", YZModuleDeniedBehavior.Hide),//Mark By Xine at 20220414 關閉模組權限驗證
                    startApp = "PMS/Routing",
                    style = "background-color:#acaf4c"
                }
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}