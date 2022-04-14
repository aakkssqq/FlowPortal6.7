
//实例化并行网关
Ext.define('YZSoft.bpa.sprite.BPMN.Gateway.ParallelEBGateway', {
    extend: 'YZSoft.bpa.sprite.BPMN.Gateway.Sprite',
    sprites: {
        ellipse: {
            xclass: 'Ext.draw.sprite.Ellipse',
            strokeStyle: '#000',
            lineWidth: 1.5,
            fillStyle: 'none'
        },
        parallel: {
            xclass: 'YZSoft.bpa.sprite.basic.Parallel',
            strokeStyle: '#000',
            fillStyle: 'none',
            lineWidth: 1.5,
            thick: 0.08,
            samethick: true
        }
    },

    updateChildEllipse: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            cx = x + w * 0.5,
            cy = y + h * 0.5,
            rx = w * 0.25,
            ry = h * 0.25;

        sprite.setAttributes({
            cx: cx,
            cy: cy,
            rx: rx,
            ry: ry,
            strokeStyle: attr.strokeStyle
        });
    },

    updateChildParallel: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            x: x + w * 0.29,
            y: y + h * 0.29,
            width: w * 0.42,
            height: h * 0.42,
            strokeStyle: attr.strokeStyle
        });
    }
});
