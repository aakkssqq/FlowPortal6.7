/*
    模块的tab
*/
Ext.define('YZSoft.frame.tab.Module',{
    extend: 'YZSoft.frame.tab.Base',
    cls: ['yz-s-module-tab'],
    border: false,
    deferredRender: true,
    hideTab: false,
    enableTabScroll: true,
    plain: true,

    constructor: function (config) {
        var me = this,
            cfg;

        me.tabBar = Ext.create('Ext.tab.Bar', {
            border: false,
            cls: 'yz-tab-bar-module',
            flex: 1,
            layout: {
                overflowHandler: 'menu'
            }
        });

        me.titleBar = Ext.create('Ext.container.Container', {
            cls: 'yz-titlebar-module',
            border: false,
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [me.tabBar]
        });

        cfg = {
            dockedItems: [me.titleBar],
            tabBar: me.tabBar
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    setTitle: function (title) {
    }
});