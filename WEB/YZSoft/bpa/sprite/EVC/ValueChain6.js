
//价值链6
Ext.define('YZSoft.bpa.sprite.EVC.ValueChain6', {
    extend: 'YZSoft.bpa.sprite.EVC.Sprite',

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        path.moveTo(x, y);
        path.lineTo(x + w, y);
        path.lineTo(x + w, y + h - Math.min(h / 2, w / 6));
        path.lineTo(x + w * 0.5, y + h);
        path.lineTo(x, y + h - Math.min(h / 2, w / 6));
        path.closePath();
    },

    updateChildText: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            left: x,
            top: y,
            width: w,
            height: h - Math.min(h / 2, w / 6) * 4 / 5,
            paddingtop: (attr.lineWidth * 0.5 || 0) + 2,
            paddingleft: (attr.lineWidth * 0.5 || 0) + 2,
            paddingright: (attr.lineWidth * 0.5 || 0) + 2,
            paddingbottom: (attr.lineWidth * 0.5 || 0) + 2
        });
    }
});
