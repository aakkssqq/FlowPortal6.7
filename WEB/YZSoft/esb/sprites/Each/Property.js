/*
config
designer
sprite
*/
Ext.define('YZSoft.esb.sprites.Each.Property', {
    extend: 'YZSoft.esb.sprites.PropertyAbstract',

    constructor: function (config) {
        var me = this,
            itemCfg = Ext.copy(config, ['designer', 'sprite']),
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.esb.sprites.Each.propertypages.General', Ext.apply({
            title: RS.$('All_General'),
            padding: '25 26 10 26'
        }, itemCfg));

        cfg = {
            activeTab: 0,
            items: [
                me.pnlGeneral
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});