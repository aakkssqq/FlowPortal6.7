
YZSoft.modulesContainerSelector = '[cls~=yz-identity-modulescontainer]';
YZSoft.moduleContainerSelector = '[cls~=yz-identity-modulecontainer]';

Ext.define('YZSoft.bpa.MainPanel', {
    extend: 'Ext.container.Container',

    constructor: function (config) {
        var me = this,
            cfg,
            menuItems = [];

        Ext.each(config.modules, function (module) {
            var menuItem = Ext.create('Ext.button.Button', Ext.apply({
                ui: 'toolbar',
                cls: 'bpa-btn-mainmenu',
                toggleGroup: 'menu',
                allowDepress: false
            }, module));

            menuItems.push(menuItem);

            menuItem.on({
                scope: me,
                toggle: function (btn, pressed, eOpts) {
                    if (pressed)
                        me.showModule(btn);
                },
                clickOnPressedState: function (btn) {
                    var pnlModule = btn.pnlModule;
                    if (pnlModule) {
                        me.pnlModule.setActiveModule(pnlModule);
                        pnlModule.fireEvent('clickMainMenuOnPressedState', btn);
                    }
                }
            });
        });

        me.pnlMenu = Ext.create('Ext.container.Container', {
            region: 'west',
            width: 80,
            cls: 'bpa-panel-navigate',
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'start'
            },
            items: menuItems
        });

        me.pnlModule = Ext.create('YZSoft.src.container.ModuleContainer', {
            region: 'center',
            layout: 'card',
            cls: 'yz-identity-modulescontainer'
        });

        cfg = {
            layout: 'border',
            items: [me.pnlMenu, me.pnlModule]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        menuItems[2].toggle(true, false);
    },

    showModule: function (btn) {
        var me = this,
            cfg = btn.module;

        Ext.apply(cfg, {
            button: btn
        });

        btn.pnlModule = me.pnlModule.showModule({
            xclass: cfg.xclass,
            config: cfg,
            match: function (item) {
                return item.button === btn;
            }
        });
    }
});