/*
config
designer
sprite
*/
Ext.define('YZSoft.esb.sprites.DSResponse.Property', {
    extend: 'YZSoft.esb.sprites.PropertyAbstract',

    constructor: function (config) {
        var me = this,
            itemCfg = Ext.copy(config, ['designer', 'sprite']),
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.esb.sprites.DSResponse.propertypages.General', Ext.apply({
            title: RS.$('All_General'),
            padding: '25 26 5 26'
        }, itemCfg));

        me.pnlInput = Ext.create('YZSoft.esb.sprites.DSResponse.propertypages.Input', Ext.apply({
            title: RS.$('ESB_Response_PropertyPage_Title_Input'),
            padding: '0 0 0 0'
        }, itemCfg));

        cfg = {
            items: [
                me.pnlGeneral,
                me.pnlInput
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});