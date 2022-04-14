
//错误开始事件(可中断)
Ext.define('YZSoft.bpa.sprite.BPMN.StartEvent.ErrorStartEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.StartEvent.InturruptingEvent',
    sprites: {
        errorEvent: {
            xclass: 'YZSoft.bpa.sprite.basic.ErrorEvent',
            fillStyle: 'none',
            lineWidth: 1
        }
    },

    updateChildErrorEvent: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            x: x + w * 0.22,
            y: y + h * 0.3,
            width: w * 0.56,
            height: h * 0.4,
            strokeStyle: attr.strokeStyle
        });
    }
});