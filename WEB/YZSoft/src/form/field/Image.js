
/*
config:
editable
download
{
    url:
    params:{
    }
}
upload
{
    url:
    params:{
    }
}
*/
Ext.define('YZSoft.src.form.field.Image', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.yzimagefield'],
    width: 200,
    height: 200,
    editable: true,
    download: {
        url: YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx')
    },

    upload: {
        url: YZSoft.$url('YZSoft.Services.REST/Attachment/Upload.ashx'),
        fileTypes: RS.$('All_FileType_Image'),
        typesDesc: RS.$('All_FileTypeDesc_Image')
    },

    getParams: function (params) {
        var params = Ext.apply(this.download.params || {}, {
            fileid: this.value,
            _dc: +new Date()
        });

        return params
    },

    setValue: function (fileid) {
        var me = this;

        me.value = fileid;
        var params = this.getParams();

        var url = fileid ? Ext.String.urlAppend(me.download.url, Ext.Object.toQueryString(params)) : me.emptySrc;
        if (url)
            me.image.setSrc(url);
    },

    getValue: function () {
        return this.value;
    },

    constructor: function (config) {
        var me = this,
            emptySrc = config.emptySrc || me.emptySrc;

        Ext.merge(this.download, config.download);
        Ext.merge(this.upload, config.upload);
        delete config.download;
        delete config.upload;

        me.image = Ext.create('Ext.Img', {
            style: 'cursor:pointer',
            src: emptySrc
        });

        var cfg = {
            layout: {
                type: 'fit'
            },
            items: [me.image]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (me.editable) {
            me.uploader = Ext.create('YZSoft.src.ux.Uploader', Ext.apply({
                attachTo: this
            }, me.upload));

            me.uploader.on({
                uploadSuccess: function (file, data) {
                    me.uploadMask.setProgress(100);
                    Ext.defer(function () {
                        me.uploadMask.destroy();
                        me.onUploadSuccess(file, data);
                    }, 120);
                },
                fileSelected: function () {
                    me.uploadMask = Ext.create('YZSoft.src.progress.CircleProgressMask', Ext.apply({
                        target: me,
                        extraCls: 'yz-cic-mask-image',
                        listeners: {
                            afterrender: function () {
                                Ext.defer(function () {
                                    me.uploader.uploader.startUpload(me.uploader.lastFile.id);
                                }, 120);
                            }
                        }
                    }, me.uploadMaskCfg));
                    me.uploadMask.show();
                    return false;
                },
                uploadFailed: function () {
                    me.uploadMask.destroy();
                },
                uploadCancled: function () {
                    me.uploadMask.destroy();
                },
                uploadProgress: function (file, complete, total) {
                    me.uploadMask.setProgress(complete * 100 / total);
                }
            });
        }
    },

    onUploadSuccess: function (file, data) {
        this.setValue(data.fileid);
    }
});