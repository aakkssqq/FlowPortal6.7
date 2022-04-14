
Ext.define('YZSoft.forms.field.SelectOUButton', {
    extend: 'YZSoft.forms.field.BrowserButtonBase',

    onClick: function (e) {
        var me = this;

        if (!me.dlg) {
            me.dlg = Ext.create('YZSoft.bpm.src.dialogs.SelOUDlg', {
                closeAction:'hide',
                fn: function (srcou) {
                    var ou = Ext.apply({}, srcou);
                    ou.OUName = ou.Name;
                    ou.OUFullName = ou.FullName;
                    ou.OUCode = ou.Code;
                    ou.OULevel = ou.Level;

                    me.mapvalues = ou;
                    me.agent.onDataAvailable(me);
                }
            });
        }

        me.dlg.show();
    }
});