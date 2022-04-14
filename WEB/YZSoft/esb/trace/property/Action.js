/*
config
designer
sprite
*/
Ext.define('YZSoft.esb.trace.property.Action', {
    extend: 'YZSoft.esb.trace.property.Abstract',

    constructor: function (config) {
        var me = this,
            itemCfg = Ext.copy(config, ['designer', 'sprite']),
            sprite = config.sprite,
            step = sprite.step,
            cfg;

        me.pnlInput = Ext.create('YZSoft.esb.trace.property.action.Input', Ext.apply({
            title: RS.$('All_ESBTrace_PropertyPage_Title_Input'),
            padding: '0 0 0 0',
        }, itemCfg));

        me.pnlOutput = Ext.create('YZSoft.esb.trace.property.action.Output', Ext.apply({
            title: RS.$('All_ESBTrace_PropertyPage_Title_Output'),
            padding: '0 0 0 0',
            hidden: step.Status == 'Enter' || step.Status == 'Begin' || step.Status == 'Call'
        }, itemCfg));

        me.pnlGeneral = Ext.create('YZSoft.esb.trace.property.action.General', Ext.apply({
            title: RS.$('All_ESBTrace_PropertyPage_Title_General'),
            padding: '25 26 5 26'
        }, itemCfg));

        cfg = {
            activeTab: 0,
            items: [
                me.pnlInput,
                me.pnlOutput,
                me.pnlGeneral
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});