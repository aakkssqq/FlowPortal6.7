
/*
config
    uploader
*/
Ext.define('YZSoft.src.document.Abstract', {
    extend: 'YZSoft.src.document.AbstractBase',

    download: function (record) {
        if (!record.data.uploadid) {
            YZSoft.src.ux.File.download(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), {
                fileid: record.data.FileID,
                _dc: +new Date()
            });
        }
    },

    onAfterUploadsuccess: function (rec, file, data) {
        var me = this,
            folderid = me.folderid;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
            params: {
                method: 'AddAttachmentToFolder',
                folderid: folderid,
                fileid: data.fileid,
                flag: 'Upload'
            },
            success: function (action) {
                Ext.apply(rec.data, action.result);
                rec.commit();
            }
        });
    },

    onAfterUploadSuccessUpdate: function (rec, file, data) {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
            params: {
                method: 'UpdateAttachment',
                id: rec.data.ID,
                fileid: rec.data.FileID,
                replacewithfileid: data.fileid
            },
            success: function (action) {
                Ext.apply(rec.data, action.result);
                rec.commit();
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage, function () {
                    Ext.apply(rec.data, rec.dataSaved);
                    rec.commit();
                });
            }
        });
    },

    doDeleteDocuments: function (recs) {
        var me = this,
            ids = [], names = [];

        Ext.each(recs, function (rec) {
            ids.push(rec.data.ID);
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
                    url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                    params: {
                        method: 'DeleteFiles'
                    },
                    jsonData: ids,
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

    showFolder: function (folderid, config) {
        var me = this;

        me.store.load(Ext.apply({
            loadMask: false,
            params: {
                folderid: folderid
            }
        }, config));
    },

    moveObjectsToFolder: function (moveroot, folderid, recs) {
        var me = this,
            fileids = [],
            folderids = [];

        Ext.each(recs, function (rec) {
            if (rec.data.isFolder)
                folderids.push(rec.data.FolderID);
            else
                fileids.push(rec.data.ID);
        });

        Ext.create('YZSoft.src.dialogs.SelFolderDlg', {
            autoShow: true,
            title: RS.$('All_MoveTo'),
            excludeModel: folderids.length ? 'moveFolderExclude' : 'moveFileExclude',
            excludeFolderIds: [folderid],
            storeConfig: {
                root: moveroot
            },
            fn: function (recTarget) {
                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                    params: {
                        method: 'MoveObjectsToFolder',
                        targetfolderid: recTarget.getId()
                    },
                    jsonData: {
                        fileids: fileids,
                        folderids: folderids
                    },
                    waitMsg: {
                        msg: RS.$('All_Moving'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        me.mask({
                            msg: Ext.String.format(RS.$('All_Copy_Success_Multi'), fileids.length + folderids.length),
                            msgCls: 'yz-mask-msg-success',
                            autoClose: 'xx',
                            fn: function () {
                                me.store.remove(recs);
                            }
                        });
                    }
                });
            }
        });
    }
});