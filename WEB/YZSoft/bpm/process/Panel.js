/*
config
    processName
    processVersion
    activeTabIndex
    backButton
Events
    backClick
*/
Ext.define('YZSoft.bpm.process.Panel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.ux.Render'
    ],
    layout: 'border',
    plain: true,
    modal: true,
    border: false,

    constructor: function (config) {
        var me = this;

        config.backButton = config.backButton === true;

        me.btnBack = Ext.create('YZSoft.src.button.Button', {
            glyph: 0xe612,
            cls: 'yz-btn-flat',
            padding:0,
            text: RS.$('All_Return_Form'),
            hidden: !config.backButton,
            handler: function (item) {
                me.fireEvent('backClick');
            }
        });

        me.txtProcessName = Ext.create('Ext.toolbar.TextItem', {
            margin: '0 6 0 0',
            text: config.processName || ''
        });

        me.txtVersion = Ext.create('Ext.toolbar.TextItem', {
            margin: '0 6 0 0',
            text: Ext.String.format('{0} - {1}', RS.$('All_Version'), config.processVersion)
        });

        me.tabBar = Ext.create('Ext.tab.Bar', {
        });

        var sp = {
            xtype: 'tbseparator',
            cls: 'yz-seprator-tasktrace-title'
        };

        me.titleBar = Ext.create('Ext.container.Container', {
            region: 'north',
            padding:'0 12 0 6',
            style: 'background-color:#eaeaea',
            layout: {
                type: 'hbox',
                align: 'center',
            },
            items: [me.btnBack, me.tabBar, { xtype: 'tbfill' }, me.txtProcessName, sp, me.txtVersion]
        });

        me.chartPanel = Ext.create('YZSoft.bpm.process.FlowChart', {
            processName: config.processName,
            processVersion: config.processVersion
        });

        me.forecastPanel = Ext.create('YZSoft.bpm.forecast.ProcessPanel', {
            processName: config.processName,
            processVersion: config.processVersion,
            data: config.data
        });

        me.traceTab = Ext.create('YZSoft.src.tab.Panel', {
            region: 'center',
            tabBar: me.tabBar,
            activeTab: config.activeTabIndex,
            items: [me.chartPanel, me.forecastPanel]
        });

        var cfg = {
            title: Ext.String.format('{0} - {1}', RS.$('All_TaskTrace'), config.TaskID),
            layout: 'border',
            //tbar: me.titleBar,
            items: [me.titleBar,me.traceTab]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.chartPanel.on({
            single: true,
            afterLayout: function () {
                this.openProcess(config.processName, config.processVersion, {
                    waitMsg: {
                        msg: RS.$('All_Loading'),
                        target: this
                    }
                });
            }
        });

        me.forecastPanel.on({
            single: true,
            afterLayout: function () {
                this.store.load({
                    loadMask: {
                        msg: RS.$('All_Forecast_LoadMask_FirstTime'),
                        target: this
                    }
                });
            }
        });
    }
});
