/*
resName,
resType,
resId,
total,
kwd
*/

Ext.define('YZSoft.im.social.navigator.ChannelResultPanel', {
    extend: 'Ext.container.Container',
    cls: ['yz-im-social-navigator'],

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnBack = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-ea40',
            text: RS.$('All_Back'),
            handler: function (item) {
                me.fireEvent('back');
            }
        });

        me.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            region: 'north',
            cls: 'yz-im-toolbar',
            padding: '6 6 0 7',
            items: [
                me.btnBack
            ]
        });

        me.pnlResult = Ext.create('YZSoft.im.social.navigator.view.ChannelResult', {
            region:'center',
            resName: config.resName,
            resType: config.resType,
            resId: config.resId,
            total: config.total,
            kwd: config.kwd
        });

        cfg = {
            layout: 'border',
            items: [me.toolbar, me.pnlResult]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.pnlResult, ['messageclick']);
    }
});