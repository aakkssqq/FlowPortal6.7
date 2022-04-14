
Ext.define('YZSoft.bpa.group.Panel', {
    extend: 'YZSoft.bpa.ModuleContainer',

    constructor: function (config) {
        var me = this,
            cfg;

        me.home = Ext.create('YZSoft.bpa.group.GroupsPanel', {
        });

        cfg = {
            items: [me.home]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});