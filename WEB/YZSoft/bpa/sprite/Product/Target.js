
//目标
Ext.define('YZSoft.bpa.sprite.Product.Target', {
    extend: 'YZSoft.bpa.sprite.Product.SpriteText',
    inheritableStatics: {
        def: {
            defaults: {
                width: 70,
                height: 70
            }
        }
    },
    sprites: {
        ellipse2: {
            xclass: 'Ext.draw.sprite.Ellipse',
            fillStyle: 'none'
        },
        ellipse1: {
            xclass: 'Ext.draw.sprite.Ellipse',
            fillStyle: 'none'
        }
    },
    propertyConfig: {
        xclass: 'YZSoft.bpa.sprite.Properties.Product.Property',
        dialog: {
            xclass: 'YZSoft.bpa.sprite.Properties.Product.Dialog',
            dlgName: RS.$('BPA_Title_SpritePrperty_Target')
        },
        staticData: {
            spriteType: 'Target',
            reportType: 'Product'
        }
    },

    updateChildEllipse2: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            cx = x + w * 0.5,
            cy = y + h * 0.5,
            rx = w * 0.5 * 2 / 3,
            ry = h * 0.5 * 2 / 3;

        sprite.setAttributes({
            cx: cx,
            cy: cy,
            rx: rx,
            ry: ry,
            strokeStyle: attr.strokeStyle,
            lineWidth: attr.lineWidth
        });
    },

    updateChildEllipse1: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            cx = x + w * 0.5,
            cy = y + h * 0.5,
            rx = w * 0.5 * 1 / 3,
            ry = h * 0.5 * 1 / 3;

        sprite.setAttributes({
            cx: cx,
            cy: cy,
            rx: rx,
            ry: ry,
            strokeStyle: attr.strokeStyle,
            lineWidth: attr.lineWidth
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
    }
});
