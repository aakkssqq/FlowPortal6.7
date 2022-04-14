/*
config
*/
Ext.define('YZSoft.bpm.km.sprite.Property', {
    extend: 'Ext.container.Container',
    border: false,
    panelCls: 'yz-pnl-bpakm yz-pnl-bpakm-small',
    panelMargin: '30 0 0 0',

    constructor: function (config) {
        var me = this,
            panelMargin = config.panelMargin || me.panelMargin,
            panelCls = config.panelCls || me.panelCls,
            cfg;

        config = config || {};

        me.pnlDesc = Ext.create('YZSoft.bpm.km.panel.Description', Ext.apply({
            title: RS.$('All_Desc'),
            margin: '10 0 0 0'
        },config.descPanelConfig));

        me.pnlResponsible = Ext.create('YZSoft.bpm.km.panel.Reference', {
            title: RS.$('KM_R'),
            cls: panelCls,
            hidden: true,
            margin: panelMargin,
            listeners: {
                scope: me,
                itemclick: 'onSpriteClick'
            }
        });

        me.pnlAccountable = Ext.create('YZSoft.bpm.km.panel.Reference', {
            title: RS.$('KM_A'),
            cls: panelCls,
            hidden: true,
            margin: panelMargin,
            listeners: {
                scope: me,
                itemclick: 'onSpriteClick'
            }
        });

        me.pnlConsulted = Ext.create('YZSoft.bpm.km.panel.Reference', {
            title: RS.$('KM_C'),
            cls: panelCls,
            hidden: true,
            margin: panelMargin,
            listeners: {
                scope: me,
                itemclick: 'onSpriteClick'
            }
        });

        me.pnlInformed = Ext.create('YZSoft.bpm.km.panel.Reference', {
            title: RS.$('KM_I'),
            cls: panelCls,
            hidden: true,
            margin: panelMargin,
            listeners: {
                scope: me,
                itemclick: 'onSpriteClick'
            }
        });

        me.pnlRegulation = Ext.create('YZSoft.bpm.km.panel.Reference', {
            title: RS.$('KM_Regulation'),
            cls: panelCls,
            hidden: true,
            margin: panelMargin,
            listeners: {
                scope: me,
                itemclick: 'onSpriteClick'
            }
        });

        me.pnlRisk = Ext.create('YZSoft.bpm.km.panel.Reference', {
            title: RS.$('KM_Risk'),
            cls: panelCls,
            hidden: true,
            margin: panelMargin,
            listeners: {
                scope: me,
                itemclick: 'onSpriteClick'
            }
        });

        me.pnlControlPoint = Ext.create('YZSoft.bpm.km.panel.Reference', {
            title: RS.$('KM_ControlPoint'),
            cls: panelCls,
            hidden: true,
            margin: panelMargin,
            listeners: {
                scope: me,
                itemclick: 'onSpriteClick'
            }
        });

        me.pnlKPI = Ext.create('YZSoft.bpm.km.panel.Reference', {
            title: 'KPI',
            cls: panelCls,
            hidden: true,
            margin: panelMargin,
            listeners: {
                scope: me,
                itemclick: 'onSpriteClick'
            }
        });

        me.pnlForm = Ext.create('YZSoft.bpm.km.panel.Reference', {
            title: RS.$('KM_Form'),
            cls: panelCls,
            hidden: true,
            margin: panelMargin,
            listeners: {
                scope: me,
                itemclick: 'onSpriteClick'
            }
        });

        me.pnlITSystem = Ext.create('YZSoft.bpm.km.panel.Reference', {
            title: RS.$('KM_ITSystem'),
            cls: panelCls,
            hidden: true,
            margin: panelMargin,
            listeners: {
                scope: me,
                itemclick: 'onSpriteClick'
            }
        });

        me.pnlUsedByFiles = Ext.create('YZSoft.bpm.km.panel.UsedByFiles', {
            cls: panelCls,
            hidden: true,
            margin: panelMargin,
            listeners: {
                scope: me,
                itemclick: 'onFileClick'
            }
        });

        me.pnlUsedBy = Ext.create('YZSoft.bpm.km.panel.UsedBy', {
            cls: panelCls,
            hidden: true,
            margin: panelMargin,
            listeners: {
                scope: me,
                itemclick: 'onSpriteClick'
            }
        });

        me.pnlParentProcess = Ext.create('YZSoft.bpm.km.panel.Processes', {
            title: RS.$('KM_ParentProcess'),
            cls: panelCls,
            hidden: true,
            margin: panelMargin,
            listeners: {
                scope: me,
                itemclick: 'onProcessClick'
            }
        });

        me.pnlParentFile = Ext.create('YZSoft.bpm.km.panel.Files', {
            title: RS.$('KM_ParentFile'),
            cls: panelCls,
            hidden: true,
            margin: panelMargin,
            listeners: {
                scope: me,
                itemclick: 'onFileClick'
            }
        });

        me.pnlDocuments = Ext.create('YZSoft.bpm.km.panel.Documents', {
            title: RS.$('KM_RelatedDocument'),
            cls: panelCls,
            hidden: true,
            margin: panelMargin
        });

        cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                me.pnlDesc,
                me.pnlResponsible,
                me.pnlAccountable,
                me.pnlConsulted,
                me.pnlInformed,
                me.pnlRegulation,
                me.pnlRisk,
                me.pnlControlPoint,
                me.pnlKPI,
                me.pnlForm,
                me.pnlITSystem,
                me.pnlUsedByFiles,
                me.pnlUsedBy,
                me.pnlParentProcess,
                me.pnlParentFile,
                me.pnlDocuments
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onSpriteClick: function (view, record, item, index, e, eOpts) {
        var me = this;

        YZSoft.ViewManager.addView(me, 'YZSoft.bpm.km.sprite.Panel', {
            id: Ext.String.format('Sprite_{0}_{1}', YZSoft.util.hex.encode(record.data.FileID), YZSoft.util.hex.encode(record.data.SpriteID)),
            title: Ext.String.format('{0} - {1}', record.data.FileName, record.data.SpriteName),
            fileid: record.data.FileID,
            spriteid: record.data.SpriteID,
            closable: true
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

    onProcessClick: function (view, record, item, index, e, eOpts) {
        var me = this;

        YZSoft.ViewManager.addView(me, 'YZSoft.bpm.km.file.bpm.Panel', {
            id: Ext.String.format('ProcessKM_{0}', YZSoft.util.hex.encode(record.data.ProcessName)),
            title: Ext.String.format('{0} - {1}', RS.$('All_ApproveKM'), record.data.ProcessName),
            processName: record.data.ProcessName,
            version: record.data.Version,
            closable: true
        });
    },

    showSprite: function (option) {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPA/ProcessReports.ashx'),
            params: {
                method: 'GetSpriteOverviewInfo',
                fileid: option.fileid,
                spriteid: option.spriteid
            },
            success: function (action) {
                me.afterLoad(action.result, option);
                me.fillSprite(action.result);
            }
        });
    },

    afterLoad: function (data, option) {
        var me = this,
            sprite = data.sprite;

        if (option.title)
            me.pnlDesc.setTitle(option.title);
    },

    fillSprite: function (data) {
        var me = this,
            sprite = data.sprite,
            usedby = data.usedby,
            usedbyFiles = data.usedbyFiles,
            parentProcess = data.parentProcess,
            parentFile = data.parentFile,
            documents = data.documents;

        Ext.suspendLayouts();
        try {
            me.pnlDesc.setData(sprite.property.Description);

            Ext.each('Responsible,Accountable,Consulted,Informed,Regulation,Risk,ControlPoint,KPI,Form,ITSystem'.split(','), function (name) {
                var ref = sprite.property[name],
                        pnl = me['pnl' + name];

                pnl.setVisible(ref && ref.length != 0);
                pnl.setData(ref);
            });

            me.pnlUsedBy.setVisible(usedby && usedby.length);
            me.pnlUsedBy.setData(usedby);

            me.pnlUsedByFiles.setVisible(usedbyFiles && usedbyFiles.length);
            me.pnlUsedByFiles.setData(usedbyFiles);

            me.pnlParentProcess.setVisible(parentProcess);
            me.pnlParentProcess.setData(parentProcess);

            me.pnlParentFile.setVisible(parentFile);
            me.pnlParentFile.setData(parentFile);

            me.pnlDocuments.setVisible(documents &&  documents.length);
            me.pnlDocuments.setData(documents);
        }
        finally {
            Ext.resumeLayouts(true);
        }
    }
});