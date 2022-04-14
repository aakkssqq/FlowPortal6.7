/*
config
    path - path of report,
    viewName
    paging
    pageItems
    extraParams
    params 报表参数
*/
Ext.define('YZSoft.report.rpt.ExcelViewPanel', {
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
                method: 'GetExcelViewDefine',
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

        me.pnlExcel = Ext.create('YZSoft.src.panel.IFramePanel', {
            border:false,
            scrolling: 'no',
            autoWidth: true,
            autoHeight: true
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
                items: [me.pnlExcel]
            }, {
                margin: '0 20 20 20',
                items: [me.grid]
            }],
            bbar: Ext.create('Ext.toolbar.Paging', {
                style:'border-top:solid 1px #ddd !important;',
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
    },

    onStoreLoad: function (store, records, successful, operation, eOpts) {
        var me = this,
            metaData = store.getProxy().getReader().metaData,
            htmlFile = metaData && metaData.htmlFile,
            err = operation.getError();

        if (htmlFile) {
            me.pnlExcel.load(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), {
                method: 'DownloadTempFile',
                fileName: htmlFile
            });
        }
        else if (err) {
            YZSoft.alert(err);
        }
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
                templateExcel: me.define.template,
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
                templateExcel: me.define.template,
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