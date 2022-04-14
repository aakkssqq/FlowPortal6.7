/*
*/
Ext.define('YZSoft.src.flowchart.toolbar.SpriteButton', {
    extend: 'Ext.container.Container',
    cls: 'yz-tbar-item-sprite',
    overCls: 'yz-btn-over',
    layout: {
        type: 'vbox',
        align: 'middle'
    },
    border: false,
    canvas:{
        width:36,
        height:36
    },

    constructor: function (config) {
        var me = this,
            btnCanvas = config.canvas = config.canvas || me.canvas,
            spriteBbox, cfg;

        me.spriteEl = Ext.create(config.sprite.xclass, Ext.apply(config.sprite.config));
        spriteBbox = me.spriteEl.getBBox();

        me.drawContainer = Ext.create('Ext.draw.Container', {
            border: false,
            width: btnCanvas.width,
            height: btnCanvas.height,
            bodyStyle: 'background-color:transparent;',
            sprites: [me.spriteEl]
        });

        me.spriteEl.setAttributes({
            translationX: Math.floor((btnCanvas.width - spriteBbox.width)/2),
            translationY: Math.floor((btnCanvas.height - spriteBbox.height)/2)
        });

        me.drawContainerWrap = Ext.create('Ext.container.Container', {
            layout: 'fit',
            border: true,
            cls: 'drawwrap',
            items: [me.drawContainer]
        });

        me.label = Ext.create('Ext.form.Label', {
            html: config.sprite.text,
            cls: 'text',
            padding: '2 0 0 0'
        });

        cfg = {
            items: [me.drawContainerWrap, me.label]
        };

        Ext.apply(cfg, config);

        me.callParent([cfg]);

        me.on({
            single:true,
            afterrender: function () {
                me.getEl().on({
                    scope:me,
                    mousedown: function (e) {
                        e.stopEvent();

                        var cfg = Ext.apply(Ext.clone(me.sprite.config || {}), me.sprite.drag),
                            sprite = Ext.create(me.sprite.xclass, cfg);

                        me.fireEvent('drag', e, sprite);
                    },
                    mouseup: function (e) {
                    }
                });
            }
        });
    }
});