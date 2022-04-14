
Ext.define('YZSoft.frame.tab.Apps',{
    extend: 'Ext.container.Container',
    layout: 'border',

    constructor: function (config) {
        var me = this,
            cfg;

        Ext.Ajax.request({
            method: 'GET',
            disableCaching: true,
            url: config.dataURL,
            async: false,
            params: {
                method: 'GetModuleTree'
            },
            success: function (response) {
                var result = Ext.decode(response.responseText),
                    modules = result;

                if (result.success === false) {
                    result.errorMessage = Ext.String.htmlDecode(result.errorMessage);
                    YZSoft.alert(result.errorMessage);
                    return;
                }

                if (modules.length == 0) {
                    window.location.replace(
                        Ext.String.urlAppend(YZSoft.$url('YZSoft/core/AccessDenied/App.aspx'), Ext.Object.toQueryString({
                            startApp: YZSoft.startApp,
                            appName: me.title
                        }))
                    );
                    return;
                }

                me.tabBar = bar = Ext.create('Ext.tab.Bar', {
                    cls: 'yz-tab-bar-navigator-mainleft'
                });

                me.pnlTabBar = Ext.create('Ext.container.Container', {
                    region: 'west',
                    layout: 'fit',
                    items: [me.tabBar]
                });

                Ext.each(modules, function (module) {
                    Ext.applyIf(module, {
                        tabWrap:true
                    })
                });

                me.tab = Ext.create('YZSoft.frame.tab.Navigator', {
                    region: 'center',
                    activeTab: config.activeTab || me.activeTab || 0, //from 0
                    tabBar: me.tabBar,
                    modules: modules,
                    classicNavigatorDefaults: {
                        width: $S.navigater.width_tabnavleft
                    },
                    defaults: {
                        iconAlign: 'top'
                    },
                    tabPosition: 'left',
                    tabRotation: 0
                });

                cfg = {
                    items: [
                        me.pnlTabBar,
                        me.tab
                    ]
                };
            },
            failure: function (response) {
                YZSoft.alert(Ext.String.format(RS.$('All_LoadModuleFailed_Msg'), url, response.status == 404 ? response.statusText : (response.responseText || '')));
            }
        });

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            single: true,
            order: 'after',
            boxready: function (to, from, opt) {
                me.on({
                    activate: function () {
                        me.tab.fireEvent('activate');
                    }
                });
            }
        });
    }
});