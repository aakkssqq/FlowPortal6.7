
/*
config
    folderid,
    foldername,
    perm
*/
Ext.define('YZSoft.src.lib.panel.DocumentPanel', {
    extend: 'YZSoft.src.lib.panel.Base',

    getMoveExcludeFolder: function (rec) {
        return [rec.getId()];
    },

    constructor: function (config) {
        var me = this,
            root;

        config.storeConfig = Ext.apply({
            root: {
                text: config.foldername || RS.$('All_Library'),
                path: config.folderid,
                FolderType: 'Document',
                expanded: false
            }
        }, config.storeConfig);

        me.callParent(arguments);

        me.tree.on({
            scope: me,
            single: true,
            afterrender: function () {
                var tree = me.tree,
                    root = tree.getRootNode(),
                    sm = tree.getSelectionModel();

                root.expand(false, function () {
                    tree.getView().refresh();
                    sm.select((root && root.firstChild) || root);
                });
            }
        });
    },

    getXClass: function () {
        return 'YZSoft.src.lib.viewer.DocumentViewer';
    },

    getViewConfig: function (record) {
        var me = this,
            root = me.store.getRoot();

        return {
            padding: '0 40 30 40',
            moveroot: {
                text: root.data.text,
                path: root.getId()
            }
        };
    },

    onItemContextMenu: function (tree, record, item, index, e, eOpts) {
        var me = this,
            items, menu;

        e.stopEvent();

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            params: {
                method: 'CheckPermisions',
                rsid: record.getRsid(),
                perms: 'Write,AssignPermision'
            },
            success: function (action) {
                var perm = action.result;

                menu = {
                    $new: {
                        iconCls: 'yz-glyph yz-glyph-e649',
                        text: RS.$('All_NewChildFolder'),
                        disabled: !perm.Write,
                        handler: function () {
                            me.createChildFolder(record);
                        }
                    },
                    $delete: {
                        iconCls: 'yz-glyph yz-glyph-delete',
                        text: RS.$('All_Delete'),
                        disabled: !perm.Write,
                        handler: function () {
                            me.deleteFolder(record);
                        }
                    },
                    rename: {
                        iconCls: 'yz-glyph yz-glyph-rename',
                        text: RS.$('All_Rename'),
                        disabled: !perm.Write,
                        handler: function () {
                            me.cellEditing.startEdit(record, 0);
                        }
                    },
                    move: {
                        iconCls: 'yz-glyph yz-glyph-e60e',
                        text: RS.$('All_Move'),
                        disabled: !perm.Write,
                        handler: function () {
                            me.moveFolder(record);
                        }
                    },
                    refresh: {
                        iconCls: 'yz-glyph yz-glyph-refresh',
                        text: RS.$('All_Refresh'),
                        handler: function () {
                            record.set('expanded', true);
                            me.store.load({
                                node: record
                            });
                        }
                    },
                    security: {
                        iconCls: 'yz-glyph yz-glyph-property',
                        text: RS.$('All_Permision'),
                        disabled: !perm.AssignPermision,
                        handler: function () {
                            me.showFolderPropertyDlg(record);
                        }
                    }
                };

                if (record.isRoot()) {
                    if (perm.Write && perm.AssignPermision) {
                        menu = [
                            menu.$new,
                            menu.refresh,
                            '-',
                            menu.security
                        ];
                    }
                    else if (perm.Write) {
                        menu = [
                            menu.$new,
                            menu.refresh
                        ];
                    }
                    else if (perm.AssignPermision) {
                        menu = [
                            menu.refresh,
                            menu.security
                        ];
                    }
                    else {
                        menu = [
                            menu.refresh
                        ];
                    }
                }
                else {
                    if (perm.Write && perm.AssignPermision) {
                        menu = [
                            menu.$new,
                            '-',
                            menu.$delete,
                            menu.rename,
                            menu.move,
                            menu.refresh,
                            '-',
                            menu.security
                        ];
                    }
                    else if (perm.Write) {
                        menu = [
                            menu.$new,
                            '-',
                            menu.$delete,
                            menu.rename,
                            menu.move,
                            '-',
                            menu.refresh
                        ];
                    }
                    else if (perm.AssignPermision) {
                        menu = [
                            menu.refresh,
                            menu.security
                        ];
                    }
                    else {
                        menu = [
                            menu.refresh
                        ];
                    }
                }

                menu = Ext.create('Ext.menu.Menu', {
                    margin: '0 0 10 0',
                    items: menu
                });

                menu.showAt(e.getXY());
                menu.focus();
            }
        });
    }
});