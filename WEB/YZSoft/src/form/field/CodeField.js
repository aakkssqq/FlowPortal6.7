/*
config
importdataset
serverName
allowCode true/false default false
dlgConfig

method
setTables
setValueType
*/

Ext.define('YZSoft.src.form.field.CodeField', {
    extend: 'Ext.form.field.Text',
    allowCode: true,
    triggers: {
        browser: {
            cls: 'yz-trigger-fieldfillcode',
            handler: 'onBrowser'
        }
    },

    onBrowser: function () {
        var me = this;

        Ext.create('YZSoft.bpm.src.dialogs.CodeSuggestDlg', Ext.apply({
            autoShow: true,
            serverName: me.serverName,
            tables: me.tables,
            importdataset: me.importdataset,
            fn: function (value) {
                var value = {
                    tinyCode: 'bpm',
                    code: value
                };
                me.setValue(value);
                me.fireEvent('selected', value);
            }
        },me.dlgConfig));
    },

    setTables: function (tables) {
        this.tables = tables;
    },

    setValueType: function (valueType) {
        this.valueType = Ext.isObject(valueType) ? valueType.name : valueType || 'String';
    },

    setValue: function (value) {
        var text = YZSoft.CodeHelper.getUIString(value);
        this.callParent([text]);
    },

    getValue: function () {
        var me = this,
            text = me.callParent(arguments) || '';

        return YZSoft.CodeHelper.changeType(text, me.valueType, me.allowCode);
    }
});