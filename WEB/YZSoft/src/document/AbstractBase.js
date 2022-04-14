
/*
config
    uploader
*/
Ext.define('YZSoft.src.document.AbstractBase', {
    extend: 'Ext.container.Container',
    requires: [
        'YZSoft.src.ux.File'
    ],
    doDeleteDocuments: Ext.emptyFn,
    getExistRecordFromQueueFile: Ext.emptyFn,

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        if (me.uploader)
            me.bindUploader(me.uploader);

        if (me.updater)
            me.bindUpdaterUploader(me.updater);
    },

    renderFileType: function (value, metaData, record) {
        return Ext.String.format('<image src="{0}" class="filetype" />',
            YZSoft.src.ux.File.getIconByExt(record.data.Ext, 32));
    },

    renderFileName: function (value, metaData, record) {
        return Ext.String.format('<image src="{0}" class="filetype" />{1}',
            YZSoft.src.ux.File.getIconByExt(record.data.Ext, 32),
            Ext.util.Format.text(value));
    },

    renderCreator: function (value, metaData, record) {
        var me = this,
            data = record.data;

        return Ext.String.format('<span class="yz-s-uid" uid="{0}" tip-align="r50-l50">{1}</span>',
            Ext.util.Format.text(data.OwnerAccount),
            Ext.util.Format.text(data.CreatorShortName));
    },

    renderFileSize: function (value, metaData, record) {
        return value.toFileSize();
    },

    bindUploader: function (uploader) {
        var me = this;

        uploader.on({
            scope: me,
            fileQueued: 'onFileQueued',
            nextUpload: 'onNextUpload',
            uploadProgress: 'onUploadProgress',
            uploadSuccess: 'onUploadSuccess',
            uploadFailed: 'onUploadFailed'
        });
    },

    bindUpdaterUploader: function (uploader) {
        var me = this;

        uploader.on({
            scope: me,
            fileQueued: 'onFileQueuedUpdate',
            nextUpload: 'onNextUpload',
            uploadProgress: 'onUploadProgress',
            uploadSuccess: 'onUploadSuccess',
            uploadFailed: 'onUploadFailed'
        });
    },

    onAfterUploadsuccess: function (rec, file, data) {
        rec.commit();
        this.grid.getSelectionModel().select(rec);
    },

    onAfterUploadSuccessUpdate: function (rec, file, data) {
        rec.commit();
        this.grid.getSelectionModel().select(rec);
    },

    onFileQueued: function (file, uploader) {
        var me = this,
            view = me.grid.getView(),
            rec, node;

        rec = me.getExistRecordFromQueueFile(file);
        if (rec) {
            rec.updating = true;
            rec.dataSaved = Ext.apply({}, rec.data);
            Ext.apply(rec.data, {
                uploadid: file.id,
                state: 'queued'
            });
            rec.commit();
        }
        else {
            rec = me.addNewUploadRecord({
                Ext: file.type,
                Name: file.name,
                Size: file.size,
                uploadid: file.id,
                state: 'queued'
            });
        }

        rec.uploader = uploader;
        node = Ext.get(view.getNode(rec));
        node.addCls('x-grid-item-queued');
    },

    addNewUploadRecord: function (data) {
        return this.store.insert(0, data)[0];
    },

    onFileQueuedUpdate: function (file,uploader) {
        var me = this,
            view = me.grid.getView(),
            recs = me.grid.getSelectionModel().getSelection(),
            rec = recs && recs[0];

        if (recs.length != 1)
            return;

        rec.updating = true;
        rec.dataSaved = Ext.apply({}, rec.data);
        Ext.apply(rec.data, {
            Ext: file.type,
            Name: file.name,
            Size: file.size,
            uploadid: file.id,
            state: 'queued'
        });
        rec.commit();

        rec.uploader = uploader;
        node = Ext.get(view.getNode(rec));
        node.addCls('x-grid-item-queued');
    },

    onNextUpload: function () {
        if (this.store.findRecord('state', 'uploading'))
            return;

        var me = this,
            rec = me.store.findRecord('state', 'queued'),
            view = me.grid.getView(),
            node = Ext.get(view.getNode(rec));

        if (rec) {
            rec.data.state = 'uploading';
            node.removeCls('x-grid-item-queued');
            node.addCls('x-grid-item-uploading');

            rec.uploader.uploader.startUpload(rec.data.uploadid);
        }
    },

    onUploadProgress: function (file, complete, total) {
        var me = this,
            rec = me.store.findRecord('uploadid', file.id),
            view = me.grid.getView(),
            node = Ext.get(view.getNode(rec));

        if (node)
            node.setStyle('backgroundPosition', node.getWidth() * complete / total);
    },

    onUploadSuccess: function (file, data) {
        var me = this,
            folderid = me.folderid,
            rec = me.store.findRecord('uploadid', file.id),
            updating = rec.updating;

        if (rec) {
            delete rec.data.state;
            delete rec.data.uploadid;
            delete rec.updating;

            if (updating)
                me.onAfterUploadSuccessUpdate(rec, file, data);
            else
                me.onAfterUploadsuccess(rec, file, data);
        }
    },

    onUploadFailed: function (file, errorMessage,code,message,uploader) {
        var me = this,
            rec = me.store.findRecord('uploadid', file.id),
            updating = rec.updating;

        if (rec) {
            uploader.uploader.cancelUpload(file.id);
            YZSoft.alert(errorMessage, function () {
                if (updating) {
                    delete rec.updating;
                    Ext.apply(rec.data, rec.dataSaved);
                    rec.commit();
                }
                else {
                    me.store.remove(rec);
                }

                uploader.fireEvent('nextUpload');
            });
            return false;
        }
    },

    deleteDocuments: function (recs) {
        var me = this,
            recs = Ext.isArray(recs) ? recs : [recs],
            recsdel = [], uploadfileid;

        //取消正在上传的文件
        Ext.each(recs, function (rec) {
            uploadfileid = rec.data.uploadid;

            if (uploadfileid && rec.uploader) {
                rec.uploader.uploader.cancelUpload(uploadfileid);
                me.store.remove(rec);
                if (rec.data.state == 'uploading')
                    rec.uploader.fireEvent('nextUpload');
            }
            else {
                recsdel.push(rec);
            }
        });

        if (recsdel.length == 0)
            return;

        me.doDeleteDocuments(recsdel);
    },

    addReference: function (libType) {
        var me = this,
            folderid = me.folderid;

        Ext.create('YZSoft.src.dialogs.SelFileDlg', {
            autoShow: true,
            title: 'All_Document_AddReference',
            libType: libType,
            fn: function (file) {
                var dlg = this;

                YZSoft.Ajax.request({
                    method: 'GET',
                    url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                    params: {
                        method: 'AddAttachmentToFolder',
                        folderid: folderid,
                        fileid: file.FileID,
                        flag:'Reference'
                    },
                    waitMsg: {
                        msg: RS.$('All_Adding'),
                        target: me,
                        start: 0
                    },
                    success: function (result) {
                        me.store.reload({
                            loadMask: {
                                msg: RS.$('All_LoadMask_Add_Success'),
                                msgCls: 'yz-mask-msg-success',
                                target: me,
                                start: 0
                            }
                        });
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
            url: YZSoft.$url('YZSoft.Services.REST/Attachment/Assist.ashx'),
            params: {
                method: 'RenameFile',
                fileid: rec.data.FileID,
                newName: context.value
            },
            success: function (action) {
                rec.set(action.result);
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage);
                context.cancel = true;
            }
        });
    }
});