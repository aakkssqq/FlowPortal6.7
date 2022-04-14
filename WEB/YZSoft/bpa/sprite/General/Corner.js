
//拐角
Ext.define('YZSoft.bpa.sprite.General.Corner', {
    extend: 'YZSoft.bpa.sprite.General.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 70,
                height: 70
            },
            anchors: {
                ActivityRightMiddle: false,
                ActivityMiddleBottom: false
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
            left: x + Math.min(w / 6, 30),
            top: y + Math.min(h / 6, 30),
            width: w - Math.min(w / 6, 30),
            height: h - Math.min(h / 6, 30),
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

        path.moveTo(x, y);
        path.lineTo(x + w, y);
        path.lineTo(x + w - Math.min(w / 6, 30), y + Math.min(h / 6, 30));
        path.lineTo(x + Math.min(w / 6, 30), y + Math.min(h / 6, 30));
        path.lineTo(x + Math.min(w / 6, 30), y + h - Math.min(h / 6, 30));
        path.lineTo(x, y + h);
        path.closePath();
    }
});
