/*
account
editable
*/
Ext.define('YZSoft.src.form.field.Sign', {
    extend: 'YZSoft.src.form.field.Image',
    alias: ['widget.yzsignfield'],
    width: 180,
    height: 80,
    download: {
        url: YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'),
        params: {
            Method: 'GetSignImage',
            thumbnail: 'M'
        }
    },

    upload: {
        url: YZSoft.$url('YZSoft.Services.REST/Attachment/Upload.ashx'),
        fileTypes: RS.$('All_FileType_Image'),
        typesDesc: RS.$('All_FileTypeDesc_Image'),
        fileSizeLimit: '500 KB',
        params: {
            Method: 'SaveSignImage'
        }
    },

    uploadMaskCfg: {
        borderWidth: 3,
        circleWidth: 38,
        circleHeight: 38
    },

    setValue: function (account) {

        this.download.params.account = account;
        this.upload.params.account = account;

        this.callParent([account]);
    },

    getParams: function (params) {
        var params = Ext.apply(this.download.params || {}, {
            _dc: +new Date()
        });

        return params
    }
});