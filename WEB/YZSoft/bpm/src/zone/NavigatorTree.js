/*
config:
storeZoneType
funcPanelXClass
securityResType
folderPerms
*/
Ext.define('YZSoft.bpm.src.zone.NavigatorTree', {
    extend: 'Ext.tree.Panel',
    requires: [
        'YZSoft.bpm.src.model.StoreFolder'
    ],
    border: false,
    storeZoneType: '',
    securityResType: '',
    funcPanelXClass: '',
    folderPerms: [{
        PermName: 'Read',
        PermType: 'Module',
        PermDisplayName: RS.$('All_Perm_Read')
    }, {
        PermName: 'Write',
        PermType: 'Module',
        PermDisplayName: RS.$('All_Perm_Write')
    }],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.TreeStore', Ext.apply({
            autoLoad: false,
            model: 'YZSoft.bpm.src.model.StoreFolder',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/StoreService.ashx'),
                extraParams: {
                    method: 'GetFolders',
                    zone: config.storeZoneType,
                    expand: false
                }
            }
        }, config.store));

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: false,
            listeners: {
                validateedit: function (editor, context, eOpts) {
                    me.onValidateEdit(editor, context, eOpts);
                }
            }
        });

        me.dd = Ext.create('Ext.tree.plugin.TreeViewDragDrop', {
            dragZone: {
                isPreventDrag: function (e, record, item, index) {
                    return record.isPreventDrag();
                }
            },
            dropZone: {
                indicatorCls: 'yz-tree-ddindicator'
            }
        });

        cfg = {
            header: false,
            plugins: [me.cellEditing],
            rootVisible: true,
            useArrows: true,
            store: me.store,
            hideHeaders: true,
            columns: [{
                xtype: 'treecolumn',
                dataIndex: 'text',
                flex: 1,
                editor: { xtype: 'textfield' }
            }],
            root: Ext.apply({
                text: 'root',
                path: 'root',
                rsid: '',
                expanded: false
            }, config.root),
            viewConfig: {
                plugins: [me.dd],
                listeners: {
                    scope: me,
                    nodedragover: 'onNodeDragOver',
                    beforedrop: 'onBeforeItemDrop'
                }
            }
        };

        delete config.root;

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            single: true,
            afterrender: function (tree, eOpts) {
                var root = this.getRootNode(),
                    store = this.getStore(),
                    sm = this.getSelectionModel();

                sm.select(root);
                store.load({
                    loadMask: $S.loadMask.first.loadMask,
                    callback: function () {
                        root.expand(false);
                    }
                });
            }
        });

        me.on({
            scope: me,
            itemcontextmenu: 'onItemContextMenu'
        });
    },

    onItemContextMenu: function (view, record, item, index, e) {
        var me = this,
            isRoot = record.isRoot(),
            menu;

        e.stopEvent();

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            params: {
                method: 'CheckPermisions',
                rsid: record.data.rsid,
                perms: 'Write'
            },
            success: function (action) {
                var perm = record.data.perm = action.result;

                menu = {
                    $new: {
                        iconCls: 'yz-glyph yz-glyph-e649',
                        text: RS.$('All_NewChildFolder'),
                        disabled: !perm.Write,
                        handler: function () {
                            me.onCreateFolderClicked(record);
                        }
                    },
                    $delete: {
                        iconCls: 'yz-glyph yz-glyph-delete',
                        text: RS.$('All_Delete'),
                        disabled: !perm.Write,
                        handler: function () {
                            me.onDeleteFolderClicked(record);
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
                    property: {
                        iconCls: 'yz-glyph yz-glyph-property',
                        text: RS.$('All_Property'),
                        handler: function () {
                            me.onPropertyClicked(record);
                        }
                    },
                    sp: {
                        xtype: 'menuseparator'
                    }
                };

                var menufolder = [
                    menu.$new,
                    menu.sp,
                    menu.$delete,
                    menu.rename,
                    menu.refresh,
                    menu.sp,
                    menu.property
                ];

                var menuroot = [
                    menu.$new,
                    menu.refresh,
                    menu.sp,
                    menu.property
                ];

                menu = Ext.create('Ext.menu.Menu', {
                    margin: '0 0 10 0',
                    items: isRoot ? menuroot : menufolder
                });

                menu.showAt(e.getXY());
                menu.focus();
            }
        });
    },

    onPropertyClicked: function (record) {
        var me = this,
            path = record.data.path,
            path = path == 'root' ? '' : path;

        Ext.create('YZSoft.bpm.src.zone.FolderDlg', {
            autoShow: true,
            title: !path ? Ext.String.format('{0} - {1}', record.data.text, RS.$('All_Root')) : Ext.String.format('{0} - {1}', RS.$('All_Folder'), record.data.text),
            rsid: record.data.rsid,
            readOnly: !record.data.perm.Write,
            path: path,
            securityResType: me.securityResType,
            perms: me.folderPerms,
            fn: function () {
                me.store.load({ node: record });
            }
        });
    },

    onCreateFolderClicked: function (record) {
        var me = this,
            path = record.data.path,
            path = path == 'root' ? '' : path;

        record.expand();
        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/StoreService.ashx'),
            params: {
                method: 'CreateNewFolder',
                zone: me.storeZoneType,
                path: path
            },
            success: function (action) {
                var newrec = record.appendChild(Ext.apply(action.result, {
                    expanded: false,
                    expandable: false
                }));

                me.getSelectionModel().select(newrec);
                me.cellEditing.startEdit(newrec, 0);
            }
        });
    },

    onDeleteFolderClicked: function (rec) {
        var me = this;

        Ext.Msg.show({
            title: RS.$('All_DeleteConfirm_Title'),
            msg: Ext.String.format(RS.$('All_DeleteFolderCfm_Msg'), rec.data.text),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'cancel',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/StoreService.ashx'),
                    params: {
                        method: 'DeleteFolder',
                        zone: me.storeZoneType,
                        path: rec.data.path
                    },
                    waitMsg: {
                        msg: RS.$('All_Deleting'),
                        target: Ext.getBody(),
                        start: 0
                    },
                    success: function (action) {
                        var nselrec = rec.nextSibling || rec.previousSibling || rec.parentNode;

                        rec.remove();            
                        nselrec && me.getSelectionModel().select(nselrec);

                        me.fireEvent('afterdeleterecord', rec);
                    }
                });
            }
        });
    },

    onValidateEdit: function (editor, context, eOpts) {
        var me = this,
            rec = context.record;

        context.value = Ext.String.trim(context.value);

        if (context.originalValue == context.value)
            return;

        if (!context.value) {
            context.cancel = true;
            return;
        }

        var err = $objname(context.value);
        if (err !== true) {
            YZSoft.alert(err);
            context.cancel = true;
            return;
        }

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/StoreService.ashx'),
            params: {
                method: 'RenameFolder',
                zone: me.storeZoneType,
                path: rec.data.path,
                newname: context.value
            },
            success: function (action) {
                var newname = action.result,
                    ppath = rec.parentNode.data.path,
                    ppath = ppath == 'root' ? '' : ppath + '/',
                    path = ppath + newname;

                rec.set('text', newname);
                rec.updatePath();
            },
            failure: function (action) {
                var me = this;
                YZSoft.alert(action.result.errorMessage, function () {
                    me.exception();
                });
            },
            exception: function () {
                rec.set('text', context.originalValue);
            }
        });
    },

    onNodeDragOver: function (targetNode, position, dragData, e, eOpts) {
        return targetNode.isPreventDrop(dragData.records, position, dragData, e, eOpts) ? false : true;
    },

    onBeforeItemDrop: function (node, data, overModel, dropPosition, dropHandlers, eOpts) {
        var me = this,
            tree = me,
            view = tree.getView(),
            targetRec = view.getRecord(node),
            targetPath = targetRec.data.path,
            targetPath = targetPath == 'root' ? '' : targetPath,
            newParentRec = targetRec,
            paths = [];

        Ext.Array.each(data.records, function (rec) {
            paths.push(rec.data.path);
        });

        dropHandlers.wait = true;
        YZSoft.Ajax.request({
            method: 'POST',
            exception: false,
            url: YZSoft.$url('YZSoft.Services.REST/BPM/StoreService.ashx'),
            params: {
                method: 'MoveFolders',
                zone: me.storeZoneType,
                targetPath: targetPath,
                position: dropPosition
            },
            jsonData: paths,
            waitMsg: {
                msg: RS.$('All_Moving'),
                target: me
            },
            success: function (action) {
                dropHandlers.processDrop();

                Ext.Array.each(data.records, function (rec) {
                    rec.updatePath();
                });
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage);
                dropHandlers.cancelDrop();
            }
        });
    }
});
