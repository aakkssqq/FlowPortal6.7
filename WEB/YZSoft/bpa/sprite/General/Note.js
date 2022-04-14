
//备注
Ext.define('YZSoft.bpa.sprite.General.Note', {
    extend: 'YZSoft.bpa.sprite.General.Sprite',
    supportLineWidth: false,
    supportLineStyle: false,
    supportStrokeStyle: false,
    requires: [
        'Ext.draw.Color'
    ],
    cap: 16,
    inheritableStatics: {
        def: {
            defaults: {
                width: 80,
                height: 100,
                fillStyle: '#ffffaa',
                strokeStyle: 'none'
            },
            anchors: {
                ActivityMiddleTop: false,
                ActivityRightMiddle: false,
                ActivityMiddleBottom: false,
                ActivityLeftMiddle: false
            },
            triggers: {
                fillStyle: 'canvas,children'
            }
        }
    },
    sprites: {
        node: {
            xclass: 'YZSoft.bpa.sprite.General.basic.Note',
            strokeStyle: 'none'
        }
    },

    updateChildNode: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            c = this.cap,
            color = Ext.draw.Color.fromString(attr.fillStyle);

        color.r -= 50,
        color.g -= 50,
        color.b -= 50,

        sprite.setAttributes({
            x: x + w - c,
            y: y,
            width: c,
            height: c,
            fillStyle: color
        });
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            c = this.cap;

        path.moveTo(x, y);
        path.lineTo(x + w - c, y);
        path.lineTo(x + w, y + c);
        path.lineTo(x + w, y + h);
        path.lineTo(x, y + h);
        path.closePath();
    }
});
