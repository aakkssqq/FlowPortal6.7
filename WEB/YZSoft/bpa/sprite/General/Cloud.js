
//云
Ext.define('YZSoft.bpa.sprite.General.Cloud', {
    extend: 'YZSoft.bpa.sprite.General.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 90,
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
            left: x + 10,
            top: y + 10,
            width: w - 20,
            height: h - 20,
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

        path.moveTo(x + 0.12 * w, y + 0.7 * h);
        path.bezierCurveTo(x - 0.1 * w, y + 0.5 * h, x + 0.04 * w, y + 0.35 * h, x + 0.09 * w, y + 0.3 * h);
        path.bezierCurveTo(x + 0.07 * w, y + 0.05 * h, x + 0.32 * w, y, x + 0.42 * w, y + 0.1 * h);
        path.bezierCurveTo(x + 0.50 * w, y - 0.05 * h, x + 0.75 * w, y, x + 0.75 * w, y + 0.15 * h);
        path.bezierCurveTo(x + 0.95 * w, y + 0.1 * h, x + 1.03 * w, y + 0.3 * h, x + 0.95 * w, y + 0.55 * h);
        path.bezierCurveTo(x + 1.02 * w, y + 0.75 * h, x + 0.95 * w, y + 1.0 * h, x + 0.72 * w, y + 0.9 * h);
        path.bezierCurveTo(x + 0.67 * w, y + 1.03 * h, x + 0.47 * w, y + 1.03 * h, x + 0.42 * w, y + 0.9 * h);
        path.bezierCurveTo(x + 0.32 * w, y + 1.0 * h, x + 0.12 * w, y + 0.95 * h, x + 0.12 * w, y + 0.7 * h);
        path.closePath();
    }
});
