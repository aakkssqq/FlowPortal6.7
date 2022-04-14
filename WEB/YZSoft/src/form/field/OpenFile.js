
/*
config:
upload
{
    url:
    params:{
    }
}
*/
Ext.define('YZSoft.src.form.field.OpenFile', {
    extend: 'Ext.form.field.Text',
    alias: ['widget.yzopenfilefield'],
    editable: false,
    upload: {
        url: YZSoft.$url('YZSoft.Services.REST/Attachment/Upload.ashx')
    },
    triggers: {
        open: {
            cls: 'yz-trigger-upload',
            preventMouseDown: false
        }
    },

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        me.on({
            scope: me,
            afterrender: function () {
                var triggerOpen = me.getTrigger('open');
                me.uploader = Ext.create('YZSoft.src.ux.Uploader', Ext.apply({
                    attachTo: triggerOpen
                }, me.upload));

                me.relayEvents(me.uploader, ['uploadSuccess', 'fileSelected', 'uploadFailed', 'uploadCancled', 'uploadProgress']);
            },
            uploadSuccess: 'onUploadSuccess'
        });
    },

    onUploadSuccess: function (file, data) {
        this.setValue(file.name);
    }
});