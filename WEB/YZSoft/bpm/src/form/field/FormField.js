
Ext.define('YZSoft.bpm.src.form.field.FormField', {
    extend: 'Ext.form.field.Text',
    triggers: {
        browser: {
            cls: 'yz-trigger-form',
            handler: 'onBrowser'
        }
    },

    onBrowser: function () {
        var me = this;

        Ext.create('YZSoft.bpm.src.dialogs.SelFormDlg', {
            autoShow: true,
            fn: function (form) {
                me.setValue(form.FullName);
            }
        });
    }
});