
Ext.define('YZSoft.bpa.apps.Relationship.Panel', {
    extend: 'Ext.container.Container',

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlRelationship = Ext.create('YZSoft.bpa.apps.Relationship.Relationship', {
            title: RS.$('BPA_SearchRelationship')
        });

        me.pnlNonRelationship = Ext.create('YZSoft.bpa.apps.Relationship.NonRelationship', {
            title: RS.$('BPA_SearchNonRelationship')
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            border: false,
            bodyStyle:'border-top:none',
            tabBar: {
                cls: 'bpa-tab-bar-appmodule',
                padding:'30 20 0 20'
            },
            defaults: {
            },
            items: [
                me.pnlRelationship,
                me.pnlNonRelationship
            ]
        });

        cfg = {
            layout: 'fit',
            items: [me.tabMain]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});