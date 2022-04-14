Ext.define('YZSoft.bpa.sprite.basic.Complex', {
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
            cx = x + w * 0.5,
            cy = y + h * 0.5,
            r = Math.min(w, h),
            r1 = r * Math.sin(45.0 * Math.PI / 180.0),
            s = r * 0.15,
            s1 = s / Math.tan(22.5 * Math.PI / 180.0), //内角
            s2 = s * Math.sin(45 * Math.PI / 180.0);   //斜边

        path.moveTo(cx - s, cy - r);
        path.lineTo(cx - s, cy - s1);
        path.lineTo(cx - r1 + s2, cy - r1 - s2);
        path.lineTo(cx - r1 - s2, cy - r1 + s2);
        path.lineTo(cx - s1, cy - s);
        path.lineTo(cx - r, cy - s);
        path.lineTo(cx - r, cy + s);
        path.lineTo(cx - s1, cy + s);
        path.lineTo(cx - r1 - s2, cy + r1 - s2);
        path.lineTo(cx - r1 + s2, cy + r1 + s2);
        path.lineTo(cx - s, cy + s1);
        path.lineTo(cx - s, cy + r);
        path.lineTo(cx + s, cy + r);
        path.lineTo(cx + s, cy + s1);
        path.lineTo(cx + r1 - s2, cy + r1 + s2);
        path.lineTo(cx + r1 + s2, cy + r1 - s2);
        path.lineTo(cx + s1, cy + s);
        path.lineTo(cx + r, cy + s);
        path.lineTo(cx + r, cy - s);
        path.lineTo(cx + s1, cy - s);
        path.lineTo(cx + r1 + s2, cy - r1 + s2);
        path.lineTo(cx + r1 - s2, cy - r1 - s2);
        path.lineTo(cx + s, cy - s1);
        path.lineTo(cx + s, cy - r);
        path.closePath();
    }
});
