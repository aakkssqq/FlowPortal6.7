
//十字形
Ext.define('YZSoft.bpa.sprite.General.Cross', {
    extend: 'YZSoft.bpa.sprite.General.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 70,
                height: 70
            }
        }
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        path.moveTo(x + w * 0.5 - Math.min(w, h) / 8, y);
        path.lineTo(x + w * 0.5 + Math.min(w, h) / 8, y);
        path.lineTo(x + w * 0.5 + Math.min(w, h) / 8, y + h * 0.5 - Math.min(w, h) / 8);
        path.lineTo(x + w, y + h * 0.5 - Math.min(w, h) / 8);
        path.lineTo(x + w, y + h * 0.5 + Math.min(w, h) / 8);
        path.lineTo(x + w * 0.5 + Math.min(w, h) / 8, y + h * 0.5 + Math.min(w, h) / 8);
        path.lineTo(x + w * 0.5 + Math.min(w, h) / 8, y + h);
        path.lineTo(x + w * 0.5 - Math.min(w, h) / 8, y + h);
        path.lineTo(x + w * 0.5 - Math.min(w, h) / 8, y + h * 0.5 + Math.min(w, h) / 8);
        path.lineTo(x, y + h * 0.5 + Math.min(w, h) / 8);
        path.lineTo(x, y + h * 0.5 - Math.min(w, h) / 8);
        path.lineTo(x + w * 0.5 - Math.min(w, h) / 8, y + h * 0.5 - Math.min(w, h) / 8);
        path.closePath();
    }
});
