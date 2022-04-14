
//数据库服务
Ext.define('YZSoft.bpa.sprite.ITSystem.Database', {
    extend: 'YZSoft.bpa.sprite.ITSystem.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 100,
                height: 70
            }
        }
    },
    propertyConfig: {
        xclass: 'YZSoft.bpa.sprite.Properties.ITSystem.Property',
        dialog: {
            xclass: 'YZSoft.bpa.sprite.Properties.ITSystem.Dialog',
            dlgName: RS.$('BPA_Database')
        },
        staticData: {
            spriteType: 'Database',
            reportType: 'ITSystem'
        }
    },

    updateChildText: function (sprite, attr) {
        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            left: attr.x,
            top: attr.y + attr.height * 0.14,
            width: attr.width,
            height: attr.height - attr.height * 0.14,
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

        path.moveTo(x, y + h * 0.14);
        path.bezierCurveTo(x, y + -h * 0.04, x + w, y + -h * 0.04, x + w, y + h * 0.14);
        path.lineTo(x + w, y + h * 0.86);
        path.bezierCurveTo(x + w, y + h * 1.04, x, y + h * 1.04, x, y + h * 0.86);
        path.closePath();

        path.moveTo(x + w, y + h * 0.14);
        path.bezierCurveTo(x + w, y + h * 0.3, x, y + h * 0.3, x, y + h * 0.14);
        path.bezierCurveTo(x, y - h * 0.04, x + w, y - h * 0.04, x + w, y + h * 0.14);
        path.closePath();
    }
});
