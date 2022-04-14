
//多例开始事件(非中断)
Ext.define('YZSoft.bpa.sprite.BPMN.StartEvent.MultipleNonInturruptingEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.StartEvent.NonInturruptingEvent',
    sprites: {
        multiple: {
            xclass: 'YZSoft.bpa.sprite.basic.Multiple',
            fillStyle: 'none',
            lineWidth: 1
        }
    },

    updateChildMultiple: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            x: x + w * 0.22,
            y: y + h * 0.22,
            width: w * 0.56,
            height: h * 0.53,
            strokeStyle: attr.strokeStyle
        });
    }
});