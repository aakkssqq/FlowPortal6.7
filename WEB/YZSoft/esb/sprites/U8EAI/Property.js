﻿/*
config
designer
sprite
*/
Ext.define('YZSoft.esb.sprites.U8EAI.Property', {
    extend: 'YZSoft.esb.sprites.PropertyAbstract',

    constructor: function (config) {
        var me = this,
            itemCfg = Ext.copy(config, ['designer', 'sprite']),
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.esb.sprites.U8EAI.propertypages.General', Ext.apply({
            title: RS.$('All_General'),
            padding: '25 26 5 26',
            listeners: {
                cnselect: function (combo, record, eOpts) {
                }
            }
        }, itemCfg));

        me.pnlInputMap = Ext.create('YZSoft.esb.sprites.U8EAI.propertypages.InputMap', Ext.apply({
            title: RS.$('ESB_PropertyPage_Title_Call'),
            padding: '0 0 0 0',
        }, itemCfg));

        me.pnlOutputMap = Ext.create('YZSoft.esb.sprites.U8EAI.propertypages.OutputMap', Ext.apply({
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