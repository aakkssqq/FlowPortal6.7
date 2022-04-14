﻿
//八边形
Ext.define('YZSoft.bpa.sprite.General.Octagon', {
    extend: 'YZSoft.bpa.sprite.General.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 70,
                height: 70
            }
        }
    },

    updateChildText: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            left: x + 10,
            top: y,
            width: w - 20,
            height: h,
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

        path.moveTo(x + Math.min(w, h) * 0.29, y);
        path.lineTo(x + w - Math.min(w, h) * 0.29, y);
        path.lineTo(x + w, y + h * 0.29);
        path.lineTo(x + w, y + h * 0.71);
        path.lineTo(x + w - Math.min(w, h) * 0.29, y + h);
        path.lineTo(x + Math.min(w, h) * 0.29, y + h);
        path.lineTo(x, y + h * 0.71);
        path.lineTo(x, y + h * 0.29);
        path.closePath();
    }
});
