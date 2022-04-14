
/*
config
    groupInfo
*/
Ext.define('YZSoft.bpa.group.DocumentPanel', {
    extend: 'Ext.container.Container',
    requires: [
        'YZSoft.src.model.Document',
        'YZSoft.src.ux.File'
    ],
    layout: 'border',
    style: 'background-color:white',
    padding: '0 40 30 40',

    constructor: function (config) {
        var me = this,
            groupInfo = me.groupInfo = config.groupInfo,
            groupid = groupInfo.Group.GroupID,
            perm = groupInfo.Perm,
            folderid = groupInfo.Group.DocumentFolderID,
            cfg;

        me.btnGenerateReport = Ext.create('Ext.button.Button', {
            text: RS.$('BPA__NewReport'),
            hidden: !perm.Edit,
            cls: 'bpa-btn-solid-hot',
            margin: '0 10 0 0',
            handler: function () {
                Ext.create('YZSoft.bpa.src.dialogs.ReportGenerateDlg', {
                    groupid: groupInfo.Group.GroupID,
                    autoShow: true,
                    fn: function (data) {
                        me.generateDocument(data);
                    }
                });
            }
        });

        me.btnUpload = Ext.create('Ext.button.Button', {
            text: RS.$('All_AddDocument'),
            hidden: !perm.Edit,
            cls: 'bpa-btn-solid-hot',
            margin: '0 10 0 0',
            handler: function () {
            }
        });

        me.uploader = Ext.create('YZSoft.src.ux.Uploader', {
            attachTo: me.btnUpload,
            autoStart: false,
            fileSizeLimit: '1000 MB',
            fileTypes: '*.*',
            typesDesc: RS.$('All_FileTypeDesc_All')
        });

        me.btnDelete = Ext.create('Ext.button.Button', {
            text: RS.$('All_Delete'),
            hidden: !perm.Edit,
            cls: 'bpa-btn-flat',
            iconCls: 'yz-glyph yz-glyph-recyclebin',
            margin: '0 0 0 5',
            handler: function () {
                var recs = me.pnlDocument.grid.getSelectionModel().getSelection();
                if (recs.length != 0) {
                    me.pnlDocument.deleteDocuments(recs);
                }
            }
        });

        me.btnRefresh = Ext.create('Ext.button.Button', {
            text: RS.$('All_Refresh'),
            cls: 'bpa-btn-flat',
            iconCls: 'yz-glyph yz-glyph-refresh',
            margin: '0 0 0 20',
            handler: function () {
                me.pnlDocument.store.reload({
                    loadMask: true
                });
            }
        });

        me.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            region: 'north',
            height: 64,
            padding: 0,
            items: [
                //me.btnGenerateReport,
                me.btnUpload,
                me.btnDelete,
                '->',
                me.btnRefresh
            ]
        });

        me.pnlDocument = Ext.create('YZSoft.src.document.Normal', {
            region: 'center',
            folderid: folderid,
            uploader: me.uploader
        });

        me.pnlDocument.grid.on({
            scope: me,
            selectionchange: 'updateStatus'
        });

        cfg = {
            items: [me.toolbar, me.pnlDocument]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            activate: function () {
                me.pnlDocument.store.reload($S.loadMask[me.firsttime !== false ? 'first' : 'activate']);
                me.firsttime = false;
            }
        });

        me.updateStatus();
    },

    generateDocument: function (data) {
        var me = this,
            groupInfo = me.groupInfo,
            tagfolderid = groupInfo.Group.DocumentFolderID;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPA/ProcessReports.ashx'),
            params: Ext.apply({
                method: 'Generate' + data.type + 'Report',
                tagfolderid: tagfolderid
            }, data),
            waitMsg: {
                msg: RS.$('All_Generating'),
                target: me.pnlDocument.grid,
                start: 0
            },
            success: function (result) {
                me.pnlDocument.store.reload({
                    loadMask: {
                        msg: RS.$('All_Generated')
                    }
                });
            }
        });
    },

    updateStatus: function () {
        var me = this,
            sm = me.pnlDocument.grid.getSelectionModel(),
            recs = sm.getSelection();

        me.btnDelete.setDisabled(recs.length == 0);
    }
});