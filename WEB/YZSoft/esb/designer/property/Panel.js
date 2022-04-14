
/*
designer:null
*/

Ext.define('YZSoft.esb.designer.property.Panel', {
    extend: 'YZSoft.src.container.ModuleContainer',
    emptyText: RS.$('ESB_SpritePropertyPage_EmptyText'),

    initComponent: function () {
        var me = this;

        me.on({
            scope: me,
            selectionchange: 'onSelectionChange'
        });

        me.callParent();
    },

    onSelectionChange: function (drawContainer,sprites) {
        if (sprites.length == 0)
            return;

        var me = this,
            sprite = sprites[0],
            propertyXClass = me.getPropertyXClass(sprite),
            showModuleCfg,
            panel;

        Ext.syncRequire(propertyXClass);
        if (Ext.ClassManager.get(propertyXClass)) {
            showModuleCfg = {
                xclass: propertyXClass,
                config: {
                    designer: me.designer,
                    sprite: sprite,
                    scrollable: 'y'
                },
                match: function (item) {
                    return false;
                    return item.sprite === sprite;
                }
            }
        }
        else {
            showModuleCfg = {
                xclass: 'YZSoft.esb.designer.property.Error',
                config: {
                    errorMessage: Ext.String.format(RS.$('Designer_PropertyClassNotExist'), propertyXClass)
                },
                match: function (item) {
                    return false;
                }
            }
        }

        panel = me.showModule(showModuleCfg);

        Ext.destroy(me.spriteListeners);

        me.spriteListeners = sprite.on({
            destroyable: true,
            destroy: function () {
                Ext.defer(function () {
                    panel.destroy();
                }, 1);
            }
        });
    },

    getPropertyXClass: function (sprite) {
        var nameSpace = sprite.$className.split('.');

        nameSpace[nameSpace.length - 1] = 'Property';
        return nameSpace.join('.');
    }
});