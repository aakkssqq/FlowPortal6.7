
//风险
Ext.define('YZSoft.bpa.sprite.Risk.Risk', {
    extend: 'YZSoft.bpa.sprite.Risk.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 80,
                height: 80,
                fillStyle: '#ff9999'
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
            left: x + 12,
            top: y + h * 0.13,
            width: w - 24,
            height: h * 0.75,
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
        path.lineTo(x + w, y + h * 0.5);
        path.lineTo(x + w * 0.5, y + h);
        path.lineTo(x, y + h * 0.5);
        path.closePath();
    }
});
