
//多例中间捕获事件
Ext.define('YZSoft.bpa.sprite.BPMN.IntermediateEvent.MultipleIntermediateCatchEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.CatchEvent',
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