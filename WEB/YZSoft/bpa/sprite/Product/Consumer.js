
//消费者
Ext.define('YZSoft.bpa.sprite.Product.Consumer', {
    extend: 'YZSoft.bpa.sprite.Product.SpriteText',
    inheritableStatics: {
        def: {
            defaults: {
                width: 70,
                height: 100
            }
        }
    },
    propertyConfig: {
        xclass: 'YZSoft.bpa.sprite.Properties.Product.Property',
        dialog: {
            xclass: 'YZSoft.bpa.sprite.Properties.Product.Dialog',
            dlgName: RS.$('BPA_Title_SpritePrperty_Consumer')
        },
        staticData: {
            spriteType: 'Consumer',
            reportType: 'Product'
        }
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            cx = x + w * 0.5,
            cy = y + h * 1/8,
            rx = w * 10 / 56,
            ry = h / 8;

        path.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2, false);
        path.closePath();

        path.moveTo(x + w * (6 / 12), y + h * (2 / 8));
        path.lineTo(x + w * (6 / 12), y + h * (6 / 8));
        path.moveTo(x + w * (6 / 12), y + h * (6 / 8));
        path.lineTo(x + w * (1 / 12), y + h);
        path.moveTo(x + w * (6 / 12), y + h * (6 / 8));
        path.lineTo(x + w * (11 / 12), y + h);
        path.moveTo(x, y + h * (4 / 8));
        path.lineTo(x + w, y + h * (4 / 8));
    }
});
