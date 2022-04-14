
//上升中间抛出事件
Ext.define('YZSoft.bpa.sprite.BPMN.IntermediateEvent.EscalationIntermediateThrowingEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.ThrowingEvent',
    sprites: {
        escalation: {
            xclass: 'YZSoft.bpa.sprite.basic.Escalation',
            strokeStyle: 'none',
            fillStyle: '#000'
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
            fillStyle: attr.strokeStyle
        });
    }
});