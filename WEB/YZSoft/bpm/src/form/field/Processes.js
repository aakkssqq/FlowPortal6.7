/*
singleSelection default:false
dlg: dialog title
*/
Ext.define('YZSoft.bpm.src.form.field.Processes', {
    extend: 'YZSoft.src.form.field.List',
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

        if (!me.dlgWin) {
            me.dlgWin = Ext.create('YZSoft.bpm.src.dialogs.SelProcessesDlg', Ext.apply({
                closeAction: 'hide',
                singleSelection: me.singleSelection
            }, me.dlg));
        }

        me.dlgWin.show({
            selection: me.getValue(),
            fn: function (processes) {
                me.setValue(processes);
            }
        });

        me.callParent(arguments);
    },

    renderItem: function (data) {
        return data.ProcessName;
    },

    destroy: function () {
        delete this.dlgWin;
        this.callParent(arguments);
    }
});