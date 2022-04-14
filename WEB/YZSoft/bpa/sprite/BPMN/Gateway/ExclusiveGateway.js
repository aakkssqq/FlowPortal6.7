
//互斥网关
Ext.define('YZSoft.bpa.sprite.BPMN.Gateway.ExclusiveGateway', {
    extend: 'YZSoft.bpa.sprite.BPMN.Gateway.Sprite',
    sprites: {
        exclusive: {
            xclass: 'YZSoft.bpa.sprite.basic.Exclusive',
            strokeStyle: 'none',
            fillStyle: '#000'
        }
    },

    updateChildExclusive: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            x: x + w * 0.3,
            y: y + h * 0.3,
            width: w * 0.4,
            height: h * 0.4,
            fillStyle: attr.strokeStyle
        });
    }
});
