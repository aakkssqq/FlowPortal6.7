
//备注
Ext.define('YZSoft.bpa.sprite.General.LeftBrace', {
    extend: 'YZSoft.bpa.sprite.General.Sprite',
    supportFillStyle: false,
    inheritableStatics: {
        def: {
            defaults: {
                width: 100,
                height: 140
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
    },
    sprites: {
        text: {
            xclass: 'YZSoft.src.flowchart.sprite.BoxText',
            text: '',
            textAlign: 'right',
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
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            left: x,
            top: y,
            width: w - 25,
            height: h,
            paddingtop: (attr.lineWidth * 0.5 || 0) + 2,
            paddingleft: (attr.lineWidth * 0.5 || 0) + 2,
            paddingright: (attr.lineWidth * 0.5 || 0) + 2,
            paddingbottom: (attr.lineWidth * 0.5 || 0) + 2
        });
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        path.moveTo(x + w, y);
        path.quadraticCurveTo(x + w - Math.min(w * 0.1, 9), y, x + w - Math.min(w * 0.1, 9), y + Math.min(h * 0.1, 9));
        path.lineTo(x + w - Math.min(w * 0.1, 9), y + h * 0.5 - Math.min(h * 0.1, 9));
        path.quadraticCurveTo(x + w - Math.min(w * 0.1, 9), y + h * 0.5, x + w - Math.min(w * 0.2, 22), y + h * 0.5);
        path.quadraticCurveTo(x + w - Math.min(w * 0.1, 9), y + h * 0.5, x + w - Math.min(w * 0.1, 9), y + h * 0.5 + Math.min(h * 0.1, 9));
        path.lineTo(x + w - Math.min(w * 0.1, 9), y + h - Math.min(h * 0.1, 9));
        path.quadraticCurveTo(x + w - Math.min(w * 0.1, 9), y + h, x + w, y + h);
    }
});
