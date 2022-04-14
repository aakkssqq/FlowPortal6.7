
//分隔条(垂直)
Ext.define('YZSoft.bpa.sprite.Lane.VerticalSeparator', {
    extend: 'YZSoft.bpa.sprite.Lane.Separator',
    isVerti: true,
    inheritableStatics: {
        def: {
            defaults: {
                width: 100,
                height: 300
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
            width: w,
            height: attr.titlesize,
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
            width: w,
            height: attr.titlesize,
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

        if (attr.ischild) {
            path.moveTo(x + w, y);
            path.lineTo(x + w, y + h);
        }
        else {
            path.moveTo(x + w *0.5, y);
            path.lineTo(x + w * 0.5, y + h);
        }
    }
});
