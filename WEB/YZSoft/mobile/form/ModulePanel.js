
Ext.define('YZSoft.mobile.form.ModulePanel', {
    extend: 'YZSoft.frame.app.Abstract',
    getCompId: function (rec) {
        return Ext.String.format('MobileForm_{0}', YZSoft.util.hex.encode(rec.data.path));
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.navigatorPanel = Ext.create('YZSoft.mobile.form.Navigator', Ext.apply({
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

        me.navigatorPanel.on({
            scope: me,
            moduleselectionchange: 'onModuleSelectionChange'
        });
    },

    onModuleSelectionChange: function (pnlNavigator, rec) {
        var me = this;

        me.moduleContainer.showModule({
            xclass: 'YZSoft.frame.module.Container',
            config: {
                itemId: me.getCompId(rec),
                items: [{
                    xclass: 'YZSoft.mobile.form.Panel',
                    processName: rec.data.ProcessName,
                    version: rec.data.ProcessVersion,
                    record: rec
                }]
            },
            match: function (item) {
                return item.itemId == me.getCompId(rec);
            }
        });
    }
});
