
/*
config:
upload
{
    params:{
    }
}
*/
Ext.define('YZSoft.src.menu.OpenFile', {
    extend: 'Ext.menu.Item',
    alias: ['widget.yzopenfilemenu'],
    upload: {
        url: YZSoft.$url('YZSoft.Services.REST/Attachment/Upload.ashx')
    },

    constructor: function (config) {
        var me = this,
            uploadCfg;

        uploadCfg = Ext.apply({
            attachTo: me
        }, me.upload);

        uploadCfg = Ext.apply(uploadCfg, config.upload);

        me.callParent([config]);

        me.uploader = Ext.create('YZSoft.src.ux.Uploader', uploadCfg);
        me.relayEvents(me.uploader, ['uploadSuccess', 'fileQueued', 'fileSelected', 'uploadFailed', 'uploadCancled', 'uploadProgress']);

        me.on({
            scope: me,
            uploadSuccess: 'onUploadSuccess'
        });
    },

    onUploadSuccess: function (file, data) {
    }
});