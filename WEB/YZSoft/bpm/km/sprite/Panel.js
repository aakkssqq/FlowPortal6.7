/*
config
fileid
spriteid
*/
Ext.define('YZSoft.bpm.km.sprite.Panel', {
    extend: 'Ext.container.Container',

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlOverview = Ext.create('YZSoft.bpm.km.sprite.Overview', {
            title: RS.$('KM_Overview'),
            fileid: config.fileid,
            spriteid: config.spriteid
        });

        me.tabBar = Ext.create('Ext.tab.Bar', {
            cls: 'yz-tab-bar-undline-bpakm yz-tab-bar-bpakm-pos',
            border: false
        });

        me.headerBar = Ext.create('Ext.container.Container', {
            region: 'north',
            padding: '0 0 0 6',
            style: 'background-color:#fff;border-bottom:solid 1px #d6d6d6;',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [me.tabBar, { xtype: 'tbfill' }]
        });

        me.tab = Ext.create('YZSoft.src.tab.Panel', {
            region: 'center',
            border: false,
            activeTab: 0,
            bodyStyle: 'border-width:0px',
            tabBar: me.tabBar,
            items: [
                me.pnlOverview
            ]
        });

        cfg = {
            layout:'border',
            items: [me.headerBar, me.tab]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});