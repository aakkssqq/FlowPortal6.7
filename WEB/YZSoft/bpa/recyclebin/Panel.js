
/*
config
    groupid
*/
Ext.define('YZSoft.bpa.recyclebin.Panel', {
    extend: 'Ext.container.Container',
    layout: 'border',

    constructor: function (config) {
        var me = this,
            cfg;

        me.titlebar = Ext.create('YZSoft.bpa.recyclebin.TitleBar', {
            region: 'north',
            height: 64
        });

        me.objectPanel = Ext.create('YZSoft.bpa.recyclebin.RecycleBinPanel', {
            region: 'center'
        });

        cfg = {
            items: [me.titlebar, me.objectPanel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            activate: function () {
                me.objectPanel.fireEvent('activate');
            }
        });
    }
});