Ext.define('YZSoft.bpa.sprite.basic.Parallel', {
    extend: 'Ext.draw.sprite.Path',
    thick: 0.13,
    samethick:false,
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
        var me = this,
            x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            thickx = Math.max(Math.floor((me.samethick ? Math.min(w, h) : w) * me.thick), 1),
            thicky = Math.max(Math.floor((me.samethick ? Math.min(w, h) : h) * me.thick),1);

        path.moveTo(x + w * 0.5 + thickx, y + h * 0.5 + thicky);
        path.lineTo(x + w, y + h * 0.5 + thicky);
        path.lineTo(x + w, y + h * 0.5 - thicky);
        path.lineTo(x + w * 0.5 + thickx, y + h * 0.5 - thicky);
        path.lineTo(x + w * 0.5 + thickx, y);
        path.lineTo(x + w * 0.5 - thickx, y);
        path.lineTo(x + w * 0.5 - thickx, y + h * 0.5 - thicky);
        path.lineTo(x, y + h * 0.5 - thicky);
        path.lineTo(x, y + h * 0.5 + thicky);
        path.lineTo(x + w * 0.5 - thickx, y + h * 0.5 + thicky);
        path.lineTo(x + w * 0.5 - thickx, y + h);
        path.lineTo(x + w * 0.5 + thickx, y + h);
        path.closePath();
    }
});