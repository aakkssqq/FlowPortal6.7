
Ext.define('YZSoft.im.social.chat.SingleChatPanel', {
    extend: 'YZSoft.im.src.FunctionTab',

    constructor: function (config) {
        var me = this,
            folderid = config.folderid,
            cfg;

        if (!folderid) {
            YZSoft.Ajax.request({
                async: false,
                url: YZSoft.$url('YZSoft.Services.REST/core/P2PGroup.ashx'),
                params: {
                    method: 'GetGroupInfo',
                    groupid: config.groupid
                },
                success: function (action) {
                    folderid = action.result.FolderID;
                }
            });
        }

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

        me.pnlChat = Ext.create('YZSoft.im.social.chat.core.Chat', {
            title: RS.$('All_Chat'),
            cls: 'yz-func-panel',
            resType: 'SingleChat',
            resId: config.groupid,
            folderid: folderid,
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