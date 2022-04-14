
/*
config
    folderid
    perm
    groupInfo
    moveroot
*/
Ext.define('YZSoft.bpa.group.lib.Viewer', {
    extend: 'Ext.container.Container',
    layout: 'border',
    style: 'background-color:white',

    constructor: function (config) {
        var me = this,
            config = config || {},
            folderid = config.folderid,
            perm = config.perm,
            cfg;

        me.btnNewProcess = Ext.create('Ext.button.Button', {
            text: RS.$('BPA__NewFile'),
            cls: 'bpa-btn-solid-hot',
            hidden: !perm.Edit && !perm.Auth,
            margin: '0 10 0 0',
            handler: function () {
                me.view.newFile();
            }
        });

        me.btnShare = Ext.create('Ext.button.Button', {
            text: RS.$('BPA__Publish'),
            cls:'bpa-btn-flat',
            iconCls: 'yz-glyph yz-glyph-e913',
            hidden: !perm.Edit,
            margin: '0 0 0 20',
            handler: function () {
                var sm = me.view.getSelectionModel(),
                    recs = sm.getSelection();

                if (recs.length == 0)
                    return;

                Ext.create('YZSoft.bpa.src.dialogs.SelLibraryFolderDlg', {
                    autoShow: true,
                    title: RS.$('BPA_Title_PublishTo'),
                    folderType: me.view.folderType,
                    fn: function (folder) {
                        me.view.shareFiles(recs, {
                            folderid: folder.path,
                            foldername: folder.text,
                            maskTarget: me
                        });
                    }
                });
            }
        });

        me.btnEdit = Ext.create('Ext.button.Button', {
            text: RS.$('All_Edit'),
            cls: 'bpa-btn-flat',
            iconCls: 'yz-glyph yz-glyph-e911',
            hidden: !perm.Edit && !perm.Auth,
            margin: '0 0 0 5',
            handler: function () {
                var sm = me.view.getSelectionModel(),
                    recs = sm.getSelection();

                if (recs.length != 1 || !recs[0].data.isFile)
                    return;

                me.view.editFile(recs[0]);
            }
        });

        me.btnDelete = Ext.create('Ext.button.Button', {
            text: RS.$('All_Delete'),
            cls: 'bpa-btn-flat',
            iconCls: 'yz-glyph yz-glyph-recyclebin',
            hidden: !perm.Edit && !perm.Auth,
            margin: '0 0 0 5',
            handler: function () {
                var recs = me.view.getSelectionModel().getSelection();
                if (recs.length != 0) {
                    me.view.deleteRecords(recs, {
                        maskTarget: me
                    });
                }
            }
        });

        me.btnRename = Ext.create('Ext.button.Button', {
            text: RS.$('All_Rename'),
            cls: 'bpa-btn-flat',
            iconCls: 'yz-glyph yz-glyph-rename',
            hidden: perm.Edit || !perm.Auth,
            margin: '0 0 0 5',
            handler: function () {
                var recs = me.view.getSelectionModel().getSelection();
                if (recs.length == 1) {
                    me.view.startEdit(recs[0], {
                        maskTarget: me
                    });
                }
            }
        });

        me.menuRename = Ext.create('Ext.menu.Item', {
            text: RS.$('All_Rename'),
            iconCls: 'yz-glyph yz-glyph-rename',
            hidden: !perm.Edit,
            handler: function () {
                var recs = me.view.getSelectionModel().getSelection();
                if (recs.length == 1) {
                    me.view.startEdit(recs[0], {
                        maskTarget: me
                    });
                }
            }
        });

        me.menuMove = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e60e',
            text: RS.$('All_Move'),
            hidden: !perm.Edit,
            handler: function () {
                var recs = me.view.getSelectionModel().getSelection();
                if (recs.length)
                    me.view.moveObjectsToFolder(me.moveroot, me.view.folderid, recs);
            }
        });

        me.btnMore = Ext.create('Ext.button.Button', {
            text: RS.$('All_More'),
            cls: 'bpa-btn-flat',
            hidden: !perm.Edit,
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
            margin: '0 20 0 0',
            handler: function () {
                me.view.store.reload({
                    loadMask: true
                });
            }
        });

        me.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            region: 'north',
            height: 64,
            items: [
                me.btnNewProcess,
                me.btnShare,
                me.btnEdit,
                me.btnDelete,
                me.btnRename,
                me.btnMore,
                '->',
                me.btnRefresh
            ]
        });

        me.crumb = Ext.create('YZSoft.src.toolbar.Breadcrumb', Ext.apply({
            showIcons: false,
            showMenuIcons: false
        }, config.crumbConfig));

        me.navBar = Ext.create('Ext.container.Container', {
            region: 'north',
            height: 40,
            items: [me.crumb]
        });

        me.view = Ext.create('YZSoft.bpa.src.view.FileView', {
            region: 'center',
            folderid: folderid,
            checkpermision: false,
            groupInfo: config.groupInfo
        });

        me.view.on({
            scope: me,
            folderChanged: function (folderid, record) {
                var node = me.crumb.getStore().getNodeById(folderid);
                if (node) {
                    me.crumb.suspendEvent('selectionchange');
                    me.crumb.setSelection(node);
                    me.crumb.resumeEvent('selectionchange');
                }
            },
            itemdblclick: function (view, record) {
                if (record.data.isFile) {
                    if (me.perm.Edit || (me.perm.Auth && record.data.OwnerAccount == userInfo.Account))
                        me.view.editFile(record);
                    else
                        me.view.viewFile(record);
                }
            },
            selectionchange: 'updateStatus',
            itemcontextmenu: 'onItemContextMenu',
            containercontextmenu: 'onContainerContextMenu'
        });

        me.crumb.on({
            order: 'after',
            afterrender: function () {
                me.crumb.renderedFlag = true;
            },
            selectionchange: function (crumb, node, eOpts) {
                if (me.crumb.renderedFlag && me.crumb.storeloaded && node)
                    me.view.showFolder(node.data.path);
            }
        });

        me.crumb.store.on({
            order: 'after',
            load: function () {
                me.crumb.storeloaded = true;
            }
        });

        cfg = {
            items: [me.toolbar, me.navBar, me.view]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();

        me.view.showFolder(folderid, {
            loadMask: {
                start: 200
            }
        });

        me.on({
            switchActive: function (config) {
                me.view.showFolder(config.folderid, {
                    loadMask: {
                        start: 200
                    }
                });
            }
        });

        me.relayEvents(me.view, ['folderChanged']);
    },

    onItemContextMenu: function (view, record, item, index, e, eOpts) {
        var me = this,
            perm = me.perm,
            sm = view.getSelectionModel(),
            menu;

        e.stopEvent();
        sm.select(record);

        menu = {
            edit: {
                iconCls: 'yz-glyph yz-glyph-edit',
                text: RS.$('All_Edit'),
                handler: function () {
                    me.view.editFile(record);
                }
            },
            openread: {
                iconCls: 'yz-glyph yz-glyph-e917',
                text: RS.$('All_Open'),
                handler: function () {
                    me.view.viewFile(record);
                }
            },
            $new: {
                iconCls: 'yz-glyph yz-glyph-new',
                text: RS.$('BPA__NewFile'),
                handler: function () {
                    me.view.newFile();
                }
            },
            $clone: {
                iconCls: 'yz-glyph yz-glyph-clone',
                text: RS.$('All_Clone'),
                handler: function () {
                    me.view.cloneFile(record);
                }
            },
            $delete: {
                iconCls: 'yz-glyph yz-glyph-delete',
                text: RS.$('All_Delete'),
                handler: function () {
                    me.view.deleteRecords([record], {
                        maskTarget: me
                    });
                }
            },
            rename: {
                iconCls: 'yz-glyph yz-glyph-rename',
                text: RS.$('All_Rename'),
                handler: function () {
                    me.view.startEdit(record, {
                        maskTarget: me
                    });
                }
            },
            move: {
                iconCls: 'yz-glyph yz-glyph-e60e',
                text: RS.$('All_Move'),
                handler: function () {
                    me.view.moveObjectsToFolder(me.moveroot, me.view.folderid, [record]);
                }
            },
            refresh: {
                iconCls: 'yz-glyph yz-glyph-refresh',
                text: RS.$('All_Refresh'),
                handler: function () {
                    me.view.$refresh();
                }
            },
            opnefolder: {
                iconCls: 'yz-glyph yz-glyph-e917',
                text: RS.$('All_Open'),
                handler: function () {
                    me.view.showFolder(record.data.FolderID, {
                        loadMask: false
                    });
                }
            }
        };

        if (record.data.isFile) {
            if (perm.Edit) {
                menu = [
                    menu.$new,
                    menu.edit,
                    '-',
                    menu.$clone,
                    menu.move,
                    '-',
                    menu.$delete,
                    menu.rename,
                    '-',
                    menu.refresh
                ];
            }
            else if (perm.Auth && record.data.OwnerAccount == userInfo.Account) {
                menu = [
                    menu.$new,
                    menu.edit,
                    '-',
                    menu.$delete,
                    menu.rename,
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
        }
        else {
            menu = [
                menu.opnefolder,
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
            $new: {
                iconCls: 'yz-glyph yz-glyph-new',
                text: RS.$('BPA__NewFile'),
                hidden: !perm.Write && !perm.Auth,
                handler: function () {
                    me.view.newFile();
                }
            },
            refresh: {
                iconCls: 'yz-glyph yz-glyph-refresh',
                text: RS.$('All_Refresh'),
                handler: function () {
                    me.view.$refresh();
                }
            }
        };

        menu = Ext.create('Ext.menu.Menu', {
            margin: '0 0 10 0',
            items: [menu.$new, menu.refresh]
        });

        menu.showAt(e.getXY());
        menu.focus();
    },

    updateStatus: function () {
        var me = this,
            sm = me.view.getSelectionModel(),
            recs = sm.getSelection(),
            hasFolder = false,
            hasOtherUserFile = false;

        Ext.each(recs, function (rec) {
            if (rec.data.isFolder)
                hasFolder = true;
        });

        Ext.each(recs, function (rec) {
            if (rec.data.OwnerAccount != userInfo.Account)
                hasOtherUserFile = true;
        });

        if (me.perm.Auth && !me.perm.Edit) {
            me.btnEdit.setDisabled(!(recs.length == 1 && recs[0].data.isFile && recs[0].data.OwnerAccount == userInfo.Account));
            me.btnRename.setDisabled(!(recs.length == 1 && recs[0].data.isFile && recs[0].data.OwnerAccount == userInfo.Account));
            me.btnDelete.setDisabled(recs.length == 0 || hasFolder || hasOtherUserFile);
        }
        else {
            me.btnShare.setDisabled(!(recs.length == 1 && recs[0].data.isFile));
            me.btnEdit.setDisabled(!(recs.length == 1 && recs[0].data.isFile));
            me.btnDelete.setDisabled(recs.length == 0 || hasFolder);
            me.menuRename.setDisabled(recs.length != 1 || hasFolder);
            me.menuMove.setDisabled(recs.length == 0 || hasFolder);
        }
    }
});