
//价值链1
Ext.define('YZSoft.bpa.sprite.EVC.ValueChain1', {
    extend: 'YZSoft.bpa.sprite.EVC.Sprite',
    inheritableStatics: {
        def: {
            anchors: {
                ActivityLeftMiddle: {
                    docked: 'l',
                    pos: function (attr) {
                        var x = attr.x,
                            y = attr.y,
                            w = attr.width,
                            h = attr.height;

                        return {
                            x: x + Math.min(h / 2, w / 6),
                            y: y + h / 2
                        }
                    }
                }
            }
        }
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        path.moveTo(x + Math.min(h / 2, w / 6), y + h * 0.5);
        path.lineTo(x, y);
        path.lineTo(x + w - Math.min(h / 2, w / 6), y);
        path.lineTo(x + w, y + h * 0.5);
        path.lineTo(x + w - Math.min(h / 2, w / 6), y + h);
        path.lineTo(x, y + h);
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
            left: x + Math.min(h / 2, w / 6),
            top: y,
            width: w - Math.min(h / 2, w / 6) * 2,
            height: h,
            paddingtop: (attr.lineWidth * 0.5 || 0) + 2,
            paddingleft: (attr.lineWidth * 0.5 || 0) + 2,
            paddingright: (attr.lineWidth * 0.5 || 0) + 2,
            paddingbottom: (attr.lineWidth * 0.5 || 0) + 2
        });
    }
});
