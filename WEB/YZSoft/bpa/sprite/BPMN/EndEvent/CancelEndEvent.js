
//取消结束事件
Ext.define('YZSoft.bpa.sprite.BPMN.EndEvent.CancelEndEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.EndEvent.Sprite',
    sprites: {
        cancelEvent: {
            xclass: 'YZSoft.bpa.sprite.basic.CancelEvent',
            strokeStyle: 'none',
            fillStyle: '#000'
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
            fillStyle: attr.strokeStyle
        });
    }
});
