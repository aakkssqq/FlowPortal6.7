/*
config
    path - path of report,
    viewName,
    paging
    pageItems
    extraParams
    params 报表参数
*/
Ext.define('YZSoft.report.rpt.MSChartViewPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.src.ux.Exporter'
    ],
    border: false,
    bodyStyle: 'background-color:#f5f5f5;',

    constructor: function (config) {
        var me = this,
            url = YZSoft.$url('YZSoft.Services.REST/Reports/Report.ashx'),
            menus, cfg;

        //获得报表定义
        YZSoft.Ajax.request({
            method: 'GET',
            async: false,
            params: {
                method: 'GetMSChartViewDefine',
                path: config.path,
                viewName: config.viewName
            },
            url: url,
            scope: me,
            success: function (action) {
                me.define = action.result;
            }
        });

        me.store = config.store;
        if (!me.store) {
            me.store = Ext.create('YZSoft.report.rpt.store.ReportStore', {
                pageSize: config.paging ? (config.pageItems || $S.pageSize.defaultSize) : 1000,
                proxy: {
                    extraParams: Ext.apply({
                        path: config.path,
                        viewName: config.viewName,
                        paging: config.paging,
                        params: Ext.util.Base64.encode(Ext.encode(config.params))
                    }, config.extraParams)
                }
            });
        }

        me.store.on({
            scope: me,
            load: 'onStoreLoad'
        });

        me.imgChart = Ext.create('Ext.Img', {
            height: me.define.view.ReportHeight
        });

        //chart type menus
        me.storeChartType = Ext.create('YZSoft.report.rpt.store.MSChartTypeStore', {});
        menus = [];
        me.storeChartType.each(function (rec) {
            menus.push({
                text: rec.data.value,
                tag: rec.data,
                handler: function (item) {
                    me.fireEvent('selectChartType', this)
                }
            });
        });

        me.btnChartType = Ext.create('Ext.Button', {
            text: me.define.view.ChartType,
            value: me.define.view.ChartType,
            padding: '6 10',
            menu: {
                items: menus
            }
        });

        me.seg3d = Ext.create('Ext.button.Segmented', {
            defaults: {
                padding: '6 8'
            },
            items: [{
                text: RS.$('All_Yes'),
                value: true
            }, {
                text: RS.$('All_No'),
                value: false,
                pressed: true
            }]
        });

        me.angle = Ext.create('Ext.slider.Single', {
            minValue: -180,
            maxValue: 180,
            width: 180,
            value: 0,
            useTips: true
        });

        me.seriesBtns = [];
        Ext.each(me.define.view.Series, function (series) {
            me.seriesBtns.push(Ext.create('YZSoft.src.button.Button', {
                text: series.Name,
                tag: series,
                enableToggle: true,
                pressed: true,
                padding: '6 8',
                listeners: {
                    beforeToggle: function (fireBtn, pressed) {
                        if (!pressed) {
                            var btn = Ext.Array.findBy(me.seriesBtns, function (btn) {
                                return fireBtn !== btn && btn.pressed;
                            });

                            if (!btn)
                                return false;
                        }
                    }
                }
            }));
        });

        me.pnlSetting = Ext.create('Ext.panel.Panel', {
            border: false,
            width: 200,
            margin: '22 40 10 0',
            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('All_Report_ChartType'),
                labelAlign: 'top',
                items: [me.btnChartType]
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: '3D',
                labelAlign: 'top',
                items: [me.seg3d]
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('All_Report_Angle'),
                labelAlign: 'top',
                items: [me.angle]
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('All_DataSeries'),
                labelAlign: 'top',
                items: me.seriesBtns
            }]
        });

        if (me.define.gridViewName) {
            me.grid = Ext.create('YZSoft.report.rpt.GridViewPanelBase', {
                title: RS.$('All_Report_DetailTable'),
                path: config.path,
                viewName: me.define.gridViewName,
                store: me.store,
                ui: 'light',
                header: {
                    cls: 'yz-header-yzreport'
                },
                border: false,
                viewConfig: {
                    loadMask: false
                }
            });
        }

        cfg = {
            scrollable: true,
            layout: {
                type: 'table',
                columns: 2,
                tableAttrs: {
                    style: {
                        //width: '100%'
                    }
                }
            },
            defaults: {
                xtype: 'container',
                style: 'display:inline-block;background-color:#fff;',
                padding: '30',
                tdAttrs: {
                    style: {
                        verticalAlign: 'top'
                    }
                }
            },
            items: [{
                    margin: '20 20 20 20',
                    items: [me.imgChart],
                }, {
                    margin: '20 20 20 0',
                    items: [me.pnlSetting]
            }, {
                colspan: 2,
                margin: '0 20 20 20',
                items: [me.grid]
            }],
            bbar: Ext.create('Ext.toolbar.Paging', {
                style: 'border-top:solid 1px #ddd !important;',
                store: me.store,
                hidden: config.store || config.paging === false,
                displayInfo: true
            })
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.addCls('yz-opacity-0');

        me.relayEvents(me.store, ['datachanged']);

        me.loadMask = Ext.create('Ext.LoadMask', {
            msg: RS.$('All_Report_Loading'),
            target: me,
            store: me.store
        });

        me.on({
            single: true,
            scope: me,
            afterLayout: function () {
                me.store.load({
                    loadMask: {
                        start: 200,
                        stay: 300
                    },
                    callback: function () {
                        me.removeCls('yz-opacity-0');
                    }
                });
            }
        });

        me.on({
            scope: me,
            selectChartType: function (menuItem) {
                me.btnChartType.setText(menuItem.tag.value);
                me.btnChartType.value = menuItem.tag.value;
                me.onChartTypeChange();
            }
        });

        me.seg3d.on({
            scope: me,
            toggle: 'onChartTypeChange'
        });

        me.angle.on({
            scope: me,
            dragend: 'onChartTypeChange'
        });

        Ext.each(me.seriesBtns, function (seriesBtn) {
            seriesBtn.on({
                scope: me,
                toggle: 'onChartTypeChange'
            });
        });
    },

    onStoreLoad: function () {
        var me = this,
            store = me.store,
            metaData = store.getProxy().getReader().metaData,
            chartid = metaData.chartid,
            html;

        if (chartid) {
            me.imgChart.setSrc(Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                method: 'ChartManagerImageService',
                id: chartid
            })));

            me.imgChart.setSize(metaData.width, metaData.height);
        }
    },

    onChartTypeChange: function () {
        var me = this,
            store = me.store,
            metaData = store.getProxy().getReader().metaData,
            extraParams = store.getProxy().getExtraParams(),
            denySeries = [];

        Ext.each(me.seriesBtns, function (seriesBtn) {
            if (!seriesBtn.pressed)
                denySeries.push(seriesBtn.tag.Name);
        });

        Ext.apply(extraParams, {
            ChartType: me.btnChartType.value,
            Enable3D: me.seg3d.getValue(),
            Rotation: me.angle.getValue(),
            DenySeries: Ext.encode(denySeries)
        });

        store.load({
            loadMask: false,
            params: {
                srcdata: metaData.srcdata,
                total: store.getTotalCount()
            }
        });
    },

    canExport: function () {
        return this.store.getTotalCount() !== 0;
    },

    $export: function (templateUrl) {
        var me = this;

        //执行导出
        if (me.paging) {
            Ext.create('YZSoft.src.dialogs.ExcelExportDlg', {
                autoShow: true,
                grid: me.grid,
                store: me.store,
                templateExcel: templateUrl,
                params: {
                    outputType: 'Export'
                },
                exportParams: {
                    dynamicParams: true
                },
                fileName: me.define.reportName,
                allowExportAll: true
            });
        }
        else {
            YZSoft.src.ux.Exporter.$export({
                grid: me.grid,
                store: me.store,
                templateExcel: templateUrl,
                params: {
                    outputType: 'Export'
                },
                exportParams: {
                    dynamicParams: true
                },
                fileName: me.define.reportName,
                start: 0,
                limit: me.store.getTotalCount()
            });
        }
    }
});