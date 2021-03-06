
//内部存储
Ext.define('YZSoft.bpa.sprite.FlowChart.InternalStorage', {
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
            left: x + Math.min(w / 6, 20),
            top: y + Math.min(h / 5, 20),
            width: w - Math.min(w/6,20),
            height: h - Math.min(h / 5, 20),
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

        path.rect(x, y, w, h);

        path.moveTo(x + Math.min(w / 6, 20), y);
        path.lineTo(x + Math.min(w / 6, 20), y + h);

        path.moveTo(x, y + Math.min(h / 5, 20));
        path.lineTo(x + w, y + Math.min(h / 5, 20));
    }
});
