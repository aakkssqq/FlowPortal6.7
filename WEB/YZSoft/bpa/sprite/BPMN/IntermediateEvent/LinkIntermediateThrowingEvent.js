
//连接中间抛出事件
Ext.define('YZSoft.bpa.sprite.BPMN.IntermediateEvent.LinkIntermediateThrowingEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.ThrowingEvent',
    sprites: {
        linkEvent: {
            xclass: 'YZSoft.bpa.sprite.basic.LinkEvent',
            strokeStyle: 'none',
            fillStyle: '#000'
        }
    },

    updateChildLinkEvent: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            x: x + w * 0.24,
            y: y + h * 0.32,
            width: w * 0.52,
            height: h * 0.36,
            fillStyle: attr.strokeStyle
        });
    }
});