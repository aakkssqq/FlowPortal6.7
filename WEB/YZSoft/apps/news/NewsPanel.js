
Ext.define('YZSoft.apps.news.NewsPanel', {
    extend: 'Ext.panel.Panel',
    layout: {
        type: 'fit'
    },
    border: false,

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: $S.pageSize.defaultSize,
            model: 'Ext.data.Model',
            sorters: {
                property: 'id',
                direction: 'ASC'
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, 'Services.ashx'),
                extraParams: {
                    method: 'GetData'
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            border: false,
            selModel: { mode: 'MULTI' },
            columns: {
                defaults: {
                },
                items: [
                    { xtype: 'rownumberer' },
                    { header: RS.$('All_Name'), dataIndex: 'Name', flex: 1 }
                ]
            },
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.store,
                displayInfo: true
            })
        });

        me.btnNew = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-new',
            text: RS.$('All_Add'),
            handler: function () {
                //me.addNew();
            }
        });

        cfg = {
            tbar:[me.btnNew],
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
    }
});