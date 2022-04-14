
//中括号
Ext.define('YZSoft.bpa.sprite.General.Parentheses', {
    extend: 'YZSoft.bpa.sprite.General.Sprite',
    supportFillStyle: false,
    inheritableStatics: {
        def: {
            defaults: {
                width: 200,
                height: 140
            },
            anchors: {
                ActivityMiddleTop: false,
                ActivityMiddleBottom: false
            },
            triggers: {
                fillStyle: ''
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
            top: y,
            width: w - 24,
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

        path.moveTo(x + Math.min(w * 0.1, 18),y);
        path.lineTo(x, y + Math.min(h * 0.1, 15));
        path.lineTo(x, y + h - Math.min(h * 0.1, 15));
        path.lineTo(x + Math.min(w * 0.1, 18),y+h);

        path.moveTo(x + w - Math.min(w * 0.1, 18),y+h);
        path.lineTo(x + w, y + h - Math.min(h * 0.1, 15));
        path.lineTo(x + w, y + Math.min(h * 0.1, 15));
        path.lineTo(x + w - Math.min(w * 0.1, 18),y);
    }
});
