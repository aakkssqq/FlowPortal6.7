/*
    dlg
*/

Ext.define('YZSoft.bpa.src.form.field.ReportFileField', {
    extend: 'YZSoft.bpa.src.form.field.ReportBrowserField',
    requires: [
        'YZSoft.bpa.src.model.Folder'
    ],
    config: {
        btnConfig: {
            text: RS.$('BPA_SelModule')
        }
    },

    onButtonClick: function (btn, e, eOpts) {
        var me = this;

        Ext.create('YZSoft.src.dialogs.SelFileDlg', Ext.apply({
            autoShow: true,
            fn: function (file) {
                me.setValue(file);
            }
        }, me.dlg));
    },

    setValue: function (file) {
        var me = this;

        me.value = file;
        me.display.setValue(file ? file.Name:'');
        me.fireEvent('change', me, file, me.value);

        me.callParent(arguments);
    },

    getValue: function () {
        return this.value && this.value.FileID;
    }
});