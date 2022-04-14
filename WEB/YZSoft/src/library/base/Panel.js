/*
events:
viewaftercheckfolderpermision
*/
Ext.define('YZSoft.src.library.base.Panel', {
    extend: 'Ext.panel.Panel',
    serviceUrl: null,
    viewType: 'detail',
    objectNameField: 'Name',
    objectVersionField: null,
    viewStoreConfig: {
        xclass:'YZSoft.src.library.base.data.FolderStore'
    },
    treeStoreConfig: {
        xclass: 'Ext.data.TreeStore'
    },
    treeConfig: {
        xclass:'YZSoft.src.library.base.Tree'
    },
    viewConfig: {
        xclass: 'YZSoft.src.library.base.View',
        region: 'center'
    },
    crumbConfig: {
        xclass: 'YZSoft.src.library.base.Breadcrumb',
        showIcons: false,
        showMenuIcons: false
    },
    openFolderCheckPerms: ['Write'],
    treeUpdatePath: Ext.emptyFn,
    edit: Ext.emptyFn,
    onTreeItemContextMenu: Ext.emptyFn,
    onViewAfterCheckFolderPermision: Ext.emptyFn,
    onViewFolderContextMenu: Ext.emptyFn,
    onViewObjectContextMenu: Ext.emptyFn,
    onViewContainerContextMenu: Ext.emptyFn,
    onViewObjectRenamed: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        if (me.tree) {
            me.mon(me.tree, {
                scope:me,
                selectionchange: 'onTreeSelectionChange',
                itemcontextmenu: 'onTreeItemContextMenu',
                containercontextmenu: 'onTreeContainerContextMenu'
            });

            me.mon(me.tree.cellEditing, {
                scope: me,
                validateedit: 'onTreeValidateEdit'
            });

            me.tree.getView().on({
                scope: me,
                nodedragover: 'onTreeFolderDragOver',
                beforedrop: 'onTreeFolderBeforeDrop'
            });
        }

        me.mon(me.view, {
            afteropenfolderbymanual: 'onViewAfterOpenFolderByManual',
            beforeopenfolder: 'onViewBeforeOpenFolder',
            objectdblclick: 'onViewObjectDblClick',
            foldercontextmenu: 'onViewFolderContextMenu',
            objectcontextmenu: 'onViewObjectContextMenu',
            containercontextmenu: 'onViewContainerContextMenu',
            validateedit: 'onViewValidateEdit',
            folderremove: function (folderId, records) {
                var parentRec = me.treeStore.getById(folderId);
                if (parentRec) {
                    var recs = [];
                    Ext.each(records, function (rec) {
                        var name = rec.get(me.objectNameField);
                        var childRec = parentRec.findChild('text', name);
                        if (childRec) {
                            parentRec.removeChild(childRec,true);
                        }
                    });
                }
            }
        });

        if (me.crumb) {
            me.mon(me.crumb, {
                afteropenfolderbyselect: 'onCrumbAfterOpenFolderBySelect',
            });
        }

        me.on({
            viewaftercheckfolderpermision: 'onViewAfterCheckFolderPermision'
        })
    },

    createViewStore: function (config) {
        var me = this;

        config = config || {};

        return Ext.create(config.xclass || me.viewStoreConfig.xclass, Ext.apply({
            remoteSort: false,
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: me.serviceUrl,
                extraParams: {
                    method: 'GetFolderObjects',
                    folderId: null
                }
            }
        }, config, me.viewStoreConfig));
    },

    createTreeStore: function (config) {
        var me = this;

        config = config || {};

        return Ext.create(config.xclass || me.treeStoreConfig.xclass, Ext.apply({
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: me.serviceUrl,
                extraParams: {
                    method: 'GetFolders',
                    expand: false
                }
            }
        }, config, me.treeStoreConfig));
    },

    createTree: function (config) {
        var me = this;

        config = config || {};

        return Ext.create(config.xclass || me.treeConfig.xclass, Ext.apply({
            libPanel: me,
            store: me.treeStore
        }, config, me.treeConfig));
    },

    createTreePanel: function (config) {
        var me = this;

        config = config || {};

        return Ext.create('Ext.panel.Panel', Ext.merge({
            region: 'west',
            width: 295,
            minWidth: 100,
            maxWidth: 500,
            split: {
                size: 5,
                collapseOnDblClick: false,
                collapsible: true
            },
            collapsible: false,
            layout: 'fit',
            tbar: {
                cls: 'yz-tbar-navigator'
            }
        }, config));
    },

    createView: function (config) {
        var me = this;

        config = config || {};

        return Ext.create(config.xclass || me.viewConfig.xclass, Ext.apply({
            libPanel: me,
            store: me.viewStore
        }, config, me.viewConfig));
    },

    createCrumb: function (config) {
        var me = this;

        config = config || {};

        return Ext.create(config.xclass || me.crumbConfig.xclass, Ext.apply({
            libPanel: me,
            store: me.treeStore
        }, config, me.crumbConfig));
    },

    createCollapseTreeButton: function (config) {
        var me = this;

        return Ext.create('Ext.button.Button', Ext.apply({
            iconCls: 'yz-glyph yz-glyph-collapse',
            tooltip: RS.$('All_Collapse'),
            scope: me,
            handler: function () {
                me.collapseTreePanel();
            }
        }, config));
    },

    createRefreshTreeButton: function (config) {
        var me = this;

        return Ext.create('Ext.button.Button', Ext.apply({
            iconCls: 'yz-glyph yz-glyph-refresh',
            tooltip: RS.$('All_Refresh'),
            handler: function () {
                me.treeRefresh();
            }
        },config));
    },

    hasFolderSelected:function(){
        var me = this,
            view = me.view,
            sm = view.getActiveView().getSelectionModel(),
            recs = sm.getSelection();

        return !!Ext.Array.findBy(recs, function (rec) {
            return rec.data.$$$isFolder;
        });
    },

    getFolderPath: function (folderId, fn) {
        var me = this;

        if (!folderId) //根目录的FolderId使用空表示
            null;

        YZSoft.Ajax.request({
            url: me.serviceUrl,
            waitMsg: false,
            params: {
                method: 'GetFolderPath',
                folderId: folderId
            },
            success: function (action) {
                fn && fn(action.result);
            }
        });
    },

    collapseTreePanel: function () {
        var me = this;

        if (!me.treePanel)
            return;

        me.treePanel.collapse();
    },

    combileChildFolderId: function (parentFolderId, viewRecord) {
        return this.treeGetFolderId(viewRecord);
    },

    IsOptEnable: function (modulePerm, recordPerm, minSelection, maxSelection) {
        var me = this,
            activeView = me.view.getActiveView();

        return YZSoft.UIHelper.IsOptEnable(me.view.folderPerm, modulePerm, activeView.getSelectionModel(), recordPerm, minSelection, maxSelection);
    },

    toggleTree:function(){
        var me = this,
            treePanel = me.treePanel;

        treePanel[treePanel.isHidden() ? 'show' : 'hide']();
    },

    treeGetRecordPyhPath: function (rec, field) {
        var field = field || 'text',
            separator = '/',
            path = []

        while (rec && !rec.isRoot()) {
            path.unshift(rec.get(field));
            rec = rec.parentNode;
        }
        return path.join(separator);
    },

    treeGetFolderId: function (record) {
        return record.getId()
    },

    treeIsFolderPreventDrag: function (e, record, item, index) {
        return record.isRoot();
    },

    treeIsFolderPreventDrop: function (tagRecord, records, position, dragData, e, eOpts) {
        if (tagRecord.isRoot() && position != 'append')
            return true;
    },

    treeRefresh: function (config) {
        var me = this;

        if (!me.tree)
            return;

        me.tree.store.load(Ext.apply({
            loadMask: true
        }, config));
    },

    treeRefreshNode: function (record,config) {
        var me = this;

        if (!me.treeStore)
            return;

        record.set('expanded', true);
        me.treeStore.load(Ext.apply({
            node: record
        },config));
    },

    treeStartRenameFolder: function (record) {
        var me = this;

        if (!me.tree)
            return;

        me.tree.cellEditing.startEdit(record, 0);
    },

    treeCreateChildFolder: function (record) {
        var me = this,
            parentFolderId = me.treeGetFolderId(record);

        record.expand();
        YZSoft.Ajax.request({
            url: me.serviceUrl,
            params: {
                method: 'CreateChildFolder',
                parentFolderId: parentFolderId
            },
            success: function (action) {
                var newrec = record.appendChild(Ext.apply(action.result, {
                    expanded: false,
                    expandable: false
                }));

                me.tree.getSelectionModel().select(newrec);
                me.tree.cellEditing.startEdit(newrec, 0);
            }
        });
    },

    treeDeleteFolder: function (rec) {
        var me = this,
            folderId = me.treeGetFolderId(rec),
            nselrec;

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
                    url: me.serviceUrl,
                    params: {
                        method: 'DeleteFolder',
                        folderId: folderId
                    },
                    waitMsg: {
                        msg: RS.$('All_Deleting'),
                        target: me,
                        start: 0
                     },
                    success: function (action) {
                        nselrec = rec.nextSibling || rec.previousSibling || rec.parentNode;

                        rec.remove();
                        nselrec && me.tree.getSelectionModel().select(nselrec);

                        me.fireEvent('folderdeleted', rec);
                    }
                });
            }
        });
    },

    onTreeValidateEdit: function (editor, context, eOpts) {
        var me = this,
            rec = context.record,
            folderId = me.treeGetFolderId(rec);

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
            url: me.serviceUrl,
            params: {
                method: 'RenameFolder',
                folderId: folderId,
                newName: context.value
            },
            success: function (action) {
                var newName = action.result;

                rec.set('text', newName);
                me.fireEvent('treefolderrenamed', folderId, newName);
                me.treeStore.fireEvent('recordrenamed', rec, context.originalValue);
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

    onTreeFolderDragOver: function (targetNode, position, dragData, e, eOpts) {
        return !this.treeIsFolderPreventDrop(targetNode, dragData.records, position, dragData, e, eOpts);
    },

    onTreeFolderBeforeDrop: function (node, data, overModel, dropPosition, dropHandlers, eOpts) {
        var me = this,
            tree = me.tree,
            view = tree.getView(),
            targetRec = view.getRecord(node),
            targetFolderId = me.treeGetFolderId(targetRec),
            newParentRec = targetRec,
            ids = [];

        Ext.Array.each(data.records, function (rec) {
            ids.push(me.treeGetFolderId(rec));
        });

        dropHandlers.wait = true;
        YZSoft.Ajax.request({
            method: 'POST',
            exception: false,
            url: me.serviceUrl,
            params: {
                method: 'MoveFolders',
                targetFolderId: targetFolderId,
                position: dropPosition
            },
            jsonData: ids,
            waitMsg: {
                msg: RS.$('All_Moving'),
                target: me
            },
            success: function (action) {
                dropHandlers.processDrop();

                Ext.Array.each(data.records, function (rec) {
                    me.treeUpdatePath(rec);
                });
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage);
                dropHandlers.cancelDrop();
            }
        });
    },

    onTreeContainerContextMenu: function (view, e, eOpts) {
        var me = this,
            menu;

        e.preventDefault();

        //menu = Ext.create('Ext.menu.Menu', {
        //    margin: '0 0 10 0',
        //    items: [{
        //        iconCls: 'yz-glyph yz-glyph-refresh',
        //        text: RS.$('All_Refresh'),
        //        handler: function () {
        //            me.treeRefresh({
        //                loadMask: true
        //            });
        //        }
        //    }]
        //});

        //menu.showAt(e.getXY());
        //menu.focus();
    },

    viewCloneSelection: function (config) {
        var me = this,
            folder = me.view.folderId,
            view = me.view.getActiveView(),
            store = view.getStore(),
            sm = view.getSelectionModel(),
            recs = sm.getSelection(),
            nameField = me.objectNameField,
            versionField = me.objectVersionField,
            items = [];

        if (recs.length == 0)
            return;

        Ext.each(recs, function (rec) {
            items.push({
                ObjectName: nameField ? rec.data[nameField] : rec.getId(),
                Version: versionField ? rec.data[versionField] : undefined
            });
        });

        YZSoft.Ajax.request({
            method: 'POST',
            url: me.serviceUrl,
            params: {
                method: 'CloneViewObjects',
                folder: folder
            },
            jsonData: items,
            waitMsg: {
                msg: RS.$('All_Cloneing'),
                target: me,
                start: 0
            },
            success: function (action) {
                store.reload({
                    loadMask: {
                        msg: Ext.String.format(RS.$('All_Cloned_Multi'), recs.length),
                        msgCls: 'yz-mask-msg-success',
                        target: me,
                        start: 0
                    },
                    callback: function () {
                        var recs = [];

                        Ext.each(action.result, function (identity) {
                            var rec = store.getById(identity.ObjectName);
                            rec && recs.push(rec);
                        })

                        sm.select(recs);

                        config && config.callback && config.callback();
                    }
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
    },

    viewDeleteSelection: function (config) {
        var me = this,
            folder = me.view.folderId,
            view = me.view.getActiveView(),
            store = view.getStore(),
            sm = view.getSelectionModel(),
            recs = sm.getSelection(),
            nameField = me.objectNameField,
            versionField = me.objectVersionField,
            items = [];

        if (recs.length == 0)
            return;

        Ext.each(recs, function (rec) {
            items.push({
                ObjectName: nameField ? rec.data[nameField] : rec.getId(),
                Version: versionField ? rec.data[versionField] : undefined
            });
        });

        Ext.Msg.show({
            title: RS.$('All_DeleteConfirm_Title'),
            msg: RS.$('All_DelCfmMulti_Msg'),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'cancel',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: me.serviceUrl,
                    params: {
                        method: 'DeleteViewObjects',
                        folder: folder
                    },
                    jsonData: items,
                    waitMsg: {
                        msg: RS.$('All_Deleting'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        store.reload({
                            loadMask: {
                                msg: Ext.String.format(RS.$('All_Deleted_Multi'), recs.length),
                                msgCls: 'yz-mask-msg-success',
                                target: me,
                                start: 0
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
        });
    },

    viewStartRenameObject: function (record) {
        var me = this,
            view = me.view.getActiveView();

        view.startRename(record, me.objectNameField);
    },

    viewRefresh: function (config) {
        var me = this;

        if (!me.viewStore)
            return;

        me.viewStore.reload(Ext.apply({
            loadMask: true
        }, config));
    },

    onViewBeforeOpenFolder: function (folderId) {
        var me = this;

        delete me.view.folerPerm;
        YZSoft.Ajax.request({
            url: me.serviceUrl,
            params: {
                method: 'CheckFolderPermisions',
                folderId: folderId,
                perms: me.openFolderCheckPerms.join(',')
            },
            success: function (action) {
                me.fireEvent('viewaftercheckfolderpermision', action.result);
                me.view.folderPerm = action.result;
            }
        });
    },

    onViewValidateEdit: function (editor, context, eOpts) {
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
            async: false,
            url: me.serviceUrl,
            params: {
                method: 'RenameViewObject',
                folder: me.view.folderId,
                name: context.originalValue,
                newName: context.value
            },
            success: function (action) {
                me.onViewObjectRenamed(context.value, rec);
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage);
                context.cancel = true;
            }
        });
    },

    onViewObjectDblClick: function (record) {
        this.edit(record);
    },

    onTreeSelectionChange: function (sm, selected, eOpts) {
        var me = this,
            view = me.view;

        if (selected.length != 1)
            return;

        view.openFolder(me.treeGetFolderId(selected[0]));
        me.crumb && me.crumb.setFolder(me.treeGetRecordPyhPath(selected[0], 'text'));
    },

    onViewAfterOpenFolderByManual: function (folderId) {
        var me = this;

        if (me.tree || me.crumb) {
            me.getFolderPath(folderId, function (path) {
                me.tree && me.tree.expandPhyPath(path, {
                    silence: true,
                    select: true
                });
                me.crumb && me.crumb.setFolder(path);
            });
        }
    },

    onCrumbAfterOpenFolderBySelect: function (folderId) {
        var me = this,
            view = me.view;

        view.openFolder(folderId);

        if (me.tree) {
            me.getFolderPath(folderId, function (path) {
                me.tree.expandPhyPath(path, {
                    silence: true,
                    select: true
                });
            });
        }
    }
});