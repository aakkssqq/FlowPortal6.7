/*
config:
bpmServer
grid
*/

Ext.define('YZSoft.bpm.src.panel.ProcessListPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.model.ProcessInfo'
    ],
    layout: 'fit',
    border: false,

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.ProcessInfo',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Process.ashx'),
                extraParams: {
                    method: 'GetAllProcessNames',
                    bpmServer: config.bpmServer
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', Ext.apply({
            store: me.store,
            border: false,
            selModel: { mode: 'SINGLE' },
            viewConfig: {
                stripeRows: true
            },
            columns: {
                defaults: {
                    sortable: true,
                    hideable: true,
                    menuDisabled: false,
                    renderer: YZSoft.Render.renderString
                },
                items: [
                    { text: RS.$('All_ProcessName'), dataIndex: 'ProcessName', flex: 1 }
                ]
            }
        }, config.grid));

        delete config.grid;

        me.btnRefresh = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-refresh',
            text: RS.$('All_Refresh'),
            handler: function () {
                me.store.reload({
                    loadMask: true
                });
            }
        });

        me.edtFilter = Ext.create('YZSoft.src.form.field.LiveSearch', {
            grid: me.grid,
            width: 220
        });

        var cfg = {
            tbar: [me.btnRefresh,'->', RS.$('All_PageFilter'), me.edtFilter],
            items: [{
                xtype:'panel',
                border:false,
                layout:'fit',
                items:[me.grid]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    afterRender: function () {
        this.callParent(arguments);
        this.store.load({ loadMask: false });
    }
});
