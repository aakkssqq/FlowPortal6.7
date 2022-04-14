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
                //new {
                //    id = "Demo",
                //    title = "流程梳理",
                //    xclass = "YZSoft.BPA.DesignerPanel"
                //},
                new {
                    id = "APP",
                    title = "应用客制",
                    dataURL = this.ResolveUrl(context,"APPDemo.ashx"),
                    activeNode = "BasicPanel"
                },
                new {
                    id = "Samples",
                    title = "功能演示",
                    dataURL = this.ResolveUrl(context,"Samples.ashx"),
                    activeNode = "FormSamples"
                }
            };

            return modules;
        }
    }
}