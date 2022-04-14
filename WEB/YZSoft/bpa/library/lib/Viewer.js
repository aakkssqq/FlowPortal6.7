
/*
config
    folderid
*/
Ext.define('YZSoft.bpa.library.lib.viewer', {
    extend: 'Ext.container.Container',
    layout: 'border',
    style: 'background-color:white',

    constructor: function (config) {
        var me = this,
            config = config || {},
            folderid = config.folderid,
            perm, cfg;

        delete config.perm;

        me.btnNewProcess = Ext.create('Ext.button.Button', {
            text: RS.$('All_New'),
            hidden: true,
            ui: 'default-toolbar',
            cls: 'bpa-btn-solid-hot',
            handler: function () {
                me.view.newFile();
            }
        });

        me.btnRefresh = Ext.create('Ext.button.Button', {
            text: RS.$('All_Refresh'),
            ui: 'default-toolbar',
            iconCls: 'yz-glyph yz-glyph-refresh',
            cls: 'bpa-btn-solid',
            margin: '0 0 0 10',
            handler: function () {
                me.view.$refresh();
            }
        });

        me.crumb = Ext.create('YZSoft.src.toolbar.Breadcrumb', Ext.apply({
            showIcons: false,
            showMenuIcons: false
        }, config.crumbConfig));

        me.toolbar = Ext.create('Ext.container.Container', {
            region: 'north',
            margin: '20 20 26 0',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [me.crumb, { xtype: 'tbfill' }, me.btnNewProcess, me.btnRefresh]
        });

        me.view = Ext.create('YZSoft.bpa.src.view.FileView', {
            region: 'center',
            folderid: folderid,
            checkpermision: true,
            securitymodel: 'RBAC'
        });

        me.view.on({
            scope: me,
            folderChanged: function (folderid) {
                me.applyFolderPermision(folderid);
                var node = me.crumb.getStore().getNodeById(folderid);
                if (node) {
                    me.crumb.suspendEvent('selectionchange');
                    me.crumb.setSelection(node);
                    me.crumb.resumeEvent('selectionchange');
                }
            },
            itemdblclick: function (view, record) {
                if (record.data.isFile) {
                    if (me.perm.Write)
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
            items: [me.toolbar, me.view]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();

        me.view.showFolder(folderid, {
            loadMask: false
        });

        me.on({
            switchActive: function (config) {
                me.view.showFolder(config.folderid, {
                    loadMask: false
                });
            }
        });

        me.relayEvents(me.view, ['folderChanged']);
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

        if (me.btnNewProcess)
            me.btnNewProcess.setVisible(perm.Write);

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
            edit: {
                iconCls: 'yz-glyph yz-glyph-edit',
                text: RS.$('All_Edit'),
                disabled: !perm.Write,
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
                disabled: !perm.Write,
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
                disabled: !perm.Write,
                handler: function () {
                    me.view.deleteRecords([record], {
                        maskTarget: me
                    });
                }
            },
            rename: {
                iconCls: 'yz-glyph yz-glyph-rename',
                text: RS.$('All_Rename'),
                disabled: !perm.Write,
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
            if (perm.Write) {
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
                hidden: !perm.Write,
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
            recs = sm.getSelection();
    }
});