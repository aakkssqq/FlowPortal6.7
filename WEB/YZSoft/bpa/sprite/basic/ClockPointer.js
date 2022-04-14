Ext.define('YZSoft.bpa.sprite.basic.ClockPointer', {
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

        path.moveTo(x + w * 0.5 + w * 0.25, y + h * 0.5);
        path.lineTo(x + w * 0.5, y + h * 0.5);
        path.lineTo(x + w * 0.5 + w * 0.4 * Math.cos(Math.PI / 12 * 5), y + h * 0.5 - h * 0.4 * Math.sin(Math.PI / 12 * 5));
    }
});
