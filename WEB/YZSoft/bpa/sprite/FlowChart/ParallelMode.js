
//并行模式
Ext.define('YZSoft.bpa.sprite.FlowChart.ParallelMode', {
    extend: 'YZSoft.bpa.sprite.FlowChart.Sprite',
    supportFillStyle: false,
    inheritableStatics: {
        def: {
            defaults: {
                width: 100,
                height: 70
            },
            anchors: {
                ActivityRightMiddle: false,
                ActivityLeftMiddle: false
            },
            triggers: {
                fillStyle: ''
            }
        }
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        path.moveTo(x, y);
        path.lineTo(x + w, y);
        path.moveTo(x, y + h);
        path.lineTo(x + w, y + h);
    }
});
