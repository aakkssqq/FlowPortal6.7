
Ext.define('YZSoft.bpa.document.Panel', {
    extend: 'YZSoft.bpa.ModuleContainer',

    constructor: function (config) {
        var me = this,
            cfg;

        me.home = Ext.create('YZSoft.bpa.document.LibrariesPanel', {
        });

        cfg = {
            items: [me.home]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    } 
});