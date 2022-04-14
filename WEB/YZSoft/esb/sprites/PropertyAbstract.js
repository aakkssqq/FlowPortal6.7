
Ext.define('YZSoft.esb.sprites.PropertyAbstract', {
    extend: 'Ext.container.Container',
    layout: {
        type: 'vbox',
        align:'stretch'
    },

    initComponent: function () {
        var me = this;

        me.tabBar = bar = Ext.create('Ext.tab.Bar', {
            padding: '0 0 0 0'
        });

        me.tab = Ext.create('YZSoft.frame.tab.Navigator', {
            flex: 1,
            activeTab: me.activeTab || 0,
            tabBar: me.tabBar,
            items: me.items
        });

        me.items = [
            me.tabBar,
            me.tab
        ];

        me.callParent();
    }
});