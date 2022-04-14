
//连接中间捕获事件
Ext.define('YZSoft.bpa.sprite.BPMN.IntermediateEvent.LinkIntermediateCatchEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.CatchEvent',
    sprites: {
        linkEvent: {
            xclass: 'YZSoft.bpa.sprite.basic.LinkEvent',
            fillStyle: 'none',
            lineWidth: 1
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
            strokeStyle: attr.strokeStyle
        });
    }
});