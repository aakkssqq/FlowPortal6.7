/*
config
designer
sprite
*/
Ext.define('YZSoft.esb.sprites.Listener.Property', {
    extend: 'YZSoft.esb.sprites.PropertyAbstract',

    constructor: function (config) {
        var me = this,
            itemCfg = Ext.copy(config, ['designer', 'sprite']),
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.esb.sprites.Listener.propertypages.General', Ext.apply({
            title: RS.$('All_General'),
            padding: '25 26 5 26'
        }, itemCfg));

        me.pnlOutput = Ext.create('YZSoft.esb.sprites.Listener.propertypages.Output', Ext.apply({
            title: RS.$('ESB_Listener_PropertyPage_Title_Output'),
            padding: '0 0 0 0'
        }, itemCfg));

        cfg = {
            items: [
                me.pnlGeneral,
                me.pnlOutput
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});