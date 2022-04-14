
Ext.define('YZSoft.bpa.sprite.BPMN.Gateway.panel.Switch', {
    extend: 'Ext.container.Container',
    sprites: [{
        xclass: 'YZSoft.bpa.sprite.BPMN.Gateway.Gateway',
        text: RS.$('BPA_Sprite_Gateway')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.Gateway.ExclusiveGateway',
        text: RS.$('BPA_Gateway_Exclusive')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.Gateway.InclusiveGateway',
        text: RS.$('BPA_Gateway_Inclusive'),
        config: {
            sprites: {
                ellipse: {
                    lineWidth: 1.2
                }
            }
        }
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.Gateway.ComplexGateway',
        text: RS.$('BPA_Gateway_Complex')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.Gateway.EventBasedGateway',
        text: RS.$('BPA_Gateway_EventBased'),
        config: {
            sprites: {
                ellipse1: {
                    lineWidth: 1
                },
                ellipse2: {
                    lineWidth: 1
                },
                multiple: {
                    lineWidth: 1
                }
            }
        }
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.Gateway.EventBasedStartGateway',
        text: RS.$('BPA_Gateway_EventBasedStart'),
        config: {
            sprites: {
                ellipse: {
                    lineWidth: 1.2
                },
                multiple: {
                    lineWidth: 1.2
                }
            }
        }
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.Gateway.ParallelGateway',
        text: RS.$('BPA_Gateway_Parallel')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.Gateway.ParallelEBGateway',
        text: RS.$('BPA_Gateway_ParallelEB'),
        config: {
            sprites: {
                ellipse: {
                    lineWidth: 1.2
                },
                parallel: {
                    lineWidth: 1.2
                }
            }
        }
    }],
    spriteConfigDefaults: {
        width: 23,
        height: 23,
        sprites: {
        },
        lineWidth: 1
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

            spriteItem = Ext.create('YZSoft.src.menu.SpriteItem', {
                canvas: {
                    width: 25,
                    height: 25
                },
                sprite: sprite
            });

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
                    ui: 'default-toolbar',
                    padding:4
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