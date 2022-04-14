/*
config
uid
*/
Ext.define('YZSoft.bpm.km.personal.Overview', {
    extend: 'Ext.container.Container',

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlPosition = Ext.create('YZSoft.bpm.km.personal.Position', {
            title: RS.$('KM_MyJobs'),
            margin: '10 0 0 0',
            listeners: {
                scope: me,
                itemclick: 'onSpriteClick'
            }
        });

        me.pnlFiles = Ext.create('YZSoft.bpm.km.panel.Files', {
            title: RS.$('KM_MyRelatedProcess'),
            margin: '30 0 0 0',
            listeners: {
                scope: me,
                itemclick: 'onFileClick'
            }
        });

        me.pnlR = Ext.create('YZSoft.bpm.km.panel.UsedBy', {
            title: RS.$('KM_R'),
            margin: '30 0 0 0',
            listeners: {
                scope: me,
                itemclick: 'onSpriteClick'
            }
        });

        me.pnlA = Ext.create('YZSoft.bpm.km.panel.UsedBy', {
            title: RS.$('KM_A'),
            margin: '30 0 0 0',
            listeners: {
                scope: me,
                itemclick: 'onSpriteClick'
            }
        });

        me.pnlC = Ext.create('YZSoft.bpm.km.panel.UsedBy', {
            title: RS.$('KM_C'),
            margin: '30 0 0 0',
            listeners: {
                scope: me,
                itemclick: 'onSpriteClick'
            }
        });

        me.pnlI = Ext.create('YZSoft.bpm.km.panel.UsedBy', {
            title: RS.$('KM_I'),
            margin: '30 0 0 0',
            listeners: {
                scope: me,
                itemclick: 'onSpriteClick'
            }
        });

        me.pnlProperty = Ext.create('YZSoft.bpm.km.sprite.Property', {
        });

        me.pnlMain = Ext.create('Ext.container.Container', {
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
            items: [me.pnlPosition, me.pnlFiles, me.pnlR, me.pnlA, me.pnlC, me.pnlI]
        });

        cfg = {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [me.pnlMain, {
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

        me.pnlPosition.on({
            positionSelected: function (positions) {
                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPA/Library.ashx'),
                    params: {
                        method: 'SetUserPositions'
                    },
                    jsonData: {
                        positions: positions
                    },
                    waitMsg: { msg: RS.$('All_Saving'), target: me.pnlMain },
                    success: function (action) {
                        me.load({
                            waitMsg: { msg: RS.$('All_Save_Succeed'), target: me.pnlMain }
                        });
                        me.fireEvent('positionChanged');
                    }
                });

            }
        });
    },

    onSpriteClick: function (view, record, item, index, e, eOpts) {
        var me = this;

        if (!record.data.SpriteID)
            return;

        me.pnlProperty.showSprite({
            fileid: record.data.FileID,
            spriteid: record.data.SpriteID,
            title: record.data.SpriteName
        });
    },

    onFileClick: function (view, record, item, index, e, eOpts) {
        var me = this;

        YZSoft.ViewManager.addView(me, 'YZSoft.bpm.km.file.bpa.Panel', {
            id: Ext.String.format('File_{0}', YZSoft.util.hex.encode(record.data.FileID)),
            title: Ext.String.format('{0} - {1}', RS.$('All_File'), record.data.FileName),
            fileid: record.data.FileID,
            closable: true
        });
    },

    onPanelRender: function () {
        this.load();
    },

    load: function (config) {
        var me = this;

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/BPA/ProcessReports.ashx'),
            params: {
                method: 'GetPersonalOverviewInfo',
                uid: me.uid
            },
            success: function (action) {
                var data = action.result;

                Ext.suspendLayouts();
                try {
                    me.pnlPosition.setData(data.positions);
                    me.pnlFiles.setData(data.files);
                    me.pnlR.setData(data.Responsible);
                    me.pnlA.setData(data.Accountable);
                    me.pnlC.setData(data.Consulted);
                    me.pnlI.setData(data.Informed);
                }
                finally {
                    Ext.resumeLayouts(true);
                }
            }
        }, config));
    }
});