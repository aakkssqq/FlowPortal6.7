
//文档
Ext.define('YZSoft.bpa.sprite.FlowChart.Document', {
    extend: 'YZSoft.bpa.sprite.FlowChart.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 100,
                height: 70
            },
            anchors: {
                ActivityMiddleBottom: {
                    docked: 'b',
                    pos: function (attr) {
                        var x = attr.x,
                            y = attr.y,
                            w = attr.width,
                            h = attr.height;

                        return {
                            x: x + w / 2,
                            y: y + h - Math.min(h / 8, w / 12)
                        }
                    }
                }
            }
        }
    },

    updateChildText: function (sprite, attr) {
        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            left: attr.x,
            top: attr.y,
            width: attr.width,
            height: attr.height * 0.9,
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

        path.moveTo(x, y + h - Math.min(h / 8, w / 12));
        path.lineTo(x, y);
        path.lineTo(x + w, y);
        path.lineTo(x + w, y + h - Math.min(h / 8, w / 12));
        path.quadraticCurveTo(x + w * 0.75, y + h - 3 * Math.min(h / 8, w / 12), x + w * 0.5, y + h - Math.min(h / 8, w / 12));
        path.quadraticCurveTo(x + w * 0.25, y + h + Math.min(h / 8, w / 12), x, y + h - Math.min(h / 8, w / 12));
        path.closePath();
    }
});
