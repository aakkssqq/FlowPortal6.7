
//错误结束事件
Ext.define('YZSoft.bpa.sprite.BPMN.EndEvent.ErrorEndEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.EndEvent.Sprite',
    sprites: {
        errorEvent: {
            xclass: 'YZSoft.bpa.sprite.basic.ErrorEvent',
            strokeStyle: 'none',
            fillStyle: '#000'
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
            fillStyle: attr.strokeStyle
        });
    }
});
