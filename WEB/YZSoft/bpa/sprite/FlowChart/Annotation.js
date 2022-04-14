
//注释
Ext.define('YZSoft.bpa.sprite.FlowChart.Annotation', {
    extend: 'YZSoft.bpa.sprite.FlowChart.Sprite',
    supportFillStyle: false,
    inheritableStatics: {
        def: {
            defaults: {
                width: 100,
                height: 70
            },
            anchors: {
                ActivityMiddleTop: false,
                ActivityRightMiddle: false,
                ActivityMiddleBottom: false
            },
            triggers: {
                fillStyle: ''
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
            left: x + 4,
            top: y,
            width: w - 8,
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

        path.moveTo(x + Math.min(w / 6, 20), y);
        path.lineTo(x, y);
        path.lineTo(x, y + h);
        path.lineTo(x + Math.min(w / 6, 20), y + h);
    }
});
