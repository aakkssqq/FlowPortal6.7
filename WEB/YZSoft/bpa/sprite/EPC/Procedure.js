
//流程路径
Ext.define('YZSoft.bpa.sprite.EPC.Procedure', {
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
                strokeStyle: '#44aaaa',
                fillStyle: {
                    type: 'linear',
                    degrees: 0,
                    stops: [{
                        offset: 0,
                        color: '#effdfd'
                    }, {
                        offset: 1,
                        color: '#a0ffff'
                    }]
                }
            }
        },
        triggers: {
            radius: 'path'
        }
    },

    updateChildText: function (sprite, attr) {
        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            left: attr.x,
            top: attr.y,
            width: attr.width * 0.8,
            height: attr.height * 0.8,
            paddingtop: (attr.lineWidth * 0.5 || 0) + 2,
            paddingleft: (attr.lineWidth * 0.5 || 0) + 2,
            paddingright: (attr.lineWidth * 0.5 || 0) + 2,
            paddingbottom: (attr.lineWidth * 0.5 || 0) + 2
        });
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        path.moveTo(x, y + 4 * 0.8);
        path.quadraticCurveTo(x, y, x + 4 * 0.8, y);
        path.lineTo(x + (w - 4) * 0.8, y);
        path.quadraticCurveTo(x + w * 0.8, y, x + w * 0.8, y + 4 * 0.8);
        path.lineTo(x + w * 0.8, y + (h - 4) * 0.8);
        path.quadraticCurveTo(x + w * 0.8, y + h * 0.8, x + (w - 4) * 0.8, y + h * 0.8);
        path.lineTo(x + 4 * 0.8, y + h * 0.8);
        path.quadraticCurveTo(x, y + h * 0.8, x, y + (h - 4) * 0.8);
        path.lineTo(x, y + 4 * 0.8);
        path.closePath();

        path.moveTo(x + w * 0.8, y + 6);
        path.lineTo(x + w, y + h * 0.5);
        path.lineTo(x + (w - 4) * 0.8, y + h);
        path.lineTo(x + w * 3 / 8, y + h);
        path.lineTo(x + w / 4, y + h * 0.8);
        path.lineTo(x + (w - 4) * 0.8, y + h * 0.8);
        path.quadraticCurveTo(x + w * 0.8, y + h * 0.8, x + w * 0.8, y + (h - 4) * 0.8);
        path.closePath();
    }
});
