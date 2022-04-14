
//事件网关
Ext.define('YZSoft.bpa.sprite.BPMN.Gateway.EventBasedGateway', {
    extend: 'YZSoft.bpa.sprite.BPMN.Gateway.Sprite',
    sprites: {
        ellipse1: {
            xclass: 'Ext.draw.sprite.Ellipse',
            strokeStyle: '#000',
            lineWidth: 1.5,
            fillStyle: 'none'
        },
        ellipse2: {
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

    updateChildEllipse1: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            cx = x + w * 0.5,
            cy = y + h * 0.5,
            rx = w * 0.3,
            ry = h * 0.3;

        sprite.setAttributes({
            cx: cx,
            cy: cy,
            rx: rx,
            ry: ry,
            strokeStyle: attr.strokeStyle
        });
    },

    updateChildEllipse2: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            cx = x + w * 0.5,
            cy = y + h * 0.5,
            rx = w * 0.23,
            ry = h * 0.23;

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
            x: x + w * 0.35,
            y: y + h * 0.33,
            width: w * 0.3,
            height: h * 0.3,
            strokeStyle: attr.strokeStyle
        });
    }
});
