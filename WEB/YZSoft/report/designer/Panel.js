
/*
config
designMode, //new,edit
readOnly
designMode = edit
path,
designMode = new
folder
*/
Ext.define('YZSoft.report.designer.Panel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.src.designer.runtime.ClassManager'
    ],
    bannerHeight: 66,

    constructor: function (config) {
        var me = this,
            config = config || {},
            mode = config.designMode,
            readOnly = config.readOnly,
            sp, cfg;

        me.cmpLogo = Ext.create('Ext.Component', {
            cls: 'yz-logo-circle',
            width: 47,
            height:47
        });

        me.btnChartColumn = Ext.create('Ext.button.Button', {
            text: RS.$('ReportDesigner_ChartType_Column'),
            glyph: 0xeafb,
            iconAlign: 'top',
            dragContext: {
                ctype: 'chart.column',
                height: 72
            }
        });

        me.btnChartColumn3D = Ext.create('Ext.button.Button', {
            text: RS.$('ReportDesigner_ChartType_Column3D'),
            glyph: 0xeafc,
            iconAlign: 'top',
            dragContext: {
                ctype: 'chart.column3d',
                height: 72
            }
        });

        me.btnChartBar = Ext.create('Ext.button.Button', {
            text: RS.$('ReportDesigner_ChartType_Bar'),
            glyph: 0xeafd,
            iconAlign: 'top',
            dragContext: {
                ctype: 'chart.bar',
                height: 72
            }
        });

        me.btnChartBar3D = Ext.create('Ext.button.Button', {
            text: RS.$('ReportDesigner_ChartType_Bar3D'),
            glyph: 0xeafe,
            iconAlign: 'top',
            dragContext: {
                ctype: 'chart.bar3d',
                height: 72
            }
        });

        me.btnChartLine = Ext.create('Ext.button.Button', {
            text: RS.$('ReportDesigner_ChartType_Line'),
            glyph: 0xeaff,
            iconAlign: 'top',
            dragContext: {
                ctype: 'chart.line',
                height: 72
            }
        });

        me.btnChartArea = Ext.create('Ext.button.Button', {
            text: RS.$('ReportDesigner_ChartType_Area'),
            glyph: 0xeb00,
            iconAlign: 'top',
            dragContext: {
                ctype: 'chart.area',
                height: 72
            }
        });

        me.btnChartScatter = Ext.create('Ext.button.Button', {
            text: RS.$('ReportDesigner_ChartType_Scatter'),
            glyph: 0xeb01,
            iconAlign: 'top',
            dragContext: {
                ctype: 'chart.scatter',
                height: 72
            }
        });

        me.btnChartPie = Ext.create('Ext.button.Button', {
            text: RS.$('ReportDesigner_ChartType_Pie'),
            glyph: 0xeb02,
            iconAlign: 'top',
            dragContext: {
                ctype: 'chart.pie',
                height: 72
            }
        });

        me.btnChartPie3D = Ext.create('Ext.button.Button', {
            text: RS.$('ReportDesigner_ChartType_Pie3D'),
            glyph: 0xeb03,
            iconAlign: 'top',
            dragContext: {
                ctype: 'chart.pie3d',
                height: 72
            }
        });

        me.btnChartRadar = Ext.create('Ext.button.Button', {
            text: RS.$('ReportDesigner_ChartType_Radar'),
            glyph: 0xeb04,
            iconAlign: 'top',
            dragContext: {
                ctype: 'chart.radar',
                height: 72
            }
        });

        me.btnGrid = Ext.create('Ext.button.Button', {
            text: RS.$('ReportDesigner_DetailTable'),
            glyph: 0xe800,
            iconAlign: 'top',
            dragContext: {
                ctype: 'report.grid',
                height: 72
            }
        });

        me.btnHBox2 = Ext.create('Ext.button.Button', {
            text: RS.$('ReportDesigner_Layout_2Column'),
            glyph: 0xeb05,
            iconAlign: 'top',
            dragContext: {
                ctype: 'layout.hbox',
                height: 72,
                columns: 2
            }
        });

        me.btnHBox3 = Ext.create('Ext.button.Button', {
            text: RS.$('ReportDesigner_Layout_3Column'),
            glyph: 0xeb06,
            iconAlign: 'top',
            dragContext: {
                ctype: 'layout.hbox',
                height: 72,
                columns: 3
            }
        });

        me.btnSearchPanel = Ext.create('Ext.button.Button', {
            text: RS.$('ReportDesigner_Search_SearchBox'),
            glyph: 0xeada,
            iconAlign: 'top',
            dragContext: {
                ctype: 'report.search.panel',
                height: 72
            }
        });

        me.btnPreview = Ext.create('Ext.button.Button', {
            text: RS.$('All_ReportX_Run'),
            //glyph:0xea86,
            cls:'yz-btn-submit yz-size-icon-12',
            handler: function () {
                var report = me.save(),
                    reportName = me.reportName || RS.$('All_ReportX_ReportNameNew');

                Ext.create('YZSoft.report.testing.Dialog', {
                    title: Ext.String.format(RS.$('All_ReportX_Title_Run'), reportName),
                    autoShow: true,
                    dock: 'right',
                    width: me.getWidth() - me.pnlTools.getWidth() - me.pnlProperty.getWidth(),
                    reportName: reportName,
                    reportDefine: report
                });
            }
        });

        me.btnSave = Ext.create('Ext.button.Button', {
            text: RS.$('All_Save'),
            margin: '0 8 0 8',
            disabled: readOnly,
            handler: function () {
                if (me.designMode == 'new')
                    me.saveNew();
                else
                    me.saveEdit();
            }
        });

        me.btnClose = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
            handler: function () {

                if (me.btnSave.disabled || !me.isDirty()) {
                    me.close();
                    return;
                }

                Ext.Msg.show({
                    title: RS.$('All_DlgTitle_CloseConfirm'),
                    msg: RS.$('Report_Designer_Close_Confirm'),
                    buttons: Ext.Msg.YESNOCANCEL,
                    defaultButton: 'yes',
                    icon: Ext.Msg.INFO,
                    buttonText: {
                        yes: RS.$('All_Save'),
                        no: RS.$('All_NotSave'),
                        cancel: RS.$('All_Cancel')
                    },
                    fn: function (btn, text) {
                        if (btn == 'no') {
                            me.close();
                            return;
                        }

                        if (btn == 'cancel')
                            return;

                        if (me.designMode == 'new') {
                            me.saveNew(function () {
                                me.close();
                            });
                        }
                        else {
                            me.saveEdit(function () {
                                me.close();
                            });
                        }
                    }
                });

            }
        });

        sp = {
            xtype: 'tbseparator',
            cls: 'yz-sp-reportdesigner-tbar'
        };

        me.titlebar = Ext.create('Ext.container.Container', {
            region: 'north',
            height: me.bannerHeight,
            cls:'yz-border-b',
            style: 'background-color:#fcfcfc;',
            padding:'0 10 0 0',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [{
                xtype: 'container',
                cls:'yz-border-r',
                height: '100%',
                width:68,
                layout: {
                    type: 'hbox',
                    align: 'middle',
                    pack: 'center'
                },
                items: [
                    me.cmpLogo
                ]
            }, {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align:'center'
                },
                padding:'0 10',
                defaults: {
                    cls: 'yz-btn-report-chart'
                },
                items: [
                    me.btnChartColumn,
                    me.btnChartColumn3D,
                    me.btnChartBar,
                    me.btnChartBar3D,
                    me.btnChartLine,
                    me.btnChartArea,
                    me.btnChartScatter,
                    me.btnChartPie,
                    me.btnChartPie3D,
                    me.btnChartRadar,
                    me.btnGrid,
                    sp,
                    me.btnHBox2,
                    me.btnHBox3,
                    sp,
                    me.btnSearchPanel
                ]
            }, {
                xtype: 'tbfill'
            }, me.btnPreview, me.btnSave, me.btnClose]
        });

        me.pnlTools = Ext.create('YZSoft.report.designer.tools.Panel', {
            region: 'west',
            width: 260,
            bodyStyle: 'background-color:#fcfcfc;',
            cls: 'yz-border-r',
            split: {
                width:0
            }
        });

        me.pnlProperty = Ext.create('YZSoft.src.designer.property.Panel', {
            region: 'east',
            width: 300,
            bodyStyle: 'background-color:#fcfcfc;',
            cls:'yz-border-l',
            split: {
                width: 0
            }
        });

        me.pnlDesignContainer = Ext.create('YZSoft.report.designer.Container', {
            region: 'center',
            designer: me
        });

        cfg = {
            layout: 'border',
            items: [
                me.titlebar,
                me.pnlTools,
                me.pnlDesignContainer,
                me.pnlProperty
            ]
        }

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.pnlProperty.relayEvents(me.pnlDesignContainer, ['selectionchange'], 'part');

        me.on({
            single:true,
            afterRender: function () {
                me.ddel = document.createElement('div');
                me.ddel.className = 'yz-dd-wrap';
                me.drag = Ext.create('Ext.dd.DragZone', me.titlebar.el.dom, {
                    ddGroup: 'chart',
                    getDragData: function (e) {
                        var target = e.getTarget('.x-btn'),
                            toolbtn = target && Ext.get(target).component;

                        if (toolbtn) {
                            return Ext.apply({
                                event: e,
                                ddel: me.ddel,
                                //sourceEl: srcbtn,
                                //repairXY: Ext.fly(sourceEl).getXY(),
                                fromToolbar: true,
                                isChart: true,
                                toolbtn: toolbtn
                            }, toolbtn.dragContext);
                        }
                    },
                    onInitDrag: function (x, y) {
                        Ext.fly(me.ddel).setHtml(Ext.String.format('<div class="yz-dd-chart">{0}</div>', this.dragData.toolbtn.getText()));
                        this.proxy.update(me.ddel);
                        this.onStartDrag(10, 10);
                    }
                });
            }
        });

        me.on({
            single: true,
            afterLayout: function () {
                if (mode == 'edit') {
                    me.openReport(config.path);
                }
            }
        });
    },

    getDefaultStore: function () {
        return this.pnlTools.dsNode.store;
    },

    openReport: function (path, config) {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/Reports/ReportXAdmin.ashx'),
            params: {
                method: 'GetReportDefine',
                path: path
            },
            waitMsg: {
                msg: RS.$('All_Loading'),
                target: me
            },
            success: function (action) {
                var data = action.result;

                if (me.destroyed)
                    return;

                me.reportName = data.name;
                me.doc = Ext.create('YZSoft.src.designer.doc.Document', {
                    src:data
                });
                me.fill(me.doc);
                me.curReport = me.save();
            }
        });
    },

    isDirty: function () {
        var me = this,
            curReport = (me.curReport && me.curReport.define),
            nowReport = me.save().define;

        curReport = curReport || {
            datasources: {},
            components: {},
            items: []
        };

        return Ext.encode(curReport) != Ext.encode(nowReport);
    },

    save: function () {
        var me = this,
            components = {},
            items = me.pnlDesignContainer.save(components),
            datasources = me.pnlTools.save();

        return {
            define: {
                datasources: datasources,
                components: components,
                items: items
            }
        }
    },

    saveNew: function (fn) {
        var me = this,
            report = me.save(),
            dlg;

        me.curReport = report;

        report.author = {
            uid: userInfo.Account,
            name: userInfo.DisplayName || userInfo.Account,
            createat: new Date()
        };

        dlg = Ext.create('YZSoft.report.designer.dialogs.SaveNewReportDlg', {
            autoShow: true,
            autoClose: false,
            fn: function (reportName) {
                dlg.hide();

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/Reports/ReportXAdmin.ashx'),
                    params: {
                        method: 'SaveReportAs',
                        folder: me.folder,
                        name: reportName,
                    },
                    jsonData: {
                        data: report
                    },
                    waitMsg: {
                        msg: RS.$('All_Saving'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        Ext.destroy(dlg);

                        me.designMode = 'edit';
                        me.reportName = reportName;
                        me.path = action.result.path;

                        me.mask({
                            msg: RS.$('All_Save_Succeed'),
                            msgCls: 'yz-mask-msg-success',
                            autoClose: true,
                            fn: function () {
                                me.fireEvent('reportsaved', 'new', reportName, action.result);
                                fn && fn(report);
                            }
                        });
                    },
                    failure: function (action) {
                        YZSoft.alert(action.result.errorMessage, function () {
                            dlg.show();
                        });
                    }
                });
            }
        });
    },

    saveEdit: function (fn) {
        var me = this,
            reportName = me.reportName,
            report = me.save();

        me.curReport = report;

        report.lastModifier = {
            uid: userInfo.Account,
            name: userInfo.DisplayName || userInfo.Account,
            date: new Date()
        };

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/Reports/ReportXAdmin.ashx'),
            params: {
                method: 'SaveReport',
                path: me.path
            },
            jsonData: {
                data: report
            },
            waitMsg: {
                msg: RS.$('All_Saving'),
                target: me,
                start: 0
            },
            success: function (action) {
                me.mask({
                    msg: RS.$('All_Save_Succeed'),
                    msgCls: 'yz-mask-msg-success',
                    autoClose: true,
                    fn: function () {
                        me.fireEvent('reportsaved', 'edit', reportName, action.result);
                        fn && fn(report);
                    }
                });
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage, function () {
                });
            }
        });
    },

    fill: function (doc) {
        var me = this,
            items = doc.resolveItems();

        me.pnlTools.fill(doc.src.define.datasources);
        me.pnlDesignContainer.add(items);
    },

    getDSNode: function (dsid) {
        return this.pnlTools.getDSNode(dsid);
    },

    selDSNode: function (fn) {
        var dsNodes = this.pnlTools.getDSNodes();

        if (dsNodes.length == 0) {
            fn && fn(null);
        }
        else if (dsNodes.length == 1) {
            fn && fn(dsNodes[0]);
        }
        else {
            Ext.create('YZSoft.report.designer.dialogs.SelDSNodeDialog', {
                title: RS.$('Designer_SelectDataSource'),
                autoShow: true,
                dsNodes: dsNodes,
                fn: function (dsNode) {
                    fn && fn(dsNode);
                }
            });
        }
    }
})