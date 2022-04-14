/*
config
    path - path of report,
    viewName
    paging
    pageItems
    extraParams
    params 报表参数

property:
    curParams
*/
Ext.define('YZSoft.report.rpt.GridViewPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.src.ux.Exporter'
    ],
    border: false,
    bodyStyle: 'background-color:#f5f5f5;',

    constructor: function (config) {
        var me = this,
            url = YZSoft.$url('YZSoft.Services.REST/Reports/Report.ashx'),
            cfg;

        //获得报表定义
        YZSoft.Ajax.request({
            method: 'GET',
            async: false,
            params: {
                method: 'GetGridViewDefine',
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

        me.grid = Ext.create('YZSoft.report.rpt.GridViewPanelBase', {
            //title: me.define.reportName,
            define: me.define,
            store: me.store,
            ui: 'light',
            //header: {
            //    cls: 'yz-header-yzreport'
            //},
            border: false,
            viewConfig: {
                loadMask: false
            }
        });

        cfg = {
            scrollable: true,
            layout: {
                type: 'table',
                columns: 1,
                tableAttrs: {
                    style: {
                        //width: '100%'
                    }
                }
            },
            defaults: {
                xtype: 'container',
                style: 'display:inline-block;background-color:#fff;',
                padding: '30'
            },
            items: [{
                margin: '20 20 20 20',
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

        Ext.create('Ext.LoadMask', {
            msg: RS.$('All_Report_Loading'),
            target: me,
            store: me.store
        });

        me.on({
            single: true,
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
                exportServiceUrl: YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'),
                grid: me.grid,
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