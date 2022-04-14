Ext.define('YZSoft.bpa.sprite.Lane.LaneBorderIndicator', {
    extend: 'Ext.draw.sprite.Path',
    ext:6,
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
                fillStyle:'none',
                lineWidth:2,
                strokeStyle:'#ff9900'
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
        var me = this,
            x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            ext = me.ext;

        if (w) {
            path.moveTo(x, y);
            path.lineTo(x + w, y);
            path.lineTo(x + w, y + h);
            path.lineTo(x, y + h);
            path.closePath();
        }
        else {
            path.moveTo(x - ext, y - ext);
            path.lineTo(x, y);
            path.lineTo(x, y + h);
            path.lineTo(x - ext, y + h + ext);

            path.moveTo(x + ext, y - ext);
            path.lineTo(x, y);
            path.lineTo(x, y + h);
            path.lineTo(x + ext, y + h + ext);
        }
    },

    hitTest: function () {
        return null;
    }
});
