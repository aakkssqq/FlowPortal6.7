/*
config
tables,
defaultField
*/

Ext.define('YZSoft.bpm.src.form.field.SNFormatField', {
    extend: 'Ext.form.field.Text',
    editable: false,
    triggers: {
        browser: {
            cls: 'yz-trigger-setting',
            handler: 'onBrowser'
        }
    },

    onBrowser: function () {
        var me = this;

        me.fireEvent('beforeShowDlg', me);
        Ext.create('YZSoft.bpm.src.dialogs.SNFormatDlg', {
            autoShow: true,
            tables: me.tables,
            defaultField: me.defaultField,
            value: me.getValue(),
            fn: function (data) {
                me.setValue(data);
            }
        });
    },

    getValue: function () {
        return this.tagValue;
    },

    setValue: function (value) {
        this.tagValue = value;
        this.callParent([value ? value.SNDesc : '']);
    }
});