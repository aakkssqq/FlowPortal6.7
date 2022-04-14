
//异或
//无text
Ext.define('YZSoft.bpa.sprite.EPC.Xor', {
    extend: 'YZSoft.bpa.sprite.EPC.Logic',

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            cx = x + w * 0.5,
            cy = y + h * 0.5,
            rx = w * 0.5,
            ry = h * 0.5;

        path.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2, false);

        path.moveTo(x + w / 2 - w * 0.15, y + h / 2 - h * 0.15);
        path.lineTo(x + w / 2 + w * 0.15, y + h / 2 + h * 0.15);
        path.moveTo(x + w / 2 + w * 0.15, y + h / 2 - h * 0.15);
        path.lineTo(x + w / 2 - w * 0.15, y + h / 2 + h * 0.15);
    }
});
