
Ext.define('YZSoft.src.panel.Inform', {
    extend: 'Ext.panel.Panel',
    cls:'yz-inform-panel',
    header: false,

    constructor: function (config) {
        var me = this;

        me.msg = Ext.create('Ext.Component', {
            cls: 'yz-inform-msg',
            html: config.msg,
            border: false
        });

        var cfg = {
            layout: 'center',
            items: [me.msg]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});