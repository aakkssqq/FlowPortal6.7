
Ext.define('YZSoft.src.designer.part.layout.HBox', {
    extend: 'YZSoft.src.designer.part.layout.Abstract',
    draggable: {
        ddGroup: 'layout'
    },
    inheritableStatics: {
        onDrop: function (dcnt, data, fn) {
            var me = this,
                columns = data.columns,
                items = [],
                cfg;

            for (i = 0; i < columns; i++) {
                items.push({
                    flex: 1
                });
            }

            cfg = {
                items: items
            };

            fn && fn(cfg);
        }
    },

    initComponent: function () {
        var me = this;

        me.ccfg = Ext.apply(me.ccfg || {}, {
            xclass: 'YZSoft.src.designer.layout.HBox'
        });

        Ext.each(me.ccfg.items, function (item) {
            Ext.apply(item, Ext.apply({
                xclass: 'YZSoft.src.designer.container.VBoxInnerContainer',
                designer: me.designer
            }, me.dcntConfig));
        });

        me.padding = 0;
        me.callParent();
    },

    getChildContainers: function () {
        var me = this,
            cnt = me.items.items[0];

        return cnt.items.items;
    },

    saveChildContainerConfig: function (childContainer) {
        return {
            flex: childContainer.flex
        };
    }
});