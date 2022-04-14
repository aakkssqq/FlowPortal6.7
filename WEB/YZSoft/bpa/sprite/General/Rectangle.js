
//矩形
Ext.define('YZSoft.bpa.sprite.General.Rectangle', {
    extend: 'YZSoft.bpa.sprite.General.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 100,
                height: 70
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
