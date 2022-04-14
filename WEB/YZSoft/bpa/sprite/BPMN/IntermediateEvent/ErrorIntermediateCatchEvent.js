
//错误中间捕获事件
Ext.define('YZSoft.bpa.sprite.BPMN.IntermediateEvent.ErrorIntermediateCatchEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.CatchEvent',
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