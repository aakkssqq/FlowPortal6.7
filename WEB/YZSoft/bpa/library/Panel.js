
Ext.define('YZSoft.bpa.library.Panel', {
    extend: 'YZSoft.bpa.ModuleContainer',

    constructor: function (config) {
        var me = this,
            cfg;

        me.home = Ext.create('YZSoft.bpa.library.LibrariesPanel', {
        });

        cfg = {
            items: [me.home]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    } 
});