
Ext.define('YZSoft.esb.designer.toolbar.SpriteButton', {
    extend: 'Ext.container.Container',
    cls: 'yz-esb-sprite-item',
    overCls: 'yz-btn-over',
    layout: {
        type: 'hbox',
        align: 'middle'
    },
    canvas: {
        width: 36,
        height: 36
    },

    initComponent: function () {
        var me = this,
            spriteCfg = me.sprite.config || {},
            canvas = me.canvas,
            spriteBbox;

        me.spriteEl = Ext.create(me.sprite.xclass, Ext.apply({
            width: 26,
            height: 26,
            sprites: {
                icon: {
                    width: 16,
                    height: 16
                }
            }
        }, spriteCfg));

        spriteBbox = me.spriteEl.getBBox();

        me.drawContainer = Ext.create('Ext.draw.Container', {
            border: false,
            width: canvas.width,
            height: canvas.height,
            bodyStyle: 'background-color:transparent;',
            sprites: [me.spriteEl]
        });

        me.spriteEl.setAttributes({
            translationX: 'translationX' in spriteCfg ? spriteCfg.translationX : Math.floor((canvas.width - spriteBbox.width) / 2),
            translationY: 'translationY' in spriteCfg ? spriteCfg.translationY : Math.floor((canvas.height - spriteBbox.height) / 2)
        });

        me.drawContainerWrap = Ext.create('Ext.container.Container', {
            layout: 'fit',
            cls: 'drawwrap',
            items: [me.drawContainer]
        });

        me.label = Ext.create('Ext.form.Label', {
            html: me.text,
            cls: 'text',
            margin:'0 0 0 1'
        });

        me.items = [
            me.drawContainerWrap,
            me.label
        ];

        me.callParent();

        me.on({
            single: true,
            afterrender: function () {
                me.getEl().on({
                    scope: me,
                    mousedown: function (e) {
                        e.stopEvent();

                        var cfg = Ext.apply({}, me.sprite.drag),
                            sprite = Ext.create(me.sprite.xclass, cfg);

                        me.fireEvent('drag', e, sprite);
                    }
                });
            }
        });
    }
});