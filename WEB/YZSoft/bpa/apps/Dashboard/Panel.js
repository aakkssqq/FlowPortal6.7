
Ext.define('YZSoft.bpa.apps.Dashboard.Panel', {
    extend: 'Ext.container.Container',
    style: 'background-color:#f0f0f0',
    scrollable: true,
    statusName: {
        NoExecute: RS.$('BPA_Status_NoExecute'),
        Regulation: RS.$('BPA_Status_Regulation'),
        PartialOnlineExecute: RS.$('BPA_Status_PartialOnlineExecute'),
        CompleteOnlineExecute: RS.$('BPA_Status_CompleteOnlineExecute')
    },
    colorName: {
        White: RS.$('BPA_Color_White'),
        Pink: RS.$('BPA_Color_Pink'),
        Yellow: RS.$('BPA_Color_Yellow'),
        LightBlue: RS.$('BPA_Color_LightBlue'),
        LightGray: RS.$('BPA_Color_LightGray'),
        Gray: RS.$('BPA_Color_Gray')
    },
    filetypeName: {
        '.evc': RS.$('BPA_ModuleType_EVC'),
        '.flow': RS.$('BPA_ModuleType_Flow'),
        '.bpmn': RS.$('BPA_ModuleType_BPMN'),
        '.org': RS.$('BPA_ModuleType_ORG'),
        '.data': RS.$('BPA_ModuleType_Data'),
        '.it': RS.$('BPA_ModuleType_IT'),
        '.product': RS.$('BPA_ModuleType_Product'),
        '.risk': RS.$('BPA_ModuleType_Risk'),
        '.reg': RS.$('BPA_ModuleType_Regulation'),
        '.kpi': RS.$('BPA_ModuleType_KPI')
    },
    strategicProcessTypes: {
        StrategicProcess: RS.$('BPA_ProcessType_Strategic'),
        OperationProcess: RS.$('BPA_ProcessType_Operation'),
        SupportProcess: RS.$('BPA_ProcessType_Support'),
        Other: RS.$('BPA_ProcessType_Other')
    },

    labelTemplates: {
        launch: new Ext.Template('{title}: {sum}'),
        design: new Ext.Template(
            '{title}: {sum}<br/>',
            RS.$('BPA_Milestone_Design') + '{Design}, ',
            RS.$('BPA_Milestone_Development') + '{Development}, ',
            RS.$('BPA_Milestone_Testing') + '{Testing}'
        ),
        other: new Ext.Template(
            '{title}: {sum}<br/>',
            RS.$('BPA_Milestone_Planning') + '{Planning}, ',
            RS.$('BPA_Milestone_Discover') + '{Discover}'
        )
    },

    constructor: function (config) {
        var me = this,
            cfg, data;

        me.pnlSearch = me.createSearchPanel(config);

        me.btnRefresh = Ext.create('Ext.button.Button', {
            text: RS.$('All_Refresh'),
            cls:'bpa-btn-flat',
            iconCls: 'yz-glyph yz-glyph-refresh',
            handler: function () {
                me.doSearch();
            }
        });

        me.btnSearch = Ext.create('YZSoft.src.button.PanelExpandButton', {
            text: RS.$('All_Filter'),
            cls: 'bpa-btn-flat',
            expandPanel: me.pnlSearch
        });

        me.toolBar = Ext.create('Ext.toolbar.Toolbar', {
            style: 'background-color:white',
            height: 48,
            padding:'0 6',
            items: [
                '->',
                me.btnRefresh,
                me.btnSearch
            ]
        });

        me.pnlSummary = me.createSummaryPanel(config);
        me.pnlFileType = me.createFileTypePanel(config)

        data = [];
        Ext.Object.each(me.strategicProcessTypes, function (name, text) {
            data.push({
                name: name,
                title: text,
                value: 0
            });
        });

        me.pnlStrategic = Ext.create('YZSoft.src.dashboard.KPI', {
            margin: '0 0 15 0',
            store: {
                fields: ['name', 'title', 'value'],
                data: data
            }
        });

        me.pnlExecuteStatus = me.createExecuteStatusPanel(config);
        me.pnlColor = me.createColorPanel(config);

        cfg = {
            padding: 0,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.toolBar, {
                xtype: 'container',
                cls:'yz-identity-floating-target',
                flex: 1,
                minHeight: 630,
                padding:15,
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'container',
                    flex: 7,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        me.pnlSummary,
                        me.pnlFileType
                    ]
                }, {
                    xtype: 'container',
                    flex: 3,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        me.pnlStrategic,
                        me.pnlExecuteStatus,
                        me.pnlColor
                    ]
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            single: true,
            afterlayout: function () {
                me.updateLayout(); //*****修正异常出现的滚动条
                me.doSearch();
            }
        });
    },

    createSearchPanel: function (config) {
        var me = this;

        me.edtLibs = Ext.create('YZSoft.bpa.src.form.field.LibrariesField', {
            fieldLabel: RS.$('KM_Scope')
        });

        me.edtResponsible = Ext.create('YZSoft.bpa.src.form.field.ReportSpriteField', {
            fieldLabel: RS.$('KM_R'),
            width: 400,
            padding: '0 0 0 200',
            btnConfig: {
                text: RS.$('BPA__SelResponsible')
            },
            dlgConfig: {
                title: RS.$('KM_R'),
                folderType: 'BPAOU'
            }
        });

        me.edtMilestone = Ext.create('YZSoft.bpa.src.form.field.MilestoneField', {
            fieldLabel: RS.$('BPA__Milestone')
        });

        me.edtModuleType = Ext.create('YZSoft.bpa.src.form.field.FileTypesField', {
            fieldLabel: RS.$('BPA__ModuleType')
        });

        me.edtFileColor = Ext.create('YZSoft.bpa.src.form.field.FileColorField', {
            fieldLabel: RS.$('ReportDesigner_Seg_Color')
        });

        me.edtExecuteStatus = Ext.create('YZSoft.bpa.src.form.field.ExecuteStatusField', {
            fieldLabel: RS.$('BPA__ExecuteStatus')
        });

        me.btnSearch = Ext.create('Ext.button.Button', {
            text: RS.$('All_Report_Statistic'),
            padding: '7 10',
            cls: 'yz-btn-submit',
            iconCls: 'yz-glyph yz-glyph-search',
            handler: function () {
                me.doSearch({
                    fn: function () {
                        me.pnlSearch.hide();
                    }
                });
            }
        });

        me.btnClose = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
            padding: '7 10',
            margin:'0 0 0 6',
            handler: function () {
                me.pnlSearch.hide();
            }
        });

        return Ext.create('Ext.container.Container', {
            padding: '10 20 20 30',
            floating: true,
            floatingContainer: me,
            style:'background-color:#fff;',
            hidden:true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'container'
            },
            items: [{
                padding: '0 0 0 0',
                layout: {
                    type: 'hbox',
                    align: 'start'
                },
                items: [me.edtLibs, me.edtResponsible, { xtype: 'tbfill' }]
            }, {
                padding: '10 0 0 0',
                items: [me.edtMilestone]
            }, {
                padding: '0 0 0 0',
                items: [me.edtModuleType]
            }, {
                padding: '0 0 0 0',
                items: [me.edtFileColor]
            }, {
                padding: '0 0 0 0',
                items: [me.edtExecuteStatus]
            }, {
                padding: '4 0 0 105',
                layout: {
                    type: 'hbox'
                },
                items: [me.btnSearch, me.btnClose]
            }]
        });
    },

    createSummaryPanel: function (config) {
        var me = this;

        me.kpiTotalModules = Ext.create('YZSoft.src.dashboard.RingChart', {
            flex: 1,
            border: false,
            series: {
                colors: ['#30b5e6', '#f5f5f5']
            }
        });

        me.kpiLaunchModules = Ext.create('YZSoft.src.dashboard.RingChart', {
            flex: 1,
            border: false,
            series: {
                colors: ['#30b5e6', '#f5f5f5']
            }
        });

        me.kpiDesignModules = Ext.create('YZSoft.src.dashboard.RingChart', {
            flex: 1,
            border: false,
            series: {
                colors: ['#ffbb75', '#f5f5f5']
            }
        });

        me.kpiDiscoverModules = Ext.create('YZSoft.src.dashboard.RingChart', {
            flex: 1,
            border: false,
            series: {
                colors: ['#fb75fb', '#f5f5f5']
            }
        });

        me.kpiPlanningModules = Ext.create('YZSoft.src.dashboard.RingChart', {
            flex: 1,
            border: false,
            series: {
                colors: ['#17c793', '#f5f5f5']
            }
        });

        return Ext.create('Ext.container.Container', {
            margin: '0 15 15 0',
            style: 'background-color:#fff;',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'container',
                flex: 1,
                height: 180,
                padding: '10 10 15 10',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                }
            },
            items: [{
                items: [me.kpiTotalModules, {
                    xtype: 'component',
                    html: Ext.String.format('<div style="text-align:center">{0}</div>', RS.$('BPA__ModuleCounts'))
                }]
            }, {
                items: [me.kpiLaunchModules, {
                    xtype: 'component',
                    html: Ext.String.format('<div style="text-align:center">{0}</div>', RS.$('BPA_Milestone_LaunchPeriod'))
                }]
            }, {
                items: [me.kpiDesignModules, {
                    xtype: 'component',
                    html: Ext.String.format('<div style="text-align:center">{0}</div>', RS.$('BPA_Milestone_DesignPeriod'))
                }]
            }, {
                items: [me.kpiDiscoverModules, {
                    xtype: 'component',
                    html: Ext.String.format('<div style="text-align:center">{0}</div>', RS.$('BPA_Milestone_DiscoverPeriod'))
                }]
            }, {
                items: [me.kpiPlanningModules, {
                    xtype: 'component',
                    html: Ext.String.format('<div style="text-align:center">{0}</div>', RS.$('BPA_Milestone_PlanningPeriod'))
                }]
            }]
        });
    },

    createExecuteStatusPanel: function (config) {
        var me = this;

        return Ext.create('Ext.chart.PolarChart', {
            title: RS.$('BPA__ExecuteStatus'),
            ui:'light',
            margin: '0 0 15 0',
            flex: 1,
            store: {
                fields: ['name', 'status', 'value'],
                data: []
            },
            insetPadding: 0,
            innerPadding: 30,
            interactions: ['rotate', 'itemhighlight'],
            series: [{
                type: 'pie',
                angleField: 'value',
                donut: 0,
                label: {
                    field: 'name',
                    display: 'rotate'
                },
                highlight: true,
                colors: ['#f5f5f5', '#fb75fb', '#17c793', '#30b5e6'],
                tooltip: {
                    trackMouse: true,
                    renderer: function (tooltip, record, item) {
                        var store = record.store,
                            total = 0;

                        store.each(function (rec) {
                            total += rec.data.value;
                        });

                        tooltip.setHtml(Ext.String.format('{0}:{1} {2}%', record.data.name, record.data.value, Math.floor(record.data.value * 1000 / total) / 10.0));
                    }
                }
            }]
        });
    },

    createColorPanel: function (config) {
        var me = this,
            data = [];

        Ext.Object.each(me.colorName, function (color, name) {
            data.push({
                value: color,
                color: name,
                desc: '&nbsp',
                ratio: 0
            });
        });

        me.viewColor = Ext.create('Ext.view.View', {
            store: {
                fields: ['value', 'color', 'desc', 'ratio'],
                data: data
            },
            itemSelector: '.yz-chart-progressbar',
            tpl: [
                '<tpl for=".">',
                    '<div class="d-flex flex-row align-items-end yz-chart-progressbar yz-view-item-bpacolorbar-wrap  yz-view-item-bpacolorbar-wrap-{color}">',
                    '<div class="title">{color}</div>',
                    '<div class="flex-fill">',
                        '<div class="desc">{desc}</div>',
                        '<div class="progress-wrap">',
                            '<div class="indicate indicate-{color}" style="width: {[values.ratio * 100]}%;"></div>',
                        '</div>',
                        '</div>',
                    '</div>',
                '</tpl>'
            ]
        });

        return Ext.create('Ext.panel.Panel', {
            bodyPadding: 20,
            items: [me.viewColor]
        });
    },

    createFileTypePanel: function (config) {
        var me = this,
            data = [];

        Ext.Object.each(me.filetypeName, function (ext, name) {
            data.push({
                ext: ext,
                type: name,
                launch: 0,
                design: 0,
                other: 0
            });
        });

        return Ext.create('Ext.chart.CartesianChart', {
            title: RS.$('BPA_Report_Title_Category'),
            width: '100%',
            ui:'light',
            insetPadding: 40,
            innerPadding: '40 0 0 0',
            margin: '0 15 0 0',
            flex: 1,
            animation: {
                easing: 'backOut',
                duration: 500
            },
            store: {
                fields: ['ext', 'type', 'launch', 'design', 'other'],
                data: data
            },
            axes: [{
                type: 'numeric',
                position: 'left',
                fields: ['launch', 'design', 'other'],
                grid: true,
                majorTickSteps: 10
            }, {
                type: 'category',
                position: 'bottom',
                fields: ['type']
            }],
            series: [{
                type: 'bar',
                axis: 'left',
                xField: 'type',
                title: [
                    RS.$('BPA_Milestone_LaunchPeriod'),
                    RS.$('BPA_Milestone_DesignPeriod'),
                    RS.$('BPA_Milestone_OtherPeriod')
                ],
                yField: ['launch', 'design', 'other'],
                colors: ['#30b5e6', '#ffbb75', '#f5f5f5'],
                style: {
                    opacity: 0.8,
                    minGapWidth: 14
                },
                highlightCfg: {
                    opacity: 0.5
                },
                label: {
                    field: [null, null, 'other'],
                    display: 'outside',
                    orientation: 'horizontal',
                    renderer: function (text, sprite, config, rendererData, index) {
                        var rec = rendererData.store.getAt(index),
                            data = rec.data;
                        return (data.launch + data.design + data.other).toString();
                    }
                },
                tooltip: {
                    trackMouse: true,
                    renderer: function (tooltip, record, item) {
                        var html,
                            field = item.field,
                            title = item.series.getTitle()[Ext.Array.indexOf(item.series.getYField(), field)],
                            sum = record.get(field),
                            tpl = me.labelTemplates[field];

                        if (tpl) {
                            html = tpl.apply(Ext.apply({
                                field: field,
                                title: title,
                                sum: sum
                            }, record.data.all));

                            tooltip.setHtml(html);
                        }
                    }
                }
            }]
        });
    },

    doSearch: function (config) {
        var me = this,
            config = config || {},
            fn = config.fn;

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/BPA/ProcessReports.ashx'),
            params: {
                method: 'GetDashboardData',
                rootfolders: Ext.encode(me.edtLibs.getValue()),
                responsible: Ext.encode(me.edtResponsible.getValue()),
                milestones: Ext.encode(me.edtMilestone.getValue()),
                moduletypes: Ext.encode(me.edtModuleType.getValue()),
                colors: Ext.encode(me.edtFileColor.getValue()),
                executeStatus: Ext.encode(me.edtExecuteStatus.getValue())
            },
            waitMsg: {
                msg: RS.$('All_Loading'),
                target: me
            },
            success: function (action) {
                var milestone = action.result.Milestone,
                    executeStatus = action.result.ExecuteStatus,
                    colors = action.result.Color,
                    filetypes = action.result.FileTypes,
                    strategic = action.result.Strategic,
                    total, value, data;

                //里程碑
                total = milestone.Total;
                value = milestone.Total;
                me.kpiTotalModules.setValue(value, total);
                me.kpiTotalModules.setText(value);

                value = milestone.Launch;
                me.kpiLaunchModules.setValue(value, total);
                me.kpiLaunchModules.setText(value);

                value = milestone.Design + milestone.Development + milestone.Testing;
                me.kpiDesignModules.setValue(value, total);
                me.kpiDesignModules.setText(value);

                value = milestone.Discover;
                me.kpiDiscoverModules.setValue(value, total);
                me.kpiDiscoverModules.setText(value);

                value = milestone.Planning;
                me.kpiPlanningModules.setValue(value, total);
                me.kpiPlanningModules.setText(value);

                //执行状态
                data = [];
                Ext.Object.each(executeStatus, function (status, value) {
                    var name = me.statusName[status];
                    if (name) {
                        data.push({
                            name: name,
                            status: status,
                            value: value
                        });
                    }
                });
                me.pnlExecuteStatus.store.setData(data);

                //颜色
                total = 0;
                Ext.Object.each(colors, function (color, count) {
                    total += count;
                });

                data = [];
                Ext.Object.each(colors, function (color, count) {
                    var name = me.colorName[color],
                        ratio = total == 0 ? 0 : Math.floor(count * 1000 / total) / 10.0;

                    if (name) {
                        data.push({
                            value: color,
                            color: name,
                            desc: count == 0 ? RS.$('All_None') : Ext.String.format(RS.$('BPA_Report_Desc_ModulePercentage'), count, ratio),
                            ratio: ratio / 100
                        });
                    }
                });
                me.viewColor.store.setData(data);

                //分类统计
                data = [];
                Ext.Object.each(filetypes, function (ext, item) {
                    var name = me.filetypeName[ext];

                    if (name) {
                        data.push({
                            ext: ext,
                            type: name,
                            launch: item.Launch,
                            design: item.Design + item.Development + item.Testing,
                            other: item.Planning + item.Discover,
                            all: item
                        });
                    }
                });
                me.pnlFileType.store.setData(data);

                //战略流程
                data = [];
                Ext.Object.each(strategic, function (strategic, count) {
                    data.push({
                        name: strategic,
                        title: me.strategicProcessTypes[strategic],
                        value: count
                    });
                });
                me.pnlStrategic.store.setData(data);

                fn && fn();
            }
        }, config));
    }
});