
//条件边界事件(可中断)
Ext.define('YZSoft.bpa.sprite.BPMN.BoundaryEvent.ConditionalBoundaryInturruptingEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.InturruptingEvent',
    sprites: {
        conditional: {
            xclass: 'YZSoft.bpa.sprite.basic.Conditional',
            fillStyle: 'none',
            lineWidth: 1
        }
    },

    updateChildConditional: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            x: x + w * 0.28,
            y: y + h * 0.27,
            width: w * 0.44,
            height: h * 0.46,
            strokeStyle: attr.strokeStyle
        });
    }
});