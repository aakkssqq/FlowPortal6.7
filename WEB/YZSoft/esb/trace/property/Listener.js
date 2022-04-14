/*
config
designer
sprite
*/
Ext.define('YZSoft.esb.trace.property.Listener', {
    extend: 'YZSoft.esb.trace.property.Abstract',

    constructor: function (config) {
        var me = this,
            itemCfg = Ext.copy(config, ['designer', 'sprite']),
            sprite = config.sprite,
            step = sprite.step,
            cfg;

        me.pnlInput = Ext.create('YZSoft.esb.trace.property.listener.Input', Ext.apply({
            title: RS.$('All_ESBTrace_PropertyPage_Title_Input'),
            padding: '0 0 0 0',
        }, itemCfg));

        me.pnlGeneral = Ext.create('YZSoft.esb.trace.property.listener.General', Ext.apply({
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
                me.pnlInput,
                me.pnlGeneral
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});