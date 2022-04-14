
Ext.define('YZSoft.im.social.notify.core.Notify', {
    extend: 'Ext.container.Container',
    layout: 'fit',
    isSocialPanel: true,

    constructor: function (config) {
        var me = this,
            cfg;

        me.view = Ext.create('YZSoft.im.src.chat.Notify', Ext.apply({
            resType: config.resType,
            resId: config.resId
        }, config.viewConfig));

        cfg = {
            items:[me.view]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.view.relayEvents(me, ['activate']);
    }
});