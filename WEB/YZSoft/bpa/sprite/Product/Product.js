
//产品
Ext.define('YZSoft.bpa.sprite.Product.Product', {
    extend: 'YZSoft.bpa.sprite.Product.SpriteBoxText',
    inheritableStatics: {
        def: {
            defaults: {
                width: 120,
                height: 70
            }
        }
    },
    sprites: {
        line: {
            xclass: 'Ext.draw.sprite.Line'
        }
    },
    propertyConfig: {
        xclass: 'YZSoft.bpa.sprite.Properties.Product.Property',
        dialog: {
            xclass: 'YZSoft.bpa.sprite.Properties.Product.Dialog',
            dlgName: RS.$('BPA_Title_SpritePrperty_Product')
        },
        staticData: {
            spriteType: 'Product',
            reportType: 'Product'
        }
    },

    updateChildLine: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            fromX: x,
            fromY: y + h * 0.75,
            toX: x + w,
            toY: y + h * 0.75,
            strokeStyle: attr.strokeStyle,
            lineWidth: attr.lineWidth
        });
    },

    updateChildText: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            left: x,
            top: y + Math.min(h / 2, w / 6),
            width: w,
            height: y + h * 0.75 - Math.min(h / 2, w / 6),
            paddingtop: (attr.lineWidth * 0.5 || 0) + 2,
            paddingleft: (attr.lineWidth * 0.5 || 0) + 2,
            paddingright: (attr.lineWidth * 0.5 || 0) + 2,
            paddingbottom: (attr.lineWidth * 0.5 || 0) + 2
        });
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        path.moveTo(x + w * 0.5, y);
        path.lineTo(x + w, y + Math.min(h / 2, w / 6));
        path.lineTo(x + w, y + h);
        path.lineTo(x, y + h);
        path.lineTo(x, y + Math.min(h / 2, w / 6));
        path.lineTo(x + w * 0.5, y);
        path.closePath();
    }
});
