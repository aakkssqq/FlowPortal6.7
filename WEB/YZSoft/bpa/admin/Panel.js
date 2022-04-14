
/*
config
*/
Ext.define('YZSoft.bpa.admin.Panel', {
    extend: 'Ext.container.Container',
    layout: 'border',

    constructor: function (config) {
        var me = this,
            cfg, perms;

        me.titlebar = Ext.create('YZSoft.bpa.admin.titlebar.HomeTitleBar', {
            region: 'north',
            height: 64
        });

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            params: {
                method: 'CheckResourcesPermision',
                rsids: [YZSoft.WellKnownRSID.BPAAdminTemplates, YZSoft.WellKnownRSID.BPAAdminGroup, YZSoft.WellKnownRSID.BPAAdminSecurity].join(','),
                perm: 'Execute'
            },
            success: function (action) {
                perms = action.result;
            }
        });

        me.pnlTemplate = Ext.create('YZSoft.bpa.admin.TemplateAdminPanel', {
            title: RS.$('BPA_Template'),
            hidden: !perms[0]
        });

        me.pnlGroup = Ext.create('YZSoft.bpa.admin.GroupAdminPanel', {
            title: RS.$('BPA_GroupSimple'),
            hidden: !perms[1]
        });

        me.pnlAccessControl = Ext.create('YZSoft.bpa.admin.AccessControlPanel', {
            title: RS.$('All_Permision'),
            hidden: !perms[2]
        });

        me.tabBar = Ext.create('Ext.tab.Bar', {
            cls: 'bpa-tab-bar-underline'
        });

        me.pnlTabBar = Ext.create('Ext.container.Container', {
            region: 'north',
            layout: 'fit',
            padding: '10 0 0 3',
            style: 'background-color:#f5f5f5',
            items: [me.tabBar]
        });

        me.tab = Ext.create('YZSoft.src.tab.Panel', {
            region: 'center',
            activeTab: 1,
            tabBar: me.tabBar,
            items: [me.pnlTemplate, me.pnlGroup, me.pnlAccessControl]
        });

        if ((!perms[0] && !perms[0] && !perms[0])) {
            cfg = {
                items: [me.titlebar, {
                    xtype: 'panel',
                    region: 'center',
                    border: false,
                    html: Ext.String.format('<div style="color:#bbb;padding:20px 30px;">{0}</div>', RS.$('BPA_EmptyText_AccessChildModelDenied'))
                }]
            };
        }
        else {
            cfg = {
                items: [me.titlebar, me.pnlTabBar, me.tab]
            };
        }

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            activate: function () {
                me.tab.getLayout().getActiveItem().fireEvent('activate');
            }
        });
    }
});