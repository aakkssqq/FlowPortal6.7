
Ext.define('YZSoft.bpa.sprite.BPMN.StartEvent.panel.Switch', {
    extend: 'Ext.container.Container',
    sprites: [{
        xclass: 'YZSoft.bpa.sprite.BPMN.StartEvent.StartEvent',
        text: RS.$('BPA_StartEvent_StartEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.StartEvent.MessageStartEvent',
        text: RS.$('BPA_StartEvent_MessageStartEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.StartEvent.TimerStartEvent',
        text: RS.$('BPA_StartEvent_TimerStartEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.StartEvent.ConditionalStartEvent',
        text: RS.$('BPA_StartEvent_ConditionalStartEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.StartEvent.SignalStartEvent',
        text: RS.$('BPA_StartEvent_SignalStartEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.StartEvent.EscalationStartEvent',
        text: RS.$('BPA_StartEvent_EscalationStartEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.StartEvent.CompensationStartEvent',
        text: RS.$('BPA_StartEvent_CompensationStartEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.StartEvent.ErrorStartEvent',
        text: RS.$('BPA_StartEvent_ErrorStartEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.StartEvent.MultipleStartEvent',
        text: RS.$('BPA_StartEvent_MultipleStartEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.StartEvent.ParallelStartEvent',
        text: RS.$('BPA_StartEvent_ParallelStartEvent')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.StartEvent.MessageNonInturruptingEvent',
        text: RS.$('BPA_StartEvent_MessageNonInturruptingEvent'),
        config: {
            lineDash: [5, 3]
        }
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.StartEvent.TimerNonInturruptingEvent',
        text: RS.$('BPA_StartEvent_TimerNonInturruptingEvent'),
        config: {
            lineDash: [5, 3]
        }
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.StartEvent.EscalationNonInturruptingEvent',
        text: RS.$('BPA_StartEvent_EscalationNonInturruptingEvent'),
        config: {
            lineDash: [5, 3]
        }
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.StartEvent.ConditionalNonInturruptingEvent',
        text: RS.$('BPA_StartEvent_ConditionalNonInturruptingEvent'),
        config: {
            lineDash: [5, 3]
        }
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.StartEvent.SignalNonInturruptingEvent',
        text: RS.$('BPA_StartEvent_SignalNonInturruptingEvent'),
        config: {
            lineDash: [5, 3]
        }
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.StartEvent.MultipleNonInturruptingEvent',
        text: RS.$('BPA_StartEvent_MultipleNonInturruptingEvent'),
        config: {
            lineDash: [5, 3]
        }
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.StartEvent.ParallelNonInturruptingEvent',
        text: RS.$('BPA_StartEvent_ParallelNonInturruptingEvent'),
        config: {
            lineDash: [5, 3]
        }
    }],
    spriteConfigDefaults: {
        width: 19,
        height: 19,
        lineWidth: 1.3
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            sprites = config.sprites || me.sprites,
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

        me.btna = Ext.create('Ext.button.Button',{
            glyph: 0xe909
        });

        me.btnb = Ext.create('Ext.button.Button',{
            glyph: 0xe90a
        });

        var cfg = {
            items: [{
                xtype:'container',
                cls:'yz-bpa-switch-header',
                layout:{
                    type:'hbox'
                },
                defaults:{
                    enableToggle:true,
                    toggleGroup:'InterruptType',
                    ui:'default-toolbar'
                },
                items:[me.btna,me.btnb]
            },{
                xtype:'container',
                layout:{
                    type:'vbox',
                    align:'stretch'
                },
                items:items
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});