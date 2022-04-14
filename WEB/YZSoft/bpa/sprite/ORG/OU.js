
//组织
Ext.define('YZSoft.bpa.sprite.ORG.OU', {
    extend: 'YZSoft.bpa.sprite.ORG.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 120,
                height: 70
            }
        }
    },
    propertyConfig: {
        xclass: 'YZSoft.bpa.sprite.Properties.OU.Property'
    },

    updateChildText: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            left: x + w * 0.15 + attr.lineWidth * 0.5,
            top: y + h * 0.19,
            width: w * 0.8 - attr.lineWidth,
            height: h * 0.62,
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
            h = attr.height,
            cx = x + w * 0.5,
            cy = y + h * 0.5,
            rx = w * 0.5,
            ry = h * 0.5;

        path.moveTo(x, y + h * 0.5);
        path.bezierCurveTo(x, y - h / 6, x + w, y - h / 6, x + w, y + h * 0.5);
        path.bezierCurveTo(x + w, y + h + h / 6, x, y + h + h / 6, x, y + h * 0.5);
        path.closePath();

        path.moveTo(x + w * 0.15, y + h * 0.13);
        path.lineTo(x + w * 0.15, y + h * 0.87);
    }
});
