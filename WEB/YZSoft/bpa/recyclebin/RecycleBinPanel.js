
/*
config
    groupInfo
*/
Ext.define('YZSoft.bpa.recyclebin.RecycleBinPanel', {
    extend: 'Ext.container.Container',
    requires: [
        'YZSoft.src.model.DeletedFolderObject',
        'YZSoft.src.ux.File'
    ],
    layout: 'border',
    style: 'background-color:white',
    padding: '0 40 30 40',
    libTypes: {
        BPAFile: RS.$('BPA_RecycleBin_LibTypeName_BPAFile'),
        BPADocument: RS.$('BPA_RecycleBin_LibTypeName_BPADocument'),
        BPATeam: RS.$('BPA_RecycleBin_LibTypeName_BPATeam')
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnClear = Ext.create('Ext.button.Button', {
            text: RS.$('BPA__EmptyRecycleBin'),
            cls: 'bpa-btn-solid-hot',
            margin: '0 10 0 0',
            handler: function () {
                me.clearRecyclebin();
            }
        });

        me.btnDelete = Ext.create('Ext.button.Button', {
            text: RS.$('All_Delete'),
            cls: 'bpa-btn-flat',
            iconCls: 'yz-glyph yz-glyph-recyclebin',
            margin: '0 0 0 20',
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();
                if (recs.length != 0)
                    me.deleteObjects(recs);
            }
        });

        me.btnRestore = Ext.create('Ext.button.Button', {
            text: RS.$('BPA__Restore'),
            cls: 'bpa-btn-flat',
            iconCls: 'yz-glyph yz-glyph-restore',
            margin: '0 0 0 5',
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();
                if (recs.length != 0)
                    me.restoreObjects(recs);
            }
        });

        me.btnRefresh = Ext.create('Ext.button.Button', {
            text: RS.$('All_Refresh'),
            cls: 'bpa-btn-flat',
            iconCls: 'yz-glyph yz-glyph-refresh',
            margin:0,
            style:'padding-right:0px;',
            handler: function () {
                me.refresh();
            }
        });

        me.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            region: 'north',
            height: 64,
            padding: 0,
            items: [
                me.btnClear,
                me.btnDelete,
                me.btnRestore,
                '->',
                me.btnRefresh
            ]
        });

        me.store = Ext.create('Ext.data.Store', {
            autoLoad: false,
            model: 'YZSoft.src.model.DeletedFolderObject',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                extraParams: {
                    method: 'GetDeletedObjects',
                    libTypes: 'BPAFile,BPADocument,BPATeam'
                }
            }
        });

        me.store.on({
            scope: me,
            load: 'updateStatus'
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            region: 'center',
            border: false,
            cls: 'yz-grid-cellalign-vcenter bpa-grid-recyclebin',
            selModel: { mode: 'MULTI' },
            viewConfig: {
                markDirty: false,
                loadMask: {
                    target: me
                }
            },
            columns: {
                defaults: {
                    sortable: true
                },
                items: [
                    { text: RS.$('All_Name'), dataIndex: 'Name', flex: 2, scope: me, renderer: me.renderObjectName },
                    { text: RS.$('BPA_RecycleBinObjectPath'), dataIndex: 'Path', flex: 3, scope: me, renderer: me.renderFolder },
                    { text: RS.$('BPA__DeleteAt'), dataIndex: 'DeleteAt', width: 180, formatter:'date("Y-m-d H:i")' },
                    { text: RS.$('BPA__DeleteBy'), dataIndex: 'DeleteBy', width: 180, renderer:me.renderDeleteBy },
                    {
                        xtype: 'actioncolumn',
                        text: RS.$('BPA__Restore'),
                        width: 120,
                        hidden: false,
                        align: 'center',
                        items: [{
                            glyph: 0xe951,
                            iconCls: 'yz-action-restore',
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                me.restoreObjects([record]);
                            }
                        }]
                    }
                ]
            },
            listeners: {
                scope: me,
                containercontextmenu: 'onContainerContextMenu',
                itemcontextmenu: 'onItemContextMenu'
            }
        });

        me.grid.on({
            scope: me,
            selectionchange: 'updateStatus'
        });

        cfg = {
            items: [me.toolbar, me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            activate: function () {
                me.store.reload($S.loadMask[me.firsttime !== false ? 'first' : 'activate']);
                me.firsttime = false;
            }
        });

        me.updateStatus();

        me.store.load({
            loadMask: false
        });
    },

    renderObjectName: function (value, metaData, record) {
        return Ext.String.format('<div class="{0}" style="margin-right:6px;"></div>{1}',
            record.isFolder() ? 'x-tree-icon  x-tree-icon-parent' : 'x-tree-icon x-tree-icon-leaf',
            Ext.util.Format.text(value));
    },

    renderFolder: function (value, metaData, record) {
        var me = this,
            libName = record.data.LibName,
            path = value,
            libType = me.libTypes[record.data.LibType];

        return Ext.String.format(path ? '{0}{1}\\{2}' : '{0}{1}', libType, Ext.util.Format.text(libName), Ext.util.Format.text(path));
    },

    renderDeleteBy: function (value, metaData, record) {
        var me = this,
            data = record.data;

        return Ext.String.format('<span class="yz-s-uid" uid="{0}" tip-align="r50-l50">{1}</span>',
            Ext.util.Format.text(data.DeleteBy),
            Ext.util.Format.text(data.DeleteByShortName));
    },

    onItemContextMenu: function (view, record, item, index, e) {
        var me = this,
            recs = me.grid.getSelectionModel().getSelection(),
            allrecs = me.store.getData().items,
            menu;

        e.stopEvent();

        menu = Ext.create('Ext.menu.Menu', {
            margin: '0 0 10 0',
            items: [{
                iconCls: 'yz-glyph yz-glyph-restore',
                text: RS.$('BPA__Restore'),
                disabled: recs.length == 0,
                handler: function () {
                    me.restoreObjects(recs);
                }
            }, {
                iconCls: 'yz-glyph yz-glyph-recyclebin',
                text: RS.$('All_Delete'),
                disabled: recs.length == 0,
                handler: function () {
                    me.deleteObjects(recs);
                }
            }, '-', {
                iconCls: 'yz-glyph yz-glyph-e61f',
                text: RS.$('BPA__EmptyRecycleBin'),
                disabled: allrecs.length == 0,
                handler: function () {
                    me.clearRecyclebin();
                }
            }, {
                iconCls: 'yz-glyph yz-glyph-refresh',
                text: RS.$('All_Refresh'),
                handler: function () {
                    me.refresh();
                }
            }]
        });

        menu.showAt(e.getXY());
        menu.focus();
    },

    onContainerContextMenu: function (view, e, eOpts) {
        var me = this,
            allrecs = me.store.getData().items,
            menu;

        e.stopEvent();

        menu = Ext.create('Ext.menu.Menu', {
            margin: '0 0 10 0',
            items: [{
                iconCls: 'yz-glyph yz-glyph-e61f',
                text: RS.$('BPA__EmptyRecycleBin'),
                disabled: allrecs.length == 0,
                handler: function () {
                    me.clearRecyclebin();
                }
            }, {
                iconCls: 'yz-glyph yz-glyph-refresh',
                text: RS.$('All_Refresh'),
                handler: function () {
                    me.refresh();
                }
            }]
        });

        menu.showAt(e.getXY());
        menu.focus();
    },

    deleteObjects: function (recs) {
        var me = this,
            fileids = [],
            folderids = [],
            msg;

        recs = Ext.isArray(recs) ? recs : [recs];

        if (recs.length == 0)
            return;

        if (recs.length == 1)
            msg = Ext.String.format(RS.$('BPA_Msg_RecycleBin_DeleteSingleItemCfm'), recs[0].data.Name);
        else
            msg = Ext.String.format(RS.$('BPA_Msg_RecycleBin_DeleteMultiItemsCfm'), recs.length);

        Ext.each(recs, function (rec) {
            if (rec.isFile())
                fileids.push(rec.data.ID);
            else
                folderids.push(rec.data.FolderID);
        });

        Ext.Msg.show({
            title: RS.$('All_DeleteConfirm_Title'),
            msg: msg,
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'cancel',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                    params: {
                        method: 'DeleteObjectsPhysical'
                    },
                    jsonData: {
                        fileids: fileids,
                        folderids: folderids
                    },
                    waitMsg: {
                        msg: RS.$('All_Deleting'),
                        target: me,
                        start: 0
                    },
                    success: function (result) {
                        me.store.remove(recs);
                    }
                });
            }
        });
    },

    clearRecyclebin: function () {
        var me = this,
            recs = me.store.getData().items,
            fileids = [],
            folderids = [];

        if (recs.length == 0)
            return;

        Ext.each(recs, function (rec) {
            if (rec.isFile())
                fileids.push(rec.data.ID);
            else
                folderids.push(rec.data.FolderID);
        });

        Ext.Msg.show({
            title: RS.$('All_DeleteConfirm_Title'),
            msg: RS.$('BPA_Msg_RecycleBin_ClearCfm'),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'cancel',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                    params: {
                        method: 'DeleteObjectsPhysical'
                    },
                    jsonData: {
                        fileids: fileids,
                        folderids: folderids
                    },
                    waitMsg: {
                        msg: RS.$('BPA_LoadMask_RecycleBinClearing'),
                        target: me,
                        start: 0,
                        stay: 'xxx'
                    },
                    success: function (result) {
                        me.store.reload({
                            loadMask: {
                                msg: RS.$('BPA_Toast_RecycleBinCleared'),
                                msgCls: 'yz-mask-msg-success',
                                target:me
                            }
                        });
                    }
                });
            }
        });
    },

    restoreObjects: function (recs) {
        var me = this,
            names = [],
            fileids = [],
            folderids = [];

        recs = Ext.isArray(recs) ? recs : [recs];

        Ext.each(recs, function (rec) {
            if (rec.isFile())
                fileids.push(rec.data.ID);
            else
                folderids.push(rec.data.FolderID);
        });

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
            params: {
                method: 'RestoreObjects'
            },
            jsonData: {
                fileids: fileids,
                folderids: folderids
            },
            waitMsg: {
                msg: RS.$('BPA_LoadMask_RecycleBinObject_Restoring'),
                target: me,
                start: 0
            },
            success: function (result) {
                me.store.reload({
                    loadMask: {
                        msg: Ext.String.format(RS.$('BPA_Toast_RecycleBinObject_Restored'), recs.length),
                        msgCls: 'yz-mask-msg-success',
                        target: me,
                        start: 0
                    }
                });
            }
        });
    },

    refresh: function () {
        this.store.reload({
            loadMask: true
        });
    },

    updateStatus: function () {
        var me = this,
            sm = me.grid.getSelectionModel(),
            recs = sm.getSelection();

        me.btnDelete.setDisabled(recs.length == 0);
        me.btnRestore.setDisabled(recs.length == 0);
        me.btnClear.setDisabled(me.store.getCount() == 0);
    }
});