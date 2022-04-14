
//信号中间捕获事件
Ext.define('YZSoft.bpa.sprite.BPMN.IntermediateEvent.SignalIntermediateCatchEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.CatchEvent',
    sprites: {
        signal: {
            xclass: 'YZSoft.bpa.sprite.basic.Signal',
            fillStyle: 'none',
            lineWidth: 1
        }
    },

    updateChildSignal: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            x: x + w * 0.22,
            y: y + h * 0.18,
            width: w * 0.56,
            height: h * 0.47,
            strokeStyle: attr.strokeStyle
        });
    }
});