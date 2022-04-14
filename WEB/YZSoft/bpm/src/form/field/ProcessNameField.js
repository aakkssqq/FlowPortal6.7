/*
bpmServer
dlg: 
*/
Ext.define('YZSoft.bpm.src.form.field.ProcessNameField', {
    extend: 'Ext.form.field.Text',
    requires: [
        'YZSoft.bpm.src.dialogs.SelProcessesDlg'
    ],
    triggers: {
        browser: {
            cls: 'yz-trigger-process',
            handler: 'onBrowser'
        }
    },

    onBrowser: function () {
        var me = this;

        me.fireEvent('beforeShowDlg', me, this);
        Ext.create('YZSoft.bpm.src.dialogs.SelProcessDlg', Ext.apply({
            autoShow: true,
            bpmServer: me.bpmServer,
            fn: function (process) {
                me.setValue(process.ProcessName);
                me.fireEvent('select', process.ProcessName)
            }
        }, me.dlg));
    }
});