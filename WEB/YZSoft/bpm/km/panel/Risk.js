
/*
config
    fileid
*/
Ext.define('YZSoft.bpm.km.panel.Risk', {
    extend: 'Ext.container.Container',

    constructor: function (config) {
        var me = this,
            fileid = config.fileid,
            cfg;

        me.store = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: [],
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPA/ProcessReports.ashx'),
                extraParams: config.params
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            region: 'center',
            border: false,
            cls: 'yz-grid-size-m yz-grid-cellalign-vcenter yz-grid-bpakm-report',
            viewConfig: {
                markDirty: false
            },
            columns: {
                defaults: {
                    sortable: false,
                    formatter: 'text'
                },
                items: [
                    { text: RS.$('KM_Activity'), dataIndex: 'ActivityName', flex: 1 },
                    { text: RS.$('KM_Risk'), dataIndex: 'Desc', flex: 4, tdCls: 'yz-wrap' }
                ]
            }
        });

        cfg = {
            layout: 'fit',
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});