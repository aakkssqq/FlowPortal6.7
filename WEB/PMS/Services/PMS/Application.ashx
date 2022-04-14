<%@ WebHandler Language="C#" Class="BPMApp.Developer.ApplicationModuleTree" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json.Linq;

namespace BPMApp.Developer
{
    public class ApplicationModuleTree : YZServiceHandler
    {
        public object GetModuleTree(HttpContext context)
        {
            object[] modules = new object[] {
                 new {
                    text = "基礎作業",
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "CreatePMSPanel",
                            text = "專案建立",
                            glyph = 0xeb22,
                            xclass = "PMS.Pages.ProductionDevice.BasicPanel"
                        }
                    }
                },
                new {
                    text = "第三方报表",
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "MyReport21",
                            text = "IFrame集成",
                            glyph = 0xeb12,
                            xclass = "YZSoft.src.panel.IFramePanel",
                            config = new {
                                url = "http://insight.baidu.com/chezhan_cd/#/detail/3307",
                                @params = new {
                                    accesstoken = "单点登录token",
                                    name = "保时捷"
                                }
                            }
                        }
                    }
                }
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}
