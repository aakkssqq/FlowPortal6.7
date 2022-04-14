
//取消中间捕获事件
Ext.define('YZSoft.bpa.sprite.BPMN.IntermediateEvent.CancelIntermediateCatchEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.CatchEvent',
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