
/*
config
    folderid
*/
Ext.define('YZSoft.src.lib.viewer.DocumentViewer', {
    extend: 'Ext.container.Container',
    requires: [
        'YZSoft.src.model.Document',
        'YZSoft.src.ux.File'
    ],
    layout: 'border',
    style: 'background-color:white',
    uploadConfig: {
        fileSizeLimit: '1000 MB',
        fileTypes: '*.*',
        typesDesc: RS.$('All_FileTypeDesc_All')
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            folderid = config.folderid,
            uploadConfig = config.uploadConfig || me.uploadConfig,
            perm, cfg;

        delete config.perm;

        me.btnUpload = Ext.create('Ext.button.Button', {
            text: RS.$('All_AddDocument'),
            hidden: true,
            cls: 'bpa-btn-solid-hot',
            margin: '0 10 0 0'
        });

        me.btnUpdate = Ext.create('Ext.button.Button', {
            text: RS.$('All_UpdateDocument'),
            hidden: true,
            cls: 'bpa-btn-box-hot',
            margin: '0 10 0 0'
        });

        me.uploader = Ext.create('YZSoft.src.ux.Uploader', Ext.apply({
            attachTo: me.btnUpload,
            autoStart: false
        }, uploadConfig));

        me.uploaderUpdate = Ext.create('YZSoft.src.ux.Uploader', Ext.apply({
            attachTo: me.btnUpdate,
            autoStart: false
        }, uploadConfig));

        me.btnDelete = Ext.create('Ext.button.Button', {
            text: RS.$('All_Delete'),
            hidden: true,
            cls:'bpa-btn-flat',
            iconCls: 'yz-glyph yz-glyph-recyclebin',
            margin: '0 0 0 5',
            handler: function () {
                var recs = me.pnlDocument.grid.getSelectionModel().getSelection();
                if (recs.length != 0) {
                    me.pnlDocument.deleteDocuments(recs);
                }
            }
        });

        me.menuRename = Ext.create('Ext.menu.Item', {
            text: RS.$('All_Rename'),
            iconCls: 'yz-glyph yz-glyph-rename',
            handler: function () {
                var sm = me.pnlDocument.grid.getSelectionModel(),
                    recs = sm.getSelection();

                if (recs.length == 1)
                    me.pnlDocument.startRename(recs[0]);
            }
        });

        me.menuMove = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e60e',
            text: RS.$('All_Move'),
            handler: function () {
                var sm = me.pnlDocument.grid.getSelectionModel(),
                    recs = sm.getSelection();

                if (recs.length)
                    me.pnlDocument.moveObjectsToFolder(me.moveroot, me.pnlDocument.folderid, recs);
            }
        });

        me.btnMore = Ext.create('Ext.button.Button', {
            text: RS.$('All_More'),
            cls: 'bpa-btn-flat',
            margin: '0 0 0 5',
            menu: {
                items: [
                    me.menuRename,
                    me.menuMove
                ]
            }
        });

        me.btnRefresh = Ext.create('Ext.button.Button', {
            text: RS.$('All_Refresh'),
            cls: 'bpa-btn-flat',
            iconCls: 'yz-glyph yz-glyph-refresh',
            margin:0,
            style: 'padding-right:0px',
            handler: function () {
                me.pnlDocument.$refresh();
            }
        });

        me.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            region: 'north',
            height: 64,
            padding:'5 0',
            items: [
                me.btnUpload,
                me.btnUpdate,
                me.btnDelete,
                me.btnMore,
                '->',
                me.btnRefresh
            ]
        });

        me.pnlDocument = Ext.create('YZSoft.src.document.Normal', {
            region: 'center',
            folderid: folderid,
            uploader: me.uploader,
            updater: me.uploaderUpdate
        });

        me.pnlDocument.on({
            folderChanged: function (folderid) {
                me.applyFolderPermision(folderid);
            }
        });

        cfg = {
            items: [me.toolbar, me.pnlDocument]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            switchActive: function (config) {
                me.pnlDocument.showFolder(config.folderid, {
                    loadMask: false
                });
            }
        });

        me.pnlDocument.grid.on({
            scope: me,
            selectionchange: 'updateStatus',
            itemcontextmenu: 'onItemContextMenu',
            containercontextmenu: 'onContainerContextMenu'
        });

        me.pnlDocument.showFolder(config.folderid, {
            loadMask: false
        });

        me.updateStatus();
    },

    applyFolderPermision: function (folderid) {
        var me = this,
            perm;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            loadMask: false,
            params: {
                method: 'CheckPermisions',
                rsid: 'FileSystemFolder://' + folderid,
                perms: 'Write,AssignPermision'
            },
            success: function (action) {
                perm = me.perm = action.result;
            }
        });

        if (me.btnUpload)
            me.btnUpload.setVisible(perm.Write);

        if (me.btnUpdate)
            me.btnUpdate.setVisible(perm.Write);

        if (me.btnMore)
            me.btnMore.setVisible(perm.Write);

        if (me.btnDelete)
            me.btnDelete.setVisible(perm.Write);

        return me;
    },

    onItemContextMenu: function (view, record, item, index, e, eOpts) {
        var me = this,
            sm = view.getSelectionModel(),
            perm = me.perm,
            menu;

        e.stopEvent();
        sm.select(record);

        menu = {
            $delete: {
                iconCls: 'yz-glyph yz-glyph-delete',
                text: RS.$('All_Delete'),
                disabled: !perm.Write,
                handler: function () {
                    me.pnlDocument.deleteDocuments([record]);
                }
            },
            rename: {
                iconCls: 'yz-glyph yz-glyph-rename',
                text: RS.$('All_Rename'),
                disabled: !perm.Write,
                handler: function () {
                    me.pnlDocument.startRename(record);
                }
            },
            move: {
                iconCls: 'yz-glyph yz-glyph-e60e',
                text: RS.$('All_Move'),
                handler: function () {
                    me.pnlDocument.moveObjectsToFolder(me.moveroot, me.pnlDocument.folderid, [record]);
                }
            },
            refresh: {
                iconCls: 'yz-glyph yz-glyph-refresh',
                text: RS.$('All_Refresh'),
                handler: function () {
                    me.pnlDocument.$refresh();
                }
            }
        };

        if (perm.Write) {
            var menuUpdate = Ext.create('Ext.menu.Item', {
                iconCls: 'yz-glyph yz-glyph-e940',
                text: RS.$('All_UpdateDocument')
            });

            var updateUploader = Ext.create('YZSoft.src.ux.Uploader', Ext.apply({
                attachTo: menuUpdate,
                autoStart: false
            }, me.uploadConfig));

            me.pnlDocument.bindUpdaterUploader(updateUploader);

            var menuUpload = Ext.create('Ext.menu.Item', {
                iconCls: 'yz-glyph yz-glyph-e91f',
                text: RS.$('All_AddDocument')
            });

            var uploader = Ext.create('YZSoft.src.ux.Uploader', Ext.apply({
                attachTo: menuUpload,
                autoStart: false
            }, me.uploadConfig));

            me.pnlDocument.bindUploader(uploader);

            menu = [
                menuUpdate,
                '-',
                menuUpload,
                menu.$delete,
                menu.rename,
                menu.move,
                '-',
                menu.refresh
            ];
        }
        else {
            menu = [
                menu.openread,
                menu.refresh
            ];
        }

        menu = Ext.create('Ext.menu.Menu', {
            margin: '0 0 10 0',
            items: menu
        });

        menu.showAt(e.getXY());
        menu.focus();
    },

    onContainerContextMenu: function (view, e, eOpts) {
        var me = this,
            perm = me.perm,
            menu;

        e.stopEvent();

        menu = {
            refresh: {
                iconCls: 'yz-glyph yz-glyph-refresh',
                text: RS.$('All_Refresh'),
                handler: function () {
                    me.pnlDocument.$refresh();
                }
            }
        };

        if (perm.Write) {
            var menuUpload = Ext.create('Ext.menu.Item', {
                iconCls: 'yz-glyph yz-glyph-e91f',
                text: RS.$('All_AddDocument')
            });

            var uploader = Ext.create('YZSoft.src.ux.Uploader', Ext.apply({
                attachTo: menuUpload,
                autoStart: false
            }, me.uploadConfig));

            me.pnlDocument.bindUploader(uploader);

            menu = [
                menuUpload,
                menu.refresh
            ];
        }
        else{
            menu = [
                menu.refresh
            ];
        }

        menu = Ext.create('Ext.menu.Menu', {
            margin: '0 0 10 0',
            items: menu
        });

        menu.showAt(e.getXY());
        menu.focus();
    },

    updateStatus: function () {
        var me = this,
            sm = me.pnlDocument.grid.getSelectionModel(),
            recs = sm.getSelection();

        me.btnDelete.setDisabled(recs.length == 0);
        me.btnUpdate.setDisabled(recs.length != 1);
        me.menuRename.setDisabled(recs.length != 1);
        me.menuMove.setDisabled(recs.length != 1);
    }
});