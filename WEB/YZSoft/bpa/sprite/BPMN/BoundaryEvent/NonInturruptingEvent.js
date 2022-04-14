Ext.define('YZSoft.bpa.sprite.BPMN.BoundaryEvent.NonInturruptingEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                lineDash: [7, 3]
            }
        }
    },

    constructor: function (config) {
        var me = this;

        me.sprites = Ext.apply({
            text: {
                xclass: 'YZSoft.src.flowchart.sprite.Text',
                text: '',
                textAlign: 'center',
                textBaseline: 'top',
                fontFamily: RS.$('All_BPA_FontFamily'),
                fontSize: 13,
                fillStyle: 'black',
                background: {
                    fillStyle: 'none'
                },
                editable: true
            },
            ellipse: {
                xclass: 'Ext.draw.sprite.Ellipse',
                fillStyle: 'none',
                lineWidth: 1,
                gap:3
            }
        }, me.sprites);

        me.callParent(arguments);
    },

    updateChildEllipse: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            cx = x + w * 0.5,
            cy = y + h * 0.5,
            rx = w * 0.5,
            ry = h * 0.5;

        sprite.setAttributes({
            cx: cx,
            cy: cy,
            rx: rx - sprite.gap,
            ry: ry - sprite.gap,
            strokeStyle: attr.strokeStyle,
            lineDash: attr.lineDash
        });
    }
});
