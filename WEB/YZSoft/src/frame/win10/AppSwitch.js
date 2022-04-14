
Ext.define('YZSoft.src.frame.win10.AppSwitch', {
    extend: 'Ext.menu.Menu',
    bodyBorder: false,
    showSeparator: false,
    shadow: false,
    cls: 'yz-menu-apps',
    minWidth:0,
    statics: {
        wins: {}
    },

    constructor: function (config) {
        var me = this,
            url = config.url,
            cfg;

        me.cnt = Ext.create('Ext.container.Container', {
            layout: {
                type: 'table',
                columns: 4
            },
            minHeight: 109,
            defaults: {
                xtype: 'button',
                iconAlign: 'top',
                cls: 'yz-flat yz-btn-switchapp-app',
                style: 'background-color:#33b3d9'
            },
            items: []
        });

        cfg = {
            items: [
                me.cnt
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        Ext.Ajax.request({
            method: 'GET',
            disableCaching: true,
            url: url,
            params: {
                method: 'GetModuleTree'
            },
            success: function (response) {
                var result = Ext.decode(response.responseText),
                    modules = result,
                    items = [];

                Ext.each(modules, function (module) {
                    module.icon = YZSoft.$url(module.icon);
                    module.scope = me;
                    module.handler = 'onAppClick';

                    items.push(module);
                });

                me.cnt.add(items);
            },
            failure: function (response) {
                YZSoft.alert(Ext.String.format(RS.$('All_LoadModuleFailed_Msg'), url, response.status == 404 ? response.statusText : (response.responseText || '')));
            }
        });
    },

    onAppClick: function (btn) {
        var me = this,
            startApp = btn.startApp;

        Ext.menu.Manager.hideAll();

        Ext.require('YZSoft.src.ux.AppSwitch', function () {
            YZSoft.src.ux.AppSwitch.openApp(startApp);
        });
    }
});