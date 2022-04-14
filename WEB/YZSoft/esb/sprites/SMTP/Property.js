/*
config
designer
sprite
*/
Ext.define('YZSoft.esb.sprites.SMTP.Property', {
    extend: 'YZSoft.esb.sprites.PropertyAbstract',

    constructor: function (config) {
        var me = this,
            itemCfg = Ext.copy(config, ['designer', 'sprite']),
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.esb.sprites.SMTP.propertypages.General', Ext.apply({
            title: RS.$('All_General'),
            padding: '25 26 5 26',
            listeners: {
                cnselect: function (combo, record, eOpts) {
                }
            }
        }, itemCfg));

        me.pnlInputMap = Ext.create('YZSoft.esb.sprites.SMTP.propertypages.InputMap', Ext.apply({
            title: RS.$('ESB_SMTP_PropertyPage_Title_Input'),
            padding: '0 0 0 0',
        }, itemCfg));

        cfg = {
            activeTab:0,
            items: [
                me.pnlGeneral,
                me.pnlInputMap
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});