Ext.define('YZSoft.bpa.src.toolbar.items.Account', {
    extend: 'Ext.button.Button',
    height: 63,

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            text: config.text || userInfo.DisplayName || userInfo.Account,
            menu: Ext.apply({
                cls: 'bpa-menu-signinuser',
                shadow: false,
                bodyPadding: '3 0',
                defaults: {
                    padding: '3 16'
                },
                items: [{
                    iconCls: 'yz-glyph yz-glyph-logout',
                    text: RS.$('All_Exit'),
                    handler: function () {
                        YZSoft.logout();
                    }
                }]
            }, config.menu)
        };

        delete config.menu;

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});