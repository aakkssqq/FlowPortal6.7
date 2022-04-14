
//开始/结束
Ext.define('YZSoft.bpa.sprite.FlowChart.Terminator', {
    extend: 'YZSoft.bpa.sprite.FlowChart.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 100,
                height: 50
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
            top: y,
            width: w - 20,
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

        path.moveTo(x + Math.min(w, h) / 3, y);
        path.lineTo(x + w - Math.min(w, h) / 3, y);
        path.bezierCurveTo(x + w + Math.min(w, h) / 3 / 3, y, x + w + Math.min(w, h) / 3 / 3, y + h, x + w - Math.min(w, h) / 3, h);
        path.lineTo(x + Math.min(w, h) / 3, y + h);
        path.bezierCurveTo(x - Math.min(w, h) / 3 / 3, y + h, x - Math.min(w, h) / 3 / 3, y, x + Math.min(w, h) / 3, y);
        path.closePath();
    }
});
