
//分隔条(水平)
Ext.define('YZSoft.bpa.sprite.Lane.HorizSeparator', {
    extend: 'YZSoft.bpa.sprite.Lane.Separator',
    isHoriz: true,
    inheritableStatics: {
        def: {
            defaults: {
                width: 300,
                height: 100
            }
        }
    },

    updateChildRect: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            hidden: !attr.ischild,
            strokeStyle: attr.strokeStyle,
            lineWidth: attr.lineWidth,
            x: x,
            y: y,
            width: attr.titlesize,
            height: h,
            fillStyle: attr.fillStyle
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
            hidden: !attr.ischild,
            left: x,
            top: y,
            width: attr.titlesize,
            height: h,
            paddingtop: (attr.lineWidth * 0.5 || 0) + 2,
            paddingleft: (attr.lineWidth * 0.5 || 0) + 2,
            paddingright: (attr.lineWidth * 0.5 || 0) + 2,
            paddingbottom: (attr.lineWidth * 0.5 || 0) + 2,
            orientation: 'vertical'
        });
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        if (attr.ischild) {
            path.moveTo(x, y + h);
            path.lineTo(x + w, y + h);
        }
        else {
            path.moveTo(x, y + h * 0.5);
            path.lineTo(x + w, y + h * 0.5);
        }
    }
});
