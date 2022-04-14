
//信号边界事件(非中断)
Ext.define('YZSoft.bpa.sprite.BPMN.BoundaryEvent.SignalBoundaryNonInturruptingEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.NonInturruptingEvent',
    sprites: {
        signal: {
            xclass: 'YZSoft.bpa.sprite.basic.Signal',
            fillStyle: 'none',
            lineWidth: 1
        }
    },

    updateChildSignal: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            x: x + w * 0.22,
            y: y + h * 0.18,
            width: w * 0.56,
            height: h * 0.47,
            strokeStyle: attr.strokeStyle
        });
    }
});