Ext.define('YZSoft.bpa.sprite.basic.LinkEvent', {
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
            h = attr.height;

        path.moveTo(x, y + h * 0.5 + h * 0.22);
        path.lineTo(x + w * 0.5 + w * 0.1, y + h * 0.5 + h * 0.22);
        path.lineTo(x + w * 0.5 + w * 0.1, y + h);
        path.lineTo(x + w, y + h * 0.5);
        path.lineTo(x + w * 0.5 + w * 0.1, y);
        path.lineTo(x + w * 0.5 + w * 0.1, y + h * 0.5 - h * 0.22);
        path.lineTo(x, y + h * 0.5 - h * 0.22);
        path.closePath();
    }
});
