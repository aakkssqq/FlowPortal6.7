
/*
config
    groupid
*/
Ext.define('YZSoft.bpa.group.GroupPanel', {
    extend: 'Ext.container.Container',
    layout: 'border',

    constructor: function (config) {
        var me = this,
            cfg;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
            params: {
                method: 'GetGroupAndUserPerm',
                groupid: config.groupid
            },
            success: function (action) {
                me.groupInfo = action.result;
            }
        });

        me.titlebar = Ext.create('YZSoft.bpa.group.toolbar.GroupTitleBar', {
            region: 'north',
            height: 64
        });

        me.pnlComm = Ext.create('YZSoft.bpa.group.SocialPanel', {
            title: RS.$('BPA_GroupModule_Social'),
            groupInfo: me.groupInfo
        });

        me.pnlLib = Ext.create('YZSoft.bpa.group.FilePanel', {
            title: RS.$('BPA_GroupModule_Module'),
            groupInfo: me.groupInfo
        });

        me.pnlDoc = Ext.create('YZSoft.bpa.group.DocumentPanel', {
            title: RS.$('BPA_GroupModule_Document'),
            groupInfo: me.groupInfo
        });

        me.pnlMember = Ext.create('YZSoft.bpa.group.MemberPanel', {
            title: RS.$('BPA_GroupModule_Member'),
            groupInfo: me.groupInfo
        });

        me.tabBar = Ext.create('Ext.tab.Bar', {
            cls: 'bpa-tab-bar-whitebox',
        });

        me.pnlTabBar = Ext.create('Ext.container.Container', {
            region: 'north',
            layout: 'fit',
            padding:'3 0 0 0',
            style: 'background-color:#f5f5f5',
            items: [me.tabBar]
        });

        me.tab = Ext.create('YZSoft.src.tab.Panel', {
            region: 'center',
            border: false,
            activeTab: 1,
            tabBar: me.tabBar,
            items: [
                me.pnlComm,
                me.pnlLib,
                me.pnlDoc,
                me.pnlMember
            ]
        });

        cfg = {
            items: [me.titlebar,me.pnlTabBar, me.tab]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            activate: function () {
                me.tab.getLayout().getActiveItem().fireEvent('activate');
            }
        });
    }
});