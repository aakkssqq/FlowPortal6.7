
//错误边界事件(可中断)
Ext.define('YZSoft.bpa.sprite.BPMN.BoundaryEvent.ErrorBoundaryInturruptingEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.InturruptingEvent',
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