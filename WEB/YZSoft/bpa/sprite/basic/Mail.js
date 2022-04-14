Ext.define('YZSoft.bpa.sprite.basic.Mail', {
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
                height: 40
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

        path.moveTo(x, y);
        path.lineTo(x + w, y);
        path.lineTo(x + w, y + h);
        path.lineTo(x, y + h);
        path.closePath();

        path.moveTo(x, y);
        path.lineTo(x + w * 0.5, y + h * 0.5);
        path.lineTo(x + w, y);
    }
});
