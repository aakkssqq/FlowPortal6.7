
/*
config
    folderid,
    foldername,
    perm
*/
Ext.define('YZSoft.bpa.library.lib.Panel', {
    extend: 'YZSoft.bpa.src.panel.LibraryPanel',

    constructor: function (config) {
        var me = this;

        config.storeConfig = Ext.apply({
            root: {
                text: config.foldername || RS.$('All_Library'),
                path: config.folderid,
                FolderType: 'BPALibrary',
                expanded: false
            }
        }, config.storeConfig);

        me.callParent(arguments);
    },

    getXClass: function () {
        return 'YZSoft.bpa.library.lib.viewer';
    },

    getViewConfig: function (record) {
        var me = this,
            catRec = record.getCategoryRecord();

        return {
            padding:'0 0 0 40',
            moveroot:{
                text: catRec.data.text,
                path: catRec.getId()
            }
        };
    },

    onItemContextMenu: function (tree, record, item, index, e, eOpts) {
        var me = this,
            folderType = record.data.FolderType,
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
                    newou: {
                        iconCls: 'yz-glyph yz-glyph-new',
                        text: RS.$('Org_CreateChildOU'),
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
                    if (perm.AssignPermision) {
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
                else if (record.isCategoryFolder()) {
                    if (perm.Write && perm.AssignPermision) {
                        menu = [
                            folderType == 'BPAOU' ? menu.newou : menu.$new,
                            menu.refresh,
                            '-',
                            menu.security
                        ]
                    }
                    else if (perm.Write) {
                        menu = [
                            folderType == 'BPAOU' ? menu.newou : menu.$new,
                            menu.refresh,
                        ]
                    }
                    else if (perm.AssignPermision) {
                        menu = [
                            menu.refresh,
                            menu.security
                        ]
                    }
                    else {
                        menu = [
                            menu.refresh
                        ]
                    }
                }
                else {
                    if (perm.Write && perm.AssignPermision) {
                        menu = [
                            folderType == 'BPAOU' ? menu.newou : menu.$new,
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
                            folderType == 'BPAOU' ? menu.newou : menu.$new,
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