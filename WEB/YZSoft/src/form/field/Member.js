
Ext.define('YZSoft.src.form.field.Member', {
    extend: 'YZSoft.src.form.field.User',
    xtype: 'YZMemberField',
    allowBlank: true,

    onBrowserClick: function () {
        var me = this;

        YZSoft.SelMemberDlg.show({
            fn: function (user) {
                if (user == null)
                    return;

                me.onSelect(user);
            }
        });
    },

    onSelect: function (user) {
        this.setValue(user.MemberFullName);
        this.fireEvent('select', user);
    }
});