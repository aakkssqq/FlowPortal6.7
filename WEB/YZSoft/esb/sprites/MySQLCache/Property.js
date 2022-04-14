/*
config
designer
sprite
*/
Ext.define('YZSoft.esb.sprites.MySQLCache.Property', {
    extend: 'YZSoft.esb.sprites.PropertyAbstract',
    requires: [
        'YZSoft.esb.sprites.MySQLCache.propertypages.General',
        'YZSoft.esb.sprites.MySQLCache.propertypages.InputMap',
        'YZSoft.esb.sprites.MySQLCache.propertypages.OutputMap'
    ],

    constructor: function (config) {
        var me = this,
            itemCfg = Ext.copy(config, ['designer', 'sprite']),
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.esb.sprites.MySQLCache.propertypages.General', Ext.apply({
            title: RS.$('All_General'),
            padding: '25 26 10 26',
            listeners: {
                cnselect: function (combo, record, eOpts) {
                    me.pnlInputMap.setConnectionName(combo.getValue());
                },
                tablechange: function (field, record, eOpts) {
                    me.pnlInputMap.setTable(field.getValue());
                }
            }
        }, itemCfg));

        me.pnlInputMap = Ext.create('YZSoft.esb.sprites.MySQLCache.propertypages.InputMap', Ext.apply({
            title: RS.$('ESB_PropertyPage_Title_Call'),
            padding: '0 0 0 0',
        }, itemCfg));

        me.pnlOutputMap = Ext.create('YZSoft.esb.sprites.MySQLCache.propertypages.OutputMap', Ext.apply({
            title: RS.$('ESB_PropertyPage_Title_Return'),
            padding: '0 0 0 0'
        }, itemCfg));

        cfg = {
            activeTab: 0,
            items: [
                me.pnlGeneral,
                me.pnlInputMap,
                me.pnlOutputMap
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});