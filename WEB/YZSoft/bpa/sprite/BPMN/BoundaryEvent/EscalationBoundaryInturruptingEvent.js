
//上升边界事件(可中断)
Ext.define('YZSoft.bpa.sprite.BPMN.BoundaryEvent.EscalationBoundaryInturruptingEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.InturruptingEvent',
    sprites: {
        escalation: {
            xclass: 'YZSoft.bpa.sprite.basic.Escalation',
            fillStyle: 'none',
            lineWidth: 1
        }
    },

    updateChildEscalation: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            x: x + w * 0.3,
            y: y + h * 0.25,
            width: w * 0.4,
            height: h * 0.5,
            strokeStyle: attr.strokeStyle
        });
    }
});