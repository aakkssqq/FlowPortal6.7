
Ext.define('YZSoft.bpa.sprite.BPMN.IntermediateEvent.panel.Switch', {
    extend: 'Ext.container.Container',
    sprites: [{
        xclass: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.IntermediateEvent',
        text: RS.$('BPA_IntermediateEvent_IntermediateEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.MessageIntermediateCatchEvent',
        text: RS.$('BPA_IntermediateEvent_MessageIntermediateCatchEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.TimerIntermediateCatchEvent',
        text: RS.$('BPA_IntermediateEvent_TimerIntermediateCatchEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.EscalationIntermediateCatchEvent',
        text: RS.$('BPA_IntermediateEvent_EscalationIntermediateCatchEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.ConditionalIntermediateCatchEvent',
        text: RS.$('BPA_IntermediateEvent_ConditionalIntermediateCatchEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.LinkIntermediateCatchEvent',
        text: RS.$('BPA_IntermediateEvent_LinkIntermediateCatchEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.SignalIntermediateCatchEvent',
        text: RS.$('BPA_IntermediateEvent_SignalIntermediateCatchEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.MultipleIntermediateCatchEvent',
        text: RS.$('BPA_IntermediateEvent_MultipleIntermediateCatchEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.ParallelIntermediateCatchEvent',
        text: RS.$('BPA_IntermediateEvent_ParallelIntermediateCatchEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.CompensationIntermediateCatchEvent',
        text: RS.$('BPA_IntermediateEvent_CompensationIntermediateCatchEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.ErrorIntermediateCatchEvent',
        text: RS.$('BPA_IntermediateEvent_ErrorIntermediateCatchEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.CancelIntermediateCatchEvent',
        text: RS.$('BPA_IntermediateEvent_CancelIntermediateCatchEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.MessageIntermediateThrowingEvent',
        text: RS.$('BPA_IntermediateEvent_MessageIntermediateThrowingEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.EscalationIntermediateThrowingEvent',
        text: RS.$('BPA_IntermediateEvent_EscalationIntermediateThrowingEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.LinkIntermediateThrowingEvent',
        text: RS.$('BPA_IntermediateEvent_LinkIntermediateThrowingEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.CompensationIntermediateThrowingEvent',
        text: RS.$('BPA_IntermediateEvent_CompensationIntermediateThrowingEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.SignalIntermediateThrowingEvent',
        text: RS.$('BPA_IntermediateEvent_SignalIntermediateThrowingEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.MultipleIntermediateThrowingEvent',
        text: RS.$('BPA_IntermediateEvent_MultipleIntermediateThrowingEvent')
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