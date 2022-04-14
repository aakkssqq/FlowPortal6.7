
/*
config
    uploader
*/
Ext.define('YZSoft.src.document.OSAbstract', {
    extend: 'YZSoft.src.document.AbstractBase',

    addNewUploadRecord: function (data) {
        return this.store.add(data)[0];
    },

    showFolder: function (root, path, config) {
        var me = this;

        me.store.load(Ext.apply({
            loadMask: false,
            params: {
                root: root,
                path: path
            }
        }, config));
    },

    download: function (record) {
        var me = this;

        if (!record.data.uploadid) {
            YZSoft.src.ux.File.download(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), {
                osfile: true,
                root: me.root,
                path: me.path,
                name: record.data.Name,
                _dc: +new Date()
            });
        }
    },

    onAfterUploadsuccess: function (rec, file, data) {
        var me = this;

        Ext.apply(rec.data, data);
        rec.commit();
        me.grid.getSelectionModel().select(rec);
    },

    doDeleteDocuments: function (recs) {
        var me = this,
            names = [];

        Ext.each(recs, function (rec) {
            names.push(rec.data.Name);
        });

        Ext.Msg.show({
            title: RS.$('All_DeleteConfirm_Title'),
            msg: RS.$1(Ext.String.format(RS.$('All_Msg_DeleteFilePermanent'), names.join(','))),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'cancel',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/OSFileSystem.ashx'),
                    params: {
                        method: 'DeleteFiles',
                        root: me.root,
                        path: me.path
                    },
                    jsonData: names,
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
            url: YZSoft.$url('YZSoft.Services.REST/core/OSFileSystem.ashx'),
            params: {
                method: 'RenameFile',
                root: me.root,
                path: me.path,
                name: context.originalValue,
                newname: context.value
            },
            success: function (action) {
                rec.set(action.result);
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
            filenames = [];

        Ext.Array.each(data.records, function (rec) {
            filenames.push(rec.getId());
        });

        dropHandlers.wait = true;
        YZSoft.Ajax.request({
            method: 'POST',
            exception: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/OSFileSystem.ashx'),
            params: {
                method: 'MoveFiles',
                root: me.root,
                path: me.path,
                excludes: me.excludes,
                tergetfilename: record.getId(),
                position: dropPosition
            },
            jsonData: filenames,
            waitMsg: {
                msg: RS.$('All_Moving'),
                target: me
            },
            success: function (action) {
                dropHandlers.processDrop();
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage);
                dropHandlers.cancelDrop();
            }
        });
    },

    getExistRecordFromQueueFile: function (file) {
        return this.store.getById(file.name);
    }
});