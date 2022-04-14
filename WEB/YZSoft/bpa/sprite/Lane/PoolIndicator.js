Ext.define('YZSoft.bpa.sprite.Lane.PoolIndicator', {
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
                width: 0,
                height: 0,
                fillStyle: 'none',
                lineWidth: 2,
                strokeStyle: '#ff9900'
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
    },

    hitTest: function () {
        return null;
    }
});
