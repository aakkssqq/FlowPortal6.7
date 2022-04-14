
//并行网关
Ext.define('YZSoft.bpa.sprite.BPMN.Gateway.ParallelGateway', {
    extend: 'YZSoft.bpa.sprite.BPMN.Gateway.Sprite',
    sprites: {
        parallel: {
            xclass: 'YZSoft.bpa.sprite.basic.Parallel',
            strokeStyle: 'none',
            fillStyle: '#000',
            thick: 0.08,
            samethick: true
        }
    },

    updateChildParallel: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            x: x + w * 0.22,
            y: y + h * 0.22,
            width: w * 0.56,
            height: h * 0.56,
            fillStyle: attr.strokeStyle
        });
    }
});
