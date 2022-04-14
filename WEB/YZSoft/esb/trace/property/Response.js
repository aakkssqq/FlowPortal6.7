/*
config
designer
sprite
*/
Ext.define('YZSoft.esb.trace.property.Response', {
    extend: 'YZSoft.esb.trace.property.Abstract',

    constructor: function (config) {
        var me = this,
            itemCfg = Ext.copy(config, ['designer', 'sprite']),
            sprite = config.sprite,
            step = sprite.step,
            cfg;

        me.pnlOutput = Ext.create('YZSoft.esb.trace.property.response.Output', Ext.apply({
            title: RS.$('All_ESBTrace_PropertyPage_Title_Output'),
            padding: '0 0 0 0',
        }, itemCfg));

        me.pnlGeneral = Ext.create('YZSoft.esb.trace.property.response.General', Ext.apply({
            title: RS.$('All_ESBTrace_PropertyPage_Title_General'),
            padding: '25 26 5 26',
            listeners: {
                cnselect: function (combo, record, eOpts) {
                }
            }
        }, itemCfg));

        cfg = {
            activeTab: 0,
            items: [
                me.pnlOutput,
                me.pnlGeneral
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});