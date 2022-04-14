
Ext.define('YZSoft.bpm.src.form.field.AssemblyField', {
    extend: 'Ext.form.field.Text',
    triggers: {
        browser: {
            cls: 'yz-trigger-assembly',
            handler: 'selAssembly'
        }
    },

    selAssembly: function () {
        var me = this;

        Ext.create('YZSoft.bpm.src.dialogs.SelAssemblyDlg', {
            autoShow: true,
            fn: function (form) {
                me.setValue(form.FullName);
            }
        });
    }
});