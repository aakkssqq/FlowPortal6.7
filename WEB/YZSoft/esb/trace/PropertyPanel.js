
/*
designer:null
*/

Ext.define('YZSoft.esb.trace.PropertyPanel', {
    extend: 'YZSoft.src.container.ModuleContainer',
    emptyText: RS.$('All_ESBTrace_PropertyPage_EmptyText'),

    initComponent: function () {
        var me = this;

        me.on({
            scope: me,
            selectionchange: 'onSelectionChange'
        });

        me.callParent();
    },

    onSelectionChange: function (drawContainer, sprites) {
        var me = this,
            sprite = sprites[0],
            propertyXClass = me.getPropertyXClass(sprite),
            showModuleCfg,
            panel;

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

        panel = me.showModule(showModuleCfg);

        Ext.destroy(me.spriteListeners);

        if (sprite) {
            me.spriteListeners = sprite.on({
                destroyable: true,
                destroy: function () {
                    Ext.defer(function () {
                        panel.destroy();
                    }, 1);
                }
            });
        }
    },

    getPropertyXClass: function (sprite) {
        var xclass;

        if (!sprite)
            xclass = 'YZSoft.esb.trace.property.Task';
        else if (sprite.isListener)
            xclass = 'YZSoft.esb.trace.property.Listener';
        else if (sprite.isResponse)
            xclass = 'YZSoft.esb.trace.property.Response';
        else
            xclass = 'YZSoft.esb.trace.property.Action';

        return xclass;
    }
});