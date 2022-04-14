
Ext.define('YZSoft.src.library.zone.Panel', {
    extend: 'YZSoft.src.library.pathbased.Panel',
    treeConfig: {
        xclass: 'YZSoft.src.library.zone.Tree'
    },
    addNewObjectText: RS.$('All_Zone_AddNew'),
    onActivate: function (times) {
        if (times != 0)
            this.viewStore.reload($S.loadMask.activate);
    },
    addNew: Ext.emptyFn,
    storeZoneType: null,
    viewMoveObjectsConfig: {
        dlgConfig: {
            cancopy: true
        }
    },

    treeShowFolderProperty: function (record) {
        var me = this,
            path = me.treeGetFolderId(record);

        Ext.create('YZSoft.bpm.src.zone.FolderDlg', {
            autoShow: true,
            title: !path ? Ext.String.format('{0} - {1}', record.data.text, RS.$('All_Root')) : Ext.String.format('{0} - {1}', RS.$('All_Folder'), record.data.text),
            rsid: record.data.rsid,
            readOnly: !record.data.perm.Write,
            path: path,
            securityResType: me.folderSecurityResType,
            perms: me.folderPerms,
            fn: function () {
                me.treeStore.load({
                    node: record
                });
            }
        });
    },

    viewMoveObjects: function (config) {
        var me = this,
            folder = me.view.folderId,
            view = me.view.getActiveView(),
            store = view.getStore(),
            sm = view.getSelectionModel(),
            recs = sm.getSelection(),
            nameField = me.objectNameField,
            versionField = me.objectVersionField,
            names = [];

        if (recs.length == 0)
            return;

        Ext.each(recs, function (rec) {
            names.push(nameField ? rec.data[nameField] : rec.getId());
        });

        Ext.create('YZSoft.bpm.src.dialogs.SelStoreFolderDlg', Ext.apply({
            autoShow: true,
            title: RS.$('All_MoveStoreObjectsTo'),
            zone: me.storeZoneType,
            excludefolder: folder,
            perm: 'Write',
            fn: function (rec, copy) {
                if (rec == null)
                    return;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: me.serviceUrl,
                    params: {
                        method: 'MoveObjectsToFolder',
                        srcfolder: folder,
                        tagfolder: rec.data.path == 'root' ? '' : rec.data.path,
                        copy: copy
                    },
                    jsonData: names,
                    waitMsg: {
                        msg: copy ? RS.$('All_Copying') : RS.$('All_Moving'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        store.reload({
                            loadMask: {
                                msg: Ext.String.format(copy ? RS.$('All_Copy_Success_Multi') : RS.$('All_Move_Success_Multi'), recs.length),
                                msgCls: 'yz-mask-msg-success',
                                target: me,
                                start: 0,
                                stay: 'xxx'
                            },
                            callback: config && config.callback
                        });
                    },
                    failure: function (action) {
                        var mbox = Ext.Msg.show({
                            title: RS.$('All_Warning'),
                            msg: RS.$1(action.result.errorMessage),
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });

                        store.reload({ mbox: mbox });
                    }
                });
            }
        }, me.viewMoveObjectsConfig && me.viewMoveObjectsConfig.dlgConfig));
    },

    onTreeItemContextMenu: function (view, record, item, index, e) {
        var me = this,
            isRoot = record.isRoot(),
            folderId = me.treeGetFolderId(record),
            menu, perm, menufolder, menuroot;

        e.stopEvent();

        YZSoft.Ajax.request({
            url: me.serviceUrl,
            params: {
                method: 'CheckFolderPermisions',
                folderId: folderId,
                perms: 'Write'
            },
            success: function (action) {
                perm = record.data.perm = action.result;

                menu = {
                    $new: {
                        iconCls: 'yz-glyph yz-glyph-e649',
                        text: RS.$('All_NewChildFolder'),
                        disabled: !perm.Write,
                        handler: function () {
                            me.treeCreateChildFolder(record);
                        }
                    },
                    $delete: {
                        iconCls: 'yz-glyph yz-glyph-delete',
                        text: RS.$('All_Delete'),
                        disabled: !perm.Write,
                        handler: function () {
                            me.treeDeleteFolder(record);
                        }
                    },
                    rename: {
                        iconCls: 'yz-glyph yz-glyph-rename',
                        text: RS.$('All_Rename'),
                        disabled: !perm.Write,
                        handler: function () {
                            me.treeStartRenameFolder(record);
                        }
                    },
                    refresh: {
                        iconCls: 'yz-glyph yz-glyph-refresh',
                        text: RS.$('All_Refresh'),
                        handler: function () {
                            me.treeRefreshNode(record);
                        }
                    },
                    property: {
                        iconCls: 'yz-glyph yz-glyph-property',
                        text: RS.$('All_Property'),
                        handler: function () {
                            me.treeShowFolderProperty(record);
                        }
                    },
                    sp: {
                        xtype: 'menuseparator'
                    }
                };

                menufolder = [
                    menu.$new,
                    menu.sp,
                    menu.$delete,
                    menu.rename,
                    menu.refresh,
                    menu.sp,
                    menu.property
                ];

                menuroot = [
                    menu.$new,
                    menu.refresh,
                    menu.sp,
                    menu.property
                ];

                menu = Ext.create('Ext.menu.Menu', {
                    margin: '0 0 10 0',
                    items: isRoot ? menuroot : menufolder,
                    defaults: {
                        clickHideDelay: 0
                    },
                    listeners: {
                        hide: function (menu) {
                            //menu.destroy();
                        }
                    }
                });

                menu.showAt(e.getXY());
                menu.focus();
            }
        });
    },

    onViewObjectContextMenu: function (record, e) {
        var me = this,
            view = me.view,
            sm = view.getActiveView().getSelectionModel(),
            recs = sm.getSelection(),
            hasFolder = me.hasFolderSelected(),
            menu, perm, menufolder, menuroot;

        e.stopEvent();

        menu = {
            edit: {
                iconCls: 'yz-glyph yz-glyph-edit',
                text: RS.$('All_Edit'),
                disabled: hasFolder || !me.IsOptEnable('Write',null, 1, 1),
                handler: function () {
                    me.edit(record);
                }
            },
            clone: {
                iconCls: 'yz-glyph yz-glyph-clone',
                text: RS.$('All_Clone'),
                disabled: hasFolder || !me.IsOptEnable('Write', null, 1, -1),
                handler: function () {
                    me.viewCloneSelection();
                }
            },
            move: {
                iconCls: 'yz-glyph yz-glyph-e60e',
                text: RS.$('All_MoveStoreObjects'),
                disabled: hasFolder || !me.IsOptEnable('Write', null, 1, -1),
                handler: function () {
                    me.viewMoveObjects();
                }
            },
            $delete: {
                iconCls: 'yz-glyph yz-glyph-delete',
                text: RS.$('All_Delete'),
                disabled: hasFolder || !me.IsOptEnable('Write', null, 1, -1),
                handler: function () {
                    me.viewDeleteSelection();
                }
            },
            rename: {
                iconCls: 'yz-glyph yz-glyph-rename',
                text: RS.$('All_Rename'),
                disabled: hasFolder || !me.IsOptEnable('Write', null, 1, 1),
                handler: function () {
                    me.viewStartRenameObject(record);
                }
            },
            refresh: {
                iconCls: 'yz-glyph yz-glyph-refresh',
                text: RS.$('All_Refresh'),
                handler: function () {
                    me.viewRefresh();
                }
            },
            sp: {
                xtype: 'menuseparator'
            }
        };

        menu = Ext.create('Ext.menu.Menu', {
            margin: '0 0 10 0',
            defaults: {
                clickHideDelay: 0
            },
            items: [
                menu.edit,
                menu.sp,
                menu.clone,
                menu.move,
                menu.sp,
                menu.$delete,
                menu.rename,
                menu.refresh
            ],
            listeners: {
                hide: function (menu) {
                    //menu.destroy();
                }
            }
        });

        menu.showAt(e.getXY());
        menu.focus();
    },

    onViewFolderContextMenu: function (view, e, eOpts) {
        var me = this,
            view = me.view,
            sm = view.getActiveView().getSelectionModel(),
            recs = sm.getSelection(),
            menu, perm, menufolder, menuroot;

        e.stopEvent();

        menu = {
            open: {
                iconCls: 'yz-glyph yz-glyph-e917',
                text: RS.$('All_Open'),
                disabled: !me.IsOptEnable(null, null, 1, 1),
                handler: function () {
                    me.view.openFolderByRecord(recs[0]);
                }
            },
            refresh: {
                iconCls: 'yz-glyph yz-glyph-refresh',
                text: RS.$('All_Refresh'),
                handler: function () {
                    me.viewRefresh();
                }
            },
            sp: {
                xtype: 'menuseparator'
            }
        };

        menu = Ext.create('Ext.menu.Menu', {
            margin: '0 0 10 0',
            defaults: {
                clickHideDelay: 0
            },
            items: [
                menu.open,
                menu.sp,
                menu.refresh
            ],
            listeners: {
                hide: function (menu) {
                    //menu.destroy();
                }
            }
        });

        menu.showAt(e.getXY());
        menu.focus();
    },

    onViewContainerContextMenu: function (view, e, eOpts) {
        var me = this,
            view = me.view,
            sm = view.getActiveView().getSelectionModel(),
            menu, perm, menufolder, menuroot;

        e.stopEvent();

        menu = {
            newObject: me.getObjectContextMenuNewMenuItems ? {
                iconCls: 'yz-glyph yz-glyph-e61d',
                text: me.addNewObjectText,
                disabled: !me.IsOptEnable('Write', null, -1, -1),
                menu: Ext.apply({
                    items: me.getObjectContextMenuNewMenuItems()
                }, me.newObjectMenu)
            } : {
                iconCls: 'yz-glyph yz-glyph-e61d',
                text: me.addNewObjectText,
                disabled: !me.IsOptEnable('Write', null, -1, -1),
                handler: function () {
                    me.addNew();
                }
            },
            refresh: {
                iconCls: 'yz-glyph yz-glyph-refresh',
                text: RS.$('All_Refresh'),
                handler: function () {
                    me.viewRefresh();
                }
            },
            sp: {
                xtype: 'menuseparator'
            }
        };

        menu = Ext.create('Ext.menu.Menu', {
            margin: '0 0 10 0',
            defaults: {
                clickHideDelay: 0
            },
            items: [
                menu.newObject,
                menu.sp,
                menu.refresh
            ],
            listeners: {
                hide: function (menu) {
                    //menu.destroy();
                }
            }
        });

        menu.showAt(e.getXY());
        menu.focus();
    }
});