/*
config
excelFile
timeout  default 180000,
pageSize
*/
Ext.define('YZSoft.report.ExcelReportPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.src.ux.File'
    ],
    reportServiceUrl: YZSoft.$url('YZSoft.Services.REST/Reports/Report.ashx'),
    layout: 'fit',
    border: false,

    constructor: function (config) {

        var me = this,
            config = config || {},
            excelFile = config.excelFile,
            timeout = config.timeout || 180000,
            pageSize = config.pageSize || $S.pageSize.defaultSize,
            storeCfg,cfg;

        storeCfg = Ext.merge({
            remoteSort: false,
            model: 'Ext.data.Model',
            pageSize: pageSize,
            proxy: {
                type: 'ajax',
                url: config.reportServiceUrl || me.reportServiceUrl,
                timeout: timeout,
                extraParams: {
                    Method: 'GenExcelReport',
                    excelFile: excelFile
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        }, config.storeConfig);

        me.store = Ext.create('Ext.data.Store', storeCfg);

        me.pnlExcel = Ext.create('YZSoft.src.panel.IFramePanel', {
            border:false,
            scrolling:'no',
            autoWidth:true,
            autoHeight:true
        });

        cfg = {
            items: [{
                layout: {
                    type: 'vbox'
                },
                scrollable: true,
                border: false,
                items: [{
                    xtype: 'panel',
                    bodyPadding: 20,
                    border: false,
                    layout: 'vbox',
                    items: [me.pnlExcel]
                }]
            }],
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.store,
                hidden: !('pageSize' in config),
                displayInfo: true
            })
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.store.on({
            scope: me,
            beforeload: function (store) {
                var extraParams = store.getProxy().getExtraParams();
                me.fireEvent('beforereportload', store, extraParams);

                //转换参数
                var pms = [];
                Ext.Object.each(extraParams, function (key, val) {
                    if (key != 'UserParamNames')
                        pms.push(key);
                });
                extraParams.UserParamNames = pms.join(',');
            },
            load: 'onStoreLoad'
        });

        Ext.create('Ext.LoadMask', { msg: RS.$('All_ExcelReport_Loading'), target: me, store: me.store });

        me.on({
            single: true,
            scope: me,
            afterLayout: function () {
                me.store.load({});
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
            me.containsReport = true;
            me.fireEvent('reportload', store);
        }
        else if (err) {
            YZSoft.alert(err);
            me.containsReport = false;
            me.fireEvent('reportload', store);
        }
    },

    $export: function () {
        var me = this,
            params;

        if (!me.containsReport)
            return;

        params = Ext.apply({}, me.store.lastParams);
        params.outputType = 'Export';

        YZSoft.src.ux.File.download(me.reportServiceUrl, params);
    }
});
