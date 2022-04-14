
//数据
Ext.define('YZSoft.bpa.sprite.FlowChart.Data', {
    extend: 'YZSoft.bpa.sprite.FlowChart.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 100,
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
                            x: x + Math.min(h / 3, w / 3) / 2,
                            y: y + h / 2
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
                            x: x + w-Math.min(h/3,w/3)/2,
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
            left: x + w * 0.15,
            top: y,
            width: w * 0.7,
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

        path.moveTo(x + Math.min(h / 3, w / 3), y);
        path.lineTo(x + w, y);
        path.lineTo(x + w - Math.min(h / 3, w / 3), y + h);
        path.lineTo(x, y + h);
        path.closePath();
    }
});
