
//条款
Ext.define('YZSoft.bpa.sprite.Regulation.Item', {
    extend: 'YZSoft.bpa.sprite.Regulation.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 100,
                height: 52
            },
            anchors: {
                ActivityRightMiddle: {
                    docked: 'r',
                    pos: function (attr) {
                        var x = attr.x,
                            y = attr.y,
                            w = attr.width,
                            h = attr.height;

                        return {
                            x: x + w - Math.min(h / 2, w / 6),
                            y: y + h / 2
                        }
                    }
                }
            }
        }
    },
    propertyConfig: {
        xclass: 'YZSoft.bpa.sprite.Properties.RegulationItem.Property'
    },

    updateChildText: function (sprite, attr) {
        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            left: attr.x,
            top: attr.y,
            width: attr.width,
            height: attr.height,
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

        path.moveTo(x, y + h);
        path.lineTo(x, y);
        path.lineTo(x + w, y);
        path.lineTo(x + w - Math.min(h / 2, w / 6), y + h * 0.5);
        path.lineTo(x + w, y + h);
        path.lineTo(x + Math.min(h / 2, w / 6), y + h);
        path.closePath();
    }
});
