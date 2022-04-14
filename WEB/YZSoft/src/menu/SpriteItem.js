/*
*/
Ext.define('YZSoft.src.menu.SpriteItem', {
    extend: 'Ext.container.Container',
    layout: {
        type: 'hbox',
        align: 'middle'
    },
    cls: 'yz-sprite-menu-item-cnt',
    overCls: 'yz-sprite-menu-item-over',
    canvas: {
        width: 21,
        height: 21
    },

    constructor: function (config) {
        var me = this,
            spriteCfg = config.sprite.config,
            btnCanvas = config.canvas = config.canvas || me.canvas,
            cfg;

        me.spriteEl = Ext.create(config.sprite.xclass, Ext.apply(spriteCfg));
        me.spriteBbox = me.spriteEl.getBBox();

        me.drawContainer = Ext.create('Ext.draw.Container', {
            border: false,
            width: btnCanvas.width,
            height: btnCanvas.height,
            bodyStyle: 'background-color:transparent;',
            sprites: [me.spriteEl]
        });

        me.spriteEl.setAttributes({
            translationX: 'translationX' in spriteCfg ? spriteCfg.translationX : Math.floor((btnCanvas.width - me.spriteBbox.width) / 2),
            translationY: 'translationY' in spriteCfg ? spriteCfg.translationY : Math.floor((btnCanvas.height - me.spriteBbox.height) / 2)
        });

        me.label = Ext.create('Ext.form.Label', {
            html: config.sprite.text,
            cls: 'yz-split-menu-item-text'
        });

        cfg = {
            items: [me.drawContainer, me.label]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            single: true,
            afterrender: function () {
                me.getEl().on({
                    scope: me,
                    click: function (e) {
                        Ext.menu.Manager.hideAll();
                        me.fireEvent('itemClick', me.sprite.xclass, me.sprite, e);
                    }
                });
            }
        });
    }
});