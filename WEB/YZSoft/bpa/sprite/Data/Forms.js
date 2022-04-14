
//多个表单
Ext.define('YZSoft.bpa.sprite.Data.Forms', {
    extend: 'YZSoft.bpa.sprite.Data.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 100,
                height: 70
            },
            anchors: {
                ActivityMiddleBottom: {
                    docked: 'b',
                    pos: function (attr) {
                        var x = attr.x,
                            y = attr.y,
                            w = attr.width,
                            h = attr.height;

                        return {
                            x: x + w / 2,
                            y: y + h - h / 8
                        }
                    }
                }
            }
        }
    },
    propertyConfig: {
        xclass: 'YZSoft.bpa.sprite.Properties.Form.Property',
        dialog: {
            xclass: 'YZSoft.bpa.sprite.Properties.Form.Dialog',
            dlgName: RS.$('BPA_Title_FormProperty')
        },
        staticData: {
            spriteType: 'Forms',
            reportType: 'Form'
        }
    },

    updateChildText: function (sprite, attr) {
        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            left: attr.x,
            top: attr.y + attr.height * 0.2,
            width: attr.width * 0.8,
            height: attr.height * 0.72,
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

        path.moveTo(x, y + h * 0.2);
        path.lineTo(x + w * 0.1, y + h * 0.2);
        path.lineTo(x + w * 0.1, y + h * 0.1);
        path.lineTo(x + w * 0.2, y + h * 0.1);
        path.lineTo(x + w * 0.2, y);
        path.lineTo(x + w, y);
        path.lineTo(x + w, y + h * 0.7);
        path.lineTo(x + w * 0.9, y + h * 0.7);
        path.lineTo(x + w * 0.9, y + h * 0.8);
        path.lineTo(x + w * 0.8, y + h * 0.8);
        path.lineTo(x + w * 0.8, y + h * 0.9);
        path.quadraticCurveTo(x + w * 0.75 * 0.8, y + h * 0.8, x + w * 0.8 * 0.5, y + h * 0.9);
        path.quadraticCurveTo(x + w * 0.25 * 0.8, y + h, x, y + h * 0.9);
        path.closePath();

        path.moveTo(x, y + h * 0.2);
        path.lineTo(x + w * 0.8, y + h * 0.2);
        path.lineTo(x + w * 0.8, y + h * 0.9);

        path.moveTo(x + w * 0.2, y + h * 0.1);
        path.lineTo(x + w * 0.9, y + h * 0.1);
        path.lineTo(x + w * 0.9, y + h * 0.8);
    }
});
