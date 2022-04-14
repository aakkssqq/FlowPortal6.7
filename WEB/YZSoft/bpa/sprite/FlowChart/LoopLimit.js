
//循环限值
Ext.define('YZSoft.bpa.sprite.FlowChart.LoopLimit', {
    extend: 'YZSoft.bpa.sprite.FlowChart.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 100,
                height: 70
            }
        }
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        path.moveTo(x, y + Math.min(h / 2, w / 6));
        path.lineTo(x + Math.min(h / 2, w / 6), y);
        path.lineTo(x + w - Math.min(h / 2, w / 6), y);
        path.lineTo(x + w, y + Math.min(h / 2, w / 6));
        path.lineTo(x + w, y + h);
        path.lineTo(x, y + h);
        path.closePath();
    }
});
