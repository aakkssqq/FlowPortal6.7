
//上箭头
Ext.define('YZSoft.bpa.sprite.General.SingleUpArrow', {
    extend: 'YZSoft.bpa.sprite.General.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 60,
                height: 90
            },
            anchors: {
                ActivityRightMiddle: false,
                ActivityLeftMiddle: false
            }
        }
    },
    sprites: {
        text: {
            xclass: 'YZSoft.src.flowchart.sprite.Text',
            text: '',
            textAlign: 'center',
            textBaseline: 'middle',
            fontFamily: RS.$('All_BPA_FontFamily'),
            fontSize: 13,
            fillStyle: 'black',
            background: {
                fillStyle: 'none'
            },
            editable: true
        }
    },

    updateChildText: function (sprite, attr) {
        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            x: Math.floor(attr.x + attr.width / 2),
            y: Math.floor(attr.y + attr.height *0.60)
        });
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        path.moveTo(x + w * 0.5, y);
        path.lineTo(x + w, y + Math.min(w * 0.5, h * 0.45));
        path.lineTo(x + w * 0.67, y + Math.min(w * 0.5, h * 0.45));
        path.lineTo(x + w * 0.67, y + h);
        path.lineTo(x + w * 0.33, y + h);
        path.lineTo(x + w * 0.33, y + Math.min(w * 0.5, h * 0.45));
        path.lineTo(x, y + Math.min(w * 0.5, h * 0.45));
        path.closePath();
    }
});
