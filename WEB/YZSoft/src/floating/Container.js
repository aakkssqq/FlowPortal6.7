
/*
config
container
*/
Ext.define('YZSoft.src.floating.Container', {
    extend: 'Ext.container.Container',
    floating: true,
    preventFocusOnActivate: true,
    preventDefaultAlign: true,
    shadowOffset: 1,
    draggable: {
        constrain: true
    },

    constructor: function (config) {
        var me = this,
            container = config.container;

        me.callParent(arguments);

        me.offset = me.offset || {};
        me.offset.x = me.offset.x || 0;
        me.offset.y = me.offset.y || 0;

        if (container) {
            if (container.rendered) {
                me.bindContainer(container);
            }
            else {
                container.on({
                    single: true,
                    afterrender: function () {
                        Ext.defer(function () {
                            me.bindContainer(container);
                        }, 1);
                    }
                })
            }

            me.container.on({
                scope: me,
                resize: 'onContainerResize'
            });

            me.on({
                single: true,
                show: function () {
                    me.alignTo(container, 'tr-tr?', [me.offset.x, me.offset.y]);
                }
            });
        }
    },

    bindContainer: function (container) {
        var me = this;

        container.add(me);
        if (!me.isHidden())
            me.show();
    },

    alignTo: function (element, position, offsets, /* private (documented in ext) */animate) {
        var me = this;
        me.mixins.positionable.alignTo.call(me, element, position, offsets, animate);
    },

    onContainerResize: function (container, width, height, oldWidth, oldHeight, eOpts) {
        var me = this,
            container = me.container,
            cntRegion,
            myRegion,
            x, y;

        Ext.defer(function () {
            if (me.rendered) {
                cntRegion = container.getConstrainRegion();
                myRegion = me.getEl().getRegion();

                x = myRegion.left;
                y = myRegion.top;
                if (myRegion.right > cntRegion.right)
                    x = cntRegion.right - (myRegion.right - myRegion.left) + me.offset.x;
                if (myRegion.bottom > cntRegion.bottom)
                    y = cntRegion.bottom - (myRegion.bottom - myRegion.top);

                me.setXY([x, y]);
            }
        }, 1);
    }
});