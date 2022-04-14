
Ext.define('YZSoft.im.social.chat.GroupPanel', {
    extend: 'YZSoft.im.src.FunctionTab',

    constructor: function (config) {
        var me = this,
            cfg, folderid;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
            params: {
                method: 'GetGroupAndUserPerm',
                groupid: config.groupid
            },
            success: function (action) {
                me.groupInfo = action.result;
                folderid = me.groupInfo.Group.DocumentFolderID;
            }
        });

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
            resType: 'Group',
            resId: config.groupid,
            folderid: folderid,
            viewConfig: config.socialPanelConfig
        });

        if (folderid !=- 1) {
            me.pnlDoc = Ext.create('YZSoft.bpa.group.DocumentPanel', {
                title: RS.$('All_IM_Group_Files'),
                groupInfo: me.groupInfo
            });
        }

        cfg = {
            dockedItems: [me.titleBar],
            tabBar: me.tabBar,
            items: [me.pnlChat, me.pnlDoc]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});