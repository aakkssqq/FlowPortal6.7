
//多例中间抛出事件
Ext.define('YZSoft.bpa.sprite.BPMN.IntermediateEvent.MultipleIntermediateThrowingEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.ThrowingEvent',
    sprites: {
        multiple: {
            xclass: 'YZSoft.bpa.sprite.basic.Multiple',
            strokeStyle: 'none',
            fillStyle: '#000'
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
            fillStyle: attr.strokeStyle
        });
    }
});