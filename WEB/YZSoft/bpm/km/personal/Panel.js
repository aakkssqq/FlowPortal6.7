/*
config
uid
*/
Ext.define('YZSoft.bpm.km.personal.Panel', {
    extend: 'Ext.container.Container',

    constructor: function (config) {
        var me = this,
            uid = config.uid || userInfo.Account,
            cfg;

        me.pnlOverview = Ext.create('YZSoft.bpm.km.personal.Overview', {
            title: RS.$('KM_Overview'),
            uid: uid,
            listeners: {
                positionChanged: function () {
                    me.pnlActivities.fireEvent('positionChanged');
                    me.pnlRisk.fireEvent('positionChanged');
                    me.pnlKPI.fireEvent('positionChanged');
                    me.pnlRACI.fireEvent('positionChanged');
                }
            }
        });

        me.pnlActivities = Ext.create('YZSoft.bpm.km.personal.Activities', {
            title: RS.$('KM_JobResponsibility'),
            uid: uid
        });

        me.pnlRisk = Ext.create('YZSoft.bpm.km.personal.Risk', {
            title: RS.$('KM_Risk'),
            uid: uid
        });

        me.pnlKPI = Ext.create('YZSoft.bpm.km.personal.KPI', {
            title: RS.$('KM_KPI'),
            uid: uid
        });

        me.pnlRACI = Ext.create('YZSoft.bpm.km.personal.RACI', {
            title: 'RACI',
            uid: uid
        });

        me.tabBar = Ext.create('Ext.tab.Bar', {
            cls: 'yz-tab-bar-undline-bpakm yz-tab-bar-bpakm-pos',
            border: false
        });

        me.headerBar = Ext.create('Ext.container.Container', {
            region: 'north',
            padding:'0 0 0 6',
            style: 'background-color:#fff;border-bottom:solid 1px #d6d6d6;',
            layout: {
                type: 'hbox',
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
            items: [
                me.pnlOverview,
                me.pnlActivities,
                me.pnlRisk,
                me.pnlKPI,
                me.pnlRACI
            ]
        });

        cfg = {
            layout: 'border',
            items: [me.headerBar, me.tab]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
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