if (typeof (SWFUpload) == 'undefined')
    Ext.Loader.loadScript({ url: YZSoft.$url('YZSoft/src/ux/UploadEngine.js') });

/*
config
attachTo - 附加到的el
loadMask:{
    msg:''
    target:
    showProgress: true/false
}
fileTypes
typesDesc
*/

Ext.define('YZSoft.src.ux.Uploader', {
    extend: 'Ext.Evented',
    autoStart: true,
    params: {},
    debugMode: false,
    url: YZSoft.$url('YZSoft.Services.REST/Attachment/Upload.ashx'),
    flashUrl: YZSoft.$url('YZSoft/attachment/Upload.swf'),
    swfUploadConfig: {},
    relayCookies: false,
    progressBar: false,
    fileSizeLimit: "16 MB",
    fileTypes: '*.*',
    typesDesc: RS.$('All_FileTypeDesc_All'),
    scope: null,
    buttonAction: SWFUpload.BUTTON_ACTION.SELECT_FILES,

    QueueError: {
        "-100": RS.$('All_Upload_QueueError_M100'),
        "-110": RS.$('All_Upload_QueueError_M110'),
        "-120": RS.$('All_Upload_QueueError_M120'),
        "-130": RS.$('All_Upload_QueueError_M130')
    },

    UploadError: {
        '-200': RS.$('All_Upload_UploadError_M200'),
        '-220': RS.$('All_Upload_UploadError_M220'),
        '-240': RS.$('All_Upload_UploadError_M240')
    },

    constructor: function (config) {
        var me = this,
            attachTo = config.attachTo;

        delete config.attachTo;

        Ext.apply(me, config);
        me.callParent(arguments);

        if (attachTo) {
            if (attachTo.rendered) {
                me.attach(attachTo.el.dom);
            }
            else {
                attachTo.on({
                    single: true,
                    order: 'after',
                    afterrender: function () {
                        if (attachTo.hidden) {
                            attachTo.on({
                                single: true,
                                order: 'after',
                                show: function () {
                                    Ext.defer(function () {
                                        me.attach(attachTo.el.dom);
                                    }, 1);
                                }
                            });
                        }
                        else {
                            Ext.defer(function () {
                                me.attach(attachTo.el.dom);
                            }, 1);
                        }
                    }
                });
            }
        }
    },

    attach: function (dom) {
        var me = this;

        me.wrap = Ext.get(Ext.DomHelper.append(dom, {
            role: 'presentation',
            style: Ext.String.format('z-index: 99;position: absolute;top: 0;left: 0;width: 100%;height: 100%;background-color:transparent;overflow:hidden;cursor:pointer;', dom.clientWidth, dom.clientHeight),
            cn: {
                tag: 'div',
                role: 'presentation',
                style: 'width: 100%;height: 100%;background-color:transparent;'
            }
        }));

        //父隐藏时创建的附件上传对象，其clientWidth、clientHeight为0;
        //me.wrap = Ext.get(Ext.DomHelper.append(dom, {
        //    role: 'presentation',
        //    style: Ext.String.format('z-index: 99;position: absolute;top: 0;left: 0;width: {0}px;height: {1}px;background-color:transparent;overflow:hidden;cursor:pointer;', dom.clientWidth, dom.clientHeight),
        //    cn: {
        //        tag: 'div',
        //        role: 'presentation',
        //        style: 'width: 100%;height: 100%;background-color:transparent;'
        //    }
        //}));

        var attachEl = Ext.get(dom.lastChild.lastChild),
            config = me.getSwfUploadConfig(attachEl);

        me.uploader = new SWFUpload(config);
        Ext.fly(dom).addCls('yz-xform-field-attachments-opt-add-attached');

        me.on({
            fileSelected: function () {
                if (me.loadMask) {
                    me.uploadMask = Ext.create('Ext.LoadMask', me.loadMask);
                    me.uploadMask.show();
                }
            },
            uploadFailed: function () {
                if (me.loadMask && me.uploadMask)
                    me.uploadMask.destroy();
            },
            uploadCancled: function () {
                if (me.loadMask && me.uploadMask)
                    me.uploadMask.destroy();
            },
            uploadProgress: function (file, complete, total) {
                if (me.loadMask && me.uploadMask && me.loadMask.showProgress)
                    me.uploadMask.msgTextEl.setHtml(me.uploadMask.msg + complete * 100 / total + '%');
            },
            uploadSuccess: function (file, data, fn) {
                if (me.loadMask && me.uploadMask)
                    me.uploadMask.destroy();
            }
        });
    },

    getSwfUploadConfig: function (attachEl) {
        var me = this;

        return Ext.apply({
            flash_url: this.flashUrl,
            upload_url: this.url,

            file_size_limit: this.fileSizeLimit,
            file_types: this.fileTypes,
            file_types_description: this.typesDesc,
            file_upload_limit: 0,
            file_queue_limit: 0,

            debug: this.debugMode,
            post_params: {},
            params: me.params,

            button_action: this.buttonAction,
            button_width: (attachEl.getWidth() || 22).toString(),  //父对象隐藏情况下，getWidth返回0
            button_height: (attachEl.getHeight() || 22).toString(), //父对象隐藏情况下，getHeight返回0
            button_placeholder: attachEl.dom,
            button_cursor: SWFUpload.CURSOR.HAND,
            button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,

            prevent_swf_caching: true,

            file_dialog_start_handler: function () {
                //准备附加参数
                var params = Ext.apply({}, me.params);
                Ext.each(me.relayCookies, function (cookieName) {
                    params[cookieName] = Ext.util.Cookies.get(cookieName) || '';
                });

                if (YZSoft.uploadMissCookie) {
                    if (!YZSoft.__upload_params) {
                        YZSoft.Ajax.request({
                            async: false,
                            url: YZSoft.$url('YZSoft.Services.REST/core/Basic.ashx'),
                            params: { method: 'GetFileUploadAccessParams' },
                            success: function (action) {
                                YZSoft.__upload_params = action.result;
                            }
                        });
                    }
                    Ext.apply(params, YZSoft.__upload_params);
                }

                me.uploader.setPostParams(params);
            },

            swfupload_loaded_handler: function () {
                me.fireEvent('uploadLoaded');
            },

            file_queued_handler: function (file) {
                me.lastFile = file;
                me.fireEvent('fileQueued', file, me);
            },

            file_queue_error_handler: function (file, code, message) {
                if (me.fireEvent('fileQueueError', file, code, message) !== false) {
                    var err = me.QueueError[code] || RS.$('All_Upload_QueueError_Default');
                    err = Ext.String.format(err, file.name, (file.size || 0).toFileSize(), code, message, this.settings.file_size_limit);
                    alert(err); //必需alert,选择多个文件，其中一个文件超过大小限制，此时需要阻塞进程。
                }
            },

            upload_error_handler: function (file, code, message) {
                if (code == SWFUpload.UPLOAD_ERROR.FILE_CANCELLED) {
                    me.fireEvent('uploadCancled');
                    return;
                }

                var errorMessage = me.UploadError[code] || RS.$('All_Upload_UploadFailHttp_Msg');
                errorMessage = Ext.String.format(errorMessage, file && file.name, file && file.size && file.size.toFileSize(), code, message);

                if (me.fireEvent('uploadFailed', file, errorMessage, code, message, me) !== false) {
                    YZSoft.alert(errorMessage, function () {
                        me.fireEvent('uploadFailed', file, errorMessage, code, message, me);
                        me.fireEvent('nextUpload');
                    });
                }
            },

            file_dialog_complete_handler: function (numSelected, numQueued) {
                if (numQueued <= 0)
                    return;

                if (me.fireEvent('fileSelected', numSelected, numQueued) !== false) {
                    if (numSelected > 0 && me.autoStart && me.lastFile) {
                        me.uploader.startUpload(me.lastFile.id);
                    }
                    else {
                        me.fireEvent('nextUpload');
                    }
                }
            },

            upload_success_handler: function (file, data) {
                var rv = Ext.decode(data);

                if (rv.success === false) {
                    var errorMessage = Ext.String.format(RS.$('All_UploadFail_Msg'), file.name, rv.errorMessage);
                    if (me.fireEvent('uploadFailed', file, errorMessage, -1, rv.errorMessage, me) !== false) {
                        YZSoft.alert(rv.errorMessage, function () {
                            me.fireEvent('nextUpload');
                        });
                    }
                }
                else {
                    me.fireEvent('uploadSuccess', file, rv);
                    me.fireEvent('nextUpload');
                }
            },

            upload_progress_handler: function (file, complete, total) {
                me.fireEvent('uploadProgress', file, complete, total);
            }

        }, this.swfUploadConfig);
    }
});