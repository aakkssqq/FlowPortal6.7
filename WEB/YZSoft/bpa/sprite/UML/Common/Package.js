
//包
Ext.define('YZSoft.bpa.sprite.UML.Common.Package', {
    extend: 'YZSoft.bpa.sprite.UML.Common.Sprite',
    radius: 4,
    headheight:25,
    inheritableStatics: {
        def: {
            defaults: {
                width: 210,
                height: 150
            }
        }
    },
    sprites: {
        text: {
            xclass: 'YZSoft.src.flowchart.sprite.BoxText',
            text: '',
            textAlign: 'left',
            textBaseline: 'middle',
            fontFamily: RS.$('All_BPA_FontFamily'),
            fontSize: 13,
            fillStyle: 'black',
            background: {
                fillStyle: 'none'
            },
            editable: true
        },
        bodyText: {
            xclass: 'YZSoft.src.flowchart.sprite.BoxText',
            text: '',
            textAlign: 'left',
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
            h = attr.height,
            th = this.headheight;

        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            left: x,
            top: y,
            width: w * 0.7,
            height: th,
            paddingtop: (attr.lineWidth * 0.5 || 0),
            paddingleft: (attr.lineWidth * 0.5 || 0) + 8,
            paddingright: (attr.lineWidth * 0.5 || 0) + 8,
            paddingbottom: (attr.lineWidth * 0.5 || 0)
        });
    },

    updateChildBodyText: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            th = this.headheight;

        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            left: x,
            top: y + th,
            width: w,
            height: h - th,
            paddingtop: (attr.lineWidth * 0.5 || 0),
            paddingleft: (attr.lineWidth * 0.5 || 0) + 8,
            paddingright: (attr.lineWidth * 0.5 || 0) + 8,
            paddingbottom: (attr.lineWidth * 0.5 || 0)
        });
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            th = this.headheight,
            r = this.radius;

        path.moveTo(x, y + th);
        path.lineTo(x + w - r, y + th);
        path.quadraticCurveTo(x + w, y + th, x + w, y + th + r);
        path.lineTo(x + w, y + h - r);
        path.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        path.lineTo(x + r, y + h);
        path.quadraticCurveTo(x, y + h, x, y + h - r);
        path.lineTo(x, y + r);
        path.quadraticCurveTo(x, y, x + r, y);
        path.lineTo(x + w * 0.7 - r, y);
        path.quadraticCurveTo(x + w * 0.7, y, x + w * 0.7 + r * 0.75, y + r * 0.75);
        path.lineTo(x + w * 0.76, y + th);
        path.closePath();
    }
});
