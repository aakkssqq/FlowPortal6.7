/*
config
title
tables
*/

Ext.define('YZSoft.bpm.src.form.field.FormFieldsField', {
    extend: 'YZSoft.src.form.field.List',
    requires: [
        'YZSoft.bpm.src.dialogs.SelFormFieldsDlg'
    ],
    triggers: {
        browser: {
            cls: 'yz-trigger-formfield',
            handler: 'onBrowser'
        }
    },

    onBrowser: function () {
        var me = this;

        Ext.create('YZSoft.bpm.src.dialogs.SelFormFieldsDlg', Ext.apply({
            autoShow: true,
            tables: me.tables,
            value: me.getValue(),
            fn: function (value) {
                me.setValue(value);
            }
        }, me.dlgConfig));
    },

    renderItem: function (data) {
        return data.tableName + '.' + data.columnName;
    },

    setValue: function (value) {
        var me = this,
            regularValue = [];

        Ext.Array.each(value, function (column) {
            if (Ext.isString(column))
                column = me.parseColumnName(column);

            regularValue.push(column);
        });

        return this.callParent([regularValue]);
    },

    parseColumnName: function (fullName) {
        var names = fullName.split('.');
        return {
            tableName: names[0],
            columnName: names[1]
        };
    }
});