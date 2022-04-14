/*
config
processName
version
*/
Ext.define('YZSoft.bpm.km.file.bpm.Overview', {
    extend: 'Ext.container.Container',

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlPurpose = Ext.create('YZSoft.bpm.km.panel.Description', {
            title: RS.$('KM_Purpose'),
            margin: '10 0 0 0'
        });

        me.pnlScope = Ext.create('YZSoft.bpm.km.panel.Description', {
            title: RS.$('KM_Scope'),
            margin: '30 0 0 0'
        });

        me.pnlDefinition = Ext.create('YZSoft.bpm.km.panel.Description', {
            title: RS.$('KM_Definition'),
            margin: '30 0 0 0'
        });

        me.pnlResponsibility = Ext.create('YZSoft.bpm.km.panel.Description', {
            title: RS.$('KM_Responsibility'),
            margin: '30 0 0 0'
        });

        me.pnlActivities = Ext.create('YZSoft.bpm.km.panel.bpm.Activities', {
            margin: '30 0 0 0'
        });

        me.pnlDocuments = Ext.create('YZSoft.bpm.km.panel.Documents', {
            margin: '30 0 0 0'
        });

        me.pnlProperty = Ext.create('YZSoft.bpm.km.sprite.Property', {
        });

        cfg = {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'container',
                scrollable: true,
                flex: 10,
                padding: '10 18',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                defaults: {
                    border: false
                },
                items: [me.pnlPurpose, me.pnlScope, me.pnlDefinition, me.pnlResponsibility, me.pnlActivities, me.pnlDocuments]
            }, {
                xtype: 'container',
                scrollable: true,
                flex: 5,
                padding: '10 16',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                style: 'border-left:solid 1px #d6d6d6;',
                items: [me.pnlProperty]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope: me,
            single: true,
            render: 'onPanelRender'
        });

        me.pnlActivities.on({
            itemclick: function (view, record, item, index, e, eOpts) {
                if (!record.data.SpriteID)
                    return;

                me.pnlProperty.showSprite({
                    fileid: me.fileid,
                    spriteid: record.data.SpriteID,
                    title: record.data.NodeName
                });
            }
        });
    },

    onPanelRender: function () {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPA/ProcessReports.ashx'),
            params: {
                method: 'GetBPMProcessOverviewInfo',
                processName: me.processName,
                version: me.version
            },
            success: function (action) {
                var data = action.result;

                Ext.suspendLayouts();
                try
                {
                    me.fileid = data.FileID;
                    me.pnlPurpose.setData(data.Purpose);
                    me.pnlScope.setData(data.Scope);
                    me.pnlDefinition.setData(data.Definition);
                    me.pnlResponsibility.setData(data.Responsibility);
                    me.pnlActivities.setData(data.activities);
                    me.pnlDocuments.setData(data.documents);
                }
                finally {
                    Ext.resumeLayouts(true);
                }
            }
        });
    }
});