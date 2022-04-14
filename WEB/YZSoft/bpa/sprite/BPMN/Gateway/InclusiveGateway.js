
//相容网关
Ext.define('YZSoft.bpa.sprite.BPMN.Gateway.InclusiveGateway', {
    extend: 'YZSoft.bpa.sprite.BPMN.Gateway.Sprite',
    sprites: {
        ellipse: {
            xclass: 'Ext.draw.sprite.Ellipse',
            strokeStyle: '#000',
            lineWidth: 2,
            fillStyle: 'none'
        }
    },

    updateChildEllipse: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            cx = x + w * 0.5,
            cy = y + h * 0.5,
            rx = w * 0.25,
            ry = h * 0.25;

        sprite.setAttributes({
            cx: cx,
            cy: cy,
            rx: rx,
            ry: ry,
            strokeStyle: attr.strokeStyle
        });
    }
});
