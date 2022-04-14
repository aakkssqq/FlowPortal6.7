Ext.define('YZSoft.bpa.sprite.basic.Exclusive', {
    extend: 'Ext.draw.sprite.Path',
    inheritableStatics: {
        def: {
            processors: {
                x: 'number',
                y: 'number',
                width: 'number',
                height: 'number'
            },
            aliases: {
            },
            defaults: {
                x: 0,
                y: 0,
                width: 40,
                height: 40,
                miterLimit: 3
            },
            triggers: {
                x: 'path',
                y: 'path',
                width: 'path',
                height: 'path'
            }
        }
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            xs = w * 0.2,
            ys = h * 0.2;

        path.moveTo(x, y);
        path.lineTo(x + w * 0.5 - xs * 0.5, y + h * 0.5);
        path.lineTo(x, y + h);
        path.lineTo(x + xs, y + h);
        path.lineTo(x + w * 0.5, y + h * 0.5 + ys * 0.5);
        path.lineTo(x + w - xs, y + h);
        path.lineTo(x + w, y + h);
        path.lineTo(x + w * 0.5 + xs * 0.5, y + h * 0.5);
        path.lineTo(x + w, y);
        path.lineTo(x + w - xs, y);
        path.lineTo(x + w * 0.5, y + h * 0.5 - ys * 0.5);
        path.lineTo(x + xs, y);
        path.closePath();
    }
});
