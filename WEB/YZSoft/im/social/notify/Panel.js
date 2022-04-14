
Ext.define('YZSoft.im.social.notify.Panel', {
    extend: 'YZSoft.im.src.FunctionTab',

    constructor: function (config) {
        var me = this,
            cfg;

        me.cmpTitle = Ext.create('Ext.Component', {
            cls: 'yz-item-title',
            tpl: '{title}',
            data: {
                title: config.title
            }
        });

        me.tabBar = Ext.create('Ext.tab.Bar', {
            border: false,
            cls: 'yz-tab-bar-undline yz-im-tab-bar-module',
            flex: 1,
            layout: {
                overflowHandler: 'scroller'
            }
        });

        me.titleBar = Ext.create('Ext.container.Container', {
            cls: 'yz-item-titlebar',
            border: false,
            layout: {
                type: 'hbox',
                align: 'end'
            },
            items: [me.cmpTitle, me.tabBar]
        });

        me.pnlChat = Ext.create('YZSoft.im.social.notify.core.Notify', {
            title: RS.$('All_IM_Notify'),
            cls: 'yz-func-panel',
            resType: config.resType,
            resId: config.resId,
            viewConfig: config.socialPanelConfig
        });

        cfg = {
            dockedItems: [me.titleBar],
            tabBar: me.tabBar,
            items: [me.pnlChat]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});