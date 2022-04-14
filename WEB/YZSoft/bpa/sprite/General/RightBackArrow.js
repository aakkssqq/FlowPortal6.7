
//右返回箭头
Ext.define('YZSoft.bpa.sprite.General.RightBackArrow', {
    extend: 'YZSoft.bpa.sprite.General.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 70,
                height: 70
            },
            anchors: {
                ActivityMiddleBottom: false,
                ActivityLeftMiddle: {
                    docked: 'l',
                    pos: function (attr) {
                        var x = attr.x,
                            y = attr.y,
                            w = attr.width,
                            h = attr.height;

                        return {
                            x: x + Math.min(w * 0.12, 20),
                            y: y + h * 0.39
                        }
                    }
                }
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
            width: w - 10,
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

        path.moveTo(x + w, y + Math.min(Math.min(w, h) * 0.4, 80));
        path.quadraticCurveTo(x + w, y, x + w - Math.min(Math.min(w, h) * 0.4, 80), y);
        path.lineTo(x + Math.min(w * 0.12, 20) + Math.min(Math.min(w, h) * 0.4, 80), y);
        path.quadraticCurveTo(x + Math.min(w * 0.12, 20), y, x + Math.min(w * 0.12, 20), y + Math.min(Math.min(w, h) * 0.4, 80));
        path.lineTo(x + Math.min(w * 0.12, 20), y + h - h * 0.1 - Math.min(h * 0.1, 50));
        path.lineTo(x, y + h - h * 0.1 - Math.min(h * 0.1, 50));
        path.lineTo(x + Math.min(w * 0.12, 20) + Math.min(Math.min(h, w) * 0.25, 50) / 2, y + h);
        path.lineTo(x + Math.min(Math.min(h, w) * 0.25, 50) + Math.min(w * 0.12, 20) * 2, y + h - h * 0.1 - Math.min(h * 0.1, 50));
        path.lineTo(x + Math.min(Math.min(h, w) * 0.25, 50) + Math.min(w * 0.12, 20), y + h - h * 0.1 - Math.min(h * 0.1, 50));
        path.lineTo(x + Math.min(Math.min(h, w) * 0.25, 50) + Math.min(w * 0.12, 20), y + Math.min(Math.min(h, w) * 0.4, 80));
        path.quadraticCurveTo(x + Math.min(Math.min(h, w) * 0.25, 50) + Math.min(w * 0.12, 20), y + Math.min(Math.min(h, w) * 0.25, 50), x + Math.min(Math.min(h, w) * 0.25, 50) + Math.min(w * 0.12, 20) + Math.min(w * 0.15, 30), y + Math.min(Math.min(h, w) * 0.25, 50));
        path.lineTo(x + w - Math.min(Math.min(h, w) * 0.25, 50) - Math.min(w * 0.15, 30), y + Math.min(Math.min(h, w) * 0.25, 50));
        path.quadraticCurveTo(x + w - Math.min(Math.min(h, w) * 0.25, 50), y + Math.min(Math.min(h, w) * 0.25, 50), x + w - Math.min(Math.min(h, w) * 0.25, 50), y + Math.min(Math.min(h, w) * 0.4, 80));
        path.lineTo(x + w - Math.min(Math.min(h, w) * 0.25, 50), y + h);
        path.lineTo(x + w, y + h);
        path.closePath();
    }
});
