
//定时边界事件(可中断)
Ext.define('YZSoft.bpa.sprite.BPMN.BoundaryEvent.TimerBoundaryInturruptingEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.InturruptingEvent',
    sprites: {
        clock: {
            xclass: 'YZSoft.bpa.sprite.basic.Clock',
            fillStyle: 'none',
            lineWidth: 1
        },
        clockPointer: {
            xclass: 'YZSoft.bpa.sprite.basic.ClockPointer',
            fillStyle: 'none',
            lineWidth: 1
        }
    },

    updateChildClock: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            x: x + w * 0.2,
            y: y + h * 0.2,
            width: w * 0.6,
            height: h * 0.6,
            strokeStyle: attr.strokeStyle
        });
    },

    updateChildClockPointer: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            x: x + w * 0.2,
            y: y + h * 0.2,
            width: w * 0.6,
            height: h * 0.6,
            strokeStyle: attr.strokeStyle
        });
    }
});