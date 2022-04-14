
//云服务
Ext.define('YZSoft.bpa.sprite.ITSystem.CloudServer', {
    extend: 'YZSoft.bpa.sprite.ITSystem.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 100,
                height: 60,
                lineWidth:4
            }
        }
    },
    propertyConfig: {
        xclass: 'YZSoft.bpa.sprite.Properties.ITSystem.Property',
        dialog: {
            xclass: 'YZSoft.bpa.sprite.Properties.ITSystem.Dialog',
            dlgName: RS.$('BPA_ITSystem_CloudServer')
        },
        staticData: {
            spriteType: 'CloudServer',
            reportType: 'ITSystem'
        }
    },

    updateChildText: function (sprite, attr) {
        var me = this,
            x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            left: x + w * 0.17,
            top: y + h * 0.2,
            width: w * 0.65,
            height: h * 0.75,
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

        path.moveTo(x + 0.17 * w, y + h);
        path.bezierCurveTo(x - 0.05 * w, y + h, x - 0.05 * w, y + 0.47 * h, x + 0.17 * w, y + 0.47 * h);
        path.bezierCurveTo(x + 0.13 * w, y + 0.28 * h, x + 0.29 * w, y + 0.156 * h, x + 0.346 * w, y + 0.344 * h);
        path.bezierCurveTo(x + 0.39 * w, y - 0.1 * h, x + 0.85 * w, y - 0.1 * h, x + 0.8 * w, y + 0.5 * h);
        path.bezierCurveTo(x + 1.05 * w, y + 0.5 * h, x + 1.05 * w, y + h, x + 0.8 * w, y + h);
        path.closePath();
    }
});
