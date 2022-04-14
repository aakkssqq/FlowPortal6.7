
Ext.define('YZSoft.bpm.km.panel.bpa.Activities', {
    extend: 'Ext.panel.Panel',
    cls: 'yz-pnl-bpakm',
    ui:'light',
    header: {
        cls:'yz-header-bpakm'
    },
    title: RS.$('KM_Activity'),

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.Store', {
            fields: ['SpriteID', 'SpriteName'],
            data: []
        });

        me.view = Ext.create('Ext.view.View', {
            tpl: [
                '<tpl for=".">',
                    '<div class="yz-dataview-item yz-dataview-item-block yz-dataview-item-bpakm {SpriteID:this.renderCls} yz-dataview-item-bpakm-activity">',
                          '{SpriteName:text}',
                    '</div>',
                '</tpl>', {
                    renderCls: function (spriteid) {
                        return spriteid ? '' : 'yz-dataview-item-bpakm-disabled'
                    }
                }
            ],
            overItemCls: 'yz-dataview-item-bpakm-over',
            selectedItemCls: '',
            itemSelector: '.yz-dataview-item-bpakm',
            store: me.store
        });

        var cfg = {
            items: [me.view]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.view, ['itemclick']);
    },

    setData: function (activities) {
        var me = this,
            data = [];

        Ext.each(activities, function (activity) {
            if (activity.SpriteName)
                data.push(activity);
        });

        me.store.setData(data);
    }
});