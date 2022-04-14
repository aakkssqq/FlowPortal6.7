
//数据
Ext.define('YZSoft.bpa.sprite.EPC.EPCData', {
    extend: 'YZSoft.bpa.sprite.EPC.EPC',
    inheritableStatics: {
        def: {
            defaults: {
                width: 100,
                height: 70,
                strokeStyle: '#0b6cc3',
                fillStyle: {
                    type: 'linear',
                    degrees: 0,
                    stops: [{
                        offset: 0,
                        color: '#9dd7ed'
                    }, {
                        offset: 1,
                        color: '#899dc0'
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

        path.moveTo(x, y);
        path.lineTo(x + w, y);
        path.lineTo(x + w, y + h);
        path.lineTo(x, y + h);
        path.closePath();
    }
});
