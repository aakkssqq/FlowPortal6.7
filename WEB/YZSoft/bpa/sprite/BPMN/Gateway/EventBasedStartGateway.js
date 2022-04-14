
//实例化事件网关
Ext.define('YZSoft.bpa.sprite.BPMN.Gateway.EventBasedStartGateway', {
    extend: 'YZSoft.bpa.sprite.BPMN.Gateway.Sprite',
    sprites: {
        ellipse: {
            xclass: 'Ext.draw.sprite.Ellipse',
            strokeStyle: '#000',
            lineWidth: 1.5,
            fillStyle: 'none'
        },
        multiple: {
            xclass: 'YZSoft.bpa.sprite.basic.Multiple',
            fillStyle: 'none',
            lineWidth: 1.5
        }
    },

    updateChildEllipse: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            cx = x + w * 0.5,
            cy = y + h * 0.5,
            rx = w * 0.29,
            ry = h * 0.29;

        sprite.setAttributes({
            cx: cx,
            cy: cy,
            rx: rx,
            ry: ry,
            strokeStyle: attr.strokeStyle
        });
    },

    updateChildMultiple: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            x: x + w * 0.32,
            y: y + h * 0.31,
            width: w * 0.36,
            height: h * 0.36,
            strokeStyle: attr.strokeStyle
        });
    }
});
