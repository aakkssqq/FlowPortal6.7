/*
config
processName
version
*/
Ext.define('YZSoft.bpm.km.file.bpm.Panel', {
    extend: 'Ext.container.Container',

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlOverview = Ext.create('YZSoft.bpm.km.file.bpm.Overview', {
            title: RS.$('KM_Overview'),
            processName: config.processName,
            version: config.version
        });

        me.pnlRACI = Ext.create('YZSoft.bpm.km.file.bpm.RACI', {
            title: 'RACI',
            processName: config.processName,
            version: config.version
        });

        me.pnlChart = Ext.create('YZSoft.bpm.process.FlowChart', {
            title: RS.$('All_BPA_ProcessChart'),
            processName: config.processName,
            processVersion: config.version
        });

        me.pnlChart.openProcess(config.processName, config.version);

        me.pnlSocial = Ext.create('YZSoft.im.social.bbs.core.BBS', {
            title: RS.$('KM_Social'),
            border: false,
            scrollable: true,
            padding: 40,
            resType: 'Process',
            resId: config.processName,
            commentsConfig: {
                height: 128,
                margin: '0 10 40 0'
            },
            viewConfig: {
                margin: '0 10 0 0',
                padding: '0 0 30 0',
                autoLoad: true
            }
        });

        me.tabBar = Ext.create('Ext.tab.Bar', {
            cls: 'yz-tab-bar-undline-bpakm yz-tab-bar-bpakm-pos',
            border: false
        });

        me.headerBar = Ext.create('Ext.container.Container', {
            region: 'north',
            padding: '0 0 0 6',
            style: 'background-color:#fff;border-bottom:solid 1px #d6d6d6;',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [me.tabBar, { xtype: 'tbfill'}]
        });

        me.tabMain = Ext.create('YZSoft.src.tab.Panel', {
            region: 'center',
            border: false,
            activeTab: 0,
            bodyStyle: 'border-width:0px',
            tabBar: me.tabBar,
            items: [
                me.pnlOverview,
                me.pnlRACI,
                me.pnlChart,
                me.pnlSocial
            ]
        });

        cfg = {
            layout: 'border',
            items: [me.headerBar, me.tabMain]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            activate: function () {
                me.tabMain.getActiveTab().fireEvent('activate');
            }
        });
    }
});