
//形状转换
Ext.define('YZSoft.src.flowchart.sprite.SwitchIndicator', {
    extend: 'YZSoft.src.flowchart.sprite.Image',
    isShape: false,
    src: 'images/switch.png',
    minWidth: 8,
    minHeight: 8,
    hitRadius: {
        body: 0,
        bound: 0
    },
    offset: {
        x: 3,
        y: -8
    },
    inheritableStatics: {
        def: {
            defaults: {
                width: 8,
                height: 8
            }
        }
    },

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        me.on({
            scope: me,
            mousemove: 'onMouseMove'
        });
    },

    onMouseMove: function (e, context) {
        var me = this,
            cnt = context.drawContainer,
            plugin = context.plugin,
            surface = me.getSurface(),
            xy = surface.getEventXY(e),
            point;

        plugin.setCursor('pointer', function (e) {
            me.onContextMenu(e);
        });

        return false;
    },

    onContextMenu: function (e) {
        if (this.sprite && this.sprite.onSwitchClick)
            this.sprite.onSwitchClick(e);
    },

    attach: function (sprite) {
        var me = this;

        if (me.spriteListener) {
            Ext.destroy(me.spriteListener);
            delete me.spriteListener;
        }

        me.sprite = sprite;

        me.spriteListener = me.sprite.on({
            scope: me,
            destroyable: true,
            positionChanged: 'onOwnerPositionChanged',
            sizeChanged: 'onOwnerSizeChanged'
        });

        me.updatePosition(sprite);
    },

    detach: function () {
        var me = this;

        me.sprite = null;
        if (me.spriteListener) {
            Ext.destroy(me.spriteListener);
            delete me.spriteListener;
        }
    },

    onOwnerPositionChanged: function (attr) {
        this.updatePosition(this.sprite);
    },

    onOwnerSizeChanged: function (attr) {
        this.updatePosition(this.sprite);
    },

    updatePosition: function (sprite) {
        var me = this,
            bbox = sprite.getBBox(false);

        me.setAttributes({
            x: bbox.x + bbox.width + me.offset.x,
            y: bbox.y + bbox.height + me.offset.y
        });
    }
});