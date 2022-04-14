Ext.define('YZSoft.bpa.sprite.BPMN.EndEvent.Sprite', {
    extend: 'YZSoft.bpa.sprite.BPMN.Sprite',
    switchable: true,
    canChangeLineStyle: false,
    inheritableStatics: {
        def: {
            defaults: {
                width: 36,
                height: 36,
                strokeStyle: '#000',
                fillStyle: '#fff',
                lineWidth: 4
            },
            triggers: {
                strokeStyle: 'canvas,children'
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
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            cx = x + w * 0.5,
            cy = y + h * 0.5,
            rx = w * 0.5,
            ry = h * 0.5;

        path.ellipse(cx, cy, rx, ry, 0, 0, Math.PI*2, false);
        path.closePath();
    },

    onSwitchClick: function (e) {
        var me = this,
            menu, panel;

        panel = Ext.create('YZSoft.bpa.sprite.BPMN.EndEvent.panel.Switch', {
            listeners: {
                scope: me,
                select: function (xclass) {
                    me.getSurface().ownerCt.changeType(me, xclass);
                }
            }
        });

        menu = Ext.create('Ext.menu.Menu', {
            cls: 'yz-menu',
            bodyBorder: false,
            bodyStyle: 'padding:0px 0px;',
            showSeparator: false,
            items: [panel]
        });
        menu.showAt(e.getXY());
        menu.focus();
    }
});
