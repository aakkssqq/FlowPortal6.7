
Ext.define('YZSoft.bpm.km.panel.Processes', {
    extend: 'Ext.panel.Panel',
    cls: 'yz-pnl-bpakm',
    ui: 'light',
    header: {
        cls: 'yz-header-bpakm'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.Store', {
            fields: ['ProcessName', 'Version'],
            data: []
        });

        me.view = Ext.create('Ext.view.View', {
            tpl: [
                '<tpl for=".">',
                    '<div class="yz-dataview-item yz-dataview-item-block yz-dataview-item-bpakm yz-dataview-item-bpakm-parentfile">',
                        '{ProcessName:text}',
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

    setData: function (processes) {
        this.store.setData(processes ? (Ext.isArray(processes) ? processes : [processes]) : []);
    }
});