
/*
config
    folderid,
    perm,
    securitymodel
*/
Ext.define('YZSoft.src.lib.panel.Base', {
    extend: 'Ext.container.Container',
    requires: ['YZSoft.src.model.Folder'],
    getMoveExcludeFolder: Ext.emptyFn,
    onStoreLoadFirstTime: Ext.emptyFn,
    getViewConfig: Ext.emptyFn,
    style: 'background-color:white',
    securitymodel: 'RBAC',
    split: {
        cls: 'yz-splitter-light',
        size: 4,
        collapsible: true
    },

    constructor: function (config) {
        var me = this,
            folderid = config.folderid,
            perm = config.perm,
            cfg;

        me.viewContainer = me.createViewContainer(config);

        me.store = me.createStore(config);

        me.tree = me.createTree(config);

        me.treeContainer = me.createTreeContainer(config);

        cfg = me.getConfig();

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.tree.on({
            scope: me,
            select: 'onItemSelect',
            itemcontextmenu: 'onItemContextMenu',
            containercontextmenu: 'onContainerContextMenu'
        });

        me.store.on({
            single: true,
            scope: me,
            load: 'onStoreLoadFirstTime'
        });

        me.viewContainer.on({
            scope: me,
            folderChanged: 'onViewerFolderChanged'
        });
    },

    createViewContainer: function (config) {
        return Ext.create('YZSoft.src.lib.viewcontainer.Single', Ext.apply({
        }, config.viewConfig));
    },

    createStore: function (config) {
        var me = this,
            securitymodel = config.securitymodel || me.securitymodel;

        return Ext.create('Ext.data.TreeStore', Ext.apply({
            autoLoad: false,
            model: 'YZSoft.src.model.Folder',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                extraParams: {
                    method: 'GetFolders',
                    checkpermision: true,
                    securitymodel: securitymodel,
                    expand: false
                }
            },
            root: {
                text: 'root',
                path: config.folderid
            }
        }, config.storeConfig));
    },

    createTree: function (config) {
        var me = this;

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

        return Ext.create('Ext.tree.Panel', Ext.apply({
            store: me.store,
            plugins: [me.cellEditing],
            rootVisible: true,
            useArrows: true,
            border: false,
            hideHeaders: true,
            cls: 'yz-tree-bpalib',
            viewConfig: {
                plugins: [me.dd],
                loadMask: false,
                listeners: {
                    scope: me,
                    nodedragover: 'onNodeDragOver',
                    beforedrop: 'onBeforeItemDrop'
                }
            },
            columns: [{
                xtype: 'treecolumn',
                dataIndex: 'text',
                flex: 1,
                editor: { xtype: 'textfield' }
            }]
        }, config.treeConfig));
    },

    createTreeContainer: function (config) {
        var me = this;

        return Ext.create('Ext.panel.Panel', Ext.apply({
            title: RS.$('All_Navigate'),
            border: false,
            header: false,
            width: 260,
            region: 'west',
            layout: 'fit',
            split:  config.split || me.split,
            items: [me.tree]
        }, config.treeContainer));
    },

    getConfig: function () {
        var me = this;

        return {
            layout: 'border',
            defaults: {
                xtype: 'container'
            },
            items: [me.treeContainer, {
                region: 'center',
                layout: 'fit',
                items: [me.viewContainer]
            }]
        }
    },

    onItemSelect: function (tree, record, index, eOpts) {
        var me = this,
            xclass = me.getXClass('Process');

        me.viewContainer.addView(xclass, Ext.apply({
            folderid: record.getId(),
            perm: me.perm,
            crumbConfig: {
                store: me.store
            }
        }, me.getViewConfig(record)));
    },

    onItemContextMenu: function (tree, record, item, index, e, eOpts) {
    },

    onContainerContextMenu: function (view, e, eOpts) {
        e.preventDefault();
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
            url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
            params: {
                method: 'RenameFolder',
                folderid: rec.getId(),
                newname: context.value
            },
            success: function (action) {
                var newname = action.result;
                rec.set('text', newname);
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage, function () {
                    me.exception();
                });
            },
            exception: function () {
                rec.set('text', context.originalValue);
            }
        });
    },

    selectFolder: function (folderid, silence) {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
            waitMsg: false,
            params: {
                method: 'GetFolderPath',
                folderid: folderid
            },
            success: function (action) {
                me.selectFolderByPath(action.result, silence);
            }
        });
    },

    selectFolderByPath: function (ids, silence) {
        var me = this,
            store = me.store;

        for (var i = ids.length - 1; i >= 0; i--) {
            var id = ids[i],
                rec;

            rec = store.getById(id);
            if (rec) {
                Ext.suspendLayouts();
                me.expandFolder(rec, Ext.Array.slice(ids, i), {
                    silence: silence
                });
                Ext.resumeLayouts();
                return;
            }
        }
    },

    expandFolder: function (rec, ids, options) {
        options = options || {};

        var me = this,
            current = rec,
            index = 0,
            tree = me.tree,
            view = tree.getView(),
            callback = options.callback,
            silence = options.silence,
            scope = options.scope,
            loaded = [];

        expander = function (newChildren) {
            var node = this,
                len, i, value;

            // We've arrived at the end of the path.
            if (++index === ids.length) {

                if (silence)
                    me.tree.suspendEvent('select');

                try {
                    view.getSelectionModel().select(node);
                }
                finally {
                    if (silence)
                        me.tree.resumeEvent('select');
                }

                return Ext.callback(callback, scope || me, [true, node, view.getNode(node)]);
            }

            // Find the next child in the path if it's there and expand it.
            for (i = 0, len = newChildren ? newChildren.length : 0; i < len; i++) {
                var cnode = newChildren[i];
                if (cnode.getId() === ids[index]) {
                    return cnode.expand(false, expander);
                }
            }

            if (!loaded[node.getId().toString()]) {
                loaded[node.getId().toString()] = true;
                me.store.load({
                    node: node,
                    callback: function () {
                        --index;
                        return node.expand(false, expander);
                    }
                });
            }

            // If we get here, there's been a miss along the path, and the operation is a fail.
            node = this;
            Ext.callback(callback, scope || me, [false, node, view.getNode(node)]);
        };
        current.expand(false, expander);
    },

    onViewerFolderChanged: function (tofolderid, fromfolderid) {
        var me = this;

        me.tree.suspendEvent('select');
        try {
            me.selectFolder(tofolderid, true);
        }
        finally {
            me.tree.resumeEvent('select');
        }
    },

    onNodeDragOver: function (targetNode, position, dragData, e, eOpts) {
        return targetNode.isPreventDrop(dragData.records, position, dragData, e, eOpts) ? false : true;
    },

    onBeforeItemDrop: function (node, data, overModel, dropPosition, dropHandlers, eOpts) {
        var me = this,
            tree = me.tree,
            view = tree.getView(),
            record = view.getRecord(node),
            folderids = [];

        Ext.Array.each(data.records, function (rec) {
            folderids.push(rec.getId());
        });

        dropHandlers.wait = true;
        YZSoft.Ajax.request({
            method: 'POST',
            exception: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
            waitMsg: {
                msg: RS.$('All_Moving'),
                target: me
            },
            params: {
                method: 'MoveFolders',
                targetfolderid: record.getId(),
                position: dropPosition
            },
            jsonData: folderids,
            success: function (action) {
                dropHandlers.processDrop();
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage);
                dropHandlers.cancelDrop();
            }
        });
    },

    createChildFolder: function (rec) {
        var me = this,
            securitymodel = me.securitymodel,
            folderid = rec.getId();

        rec.expand();
        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
            params: {
                method: 'CreateFolder',
                folderid: folderid,
                securitymodel: securitymodel,
                name: RS.$('All_NewFolder')
            },
            success: function (action) {
                var newrec = rec.appendChild(Ext.apply(action.result, {
                    expanded: false,
                    expandable: false
                }));

                me.tree.getSelectionModel().select(newrec);
                me.cellEditing.startEdit(newrec, 0);
            }
        });
    },

    deleteFolder: function (rec) {
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
                    url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                    params: {
                        method: 'DeleteFolder',
                        folderid: rec.getId()
                    },
                    waitMsg: {
                        msg: RS.$('All_Deleting'),
                        target: Ext.getBody(),
                        start: 0
                    },
                    success: function (action) {
                        var nselrec = rec.nextSibling || rec.previousSibling || rec.parentNode;
                        rec.remove();
                        me.tree.getSelectionModel().select(nselrec);
                    }
                });
            }
        });
    },

    moveFolder: function (rec) {
        var me = this,
            recMoveRoot;

        if (rec.getCategoryRecord) {
            recMoveRoot = rec.getCategoryRecord();
        }
        else {
            var recMoveRoot = rec;
            while (!recMoveRoot.isRoot()) {
                recMoveRoot = recMoveRoot.parentNode;
            }
        }

        Ext.create('YZSoft.src.dialogs.SelFolderDlg', {
            autoShow: true,
            title: RS.$('All_MoveTo'),
            excludeFolderIds: me.getMoveExcludeFolder(rec),
            storeConfig: {
                root: {
                    text: recMoveRoot.data.text,
                    path: recMoveRoot.getId()
                }
            },
            fn: function (recTarget) {
                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                    params: {
                        method: 'MoveFolders',
                        targetfolderid: recTarget.getId(),
                        position: 'append'
                    },
                    jsonData: [rec.getId()],
                    waitMsg: {
                        msg: RS.$('All_Moving'),
                        target: Ext.getBody(),
                        start: 0
                    },
                    success: function (action) {
                        rec.remove();
                        var tag = me.store.getById(recTarget.getId());
                        if (tag) {
                            tag.set('expanded', true);
                            me.store.load({
                                loadMask: false,
                                node: tag,
                                callback: function () {
                                    rec = me.store.getById(rec.getId());
                                    if (rec)
                                        me.tree.getSelectionModel().select(rec);
                                }
                            });
                        }
                    }
                });
            }
        });
    },

    showFolderPropertyDlg: function (record) {
        Ext.create('YZSoft.app.filesystem.FolderDlg', {
            title: Ext.String.format(record.isRoot() ? '{0}' : RS.$('All_Title_Folder'), record.data.text),
            autoShow: true,
            folderid: record.getId()
        });
    }
});