/*
config
designer
sprite
*/
Ext.define('YZSoft.esb.trace.property.Task', {
    extend: 'YZSoft.esb.trace.property.Abstract',

    constructor: function (config) {
        var me = this,
            itemCfg = Ext.copy(config, ['designer']),
            cfg;

        me.pnlVariables = Ext.create('YZSoft.esb.trace.property.task.Variables', Ext.apply({
            title: RS.$('All_ESBTrace_PropertyPage_Title_Variables'),
            padding: '0 0 0 0',
        }, itemCfg));

        me.pnlGeneral = Ext.create('YZSoft.esb.trace.property.task.General', Ext.apply({
            title: RS.$('All_ESBTrace_PropertyPage_Title_General'),
            padding: '25 26 5 26'
        }, itemCfg));

        cfg = {
            activeTab: 0,
            items: [
                me.pnlVariables,
                me.pnlGeneral
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});