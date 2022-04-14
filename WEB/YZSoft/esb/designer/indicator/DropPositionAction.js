
//指示位置
Ext.define('YZSoft.esb.designer.indicator.DropPositionAction', {
    extend: 'YZSoft.esb.sprites.SpriteAbstract',
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
