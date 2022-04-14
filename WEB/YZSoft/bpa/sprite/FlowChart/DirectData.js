
//数据库
Ext.define('YZSoft.bpa.sprite.FlowChart.DirectData', {
    extend: 'YZSoft.bpa.sprite.FlowChart.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 100,
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
            left: x,
            top: y,
            width: w * 0.8,
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

        path.moveTo(x + h / 6, y);
        path.lineTo(x + w - h / 6, y);
        path.bezierCurveTo(x + w + h / 22, y, x + w + h / 22, y + h, x + w - h / 6, y + h);
        path.lineTo(x + h / 6, y + h);
        path.bezierCurveTo(x - h / 22, y + h, x - h / 22, y, x + h / 6, y);
        path.closePath();

        path.moveTo(x + w - h / 6, y);
        path.bezierCurveTo(x + w - h / 8 * 3, y, x + w - h / 8 * 3, y + h, x + w - h / 6, y + h);
        path.bezierCurveTo(x + w - h / 8 * 3, y + h, x + w - h / 8 * 3, y, x + w - h / 6, y);
    }
});
