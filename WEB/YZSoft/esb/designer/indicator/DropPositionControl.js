
//指示位置
Ext.define('YZSoft.esb.designer.indicator.DropPositionControl', {
    extend: 'YZSoft.esb.sprites.FlowControlSpriteAbstract',
    inheritableStatics: {
        def: {
            defaults: {
                type: 'action',
                fillStyle: 'none',
                lineDash: [7, 3],
                strokeStyle: '#666666',
                lineWidth: 1
            }
        }
    },
    isIndicator: true,
    selectable: false,
    sprites: false
});
