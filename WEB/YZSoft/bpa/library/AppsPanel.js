
/*libInfo*/

Ext.define('YZSoft.bpa.library.AppsPanel', {
    extend: 'Ext.container.Container',

    constructor: function (config) {
        var me = this;

        me.pnlModuleList = Ext.create('YZSoft.bpa.apps.ModuleList.Panel', {
            title: RS.$('BPA__ModuleList'),
            tabConfig: {
                iconCls: 'yz-glyph yz-glyph-e954',
                textAlign: 'left'
            }
        });

        me.pnlRelationship = Ext.create('YZSoft.bpa.apps.Relationship.Panel', {
            title: RS.$('BPA_SearchRelationship'),
            tabConfig: {
                iconCls: 'yz-glyph yz-glyph-e956',
                textAlign: 'left'
            }
        });

        me.pnlPanoramic = Ext.create('YZSoft.bpa.apps.Panoramic.Panel', {
            title: RS.$('BPA_Title_Panoramic'),
            libInfo: config.libInfo,
            tabConfig: {
                iconCls: 'yz-glyph yz-glyph-e955',
                textAlign: 'left'
            }
        });

        me.pnlDashboard = Ext.create('YZSoft.bpa.apps.Dashboard.Panel', {
            title: RS.$('BPA__ProcessStatistics'),
            tabConfig: {
                iconCls: 'yz-glyph yz-glyph-e958',
                textAlign: 'left'
            }
        });

        //me.pnlApp5 = Ext.create('Ext.panel.Panel', {
        //    title: '流程发布',
        //    tabConfig: {
        //        iconCls: 'yz-glyph yz-glyph-e959',
        //        textAlign: 'left'
        //    }
        //});

        //me.pnlApp6 = Ext.create('Ext.panel.Panel', {
        //    title: RS.$('BPA__ReportGenerator'),
        //    tabConfig: {
        //        iconCls: 'yz-glyph yz-glyph-e957',
        //        textAlign: 'left'
        //    }
        //});

        me.tabBar = Ext.create('Ext.tab.Bar', {
            cls: 'bpa-tab-bar-apps',
            border: false,
            padding: '20 10',
            layout: {
                type: 'vbox',
                align: 'stretch'
            }
        });

        me.pnlTabBar = Ext.create('Ext.container.Container', {
            region: 'west',
            width: 220,
            style: 'background-color:#f8f8f8;border-right:solid 1px #f0f0f0;',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.tabBar, { xtype: 'tbfill'}]
        });

        me.tab = Ext.create('YZSoft.src.tab.Panel', {
            region: 'center',
            border: false,
            activeTab: 0,
            bodyStyle: 'border-width:0px',
            tabBar: me.tabBar,
            defaults: {
                border: false
            },
            items: [
                me.pnlModuleList,
                me.pnlRelationship,
                me.pnlPanoramic,
                me.pnlDashboard
            ]
        });

        cfg = {
            layout: 'border',
            items: [me.pnlTabBar, me.tab]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});