Ext.define('YZSoft.src.tab.Panel', {
    extend: 'Ext.tab.Panel',
    hideTab: false,

    initComponent: function () {
        var me = this,
        // Default to 0 if undefined and not null!
            activeTab = me.activeTab !== null ? (me.activeTab || 0) : null,
            dockedItems = me.dockedItems,
            header = me.header,
            tabBarHeaderPosition = me.tabBarHeaderPosition,
            tabBar = me.getTabBar() || {},
            headerItems;

        // Configure the layout with our deferredRender, and with our activeTeb
        me.layout = new Ext.layout.container.Card(Ext.apply({
            owner: me,
            deferredRender: me.deferredRender,
            itemCls: me.itemCls,
            activeItem: activeTab
        }, me.layout));

        if (tabBar.isSeparate) {
        }
        else if (tabBarHeaderPosition != null) {
            header = me.header = Ext.apply({}, header);

            headerItems = header.items = (header.items ? header.items.slice() : []);
            header.itemPosition = tabBarHeaderPosition;
            headerItems.push(tabBar);
            header.hasTabBar = true;
        } else {
            dockedItems = [].concat(me.dockedItems || []);
            dockedItems.push(tabBar);
            me.dockedItems = dockedItems;
        }

        Ext.panel.Panel.prototype.initComponent.call(this);

        // We have to convert the numeric index/string ID config into its component reference
        activeTab = me.activeTab = me.getComponent(activeTab);

        // Ensure that the active child's tab is rendered in the active UI state
        if (activeTab) {
            tabBar.setActiveTab(activeTab.tab, true);
        }
    },

    applyTabBar: function (tabBar) {
        if (tabBar && tabBar.isComponent) {
            tabBar.tabPanel = this;
            tabBar.isSeparate = true;
            return tabBar;
        }
        else {
            return this.callParent(arguments);
        }
    },

    onAdd: function (item, index) {
        var me = this;

        item.tabConfig = item.tabConfig || {};

        if (me.hideTab === true) {
            if (me.items.getCount() == 1)
                me.tabBar.hide();
            else
                me.tabBar.show();
        }

        me.callParent(arguments);

        //修正overflowHandler未触发，滚动按钮未出现问题
        me.tabBar.updateLayout();
    },

    onRemove: function (item, destroying) {
        var me = this;

        me.callParent(arguments);

        if (me.hideTab === true && me.items.getCount() == 1)
            me.tabBar.hide();
    }
});