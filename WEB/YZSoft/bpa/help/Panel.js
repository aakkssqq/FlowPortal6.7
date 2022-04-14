
/*
config
*/
Ext.define('YZSoft.bpa.help.Panel', {
    extend: 'Ext.container.Container',
    layout: 'border',

    constructor: function (config) {
        var me = this,
            cfg;

        me.titlebar = Ext.create('YZSoft.bpa.help.titlebar.HomeTitleBar', {
            region: 'north',
            height: 64
        });

        me.pnlAdmin = Ext.create('YZSoft.bpa.help.HelpPanel', {
            title: RS.$('All_Help')
        });

        me.tabBar = Ext.create('Ext.tab.Bar', {
            cls: 'bpa-tab-bar-underline',
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
            activeTab: 0,
            tabBar: me.tabBar,
            items: [
                me.pnlAdmin
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