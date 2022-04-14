
//展示
Ext.define('YZSoft.bpa.sprite.FlowChart.Display', {
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

        path.moveTo(x + w - w / 6,y);
        path.lineTo(x + w / 6,y);
        path.lineTo(x, y + h / 2);
        path.lineTo(x + w / 6,y+h);
        path.lineTo(x + w - w / 6,y+h);
        path.quadraticCurveTo(x + w, y + h, x + w, y + h * 0.5);
        path.quadraticCurveTo(x + w, y, x + w - w / 6,y);
        path.closePath();
    }
});
