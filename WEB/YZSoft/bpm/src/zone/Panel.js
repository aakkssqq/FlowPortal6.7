/*
config
path
storeZoneType
versionField
*/
Ext.define('YZSoft.bpm.src.zone.Panel', {
    extend: 'Ext.panel.Panel',
    header: false,
    renameCallback: Ext.emptyFn,

    createCellEditing: function (config) {
        var me = this;

        return Ext.create('Ext.grid.plugin.CellEditing', Ext.apply({
            clicksToEdit: false,
            listeners: {
                validateedit: function (editor, context, eOpts) {
                    me.onValidateEdit(editor, context, eOpts);
                }
            }
        }, config));
    },

    deleteSelection: function (grid, nameField, versionField, callback) {
        var me = this,
            grid = grid || me.grid,
            store = grid.getStore(),
            recs = grid.getSelectionModel().getSelection(),
            items = [];

        if (recs.length == 0)
            return;

        Ext.each(recs, function (rec) {
            items.push({
                ObjectName: nameField ? rec.data[nameField] : rec.getId(),
                Version: versionField ? rec.data[versionField]:undefined
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
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/StoreService.ashx'),
                    method:'POST',
                    params: {
                        method: 'DeleteObjects',
                        zone: me.storeZoneType,
                        folder: me.path
                    },
                    jsonData:items,
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
                            callback: callback
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

    cloneSelection: function (grid, nameField, versionField, callback) {
        var me = this,
            grid = grid || me.grid,
            store = grid.getStore(),
            recs = grid.getSelectionModel().getSelection(),
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
            url: YZSoft.$url('YZSoft.Services.REST/BPM/StoreService.ashx'),
            params: {
                method: 'CloneObjects',
                zone: me.storeZoneType,
                folder: me.path
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

                        grid.getSelectionModel().select(recs);

                        callback && callback();
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

    moveObjects: function (config) {
        var me = this,
            grid = config.grid || me.grid,
            nameField = config.nameField,
            callback = config.callback,
            store = grid.getStore(),
            recs = grid.getSelectionModel().getSelection(),
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
            excludefolder: me.path,
            perm: 'Write',
            fn: function (rec,copy) {
                if (rec == null)
                    return;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/StoreService.ashx'),
                    params: {
                        method: 'MoveObjectsToFolder',
                        zone: me.storeZoneType,
                        srcfolder: me.path,
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
                            callback: callback
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
        },config.dlgConfig));
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
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/BPM/StoreService.ashx'),
            params: {
                method: 'RenameObject',
                zone: me.storeZoneType,
                folder: me.path,
                name: context.originalValue,
                version: editor.versionField ? rec.data[editor.versionField] : null,
                newname: context.value
            },
            success: function (action) {
                me.renameCallback(context.value,rec);
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage);
                context.cancel = true;
            }
        });
    },

    onBeforeItemDrop: function (node, data, overModel, dropPosition, dropHandlers, eOpts) {
        var me = this,
            record = overModel,
            names = [];

        Ext.Array.each(data.records, function (rec) {
            names.push(rec.getId());
        });

        dropHandlers.wait = true;
        YZSoft.Ajax.request({
            method: 'POST',
            exception: false,
            url: YZSoft.$url('YZSoft.Services.REST/BPM/StoreService.ashx'),
            params: {
                method: 'MoveObjects',
                zone: me.storeZoneType,
                folder: me.path,
                tergetname: record.getId(),
                position: dropPosition
            },
            jsonData: names,
            waitMsg: {
                msg: RS.$('All_Moving'),
                target: me
            },
            success: function (action) {
                dropHandlers.processDrop();
                data.view && data.view.refresh();
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage);
                dropHandlers.cancelDrop();
            }
        });
    },

    combinePath: function (folder, objectName) {
        if (folder)
            return Ext.String.format('{0}/{1}', folder, objectName);
        else
            return objectName;
    },

    getRecordFullName: function (folder, objectName) {
        if (folder)
            return Ext.String.format('{0}/{1}', folder, objectName);
        else
            return Ext.String.format('{0}', objectName);
    },

    getRecordRsid: function (zone, folder, objectName) {
        if (folder)
            return Ext.String.format('{0}://{1}/{2}', zone, folder, objectName);
        else
            return Ext.String.format('{0}://{1}', zone, objectName);
    }
});
