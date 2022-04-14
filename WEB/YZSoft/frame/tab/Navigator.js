
/*
tab形式的导航，如：网站主菜单
modules,
classicNavigatorDefaults
*/
Ext.define('YZSoft.frame.tab.Navigator', {
    extend: 'YZSoft.frame.tab.Base',
    requires: [
        'Ext.plugin.LazyItems'
    ],

    constructor: function (config) {
        var me = this,
            items = [],
            cfg;

        Ext.each(config.modules, function (module) {
            var item, moduleCfg, moduleContainerCfg;

            if (module.ment) { //维护中的模块
                item = Ext.create('YZSoft.src.panel.MaintPanel', {
                    title: module.title,
                    message: module.ment,
                    url: module.url
                });
            }
            else {
                moduleCfg = Ext.apply({
                    xclass: module.xclass || 'YZSoft.frame.app.Classic'
                }, module);
                delete moduleCfg.id;

                moduleCfg.classicNavigatorDefaults = config && config.classicNavigatorDefaults;          

                moduleContainerCfg = {
                    xclass: 'YZSoft.frame.module.Container',
                    tabWrap: module.tabWrap,
                    items: [moduleCfg],
                    goto: function (moduleids, callback, scope) {
                        var defaultModule = this.items.items[0];

                        this.setActiveItem(defaultModule);
                        defaultModule.goto && defaultModule.goto(moduleids, callback, scope);
                    },
                    listeners: {
                        togglemenu: function () {
                            var pnl = this.getActiveItem();
                            pnl && pnl.fireEvent('togglemenu');
                        }
                    }
                };

                item = Ext.apply({
                }, module);
                item.itemId = module.id;
                delete item.id;

                item = Ext.apply(item, {
                    xclass: 'Ext.container.Container',
                    layout: 'fit',
                    goto: function (moduleids, callback, scope) {
                        var moduleContainer = this.items.items[0];
                        moduleContainer && moduleContainer.goto && moduleContainer.goto(moduleids, callback, scope);
                    },
                    listeners: {
                        togglemenu: function () {
                            var lazyPanel = this.items.items[0];

                            lazyPanel.fireEvent('togglemenu');
                        },
                        activate: function () {
                            if (this.yz_actived) {
                                this.items.items[0].fireEvent('activate');
                            }
                            this.yz_actived = true;
                        }
                    },
                    plugins: {
                        lazyitems: {
                            items: [moduleContainerCfg]
                        }
                    }
                });
            }

            items.push(item);
        });

        cfg = {
            items: items
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    goto: function (moduleids, callback, scope) {
        var me = this,
            mainTab = YZSoft.mainTab,
            moduleids = Ext.Array.clone(moduleids),
            tabid = Ext.Array.splice(moduleids, 0, 1)[0],
            activeModule;

        if (tabid) {
            activeModule = me.getComponent(tabid);

            if (!activeModule) {
                Ext.Logger.warn(Ext.String.format('Invalid module id:{0}', tabid));
                return;
            }

            if (activeModule.navigator)
                activeModule.navigator.ignoreActiveNode = true;

            me.setActiveTab(activeModule);

            if (activeModule.navigator)
                delete activeModule.navigator.ignoreActiveNode;

            if (moduleids.length)
                activeModule && activeModule.goto && activeModule.goto(moduleids, callback, scope);
        }
    }
});