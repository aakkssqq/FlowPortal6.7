/*
config
    path - path of report,
*/
Ext.define('YZSoft.report.Panel', {
    extend: 'Ext.panel.Panel',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    cls: 'yz-panel-reportx',
    bodyCls: 'yz-panel-reportx-body',
    bodyStyle: 'background-color:#f5f5f5;',
    scrollable: {
        x: false,
        y: 'scroll'
    },
    bodyPadding: 5,
    defaults: {
        padding: 20,
        margin: 5
    },

    constructor: function (config) {
        var me = this,
            config = config || {};

        me.callParent(arguments);

        me.on({
            single: true,
            afterLayout: function () {
                me.openReport(config.path);
            }
        });
    },

    openReport: function (path, config) {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/Reports/ReportX.ashx'),
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

                me.reportName = data.name;
                me.doc = Ext.create('YZSoft.src.designer.doc.Document', {
                    src: data
                });
                me.fill(me.doc);
            }
        });
    },

    fill: function (doc) {
        var me = this,
            classManager = me.classManager,
            items, xclass;

        me.ds = [];

        Ext.Object.each(me.doc.src.define.datasources, function (dsid, ds) {
            me.ds[dsid] = {
                define: ds,
                store: me.createStore(ds.ds)
            };
        });

        items = doc.resolveItems(function (item) {
            item.reportPanel = me;

            if (item.dsid)
                item.store = me.ds[item.dsid].store;
        });

        me.add(items);

        Ext.each(me.searchPanels, function (searchPanel) {
            searchPanel.doSearch();
        });

        //对没有被searchbox触发的store进行数据加载
        Ext.Object.each(me.ds, function (dsid, ds) {
            if (!ds.store.bindSearch)
                ds.store.loadPage(1);
        });
    },

    createStore: function (ds) {
        var me = this,
            ods = Ext.create('YZSoft.src.datasource.DataSource', ds),
            store;

        store = ods.createStore({
            remoteSort: true
        });

        return store;
    }
});