
//复杂网关
Ext.define('YZSoft.bpa.sprite.BPMN.Gateway.ComplexGateway', {
    extend: 'YZSoft.bpa.sprite.BPMN.Gateway.Sprite',
    sprites: {
        complex: {
            xclass: 'YZSoft.bpa.sprite.basic.Complex',
            strokeStyle: 'none',
            fillStyle: '#000'
        }
    },

    updateChildComplex: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            x: x + w * 0.38,
            y: y + h * 0.38,
            width: w * 0.24,
            height: h * 0.24,
            fillStyle: attr.strokeStyle
        });
    }
});
