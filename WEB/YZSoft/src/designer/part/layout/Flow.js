
Ext.define('YZSoft.src.designer.part.layout.Flow', {
    extend: 'YZSoft.src.designer.part.layout.Abstract',
    cls: 'yz-part-report-searchpnl',
    draggable: {
        ddGroup: 'layout'
    },
    inheritableStatics: {
        onDrop: function (dcnt, data, fn) {
            fn && fn({
            });
        }
    },

    initComponent: function () {
        var me = this;

        Ext.apply(me.ccfg, Ext.apply({
            xclass: 'YZSoft.src.designer.container.FlowContainer',
            designer: me.designer
        }, me.dcntConfig));

        me.padding = 0;
        me.callParent();
    },

    getChildContainers: function () {
        var me = this,
            cnt = me.items.items[0];

        return cnt;
    },

    saveChildContainerConfig: function (childContainer) {
        return {
        };
    }
});