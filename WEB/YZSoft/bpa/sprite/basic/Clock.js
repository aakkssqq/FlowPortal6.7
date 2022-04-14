Ext.define('YZSoft.bpa.sprite.basic.Clock', {
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

        path.moveTo(x, y + h / 2);
        path.bezierCurveTo(x, y - h / 6, x + w, y - h / 6, x + w, y + h / 2);
        path.bezierCurveTo(x + w, y + h + h / 6, x, y + h + h / 6, x, y + h / 2);
        path.closePath();

        for (var i = 0; i < 12; i++) {
            path.moveTo(x + w * 0.5 + w * 0.5 * Math.cos(Math.PI / 6 * i), y + h * 0.5 + h * 0.5 * Math.sin(Math.PI / 6 * i));
            path.lineTo(x + w * 0.5 + w * 0.4 * Math.cos(Math.PI / 6 * i), y + h * 0.5 + h * 0.4 * Math.sin(Math.PI / 6 * i));
        }
    }
});
