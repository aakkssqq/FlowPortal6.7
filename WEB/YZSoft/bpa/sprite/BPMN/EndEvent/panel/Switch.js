
Ext.define('YZSoft.bpa.sprite.BPMN.EndEvent.panel.Switch', {
    extend: 'Ext.container.Container',
    sprites: [{
        xclass: 'YZSoft.bpa.sprite.BPMN.EndEvent.EndEvent',
        text: RS.$('BPA_Sprite_EndEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.EndEvent.MessageEndEvent',
        text: RS.$('BPA_EndEvent_Message')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.EndEvent.EscalatEndEvent',
        text: RS.$('BPA_EndEvent_Escalat')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.EndEvent.CancelEndEvent',
        text: RS.$('BPA_EndEvent_Cancel')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.EndEvent.ErrorEndEvent',
        text: RS.$('BPA_EndEvent_Error')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.EndEvent.CompensationEndEvent',
        text: RS.$('BPA_EndEvent_Compensation')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.EndEvent.SignalEndEvent',
        text: RS.$('BPA_EndEvent_Signal')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.EndEvent.MultipleEndEvent',
        text: RS.$('BPA_EndEvent_Multiple')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.EndEvent.Terminate',
        text: RS.$('BPA_EndEvent_Terminate')
    }],
    spriteConfigDefaults: {
        width: 19,
        height: 19,
        lineWidth: 1.3
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            sprites = config.sprites || me.sprites;
        spriteConfigDefaults = config.spriteConfigDefaults || me.spriteConfigDefaults;
        items = [];

        Ext.each(sprites, function (sprite) {
            var spriteConfig, spriteItem;

            spriteConfig = Ext.clone(spriteConfigDefaults);
            sprite.config = Ext.apply(spriteConfig, sprite.config);

            spriteItem = Ext.create('YZSoft.src.menu.SpriteItem', { sprite: sprite });
            spriteItem.on({
                itemClick: function (xclass, sprite, e) {
                    me.fireEvent('select', xclass, sprite, e);
                }
            });

            items.push(spriteItem);
        });

        me.btna = Ext.create('Ext.button.Button', {
            glyph: 0xe909
        });

        me.btnb = Ext.create('Ext.button.Button', {
            glyph: 0xe90a
        });

        var cfg = {
            items: [{
                xtype: 'container',
                cls: 'yz-bpa-switch-header',
                layout: {
                    type: 'hbox'
                },
                defaults: {
                    enableToggle: true,
                    toggleGroup: 'InterruptType',
                    ui: 'default-toolbar'
                },
                items: [me.btna, me.btnb]
            }, {
                xtype: 'container',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: items
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});