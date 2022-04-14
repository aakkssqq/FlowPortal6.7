
Ext.define('YZSoft.src.frame.win10.ModuleTab', {
    extend: 'YZSoft.src.tab.Panel',
    xtype: 'yz-tab-module',
    cls: 'yz-tab-module',
    border: false,
    deferredRender: true,
    hideTab: false,

    constructor: function (config) {
        var me = this,
            cfg;

        //config.hideTab = false;

        me.cmpTitle = Ext.create('Ext.Component', {
            cls: 'yz-item-title',
            tpl: '{title}',
            data: {
                title: config.caption
            }
        });

        me.tabBar = Ext.create('Ext.tab.Bar', {
            border: false,
            cls: 'yz-flat yz-tab-app-module-default',
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

        cfg = {
            dockedItems: [me.titleBar],
            tabBar: me.tabBar
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    setTitle: function (title) {
        this.cmpTitle.update({
            title: title
        });
    },

    onAdd: function (item, index) {
        if (item.layout.type != 'card' && !item.preventAddCls) {
            item.addCls('yz-func-panel');
            if (item.addBodyCls)
                item.addBodyCls('yz-func-panel-body');
        }

        this.callParent(arguments);
    }
});