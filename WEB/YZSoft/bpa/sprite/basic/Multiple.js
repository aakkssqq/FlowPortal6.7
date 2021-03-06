Ext.define('YZSoft.bpa.sprite.basic.Multiple', {
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

        path.moveTo(x + w * 0.5, y);
        path.lineTo(x, y + h * 0.39);
        path.lineTo(x + w * 0.18, y + h);
        path.lineTo(x + w * 0.82, y + h);
        path.lineTo(x + w, y + h * 0.39);
        path.closePath();
    }
});