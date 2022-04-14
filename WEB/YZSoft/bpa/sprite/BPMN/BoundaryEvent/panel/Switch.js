
Ext.define('YZSoft.bpa.sprite.BPMN.BoundaryEvent.panel.Switch', {
    extend: 'Ext.container.Container',
    sprites: [{
        xclass: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.BoundaryEvent',
        text: RS.$('BPA_Event_Boundary')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.MessageBoundaryInturruptingEvent',
        text: Ext.String.format('{0}({1})',
            RS.$('BPA_Event_MessageBoundary'),
            RS.$('BPA_Inturrupting'))
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.TimerBoundaryInturruptingEvent',
        text: Ext.String.format('{0}({1})',
            RS.$('BPA_Event_TimerBoundary'),
            RS.$('BPA_Inturrupting'))
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.EscalationBoundaryInturruptingEvent',
        text: Ext.String.format('{0}({1})',
            RS.$('BPA_Event_EscalationBoundary'),
            RS.$('BPA_Inturrupting'))
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.ConditionalBoundaryInturruptingEvent',
        text: Ext.String.format('{0}({1})',
            RS.$('BPA_Event_ConditionalBoundary'),
            RS.$('BPA_Inturrupting'))
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.SignalBoundaryInturruptingEvent',
        text: Ext.String.format('{0}({1})',
            RS.$('BPA_Event_SignalBoundary'),
            RS.$('BPA_Inturrupting'))
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.MultipleBoundaryInturruptingEvent',
        text: Ext.String.format('{0}({1})',
            RS.$('BPA_Event_MultipleBoundary'),
            RS.$('BPA_Inturrupting'))
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.ParallelBoundaryInturruptingEvent',
        text: Ext.String.format('{0}({1})',
            RS.$('BPA_Event_ParallelBoundary'),
            RS.$('BPA_Inturrupting'))
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.CompensationBoundaryInturruptingEvent',
        text: Ext.String.format('{0}({1})',
            RS.$('BPA_Event_CompensationBoundary'),
            RS.$('BPA_Inturrupting'))
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.ErrorBoundaryInturruptingEvent',
        text: Ext.String.format('{0}({1})',
            RS.$('BPA_Event_ErrorBoundary'),
            RS.$('BPA_Inturrupting'))
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.CancelBoundaryInturruptingEvent',
        text: Ext.String.format('{0}({1})',
            RS.$('BPA_Event_CancelBoundary'),
            RS.$('BPA_Inturrupting'))
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.BoundaryNonInturruptingEvent',
        text: Ext.String.format('{0}({1})',
            RS.$('BPA_Event_Boundary'),
            RS.$('BPA_NonInturrupting')),
        config: {
            lineDash: [5, 3]
        }
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.MessageBoundaryNonInturruptingEvent',
        text: Ext.String.format('{0}({1})',
            RS.$('BPA_Event_MessageBoundary'),
            RS.$('BPA_NonInturrupting')),
        config: {
            lineDash: [5, 3]
        }
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.TimerBoundaryNonInturruptingEvent',
        text: Ext.String.format('{0}({1})',
            RS.$('BPA_Event_TimerBoundary'),
            RS.$('BPA_NonInturrupting')),
        config: {
            lineDash: [5, 3]
        }
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.EscalationBoundaryNonInturruptingEvent',
        text: Ext.String.format('{0}({1})',
            RS.$('BPA_Event_EscalationBoundary'),
            RS.$('BPA_NonInturrupting')),
        config: {
            lineDash: [5, 3]
        }
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.ConditionalBoundaryNonInturruptingEvent',
        text: Ext.String.format('{0}({1})',
            RS.$('BPA_Event_ConditionalBoundary'),
            RS.$('BPA_NonInturrupting')),
        config: {
            lineDash: [5, 3]
        }
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.SignalBoundaryNonInturruptingEvent',
        text: Ext.String.format('{0}({1})',
            RS.$('BPA_Event_SignalBoundary'),
            RS.$('BPA_NonInturrupting')),
        config: {
            lineDash: [5, 3]
        }
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.MultipleBoundaryNonInturruptingEvent',
        text: Ext.String.format('{0}({1})',
            RS.$('BPA_Event_MultipleBoundary'),
            RS.$('BPA_NonInturrupting')),
        config: {
            lineDash: [5, 3]
        }
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.ParallelBoundaryNonInturruptingEvent',
        text: Ext.String.format('{0}({1})',
            RS.$('BPA_Event_ParallelBoundary'),
            RS.$('BPA_NonInturrupting')),
        config: {
            lineDash: [5, 3]
        }
    }],
    spriteConfigDefaults: {
        width: 19,
        height: 19,
        lineWidth: 1.3,
        sprites: {
            ellipse: {
                gap: 2
            }
        }
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

            spriteItem = Ext.create('YZSoft.src.menu.SpriteItem', {sprite: sprite});
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