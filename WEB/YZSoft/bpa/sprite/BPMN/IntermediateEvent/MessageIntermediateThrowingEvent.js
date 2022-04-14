
//消息中间抛出事件
Ext.define('YZSoft.bpa.sprite.BPMN.IntermediateEvent.MessageIntermediateThrowingEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.ThrowingEvent',
    sprites: {
        message: {
            xclass: 'YZSoft.bpa.sprite.basic.MailInverse',
            strokeStyle: 'none',
            fillStyle: '#000'
        },
        assist: {
            xclass: 'YZSoft.bpa.sprite.basic.MailInverseTriangle',
            strokeStyle: '#fff',
            lineWidth: 1
        }
    },

    updateChildMessage: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            x: x + w * 0.22,
            y: y + h * 0.32,
            width: w * 0.56,
            height: h * 0.36,
            fillStyle: attr.strokeStyle
        });
    },

    updateChildAssist: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            x: x + w * 0.22,
            y: y + h * 0.32,
            width: w * 0.56,
            height: h * 0.18,
            fillStyle: attr.strokeStyle
        });
    }
});