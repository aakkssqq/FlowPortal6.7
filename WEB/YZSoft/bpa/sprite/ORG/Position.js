
//岗位
Ext.define('YZSoft.bpa.sprite.ORG.Position', {
    extend: 'YZSoft.bpa.sprite.ORG.Sprite',
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
        xclass: 'YZSoft.bpa.sprite.Properties.Position.Property'
    },

    updateChildLine: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            fromX: x + Math.max(w / 6, 4.5),
            fromY: y,
            toX: x + Math.max(w / 6, 4.5),
            toY: y + h,
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
            left: x + w / 6 + attr.lineWidth * 0.5,
            top: y,
            width: w * 5/6 - attr.lineWidth,
            height: h,
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

        path.rect(x, y, w, h);
    }
});
