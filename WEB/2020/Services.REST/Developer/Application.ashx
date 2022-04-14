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
                    text = "应用开发",
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "BasicPanel",
                            text = "设备管理",
                            glyph = 0xeb22,
                            xclass = "Demo.ProductionDevice.BasicPanel"
                        },
                        new {
                            id = "AccessControlPanel",
                            text = "集成权限",
                            glyph = 0xeb22,
                            modulePerm = new YZModulePermision("d0ebfcf9-0007-44b3-b218-ef94628de67e", YZModuleDeniedBehavior.Hide),
                            xclass = "Demo.ProductionDevice.AccessControlPanel"
                        },
                        new {
                            id = "AssignPermisionPanel",
                            text = "记录授权",
                            glyph = 0xeb22,
                            modulePerm = new YZModulePermision("d0ebfcf9-0007-44b3-b218-ef94628de67e", YZModuleDeniedBehavior.Hide),
                            xclass = "Demo.ProductionDevice.AssignPermisionPanel"
                        },
                        new {
                            id = "IntegrationProcessPanel",
                            text = "整合流程",
                            glyph = 0xeb22,
                            modulePerm = new YZModulePermision("d0ebfcf9-0007-44b3-b218-ef94628de67e", YZModuleDeniedBehavior.Hide),
                            xclass = "Demo.ProductionDevice.IntegrationProcessPanel"
                        }
                    }
                },
                new {
                    text = "Excel 报表",
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "SalesReport",
                            text = "销售报表",
                            glyph = 0xeb2a,
                            tabs =  new object[]{
                                new {
                                    id = "YearSalesReport",
                                    text = "年度营业报表",
                                    xclass = "Demo.Sales.SalesReportPanel"
                                },
                                new {
                                    id = "YearSalesReportMultiSheet",
                                    text = "年度营业报表（多Sheet）",
                                    xclass = "Demo.Sales.SalesReportPanel",
                                    config = new {
                                        multiSheet = true
                                    }
                                }
                            }
                        },
                        new {
                            id = "DeviceRepair",
                            text = "维修队日报表",
                            glyph = 0xeb2a,
                            tabs =  new object[]{
                                new {
                                    id = "YearDeviceRepair",
                                    text = "维修队日报表",
                                    xclass = "Demo.DeviceRepair.DailyReportPanel"
                                }
                            }
                        }
                    }
                },
                new {
                    text = "报表展示",
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "ReportX",
                            text = "ReportX",
                            glyph = 0xeb12,
                            xclass = "YZSoft.report.Panel",
                            config = new {
                                path = "D41.ReportX/年度销售统计"
                            }
                        },
                        new {
                            id = "Report5",
                            text = "Report5.0",
                            glyph = 0xeb12,
                            xclass = "YZSoft.report.rpt.Panel",
                            config = new {
                                path = "D22.ReportLink/流程发起量统计"
                            }
                        },
                        new {
                            id = "Report5CustomSearch",
                            text = "自定义搜索",
                            glyph = 0xeb12,
                            xclass = "YZSoft.report.rpt.Panel",
                            config = new {
                                path = "D22.ReportLink/员工发起排行榜",
                                pnlSearch = new {
                                    xclass = "Demo.YZReport.CustomSearchBar"
                                }
                            }
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
