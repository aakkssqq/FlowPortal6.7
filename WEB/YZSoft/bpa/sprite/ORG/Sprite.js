Ext.define('YZSoft.bpa.sprite.ORG.Sprite', {
    extend: 'YZSoft.bpa.sprite.Sprite',
    inheritableStatics: {
        def: {
            processors: {
            },
            defaults: {
                strokeStyle: '#dc5712',
                lineWidth: 2,
                fillStyle: {
                    type: 'linear',
                    degrees: 10,
                    stops: [{
                        offset: 0,
                        color: '#f5ecba'
                    }, {
                        offset: 1,
                        color: '#f4d000'
                    }]
                }
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
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            left: x,
            top: y,
            width: w,
            height: h,
            paddingtop: (attr.lineWidth * 0.5 || 0) + 2,
            paddingleft: (attr.lineWidth * 0.5 || 0) + 2,
            paddingright: (attr.lineWidth * 0.5 || 0) + 2,
            paddingbottom: (attr.lineWidth * 0.5 || 0) + 2
        });
    }
});