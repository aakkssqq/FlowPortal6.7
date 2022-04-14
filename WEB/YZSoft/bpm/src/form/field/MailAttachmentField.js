/*
config
tables
*/

Ext.define('YZSoft.bpm.src.form.field.MailAttachmentField', {
    extend: 'Ext.form.field.Text',
    triggers: {
        browser: {
            cls: 'yz-trigger-attachment-field',
            handler: 'onBrowser'
        }
    },

    onBrowser: function () {
        var me = this;

        Ext.create('YZSoft.bpm.src.dialogs.SelFormFieldDlg', {
            autoShow: true,
            tables: me.tables,
            fn: function (field) {
                var value = Ext.String.format('Context.Current.GetAttachments(Convert.ToString(FormDataSet["{0}"])).ToNotifyAttachments()',
                    field.TableName + '.' + field.ColumnName);

                me.setValue(value);
                me.fireEvent('selected', value);
            }
        });
    }
});