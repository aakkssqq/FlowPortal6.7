
Ext.define('YZSoft.system.online.SystemUsersPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.model.User'
    ],

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.bpm.src.model.User',
            pageSize: $S.pageSize.BPMAdmin.systemUsers,
            sorters: { property: 'LastActiveDate', direction: 'DESC' },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/ActiveUsers.ashx'),
                extraParams: {
                    method: 'GetSystemUsers'
                },
                reader: {
                    rootProperty:'children'
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel',{
            cls: 'yz-border-t',
            store: me.store,
            region: 'center',
            columns: [
                { xtype: 'rownumberer', align: 'center' },
                { text: RS.$('All_UserDisplayName'), dataIndex: 'DisplayName', width: 140, align: 'center', sortable: true, renderer: me.renderUser },
                { text: RS.$('All_Account'), dataIndex: 'Account', width: 140, align: 'center', sortable: true, formatter: 'text' },
                { text: RS.$('All_Phone'), dataIndex: 'Mobile', width: 120, align: 'center', sortable: true, formatter: 'text' },
                { text: RS.$('All_EMail'), dataIndex: 'EMail', width: 260, align: 'center', sortable: true, formatter: 'text' },
                { text: RS.$('All_LastActiveDate'), dataIndex: 'LastActiveDate', flex: 1, align: 'left', sortable: true, formatter: 'date("Y-m-d H:i:s")' }
            ],
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.store,
                displayInfo: true
            })
        });

        me.btnExcelExport = Ext.create('YZSoft.src.button.ExcelExportButton', {
            grid: me.grid,
            templateExcel: YZSoft.$url(me, Ext.String.format('30DaysUsers{0}.xls', RS.$('All_LangPostfix'))),
            params: {},
            fileName: '30DaysUsers',
            allowExportAll: true,
            listeners: {
                beforeload: function (params) {
                    params.ReportDate = new Date()
                }
            }
        });

        me.edtSearch = Ext.create('YZSoft.src.form.field.Search',{
            store: me.store
        });

        var cfg = {
            layout: 'border',
            tbar: {
                cls:'yz-tbar-module',
                items: [me.btnExcelExport, '->', RS.$('All_Search'), me.edtSearch]
            },
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onActivate: function (times) {
        if (times == 0)
            this.store.load($S.loadMask.first);
        else
            this.store.reload($S.loadMask.activate);
    },

    renderUser: function (value, metaData, record) {
        var me = this,
            data = record.data;

        return Ext.String.format('<span class="yz-s-uid" uid="{0}" tip-align="l50-r50">{1}</span>',
            Ext.util.Format.text(data.Account),
            Ext.util.Format.text(data.DisplayName || data.Account));
    }
});
