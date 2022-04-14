
//信号结束事件
Ext.define('YZSoft.bpa.sprite.BPMN.EndEvent.SignalEndEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.EndEvent.Sprite',
    sprites: {
        signal: {
            xclass: 'YZSoft.bpa.sprite.basic.Signal',
            strokeStyle: 'none',
            fillStyle: '#000'
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
            fillStyle: attr.strokeStyle
        });
    }
});
