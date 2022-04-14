Ext.define('YZSoft.bpa.sprite.EVC.Sprite', {
    extend: 'YZSoft.bpa.sprite.Sprite',
    inheritableStatics: {
        def: {
            processors: {
                radius: 'number'
            },
            defaults: {
                width: 150,
                height: 70,
                strokeStyle: '#000',
                fillStyle: '#fff',
                lineWidth: 2
            },
            triggers: {
                radius: 'path'
            }
        }
    },

    constructor: function (config) {
        var me = this;

        me.sprites = Ext.apply({
            text: {
                xclass: 'YZSoft.src.flowchart.sprite.BoxText',
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
        }, me.sprites);

        me.callParent(arguments);
    },

    updateChildText: function (sprite, attr) {
        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            left: attr.x,
            top: attr.y,
            width: attr.width,
            height: attr.height,
            paddingtop: (attr.lineWidth * 0.5 || 0) + 2,
            paddingleft: (attr.lineWidth * 0.5 || 0) + 2,
            paddingright: (attr.lineWidth * 0.5 || 0) + 2,
            paddingbottom: (attr.lineWidth * 0.5 || 0) + 2
        });
    }
});