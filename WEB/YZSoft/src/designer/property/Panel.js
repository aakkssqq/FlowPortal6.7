
Ext.define('YZSoft.src.designer.property.Panel', {
    extend: 'YZSoft.src.container.ModuleContainer',

    initComponent: function () {
        var me = this;

        me.on({
            scope: me,
            partselectionchange: 'onPartSelectionChange'
        });

        me.callParent();
    },

    onPartSelectionChange: function (part, innerComponent, oldprat, oleinnerComponent) {
        var me = this,
            tag = innerComponent || part.getComp(),
            designerXClass = me.getDesignerXClass(tag),
            showModuleCfg,
            panel;

        Ext.syncRequire(designerXClass);
        if (Ext.ClassManager.get(designerXClass)) {
            showModuleCfg = {
                xclass: designerXClass,
                config: {
                    part: part,
                    tag: tag,
                    scrollable: 'y'
                },
                match: function (item) {
                    return item.tag === tag;
                }
            }
        }
        else {
            showModuleCfg = {
                xclass: 'YZSoft.src.designer.property.Error',
                config: {
                    errorMessage: Ext.String.format(RS.$('Designer_PropertyClassNotExist'), designerXClass)
                },
                match: function (item) {
                    return false;
                }
            }
        }

        panel = me.showModule(showModuleCfg);

        Ext.destroy(me.partListeners);
        Ext.destroy(me.innerCompListeners);

        if (part) {
            me.partListeners = part.on({
                destroyable: true,
                destroy: function () {
                    Ext.defer(function () {
                        panel.destroy();
                    }, 1);
                }
            });
        }

        if (innerComponent) {
            me.innerCompListeners = innerComponent.on({
                destroyable: true,
                destroy: function () {
                    Ext.defer(function () {
                        panel.destroy();
                    }, 1);
                }
            });
        }
    },

    getDesignerXClass: function (component) {
        return 'YZSoft.designer.' + component.$className;
    }
});