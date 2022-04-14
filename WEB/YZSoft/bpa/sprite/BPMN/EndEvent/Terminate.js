
//终止事件
Ext.define('YZSoft.bpa.sprite.BPMN.EndEvent.Terminate', {
    extend: 'YZSoft.bpa.sprite.BPMN.EndEvent.Sprite',
    sprites: {
        ellipse: {
            xclass: 'Ext.draw.sprite.Ellipse',
            strokeStyle: 'none',
            fillStyle: '#000'
        }
    },

    updateChildEllipse: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            cx = x + w * 0.5,
            cy = y + h * 0.5,
            rx = w * 0.5,
            ry = h * 0.5;

        sprite.setAttributes({
            cx: cx,
            cy: cy,
            rx: rx * 0.5,
            ry: ry * 0.5,
            fillStyle: attr.strokeStyle
        });
    }
});