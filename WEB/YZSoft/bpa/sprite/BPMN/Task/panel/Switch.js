
Ext.define('YZSoft.bpa.sprite.BPMN.Task.panel.Switch', {
    extend: 'Ext.container.Container',
    sprites: [{
        xclass: 'YZSoft.bpa.sprite.BPMN.Task.Task',
        text: RS.$('BPA_Task_General')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.Task.SendTask',
        text: RS.$('BPA_Task_Send')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.Task.ReceiveTask',
        text: RS.$('BPA_Task_Receive')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.Task.UserTask',
        text: RS.$('BPA_Task_User')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.Task.ManualTask',
        text: RS.$('BPA_Task_Human')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.Task.BusinessRuleTask',
        text: RS.$('BPA_Task_BizRule')
    }, {
        xclass: 'YZSoft.bpa.sprite.BPMN.Task.ServiceTask',
        text: RS.$('BPA_Task_Service')
    }],
    spriteConfigDefaults: {
        width: 26,
        height: 19,
        radius: 2,
        sprites: {
            icon: {
                x: 2,
                y: 1
            }
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
                    width: 29,
                    height: 21
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