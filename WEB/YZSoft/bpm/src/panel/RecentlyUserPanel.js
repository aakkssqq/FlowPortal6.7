/*
config:
grid
*/

Ext.define('YZSoft.bpm.src.panel.RecentlyUserPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.model.UserExt',
        'YZSoft.bpm.src.ux.Render',
        'YZSoft.src.form.field.LiveSearch'
    ],
    layout: 'border',
    border: false,
    hidden:true, //此功能未完成，暂时隐藏

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            sortInfo: { field: 'Account', direction: 'ASC' },
            model: 'YZSoft.bpm.src.model.UserExt',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Org.ashx'),
                extraParams: {
                    method: 'GetUsersInPath',
                    path: 'BPMOU://易正信息'
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', Ext.apply({
            title: RS.$('All_UserList'),
            hideHeaders: true,
            region: 'east',
            width: 200,
            margins: '0 0 0 0',
            store: me.store,
            split: { size: 6 },
            border: false,
            selModel: { mode: 'SINGLE' },
            viewConfig: {
                stripeRows: false
            },
            columns: {
                defaults: {
                    sortable: true,
                    hideable: true,
                    menuDisabled: false
                },
                items: [
                    { text: '', dataIndex: 'Account', align: 'left', flex: 1, renderer: me.renderUser }
                ]
            },
            tools: [{
                type: 'refresh',
                handler: function (event, toolEl, panel) {
                    me.store.reload({
                        loadMask: true
                    });
                }
            }]
        }, config.grid));

        delete config.grid;

        me.edtFilter = Ext.create('YZSoft.src.form.field.LiveSearch', {
            grid: me.grid,
            width: 220
        });

        var cfg = {
            layout: 'fit',
            tbar: ['->', RS.$('All_PageFilter'), me.edtFilter],
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    renderUser: function (value, metaData, record) {
        return YZSoft.bpm.src.ux.Render.getUserFriendlyName(record.data.Account, record.data.DisplayName);
    },

    afterRender: function () {
        this.callParent(arguments);
        this.store.load({ loadMask: false });
    }
});
