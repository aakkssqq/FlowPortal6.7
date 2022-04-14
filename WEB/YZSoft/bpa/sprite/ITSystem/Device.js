
//IT设备
Ext.define('YZSoft.bpa.sprite.ITSystem.Device', {
    extend: 'YZSoft.bpa.sprite.ITSystem.Sprite',
    gap: 3,
    inheritableStatics: {
        def: {
            defaults: {
                width: 100,
                height: 70
            }
        }
    },
    sprites: {
        rect: {
            xclass: 'YZSoft.bpa.sprite.basic.Rect',
            lineWidth: 3,
            strokeStyle:'#333333',
            fillStyle:'#c8c8c8'
        }
    },
    propertyConfig: {
        xclass: 'YZSoft.bpa.sprite.Properties.ITSystem.Property',
        dialog: {
            xclass: 'YZSoft.bpa.sprite.Properties.ITSystem.Dialog',
            dlgName: RS.$('BPA_ITSystem_Device')
        },
        staticData: {
            spriteType: 'Device',
            reportType: 'ITSystem'
        }
    },

    updateChildRect: function (sprite, attr) {
        var me = this,
            x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            x: x + attr.lineWidth * 0.5 + me.gap + sprite.attr.lineWidth * 0.5,
            y: y + attr.lineWidth * 0.5 + me.gap + sprite.attr.lineWidth * 0.5,
            width: w - attr.lineWidth - me.gap * 2 - sprite.attr.lineWidth,
            height: h - attr.lineWidth - me.gap * 2 - sprite.attr.lineWidth,
            strokeStyle: attr.strokeStyle
        });
    },

    updateChildText: function (sprite, attr) {
        var me = this;

        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            left: attr.x + me.gap + sprite.attr.lineWidth * 0.5,
            top: attr.y + me.gap + sprite.attr.lineWidth * 0.5,
            width: attr.width - me.gap * 2 - sprite.attr.lineWidth * 2,
            height: attr.height - me.gap * 2 - -sprite.attr.lineWidth * 2,
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

        path.rect(x, y, w, h);
    }
});
