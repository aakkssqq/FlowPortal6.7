
//右箭头
Ext.define('YZSoft.bpa.sprite.General.SingleRightArrow', {
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

        path.moveTo(x, y + h * 0.33);
        path.lineTo(x + w - Math.min(h * 0.5, w * 0.45), y + h * 0.33);
        path.lineTo(x + w - Math.min(h * 0.5, w * 0.45),y);
        path.lineTo(x + w, y + h * 0.5);
        path.lineTo(x + w - Math.min(h * 0.5, w * 0.45), y + h);
        path.lineTo(x + w - Math.min(h * 0.5, w * 0.45), y + h * 0.67);
        path.lineTo(x, y + h * 0.67);
        path.closePath();
    }
});
