
//五边形
Ext.define('YZSoft.bpa.sprite.General.Polygon', {
    extend: 'YZSoft.bpa.sprite.General.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 74,
                height: 70
            },
            anchors: {
                ActivityLeftMiddle: {
                    docked: 'l',
                    pos: function (attr) {
                        var x = attr.x,
                        y = attr.y,
                        w = attr.width,
                        h = attr.height;

                        return {
                            x: x,
                            y: y + h * 0.39
                        }
                    }
                },
                ActivityRightMiddle: {
                    docked: 'r',
                    pos: function (attr) {
                        var x = attr.x,
                            y = attr.y,
                            w = attr.width,
                            h = attr.height;

                        return {
                            x: x + w,
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
            left: x + 12,
            top: y + h * 0.15,
            width: w - 24,
            height: h * 0.85,
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

        path.moveTo(x + w*0.5, y);
        path.lineTo(x, y + h * 0.39);
        path.lineTo(x + w * 0.18, y + h);
        path.lineTo(x + w * 0.82, y + h);
        path.lineTo(x + w, y + h * 0.39);
        path.closePath();
    }
});
