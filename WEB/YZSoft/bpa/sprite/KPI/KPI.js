
//KPI
Ext.define('YZSoft.bpa.sprite.KPI.KPI', {
    extend: 'YZSoft.bpa.sprite.KPI.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 120,
                height: 60,
                fillStyle: '#99ccff'
            }
        }
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        path.rect(x, y, w, h);
    }
});
