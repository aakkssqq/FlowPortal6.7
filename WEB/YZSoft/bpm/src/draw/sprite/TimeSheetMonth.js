
Ext.define('YZSoft.bpm.src.draw.sprite.TimeSheetMonth', {
    extend: 'Ext.draw.sprite.Sprite',
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
                width: 1,
                height: 1
            },
            dirtyTriggers: {
                x: 'bbox',
                y: 'bbox',
                width: 'bbox',
                height: 'bbox'
            }
        }
    },

    updatePlainBBox: function (plain) {
        var attr = this.attr;
        plain.x = attr.x;
        plain.y = attr.y;
        plain.width = attr.width;
        plain.height = attr.height;
    },

    render: function (surface, ctx, rect) {
        var bbox = this.getBBox(true);
        ctx.beginPath();
        ctx.moveTo(bbox.x+0.5, bbox.y+0.5);
        ctx.lineTo(bbox.x + bbox.width + 0.5, bbox.y + 0.5);
        ctx.lineTo(bbox.x + bbox.width + 0.5, bbox.y + bbox.height + 0.5);
        ctx.lineTo(bbox.x + 0.5, bbox.y + bbox.height + 0.5);
        ctx.closePath();
        ctx.strokeStyle = 'red';
        ctx.strokeOpacity = 1;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
});
