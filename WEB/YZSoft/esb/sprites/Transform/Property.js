/*
config
designer
sprite
*/
Ext.define('YZSoft.esb.sprites.Transform.Property', {
    extend: 'YZSoft.esb.sprites.PropertyAbstract',

    constructor: function (config) {
        var me = this,
            itemCfg = Ext.copy(config, ['designer', 'sprite']),
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.esb.sprites.Transform.propertypages.General', Ext.apply({
            title: RS.$('All_General'),
            padding: '25 26 10 26'
        }, itemCfg));

        me.pnlMap = Ext.create('YZSoft.esb.sprites.Transform.propertypages.Map', Ext.apply({
            title: RS.$('ESB_PropertyPage_Title_Call'),
            padding: '0 0 0 0'
        }, itemCfg));

        cfg = {
            activeTab: 0,
            items: [
                me.pnlGeneral,
                me.pnlMap
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});