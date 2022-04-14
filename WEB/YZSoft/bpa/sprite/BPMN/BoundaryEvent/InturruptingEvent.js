Ext.define('YZSoft.bpa.sprite.BPMN.BoundaryEvent.InturruptingEvent', {
    extend: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.Sprite',
    inheritableStatics: {
        def: {
            constants: {
                lineDash: []
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
            },
            ellipse: {
                xclass: 'Ext.draw.sprite.Ellipse',
                fillStyle: 'none',
                lineWidth: 1,
                gap: 3
            }
        }, me.sprites);

        me.callParent(arguments);
    }
});
