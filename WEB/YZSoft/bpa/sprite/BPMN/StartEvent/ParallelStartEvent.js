
//并行开始事件(可中断)
Ext.define('YZSoft.bpa.sprite.BPMN.StartEvent.ParallelStartEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.StartEvent.InturruptingEvent',
    sprites: {
        parallel: {
            xclass: 'YZSoft.bpa.sprite.basic.Parallel',
            fillStyle: 'none',
            lineWidth: 1
        }
    },

    updateChildParallel: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            x: x + w * 0.23,
            y: y + h * 0.23,
            width: w * 0.54,
            height: h * 0.54,
            strokeStyle: attr.strokeStyle
        });
    }
});