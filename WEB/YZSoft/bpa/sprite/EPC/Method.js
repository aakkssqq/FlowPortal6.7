
//功能
Ext.define('YZSoft.bpa.sprite.EPC.Method', {
    extend: 'YZSoft.bpa.sprite.EPC.EPC',
    inheritableStatics: {
        def: {
            processors: {
                radius: 'number'
            },
            defaults: {
                width: 100,
                height: 70,
                radius: 6,
                strokeStyle: '#006400',
                fillStyle: {
                    type: 'linear',
                    degrees: 0,
                    stops: [{
                        offset: 0,
                        color: '#00ff00'
                    }, {
                        offset: 1,
                        color: '#00b400'
                    }]
                }
            }
        },
        triggers: {
            radius: 'path'
        }
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            r = Math.min(attr.radius, Math.abs(attr.height) * 0.5, Math.abs(attr.width) * 0.5);

        if (r === 0) {
            path.rect(x, y, w, h);
        } else {
            path.moveTo(x + r, y);
            path.arcTo(x + w, y, x + w, y + h, r);
            path.arcTo(x + w, y + h, x, y + h, r);
            path.arcTo(x, y + h, x, y, r);
            path.arcTo(x, y, x + r, y, r);
        }
    }
});
