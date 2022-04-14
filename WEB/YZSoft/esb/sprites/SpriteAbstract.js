/*
*/
Ext.define('YZSoft.esb.sprites.SpriteAbstract', {
    extend: 'YZSoft.src.flowchart.sprite.Sprite',
    isNode: true,
    inheritableStatics: {
        def: {
            defaults: {
                width: 60,
                height: 60,
                fillStyle: '#79BB3F',
                strokeStyle: 'none',
                lineWidth: 0
            }
        }
    },
    walkEnter: Ext.emptyFn,
    walkLeave: Ext.emptyFn,

    constructor: function (config) {
        var me = this;

        if (me.sprites !== false) {
            me.sprites = Ext.merge({
                icon: {
                    xclass: 'Ext.draw.sprite.Image',
                    src: 'Sprite.png',
                    width: 16,
                    height: 16
                },
                text: {
                    xclass: 'YZSoft.src.flowchart.sprite.BoxText',
                    text: '',
                    textAlign: 'center',
                    textBaseline: 'top',
                    fontFamily: RS.$('All_BPA_FontFamily'),
                    fontSize: 13,
                    width: 140,
                    fillStyle: 'black',
                    background: {
                        fillStyle: 'none'
                    },
                    editable: true
                }
            }, me.sprites);
        }

        me.callParent(arguments);

        me.properties = Ext.apply({}, me.constProperties, me.properties);
    },

    getType: function () {
        var nameSpace = this.$className.split('.');
        return nameSpace[nameSpace.length - 2];
    },

    updateChildText: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            x: Math.floor(x + w / 2),
            y: Math.floor(y + h + 6)
        });
    },

    beforeCreateChildIcon: function (cfg) {
        cfg.src = YZSoft.$url(this, cfg.src);
    },

    updateChildIcon: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            iconBBox = sprite.getBBox(),
            iw = iconBBox.width,
            ih = iconBBox.height;

        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            x: Math.floor(x + w / 2 - iw/2),
            y: Math.floor(y + h / 2 - ih / 2)
        });
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            cx = x + w * 0.5,
            cy = y + h * 0.5,
            rx = w * 0.5,
            ry = h * 0.5;

        path.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2, false);
        path.closePath();
    },

    setCenter: function (cx, cy) {
        var me = this,
            bbox = me.getBBox(),
            w = bbox.width,
            h = bbox.height,
            x = cx - w / 2,
            y = cy - h / 2;

        me.setAttributes({
            x: x,
            y: y
        });
    },

    onEndEdit: function (text) {
        this.fireEvent('rename', this, text);
    }
});