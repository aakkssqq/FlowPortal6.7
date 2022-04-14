
/*
config
    root,
    path
    perm
*/
Ext.define('YZSoft.src.lib.viewer.OSDocumentViewer', {
    extend: 'Ext.container.Container',
    requires: [
        'YZSoft.src.model.Document',
        'YZSoft.src.ux.File'
    ],
    layout: 'border',
    style: 'background-color:white',
    padding: '10 40 30 40',

    constructor: function (config) {
        var me = this,
            perm = config.perm || {},
            cfg;

        me.btnUpload = Ext.create('Ext.button.Button', {
            text: RS.$('All_AddTemplate'),
            hidden: perm.Edit === false,
            cls: 'bpa-btn-solid-hot',
            margin: '0 10 0 0',
            handler: function () {
            }
        });

        me.btnRename = Ext.create('Ext.button.Button', {
            text: RS.$('All_Rename'),
            hidden: perm.Edit === false,
            cls: 'bpa-btn-box-hot',
            margin: '0 10 0 0',
            handler: function () {
                var sm = me.pnlDocument.grid.getSelectionModel(),
                    recs = sm.getSelection();

                if (recs.length == 1)
                    me.pnlDocument.startRename(recs[0]);
            }
        });

        me.uploader = Ext.create('YZSoft.src.ux.Uploader', {
            attachTo: me.btnUpload,
            autoStart: false,
            params: {
                Method: 'OSFileSystemUpload',
                root: config.root,
                path: config.path
            },
            fileSizeLimit: '100 MB',
            fileTypes: RS.$('All_FileType_WordExcel'),
            typesDesc: RS.$('All_FileTypeDesc_WordExcel')
        });

        me.btnDelete = Ext.create('Ext.button.Button', {
            text: RS.$('All_Delete'),
            hidden: perm.Edit === false,
            cls: 'bpa-btn-flat',
            iconCls: 'yz-glyph yz-glyph-recyclebin',
            margin: '0 10 0 0',
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
            margin: 0,
            style:'padding-right:0px;',
            handler: function () {
                me.pnlDocument.store.reload({
                    loadMask: true
                });
            }
        });

        me.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            region: 'north',
            height: 64,
            padding: '5 0',
            items: [
                me.btnUpload,
                me.btnRename,
                me.btnDelete,
                '->',
                me.btnRefresh
            ]
        });

        me.pnlDocument = Ext.create('YZSoft.src.document.OSNormal', {
            region: 'center',
            root: config.root,
            path: config.path,
            uploader: me.uploader,
            updater: me.uploaderUpdate
        });

        cfg = {
            items: [me.toolbar, me.pnlDocument]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            switchActive: function (config) {
                me.pnlDocument.showFolder(config.root, config.path, {
                    loadMask: false
                });
            }
        });

        me.pnlDocument.grid.on({
            scope: me,
            selectionchange: 'updateStatus',
            containercontextmenu: function (view, e, eOpts) {
                e.stopEvent();
            },
            itemcontextmenu: function (view, record, item, index, e) {
                e.stopEvent();
            }
        });


        me.pnlDocument.showFolder(config.root, config.path, {
            loadMask: false
        });

        me.updateStatus();
    },

    updateStatus: function () {
        var me = this,
            sm = me.pnlDocument.grid.getSelectionModel(),
            recs = sm.getSelection();

        me.btnDelete.setDisabled(recs.length == 0);
        me.btnRename.setDisabled(recs.length != 1);
    }
});