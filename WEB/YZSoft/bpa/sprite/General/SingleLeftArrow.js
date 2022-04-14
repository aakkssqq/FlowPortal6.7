
//左箭头
Ext.define('YZSoft.bpa.sprite.General.SingleLeftArrow', {
    extend: 'YZSoft.bpa.sprite.General.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 90,
                height: 60
            },
            anchors: {
                ActivityMiddleTop: false,
                ActivityMiddleBottom: false
            }
        }
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        path.moveTo(x, y + h / 2);
        path.lineTo(x + Math.min(0.5 * h, 0.45 * w), y);
        path.lineTo(x + Math.min(0.5 * h, 0.45 * w), y + h * 0.33);
        path.lineTo(x + w, y + h * 0.33);
        path.lineTo(x + w, y + h * 0.67);
        path.lineTo(x + Math.min(0.5 * h, 0.45 * w), y + h * 0.67);
        path.lineTo(x + Math.min(0.5 * h, 0.45 * w), y + h);
        path.closePath();
    }
});
