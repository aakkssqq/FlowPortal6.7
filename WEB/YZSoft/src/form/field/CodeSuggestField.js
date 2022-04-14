/*
config
tables
*/

Ext.define('YZSoft.src.form.field.CodeSuggestField', {
    extend: 'Ext.form.field.Text',
    triggers: {
        browser: {
            cls: 'yz-trigger-codesuggest',
            handler: 'onBrowser'
        }
    },

    onBrowser: function () {
        var me = this;

        me.fireEvent('beforeShowDlg', me);
        Ext.create('YZSoft.bpm.src.dialogs.CodeSuggestDlg', Ext.apply({
            autoShow: true,
            tables: me.tables,
            fn: function (value) {
                me.setValue(value);
                me.fireEvent('selected', value);
            }
        }, me.dlgConfig));
    }
});