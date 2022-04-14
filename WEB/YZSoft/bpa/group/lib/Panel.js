
/*
config
    folderid
    perm
    groupInfo
*/
Ext.define('YZSoft.bpa.group.lib.Panel', {
    extend: 'YZSoft.bpa.src.panel.LibraryPanel',
    securitymodel: 'Role',
    split: {
        cls: 'yz-splitter-transparent',
        size: 4,
        collapsible: true
    },

    constructor: function (config) {
        var me = this;

        config.storeConfig = Ext.apply({
            root: {
                text: RS.$('BPA__GroupFolder'),
                path: config.folderid,
                FolderType: 'BPAGroup',
                expanded: false
            }
        }, config.storeConfig);

        me.callParent(arguments);
    },

    getXClass: function () {
        return 'YZSoft.bpa.group.lib.Viewer';
    },

    getViewConfig: function (record) {
        var me = this,
            catRec = record.getCategoryRecord();

        return {
            padding: '0 0 0 40',
            groupInfo: me.groupInfo,
            moveroot: {
                text: catRec.data.text,
                path: catRec.getId()
            }
        };
    },

    onItemContextMenu: function (tree, record, item, index, e, eOpts) {
        var me = this,
            folderType = record.data.FolderType,
            perm = me.perm,
            items, menu;

        e.stopEvent();

        menu = {
            $new: {
                iconCls: 'yz-glyph yz-glyph-e649',
                text: RS.$('All_NewChildFolder'),
                handler: function () {
                    me.createChildFolder(record);
                }
            },
            newou: {
                iconCls: 'yz-glyph yz-glyph-new',
                text: RS.$('Org_CreateChildOU'),
                handler: function () {
                    me.createChildFolder(record);
                }
            },
            $delete: {
                iconCls: 'yz-glyph yz-glyph-delete',
                text: RS.$('All_Delete'),
                handler: function () {
                    me.deleteFolder(record);
                }
            },
            rename: {
                iconCls: 'yz-glyph yz-glyph-rename',
                text: RS.$('All_Rename'),
                handler: function () {
                    me.cellEditing.startEdit(record, 0);
                }
            },
            move: {
                iconCls: 'yz-glyph yz-glyph-e60e',
                text: RS.$('All_Move'),
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
            }
        };

        if (record.isRoot()) {
            menu = [
                menu.refresh
            ];
        }
        else if (record.isCategoryFolder()) {
            if (perm.Edit) {
                menu = [
                    folderType == 'BPAOU' ? menu.newou : menu.$new,
                    menu.refresh,
                ];
            }
            else {
                menu = [
                    menu.refresh
                ];
            }
        }
        else {
            if (perm.Edit) {
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