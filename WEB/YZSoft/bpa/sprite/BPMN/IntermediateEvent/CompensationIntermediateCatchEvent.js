
//补偿中间捕获事件
Ext.define('YZSoft.bpa.sprite.BPMN.IntermediateEvent.CompensationIntermediateCatchEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.CatchEvent',
    sprites: {
        compensation: {
            xclass: 'YZSoft.bpa.sprite.basic.Compensation',
            fillStyle: 'none',
            lineWidth: 1
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
            strokeStyle: attr.strokeStyle
        });
    }
});