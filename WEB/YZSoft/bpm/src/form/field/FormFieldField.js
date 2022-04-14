/*
config
tables
*/

Ext.define('YZSoft.bpm.src.form.field.FormFieldField', {
    extend: 'Ext.form.field.Text',
    triggers: {
        browser: {
            cls: 'yz-trigger-formfield',
            handler: 'onBrowser'
        }
    },

    onBrowser: function () {
        var me = this;

        Ext.create('YZSoft.bpm.src.dialogs.SelFormFieldDlg', {
            autoShow: true,
            tables: me.tables,
            fn: function (field) {
                var value = me.formatValue(field);
                me.setValue(value);
                me.fireEvent('selected', value);
            }
        });
    },

    formatValue: function (field) {
        return field.TableName + '.' + field.ColumnName;
    }
});