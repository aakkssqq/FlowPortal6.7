
//移动指示
Ext.define('YZSoft.src.flowchart.sprite.HVSnapLine', {
    extend: 'Ext.draw.sprite.Line',
    requires: [
        'YZSoft.src.flowchart.overrides.Sprite'
    ],
    inheritableStatics: {
        def: {
            defaults: {
                translationX: 0.5,
                translationY: 0.5
            }
        }
    },

    hitTest: function () {
        return false;
    }
});
