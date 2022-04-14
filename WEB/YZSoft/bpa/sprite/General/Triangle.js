
//三角形
Ext.define('YZSoft.bpa.sprite.General.Triangle', {
    extend: 'YZSoft.bpa.sprite.General.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 80,
                height: 70
            },
            anchors: {
                ActivityLeftMiddle: {
                    docked: 'l',
                    pos: function (attr) {
                        return {
                            x: attr.x + attr.width * 0.25,
                            y: attr.y + attr.height / 2
                        }
                    }
                },
                ActivityRightMiddle: {
                    docked: 'r',
                    pos: function (attr) {
                        return {
                            x: attr.x + attr.width * 0.75,
                            y: attr.y + attr.height / 2
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
            top: y + h * 0.25,
            width: w - 20,
            height: h * 0.75,
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

        path.moveTo(x + w / 2, y);
        path.lineTo(x + w, y + h);
        path.lineTo(x, y + h);
        path.closePath();
    }
});
