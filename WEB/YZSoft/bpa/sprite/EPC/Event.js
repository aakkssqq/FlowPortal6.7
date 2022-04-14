
//事件
Ext.define('YZSoft.bpa.sprite.EPC.Event', {
    extend: 'YZSoft.bpa.sprite.EPC.EPC',
    inheritableStatics: {
        def: {
            defaults: {
                width: 100,
                height: 70,
                strokeStyle: '#a508b3',
                fillStyle: {
                    type: 'linear',
                    degrees: 30,
                    stops: [{
                        offset: 0,
                        color: '#e873f2'
                    }, {
                        offset: 1,
                        color: '#d12be0'
                    }]
                }
            }
        }
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        path.moveTo(x, y + h * 0.5);
        path.lineTo(x + Math.min(h / 2, w / 6), y);
        path.lineTo(x + w - Math.min(h / 2, w / 6), y);
        path.lineTo(x + w, y + h * 0.5);
        path.lineTo(x + w - Math.min(h / 2, w / 6), y + h);
        path.lineTo(x + Math.min(h / 2, w / 6), y + h);
        path.closePath();
    }
});
