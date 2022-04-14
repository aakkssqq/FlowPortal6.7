
//外部数据
Ext.define('YZSoft.bpa.sprite.FlowChart.StoredData', {
    extend: 'YZSoft.bpa.sprite.FlowChart.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 100,
                height: 70
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
                            x: x + w - w * 0.1262,
                            y: y + h / 2
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
            left: x + w * 0.1,
            top: y,
            width: w * 0.75,
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

        path.moveTo(x + w / 6, y);
        path.lineTo(x + w, y);
        path.bezierCurveTo(x + w - w / 6, y, x + w - w / 6, y + h, x + w, y + h);
        path.lineTo(x + w / 6, y + h);
        path.bezierCurveTo(x - w / 17, y + h, x - w / 17, y, x + w / 6, y);
        path.closePath();
    }
});
