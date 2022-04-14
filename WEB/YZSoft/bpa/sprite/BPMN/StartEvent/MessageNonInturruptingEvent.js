
//消息开始事件(非中断)
Ext.define('YZSoft.bpa.sprite.BPMN.StartEvent.MessageNonInturruptingEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.StartEvent.NonInturruptingEvent',
    sprites: {
        message: {
            xclass: 'YZSoft.bpa.sprite.basic.Mail',
            fillStyle: 'none',
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
            strokeStyle: attr.strokeStyle
        });
    }
});