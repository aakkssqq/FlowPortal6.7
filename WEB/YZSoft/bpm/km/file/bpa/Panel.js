/*
config
fileid
*/
Ext.define('YZSoft.bpm.km.file.bpa.Panel', {
    extend: 'Ext.container.Container',

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlOverview = Ext.create('YZSoft.bpm.km.file.bpa.Overview', {
            title: RS.$('KM_Overview'),
            fileid: config.fileid
        });

        me.pnlActivities = Ext.create('YZSoft.bpm.km.file.bpa.Activities', {
            title: RS.$('KM_Responsibility'),
            fileid: config.fileid
        });

        me.pnlRisk = Ext.create('YZSoft.bpm.km.file.bpa.Risk', {
            title: RS.$('KM_Risk'),
            fileid: config.fileid
        });

        me.pnlKPI = Ext.create('YZSoft.bpm.km.file.bpa.KPI', {
            title: RS.$('KM_KPI'),
            fileid: config.fileid
        });

        me.pnlRACI = Ext.create('YZSoft.bpm.km.file.bpa.RACI', {
            title: 'RACI',
            fileid: config.fileid
        });

        me.pnlChart = Ext.create('YZSoft.bpa.FileViewPanel', {
            title: RS.$('All_BPA_ProcessChart'),
            fileid: config.fileid
        });

        me.pnlSocial = Ext.create('YZSoft.im.social.bbs.core.BBS', {
            title: RS.$('KM_Social'),
            border: false,
            scrollable: true,
            padding: 40,
            resType: 'BPAFile',
            resId: config.fileid,
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
                me.pnlActivities,
                me.pnlRisk,
                me.pnlKPI,
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

        me.pnlChart.drawContainer.on({
            shortcutclick: function (sprite, type) {
                me.openFile(sprite.relatiedFile);
            }
        });

        me.on({
            activate: function () {
                me.tabMain.getActiveTab().fireEvent('activate');
            }
        });
    },

    openFile: function (fileid) {
        var me = this;

        YZSoft.Ajax.request({
            async: true,
            method: 'GET',
            url: YZSoft.$url('YZSoft.Services.REST/Attachment/Assist.ashx'),
            params: {
                method: 'GetAttachmentInfo',
                fileid: fileid
            },
            success: function (action) {
                YZSoft.ViewManager.addView(me, 'YZSoft.bpm.km.file.bpa.Panel', {
                    id: Ext.String.format('File_{0}', YZSoft.util.hex.encode(fileid)),
                    title: Ext.String.format('{0} - {1}', RS.$('All_File'), action.result.Name),
                    fileid: fileid,
                    closable: true
                });
            }
        });
    }
});