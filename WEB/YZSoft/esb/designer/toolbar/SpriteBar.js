
Ext.define('YZSoft.esb.designer.toolbar.SpriteBar', {
    extend: 'Ext.container.Container',
    requires: [
        'YZSoft.esb.ux.ClassManager'
    ],
    scrollable: true,
    style: {
        backgroundColor: '#fff'
    },
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    initComponent: function () {
        var me = this,
            sprites = me.sprites,
            items = [];

        Ext.Object.each(sprites, function (spriteName, btnCfg) {
            if (Ext.isString(btnCfg)) {
                btnCfg = {
                    text: btnCfg
                };
            }

            Ext.merge(btnCfg, {
                sprite: {
                    xclass: YZSoft.esb.ux.ClassManager.getSpriteXClass(spriteName),
                    drag: {
                        property: {
                            name: btnCfg.text
                        }
                    }
                }
            });

            Ext.apply(btnCfg, {
                listeners: {
                    drag: function (e, sprite) {
                        me.fireEvent('dragSprite', e, sprite);
                    }
                }
            });

            items.push(btnCfg);
        });

        me.items = items;
        me.defaults = {
            xclass: 'YZSoft.esb.designer.toolbar.SpriteButton'
        };

        me.callParent();
    }
});