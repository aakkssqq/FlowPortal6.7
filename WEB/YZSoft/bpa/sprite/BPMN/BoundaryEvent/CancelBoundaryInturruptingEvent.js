
//取消边界事件(可中断)
Ext.define('YZSoft.bpa.sprite.BPMN.BoundaryEvent.CancelBoundaryInturruptingEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.InturruptingEvent',
    sprites: {
        cancelEvent: {
            xclass: 'YZSoft.bpa.sprite.basic.CancelEvent',
            fillStyle: 'none',
            lineWidth: 1
        }
    },

    updateChildCancelEvent: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            x: x + w * 0.25,
            y: y + h * 0.25,
            width: w * 0.5,
            height: h * 0.5,
            strokeStyle: attr.strokeStyle
        });
    }
});