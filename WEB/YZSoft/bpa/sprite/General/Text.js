
//文本
Ext.define('YZSoft.bpa.sprite.General.Text', {
    extend: 'YZSoft.bpa.sprite.General.Sprite',
    supportLineWidth: false,
    supportLineStyle: false,
    supportStrokeStyle: false,
    supportFillStyle: false,
    inheritableStatics: {
        def: {
            defaults: {
                width: 160,
                height: 40
            },
            anchors: {
                ActivityMiddleTop: false,
                ActivityRightMiddle: false,
                ActivityMiddleBottom: false,
                ActivityLeftMiddle: false
            },
            triggers: {
                fillStyle: ''
            }
        }
    }
});
