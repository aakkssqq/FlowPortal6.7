
Ext.define('YZSoft.forms.field.SelectUserButton', {
    extend: 'YZSoft.forms.field.BrowserButtonBase',

    onClick: function (e) {
        var me = this,
            et = me.getEleType();

        if (!me.dlg) {
            if (!et.multiSelect) {
                me.dlg = Ext.create('YZSoft.bpm.src.dialogs.SelUserDlg', {
                    closeAction: 'hide',
                    fn: function (user) {
                        me.mapvalues = user;
                        me.agent.onDataAvailable(me);
                    }
                });
            }
            else {
                me.dlg = Ext.create('YZSoft.bpm.src.dialogs.SelUsersDlg', {
                    closeAction: 'hide',
                    fn: function (users) {
                        me.mapvalues = users;
                        me.agent.onDataAvailable(me);
                    }
                });
            }
        }

        me.dlg.show();
    }
});