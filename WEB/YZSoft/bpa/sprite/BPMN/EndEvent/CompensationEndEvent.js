
//补偿结束事件
Ext.define('YZSoft.bpa.sprite.BPMN.EndEvent.CompensationEndEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.EndEvent.Sprite',
    sprites: {
        compensation: {
            xclass: 'YZSoft.bpa.sprite.basic.Compensation',
            strokeStyle: 'none',
            fillStyle: '#000'
        }
    },

    updateChildCompensation: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            x: x + w * 0.25,
            y: y + h * 0.3,
            width: w * 0.5,
            height: h * 0.4,
            fillStyle: attr.strokeStyle
        });
    }
});
