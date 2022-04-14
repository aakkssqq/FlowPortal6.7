<%@ WebHandler Language="C#" Class="BPMApp.Developer.FormModuleTree" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json.Linq;

namespace BPMApp.Developer
{
    public class FormModuleTree : YZServiceHandler
    {        
        public object GetModuleTree(HttpContext context)
        {
            object[] modules = new object[] {
                new {
                    text = "表单",
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "FormSamples",
                            text = "表单组件",
                            glyph = 0xeae7,
                            xclass = "YZSoft.src.panel.IFramePanelExt",
                            config = new {
                                url = this.ResolveUrl(context, "../../../Demo/Samples/Form/Controls.htm"),
                            }
                        },
                        new {
                            id = "FormFunctions",
                            text = "表单功能",
                            glyph = 0xeae7,
                            xclass = "YZSoft.src.panel.IFramePanelExt",
                            config = new {
                                url = this.ResolveUrl(context, "../../../Demo/Samples/Form/Functions.htm"),
                            }
                        }
                    }
                },
                new {
                    text = "集成",
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "IntegrationSamples",
                            text = "集成示例",
                            glyph = 0xeae7,
                            xclass = "YZSoft.src.panel.IFramePanelExt",
                            config = new {
                                url = this.ResolveUrl(context, "../../../Demo/Samples/Integration/Index.htm"),
                            }
                        }
                    }
                }
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}
