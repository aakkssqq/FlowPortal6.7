/*
account
editable
*/
Ext.define('YZSoft.src.form.field.Headshot', {
    extend: 'YZSoft.src.form.field.Image',
    alias: ['widget.yzheadshotfield'],
    width: 130,
    height: 130,
    download: {
        url: YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'),
        params: {
            Method: 'GetHeadshot',
            thumbnail: 'M'
        }
    },

    upload: {
        url: YZSoft.$url('YZSoft.Services.REST/Attachment/Upload.ashx'),
        fileTypes: RS.$('All_FileType_Image'),
        typesDesc: RS.$('All_FileTypeDesc_Image'),
        fileSizeLimit: '5 MB',
        params: {
            Method: 'SaveHeadshot'
        }
    },

    setValue: function (account) {
        this.value = account;
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