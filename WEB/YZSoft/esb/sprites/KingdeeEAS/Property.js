/*
config
designer
sprite
*/
Ext.define('YZSoft.esb.sprites.KingdeeEAS.Property', {
    extend: 'YZSoft.esb.sprites.PropertyAbstract',

    constructor: function (config) {
        var me = this,
            itemCfg = Ext.copy(config, ['designer', 'sprite']),
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.esb.sprites.KingdeeEAS.propertypages.General', Ext.apply({
            title: RS.$('All_General'),
            padding: '25 26 5 26',
            listeners: {
                cnselect: function (combo, record, eOpts) {
                    me.pnlInputMap.setConnectionName(combo.getValue());
                    me.pnlOutputMap.setConnectionName(combo.getValue());
                },
                offsetchange: function (field, newValue, oldValue, eOpts) {
                    me.pnlInputMap.setOffsetUrl(newValue);
                    me.pnlOutputMap.setOffsetUrl(newValue);
                },
                opselect: function (combo, record, eOpts) {
                    me.pnlInputMap.setOperationName(record.data.name);
                    me.pnlInputMap.setMessageName(record.data.messageName);
                    me.pnlOutputMap.setOperationName(record.data.name);
                    me.pnlOutputMap.setMessageName(record.data.messageName);
                }
            }
        }, itemCfg));

        me.pnlInputMap = Ext.create('YZSoft.esb.sprites.KingdeeEAS.propertypages.InputMap', Ext.apply({
            title: RS.$('ESB_PropertyPage_Title_Call'),
            padding: '0 0 0 0',
        }, itemCfg));

        me.pnlOutputMap = Ext.create('YZSoft.esb.sprites.KingdeeEAS.propertypages.OutputMap', Ext.apply({
            title: RS.$('ESB_PropertyPage_Title_Return'),
            padding: '0 0 0 0'
        }, itemCfg));

        me.pnlException = Ext.create('YZSoft.esb.sprites.KingdeeEAS.propertypages.Exception', Ext.apply({
            title: RS.$('ESB_PropertyPage_Title_Exception'),
            padding: '25 26 5 26'
        }, itemCfg));

        cfg = {
            activeTab: 0,
            items: [
                me.pnlGeneral,
                me.pnlInputMap,
                me.pnlOutputMap,
                me.pnlException
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});