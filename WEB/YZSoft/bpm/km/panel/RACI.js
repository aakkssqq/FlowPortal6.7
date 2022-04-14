
/*
config
    fileid
*/
Ext.define('YZSoft.bpm.km.panel.RACI', {
    extend: 'Ext.container.Container',
    activeNameField: 'SpriteName',

    constructor: function (config) {
        var me = this,
            fileid = config.fileid,
            activeNameField = config.activeNameField || me.activeNameField,
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
                    { text: RS.$('KM_Activity'), dataIndex: activeNameField, flex: 3 },
                    { text: RS.$('KM_RACI_Responsible'), dataIndex: 'R', flex: 2 },
                    { text: RS.$('KM_RACI_Accountable'), dataIndex: 'A', flex: 2 },
                    { text: RS.$('KM_RACI_Consulted'), dataIndex: 'C', flex: 2 },
                    { text: RS.$('KM_RACI_Informed'), dataIndex: 'I', flex: 2 }
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