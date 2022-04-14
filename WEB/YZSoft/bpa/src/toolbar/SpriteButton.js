/*
*/
Ext.define('YZSoft.bpa.src.toolbar.SpriteButton', {
    extend: 'Ext.container.Container',
    requires: [
        'Ext.tip.QuickTipManager'
    ],
    cls: 'yz-tbar-item-sprite',
    overCls: 'yz-btn-over',
    layout: {
        type: 'vbox',
        align: 'middle'
    },
    border: false,
    showLabel: RS.$('BPA_SpriteButton_ShowLabel') == '1',
    canvas: {
        width: 36,
        height: 36
    },

    constructor: function (config) {
        var me = this,
            spriteCfg = config.sprite.config,
            btnCanvas = config.canvas = config.canvas || me.canvas,
            cfg;

        me.spriteEl = Ext.create(config.sprite.xclass, Ext.apply(spriteCfg));
        me.spriteBbox = me.spriteEl.getBBox();

        me.tool = Ext.create('Ext.draw.Container', {
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

        me.cnt = Ext.create('Ext.container.Container', {
            layout: 'fit',
            border: true,
            cls: 'drawwrap',
            items: [me.tool]
        });

        me.label = Ext.create('Ext.form.Label', {
            html: config.sprite.text,
            cls: 'text',
            hidden: !me.showLabel,
            padding: '2 0 0 0',
            width: '100%'
        });

        cfg = {
            items: [me.cnt, me.label]
        };

        Ext.apply(cfg, config);

        me.callParent([cfg]);

        me.on({
            afterrender: function () {
                if (!me.showLabel) {
                    Ext.tip.QuickTipManager.register({
                        target: me.getId(),
                        text: me.sprite.text
                    });
                }

                me.getEl().on({
                    scope: me,
                    mousedown: function (e) {
                        e.stopEvent();

                        var cfg = Ext.apply({}, config.sprite.drag),
                            sprite = Ext.create(me.sprite.xclass, cfg);

                        me.fireEvent('drag', e, sprite);
                    }
                });
            },
            destroy: function (me) {
                Ext.tip.QuickTipManager.unregister(me.getId());
            }
        });
    }
});