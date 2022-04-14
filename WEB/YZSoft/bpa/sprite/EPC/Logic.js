Ext.define('YZSoft.bpa.sprite.EPC.Logic', {
    extend: 'YZSoft.bpa.sprite.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 36,
                height: 36,
                fillStyle: '#eee',
                strokeStyle: '#000',
                lineWidth: 2
            }
        }
    },

    constructor: function (config) {
        var me = this;

        me.sprites = Ext.apply({
            text: {
                xclass: 'YZSoft.src.flowchart.sprite.Text',
                text: '',
                textAlign: 'center',
                textBaseline: 'top',
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
            x: Math.floor(attr.x + attr.width / 2),
            y: Math.floor(attr.y + attr.height + 8)
        });
    }
});