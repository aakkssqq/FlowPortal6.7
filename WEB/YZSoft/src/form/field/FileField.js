/*
bpmServer
dlg: 
*/
Ext.define('YZSoft.src.form.field.FileField', {
    extend: 'Ext.form.field.Text',
    editable: false,

    setValue: function (file) {
        var me = this;

        if (!file) {
            me.fileid = '';
            me.callParent(['']);
        }
        else if (Ext.isString(file)) {
            var fileid = file;

            me.fileid = fileid;
            YZSoft.Ajax.request({
                async: false,
                method: 'GET',
                url: YZSoft.$url('YZSoft.Services.REST/Attachment/Assist.ashx'),
                params: {
                    method: 'GetAttachmentInfo',
                    fileid: fileid
                },
                success: function (action) {
                    me.setValue(action.result);
                },
                failure: function (action) {
                    //me.callParent([fileid]);
                }
            });
        }
        else {
            me.fileid = file.FileID;
            me.callParent([file.Name]);
        }
    },

    getValue: function () {
        return this.fileid;
    }
});