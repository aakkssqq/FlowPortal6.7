
//水滴
Ext.define('YZSoft.bpa.sprite.General.Teardrop', {
    extend: 'YZSoft.bpa.sprite.General.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 70,
                height: 70
            }
        }
    },

    updateChildText: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            left: x + 8,
            top: y,
            width: w - 16,
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

        path.moveTo(x + w, y);
        path.lineTo(x + w, y + h / 2);
        path.bezierCurveTo(x + w, y + h + h / 6, x, y + h + h / 6, x, y + h * 0.5);
        path.quadraticCurveTo(x, y, x + w / 2, y);
        path.lineTo(x + w / 2, y);
        path.closePath();
    }
});
