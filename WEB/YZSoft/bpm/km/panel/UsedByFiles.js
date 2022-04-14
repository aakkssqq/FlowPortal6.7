
Ext.define('YZSoft.bpm.km.panel.UsedByFiles', {
    extend: 'Ext.panel.Panel',
    cls: 'yz-pnl-bpakm',
    ui:'light',
    header: {
        cls:'yz-header-bpakm'
    },
    title: RS.$('KM_UsedByFile'),

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.Store', {
            fields: ['FileID', 'SpriteID', 'Name', 'FileName', 'SpriteName' ],
            data: []
        });

        me.view = Ext.create('Ext.view.View', {
            tpl: [
                '<tpl for=".">',
                    '<div class="yz-dataview-item yz-dataview-item-block yz-dataview-item-bpakm yz-dataview-item-bpakm-usedbyfiles">',
                            '{FileName:text}',
                    '</div>',
                '</tpl>'
            ],
            overItemCls: 'yz-dataview-item-bpakm-over',
            selectedItemCls: '',
            itemSelector: '.yz-dataview-item-bpakm',
            store: me.store
        });

        cfg = {
            items: [me.view]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.view, ['itemclick']);
    },

    setData: function (usedby) {
        this.store.setData(usedby || []);
    }
});