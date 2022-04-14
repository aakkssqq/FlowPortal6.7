
//APQC
Ext.define('YZSoft.bpa.sprite.General.Apqc', {
    extend: 'YZSoft.bpa.sprite.General.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 200,
                height: 150
            }
        }
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        path.moveTo(x, y + h / 8);
        path.quadraticCurveTo(x + w * 0.5, y - h / 8, x + w, y + h / 8);
        path.lineTo(x + w, y + h);
        path.lineTo(x, y + h);
        path.closePath();
    }
});
