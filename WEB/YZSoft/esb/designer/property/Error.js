
Ext.define('YZSoft.esb.designer.property.Error', {
    extend: 'Ext.container.Container',
    layout: 'center',
    msgStyle: 'text-align: center;color: #bbb;word-break: break-all;padding: 10px;font-size: 13px;',

    constructor: function (config) {
        var me = this,
            cfg;

        me.errorCmp = Ext.create('Ext.Component', {
            style: me.msgStyle,
            html: config.errorMessage
        });

        cfg = {
            items: [me.errorCmp]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});