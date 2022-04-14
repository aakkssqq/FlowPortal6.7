
Ext.define('YZSoft.app.formservice.ModulePanel', {
    extend: 'YZSoft.bpm.src.zone.AbstractModule',

    getFuncPnlXClass: function (rec) {
        return 'YZSoft.app.formservice.Panel';
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.navigatorPanel = Ext.create('YZSoft.app.formservice.Navigator', Ext.apply({
            region: 'west',
            title: config.title
        }, config.navigator));

        me.moduleContainer = Ext.create('YZSoft.src.container.ModuleContainer', {
            region: 'center'
        });

        cfg = {
            layout: 'border',
            items: [me.navigatorPanel, me.moduleContainer]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});
